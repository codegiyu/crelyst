import type { SVGProps } from 'react';
const SvgLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    width="1em"
    height="1em"
    style={{
      shapeRendering: 'geometricPrecision',
      textRendering: 'geometricPrecision',
      imageRendering: 'optimizeQuality',
      fillRule: 'evenodd',
      clipRule: 'evenodd',
    }}
    viewBox="0 0 5740.55 5740.55"
    {...props}>
    <path
      d="M2590.61 1984.78c364.16-373.41 902.42-474.33 1360.59-299.58l675.95-693.11C3775.89 479.56 2654 598.58 1930.2 1340.73L51.29 3267.33l1289.76-16.16c76.72 436.68 286.3 854.23 627.96 1187.43 866.17 844.74 2253.15 827.36 3097.89-38.82 744.65-763.56 819.38-1931.82 233.24-2776.58l-665.57 682.46c233.19 469.16 158.44 1053.76-228.07 1450.07-489.06 501.46-1291.99 511.52-1793.45 22.46-158.64-154.7-268.09-340.82-328.13-538.86-129.74-428.01-28.66-911.73 305.68-1254.56z"
      style={{
        fill: '#f58634',
      }}
    />
    <path
      d="M1.77 1.78h5737v5737H1.77z"
      style={{
        stroke: '#373435',
        strokeWidth: 3.55,
        strokeMiterlimit: 22.9256,
        fill: 'none',
      }}
    />
  </svg>
);
export default SvgLogo;
