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
  className?: string;
}

export const IconTag: React.FC<IconProps> = (props) => {
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
      viewBox="0 0 30 31"
      preserveAspectRatio="xMidYMid meet"
      fill=""
      role="presentation"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className || ''} ${spin ? styles.spin : ''} ${rtl ? styles.rtl : ''}`.trim()}
      {...rest}
    >
      <g>
        <g fillRule="evenodd" fill="none">
          <path d="M2 3h28v28H2z" />
          <path
            fillRule="nonzero"
            d="m7.222 7.222 9.27-3.458 12.65 12.65-12.728 12.728-12.65-12.65 3.458-9.27Zm1.589 1.59L6.04 15.94l10.373 10.374 9.9-9.9L15.94 6.041 8.81 8.812Zm13.26 7.602a1 1 0 0 1 1.414 1.414l-5.657 5.657a1 1 0 1 1-1.414-1.414l5.657-5.657Zm-11.314-5.657a4 4 0 1 1 5.657 5.657 4 4 0 0 1-5.657-5.657Zm1.415 1.415A2 2 0 1 0 15 15a2 2 0 0 0-2.828-2.828Z"
            data-follow-fill="#6a6d70"
            fill={_fill}
            className={className}
          />
        </g>
      </g>
    </svg>
  );
};
