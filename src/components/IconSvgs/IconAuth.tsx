import React, { useEffect, useRef } from 'react';
import styles from './style.module.less';
interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: string | number;
  width?: string | number;
  height?: string | number;
  spin?: boolean;
  rtl?: boolean;
  color?: string;
  fill?: string;
  stroke?: string;
}

export const IconAuth: React.FC<IconProps> = (props) => {
  const root = useRef<SVGSVGElement>(null);
  const { size = '1em', width, height, spin, rtl, color, fill, stroke, className, ...rest } = props;
  const _width = width || size;
  const _height = height || size;
  const _stroke = stroke || color;
  const _fill = fill || color;
  useEffect(() => {
    if (!_fill) {
      (root.current as SVGSVGElement)?.querySelectorAll('[data-follow-fill]').forEach((item) => {
        item.setAttribute('fill', item.getAttribute('data-follow-fill') || '');
      });
    }
    if (!_stroke) {
      (root.current as SVGSVGElement)?.querySelectorAll('[data-follow-stroke]').forEach((item) => {
        item.setAttribute('stroke', item.getAttribute('data-follow-stroke') || '');
      });
    }
  }, [stroke, color, fill]);
  return (
    <svg
      ref={root}
      width={_width}
      height={_height}
      viewBox="0 0 28 28"
      preserveAspectRatio="xMidYMid meet"
      fill=""
      role="presentation"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className || ''} ${spin ? styles.spin : ''} ${rtl ? styles.rtl : ''}`.trim()}
      {...rest}
    >
      <g>
        <g fillRule="evenodd" fill="none">
          <path d="M0 0h28v28H0z" />
          <path
            fillRule="nonzero"
            d="m14 2 11 5-.349 5.58a14.987 14.987 0 0 1-10.33 13.32L14 26A14.987 14.987 0 0 1 3.349 12.58L3 7l11-5Zm0 2.196L5.082 8.25l.263 4.205a12.987 12.987 0 0 0 8.32 11.32l.335.122a12.988 12.988 0 0 0 8.631-11.123l.024-.319.262-4.205L14 4.196ZM14 7a4 4 0 0 1 1 7.874V16h1a1 1 0 0 1 .117 1.993L16 18h-1v2a1 1 0 0 1-1.993.117L13 20v-5.126A4.002 4.002 0 0 1 14 7Zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"
            data-follow-fill="#6a6d70"
            fill={_fill}
            className={className}
          />
        </g>
      </g>
    </svg>
  );
};
