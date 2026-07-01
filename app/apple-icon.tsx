import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const AppleIcon = () =>
  new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
          backgroundColor: "#0b1f33",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width="100"
          height="100"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 4h12M8 4v16m8-16v16M5 20h14M10 8h4M10 12h4M10 16h4" />
        </svg>
      </div>
    ),
    { ...size },
  );

export default AppleIcon;
