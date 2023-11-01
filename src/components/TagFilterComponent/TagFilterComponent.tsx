import React, { useState } from 'react';
import { Input } from 'antd';
import TagFilterModal from './TagFilterModal';
import { TagItem } from 'src/utils/interface';
import { DownOutlined } from '@ant-design/icons';
import { Icon } from 'src/components';
import styles from './tag.module.less';
import classNames from 'classnames';

export interface ITagFilterValue {
  logicType?: 1 | 2;
  tagList: TagItem[];
}

interface ITagFilterComponentProps {
  onChange?: (value?: ITagFilterValue) => void;
  value?: ITagFilterValue;
  className?: string;
}
const TagFilterComponents: React.FC<ITagFilterComponentProps> = ({ value, onChange, className }) => {
  const [visible, setVisible] = useState(false);

  const handleOk = (tag?: ITagFilterValue) => {
    onChange?.(tag);
    console.log(111);
    setVisible(false);
  };

  // 取消选择
  const delAll = () => {
    onChange?.(undefined);
  };

  const onClose = () => {
    setVisible(false);
  };

  return (
    <>
      <Input
        readOnly
        suffix={value ? <Icon name="guanbi" onClick={delAll} /> : <DownOutlined />}
        className={classNames(styles.viewInput, className)}
        value={(value?.tagList || [])
          .map((tagItem) => (tagItem.displayType ? tagItem.groupName + ':' + tagItem.tagName : tagItem.tagName))
          .toString()
          .replace(/,/g, '；')}
        style={{ color: '#E1E2E6' }}
        onClick={() => setVisible(true)}
        placeholder="请选择"
      />
      <TagFilterModal
        value={value}
        visible={visible}
        onClose={() => {
          onClose();
        }}
        onOk={handleOk}
      />
    </>
  );
};

export default React.memo(TagFilterComponents);
