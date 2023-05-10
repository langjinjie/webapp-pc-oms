/**
 * @name SvgIcon
 * @author Lester
 * @date 2021-05-08 14:28
 */

import React from 'react';
import classNames from 'classnames';

import { IconTag } from 'src/components/IconSvgs/IconTag';
import { IconCompliance } from 'src/components/IconSvgs/IconCompliance';
import { IconLottery } from 'src/components/IconSvgs/IconLottery';
import { IconAuth } from 'src/components/IconSvgs/IconAuth';

interface IndexProps {
  className?: string;
  name: string;
  onClick?: React.MouseEventHandler;
}

const SvgIcon: React.FC<IndexProps> = ({ className, name, onClick }) => {
  if (name?.indexOf('local_') > -1) {
    const svgName = name.split('_')[1];

    switch (svgName) {
      case 'IconTag':
        return <IconTag className={className} onClick={onClick} />;
      case 'IconCompliance':
        return <IconCompliance className={className} onClick={onClick} />;
      case 'IconLottery':
        return <IconLottery className={className} onClick={onClick} />;
      case 'IconAuth':
        return <IconAuth className={className} onClick={onClick} />;
    }
  }
  return (
    <svg className={classNames('icon', className)} aria-hidden="true" onClick={(event) => onClick && onClick(event)}>
      <use xlinkHref={`#icon-${name}`} />
    </svg>
  );
};

export default SvgIcon;
