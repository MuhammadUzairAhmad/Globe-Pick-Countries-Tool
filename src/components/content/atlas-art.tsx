// Original decorative graticule, not a geographic map or country boundary.
export function AtlasArt() {
  return (
    <svg
      viewBox="0 0 480 340"
      fill="none"
      aria-hidden="true"
      className="h-auto w-full"
    >
      <g className="stroke-atlas" strokeWidth="1">
        <path d="M0 85h480M0 170h480M0 255h480M80 0v340M160 0v340M240 0v340M320 0v340M400 0v340" />
        <circle cx="240" cy="170" r="140" />
        <ellipse cx="240" cy="170" rx="90" ry="140" />
        <ellipse cx="240" cy="170" rx="38" ry="140" />
        <ellipse cx="240" cy="170" rx="140" ry="50" />
        <ellipse cx="240" cy="170" rx="140" ry="100" />
      </g>
      <path
        d="M100 225c100-145 200-145 275-90"
        className="stroke-brand"
        strokeWidth="2"
        strokeDasharray="5 6"
      />
      <circle cx="100" cy="225" r="5" className="fill-brand" />
      <circle
        cx="375"
        cy="135"
        r="14"
        className="fill-brand-soft stroke-brand"
      />
      <circle cx="375" cy="135" r="5" className="fill-brand" />
      <path
        d="m230 148 36 12-36 31 10-27-10-16Z"
        className="fill-brand stroke-brand"
        strokeLinejoin="round"
      />
      <g className="stroke-muted" strokeWidth="1">
        <path d="M240 15v-8m-4 4h8M240 333v-8m-4 4h8M45 170h-8m4-4v8M443 170h-8m4-4v8" />
      </g>
    </svg>
  );
}
