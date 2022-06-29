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

export const IconLottery: React.FC<IconProps> = (props) => {
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
            d="M14 2c3.306 0 6.299 1.337 8.47 3.499l.015.016.016.016A11.962 11.962 0 0 1 26 14c0 3.306-1.337 6.299-3.499 8.47l-.016.015-.016.016A11.962 11.962 0 0 1 14 26a11.962 11.962 0 0 1-8.47-3.499l-.015-.016-.016-.016A11.962 11.962 0 0 1 2 14c0-3.306 1.337-6.299 3.499-8.47l.016-.015.016-.016A11.962 11.962 0 0 1 14 2Zm1.001 2.05L15 6a1 1 0 0 1-2 0V4.05a9.954 9.954 0 0 0-5.33 2.206l2.086 2.086a1 1 0 0 1-1.414 1.414L6.257 7.671A9.954 9.954 0 0 0 4.05 13H6a1 1 0 0 1 0 2l-1.95.001a9.955 9.955 0 0 0 2.207 5.328l2.086-2.086a1 1 0 0 1 1.414 1.414l-2.086 2.086A9.954 9.954 0 0 0 13 23.95V22a1 1 0 0 1 2 0l.001 1.95a9.954 9.954 0 0 0 5.328-2.207l-2.086-2.086a1 1 0 1 1 1.414-1.414l2.086 2.086A9.954 9.954 0 0 0 23.95 15H22a1 1 0 0 1 0-2h1.95a9.954 9.954 0 0 0-2.207-5.329l-2.086 2.086a1 1 0 1 1-1.414-1.414l2.086-2.086A9.954 9.954 0 0 0 15 4.05ZM14 8a1 1 0 0 1 1 1v2.171a3.001 3.001 0 1 1-2 0V9a1 1 0 0 1 1-1Zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"
            data-follow-fill="#6a6d70"
            fill={_fill}
            className={className}
          />
        </g>
      </g>
    </svg>
  );
};
