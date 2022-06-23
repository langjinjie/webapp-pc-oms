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

export const IconCompliance: React.FC<IconProps> = (props) => {
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
            d="M10 3v2H6v18h16V5h-4V3h6v22H4V3h6Zm10.707 12.293a1 1 0 0 1 .083 1.32l-.083.094L16 21.414l-2.707-2.707a1 1 0 0 1 1.32-1.497l.094.083L16 18.585l3.293-3.292a1 1 0 0 1 1.414 0ZM13 12a1 1 0 0 1 0 2H9a1 1 0 0 1 0-2h4Zm4-4a1 1 0 0 1 0 2H9a1 1 0 1 1 0-2h8Zm-2-6v1h1v2h-4V3h1V2h2Z"
            data-follow-fill="#6a6d70"
            fill={_fill}
            className={className}
          />
        </g>
      </g>
    </svg>
  );
};
