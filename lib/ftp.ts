import { Readable, Writable } from "node:stream";
import { Client } from "basic-ftp";
import { env } from "@/lib/env";

const getFtpConfig = () => ({
  host: env.FTP_HOST,
  port: env.FTP_PORT,
  user: env.FTP_USER,
  password: env.FTP_PASSWORD,
  secure: env.FTP_SECURE,
});

export const uploadToFtp = async (
  buffer: Buffer,
  caseId: string,
  originalFilename: string,
): Promise<string> => {
  const client = new Client();
  try {
    await client.access(getFtpConfig());

    const safeName = originalFilename.replace(/[^\w\-.]/g, "_");
    const filename = `${Date.now()}-${safeName}`;
    const dirPath = `${env.FTP_BASE_PATH}/cases/${caseId}`;

    await client.ensureDir(dirPath);
    const stream = Readable.from(buffer);
    await client.uploadFrom(stream, filename);

    return `${dirPath}/${filename}`;
  } finally {
    client.close();
  }
};

export const downloadFromFtp = async (remotePath: string): Promise<Buffer> => {
  const client = new Client();
  try {
    await client.access(getFtpConfig());

    const chunks: Buffer[] = [];
    const writable = new Writable({
      write(chunk: Buffer, _enc: BufferEncoding, cb: () => void) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        cb();
      },
    });

    await client.downloadTo(writable, remotePath);
    return Buffer.concat(chunks);
  } finally {
    client.close();
  }
};
