interface IconProps {
  size?: number;
}

const pixelProps = {
  "aria-hidden": true,
  shapeRendering: "crispEdges",
  fill: "currentColor",
  viewBox: "0 0 10 10",
} as const;

export function CafeLogo({ size = 36 }: IconProps) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 12 12" shapeRendering="crispEdges">
      <rect x="1" y="4" width="8" height="1" fill="#322D2A" />
      <rect x="1" y="5" width="1" height="5" fill="#322D2A" />
      <rect x="8" y="5" width="1" height="5" fill="#322D2A" />
      <rect x="2" y="10" width="6" height="1" fill="#322D2A" />
      <rect x="2" y="5" width="6" height="5" fill="#E5C59E" />
      <rect x="2" y="5" width="6" height="1" fill="#813D3C" />
      <rect x="9" y="5" width="2" height="1" fill="#322D2A" />
      <rect x="10" y="6" width="1" height="2" fill="#322D2A" />
      <rect x="9" y="8" width="2" height="1" fill="#322D2A" />
      <rect x="3" y="1" width="1" height="2" fill="#E5C59E" />
      <rect x="5" y="0" width="1" height="3" fill="#E5C59E" />
      <rect x="7" y="1" width="1" height="2" fill="#E5C59E" />
    </svg>
  );
}

export function CupIcon({ size = 20 }: IconProps) {
  return (
    <svg {...pixelProps} width={size} height={size}>
      <rect x="0" y="3" width="7" height="1" />
      <rect x="0" y="4" width="1" height="5" />
      <rect x="6" y="4" width="1" height="5" />
      <rect x="1" y="9" width="5" height="1" />
      <rect x="7" y="4" width="2" height="1" />
      <rect x="8" y="5" width="1" height="2" />
      <rect x="7" y="7" width="2" height="1" />
      <rect x="2" y="0" width="1" height="2" />
      <rect x="4" y="0" width="1" height="2" />
    </svg>
  );
}

export function ChevronUpIcon({ size = 20 }: IconProps) {
  return (
    <svg {...pixelProps} width={size} height={size}>
      <rect x="4" y="2" width="2" height="2" />
      <rect x="2" y="4" width="2" height="2" />
      <rect x="6" y="4" width="2" height="2" />
      <rect x="0" y="6" width="2" height="2" />
      <rect x="8" y="6" width="2" height="2" />
    </svg>
  );
}

export function ChevronDownIcon({ size = 20 }: IconProps) {
  return (
    <svg {...pixelProps} width={size} height={size}>
      <rect x="4" y="6" width="2" height="2" />
      <rect x="2" y="4" width="2" height="2" />
      <rect x="6" y="4" width="2" height="2" />
      <rect x="0" y="2" width="2" height="2" />
      <rect x="8" y="2" width="2" height="2" />
    </svg>
  );
}

export function SpeakerIcon({ size = 20, muted = false }: IconProps & { muted?: boolean }) {
  return (
    <svg {...pixelProps} width={size} height={size}>
      <rect x="0" y="3" width="2" height="4" />
      <rect x="2" y="2" width="1" height="6" />
      <rect x="3" y="1" width="1" height="8" />
      <rect x="4" y="0" width="1" height="10" />
      {muted ? (
        <>
          <rect x="6" y="3" width="1" height="1" />
          <rect x="7" y="4" width="1" height="2" />
          <rect x="8" y="3" width="1" height="1" />
          <rect x="6" y="6" width="1" height="1" />
          <rect x="8" y="6" width="1" height="1" />
          <rect x="9" y="2" width="1" height="1" />
          <rect x="9" y="7" width="1" height="1" />
        </>
      ) : (
        <>
          <rect x="6" y="3" width="1" height="4" />
          <rect x="8" y="1" width="1" height="1" />
          <rect x="9" y="2" width="1" height="6" />
          <rect x="8" y="8" width="1" height="1" />
        </>
      )}
    </svg>
  );
}

export function CloseIcon({ size = 18 }: IconProps) {
  return (
    <svg {...pixelProps} width={size} height={size}>
      <rect x="0" y="0" width="2" height="2" />
      <rect x="2" y="2" width="2" height="2" />
      <rect x="4" y="4" width="2" height="2" />
      <rect x="6" y="6" width="2" height="2" />
      <rect x="8" y="8" width="2" height="2" />
      <rect x="8" y="0" width="2" height="2" />
      <rect x="6" y="2" width="2" height="2" />
      <rect x="2" y="6" width="2" height="2" />
      <rect x="0" y="8" width="2" height="2" />
    </svg>
  );
}
