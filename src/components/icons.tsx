import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Base({ size = 20, children, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export const ArrowRight = (p: IconProps) => (
  <Base {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Base>
);
export const ArrowLeft = (p: IconProps) => (
  <Base {...p}>
    <path d="M19 12H5M11 18l-6-6 6-6" />
  </Base>
);
export const ChevronLeft = (p: IconProps) => (
  <Base {...p}>
    <path d="M15 18l-6-6 6-6" />
  </Base>
);
export const ChevronRight = (p: IconProps) => (
  <Base {...p}>
    <path d="M9 18l6-6-6-6" />
  </Base>
);
export const Bed = (p: IconProps) => (
  <Base {...p}>
    <path d="M3 18V7M3 14h18v4M21 14v-2.5A2.5 2.5 0 0 0 18.5 9H11v5M7 12a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
  </Base>
);
export const Bath = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 12h16v2a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-2ZM6 12V6a2 2 0 0 1 3.6-1.2M7 19l-1 2M17 19l1 2" />
  </Base>
);
export const Area = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 4h16v16H4zM4 9h5M15 20v-5M9 4v3M20 15h-3" />
  </Base>
);
export const Stories = (p: IconProps) => (
  <Base {...p}>
    <path d="M3 11 12 4l9 7M5 10v10h14V10M5 15h14" />
  </Base>
);
export const Garage = (p: IconProps) => (
  <Base {...p}>
    <path d="M3 10 12 4l9 6v10H3V10ZM7 20v-7h10v7M7 16h10" />
  </Base>
);
export const HomeIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M3 10.5 12 4l9 6.5M5.5 9v11h13V9M10 20v-5h4v5" />
  </Base>
);
export const Tools = (p: IconProps) => (
  <Base {...p}>
    <path d="M14.5 6.5a3.5 3.5 0 0 0 4.6 4.6l-8.6 8.6a2 2 0 1 1-2.8-2.8l8.6-8.6a3.5 3.5 0 0 0-1.8-1.8ZM4 4l5 5M3 7l4-4" />
  </Base>
);
export const MapPin = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </Base>
);
export const Calendar = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4" />
  </Base>
);
export const Phone = (p: IconProps) => (
  <Base {...p}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1Z" />
  </Base>
);
export const Mail = (p: IconProps) => (
  <Base {...p}>
    <path d="M3 6h18v12H3zM3 7l9 6 9-6" />
  </Base>
);
export const Check = (p: IconProps) => (
  <Base {...p}>
    <path d="M5 12.5 10 17 19 7" />
  </Base>
);
export const Close = (p: IconProps) => (
  <Base {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Base>
);
export const Menu = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Base>
);
export const Sliders = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 7h10M18 7h2M4 17h4M12 17h8M14 4v6M8 14v6" />
  </Base>
);
export const Expand = (p: IconProps) => (
  <Base {...p}>
    <path d="M15 4h5v5M9 20H4v-5M20 4l-6 6M4 20l6-6" />
  </Base>
);
