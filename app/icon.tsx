import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

const Icon = () =>
  new ImageResponse(
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: "#0b1f33",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#b58b4a",
        fontSize: 22,
        fontWeight: 700,
        fontFamily: "Georgia, 'Times New Roman', serif",
      }}
    >
      M
    </div>,
    { ...size },
  );

export default Icon;
