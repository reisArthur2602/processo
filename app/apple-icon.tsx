import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const AppleIcon = () =>
  new ImageResponse(
    <div
      style={{
        width: 180,
        height: 180,
        borderRadius: 40,
        backgroundColor: "#0b1f33",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#b58b4a",
        fontSize: 118,
        fontWeight: 700,
        fontFamily: "Georgia, 'Times New Roman', serif",
      }}
    >
      M
    </div>,
    { ...size },
  );

export default AppleIcon;
