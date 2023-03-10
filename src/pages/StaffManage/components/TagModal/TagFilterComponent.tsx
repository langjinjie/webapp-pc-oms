import React, { useState, useEffect } from 'react';
import { Input } from 'antd';
import TagFilterModal from './TagFilterModal';
import { TagItem } from 'src/utils/interface';
import { DownOutlined } from '@ant-design/icons';
import { Icon } from 'src/components';
import styles from './tag.module.less';
import classNames from 'classnames';

interface ComponentsProps {
  onChange?: (value?: { logicType: 1 | 2; tagList: TagItem[] }) => void;
  value?: { logicType: 1 | 2; tagList: TagItem[] };
  className?: string;
}
const TagFilterComponents: React.FC<ComponentsProps> = (props) => {
  const { value, onChange, className } = props;
  const [visible, setVisible] = useState(false);
  const filterClients = (tag: { logicType: 1 | 2; tagList: TagItem[] }) => {
    // setTag(tag);
    setVisible(false);
    onChange && onChange(tag);
  };

  // 取消选择
  const delAll = () => {
    onChange?.(undefined);
  };

  useEffect(() => {
    console.log('value', value);
    value && filterClients(value);
  }, [value]);
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
        // chooseTag={(tags: { logicType: 1 | 2; tagList: TagGroup[] }) => {
        //   filterClients(tags);
        // }}
        value={value}
        visible={visible}
        onClose={() => {
          onClose();
        }}
        onChange={onChange}
      />
    </>
  );
};

export default React.memo(TagFilterComponents);
