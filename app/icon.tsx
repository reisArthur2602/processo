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
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2v6m0 0l-4 2.5m4-2.5l4 2.5M8 8l-3.5 8.5h11l-3.5-8.5m-4 8.5h4m-6 0h8v2h-8z" />
      </svg>
    </div>,
    { ...size },
  );

export default Icon;
