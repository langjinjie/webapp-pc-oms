import React from 'react';
import style from './style.module.less';
import classNames from 'classnames';

interface IProductSceneProps {
  value?: string[];
  onChange?: (value?: any) => void;
  readOnly?: boolean;
  productSceneList?: {
    id: string; // 是 配置id
    name: string; // 是 产品场景名称
    sortId: number; // 是 序号，升序规则
  }[];
}

const ProductScene: React.FC<IProductSceneProps> = ({ value = [], onChange, readOnly, productSceneList }) => {
  // 点击产品场景
  const onClickSceneItem = (row: { id: string; name: string }) => {
    if (readOnly) return;
    // 判断是否在
    if (value?.some((item) => item === row.id)) {
      onChange?.(value.filter((item) => item !== row.id));
    } else {
      onChange?.([...value, row.id.toString()]);
    }
  };

  return (
    <div className={style.wrap}>
      {productSceneList?.map(({ id, name }) => (
        <span
          key={id}
          className={classNames(style.sceneItem, { [style.active]: value.includes(id) }, { disabled: readOnly })}
          onClick={() => onClickSceneItem({ id, name })}
        >
          {name}
        </span>
      ))}
      <span className={style.tips}>可多选</span>
    </div>
  );
};
export default ProductScene;
