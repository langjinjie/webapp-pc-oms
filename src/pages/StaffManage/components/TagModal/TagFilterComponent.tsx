import React, { useState, useEffect } from 'react';
import { Input } from 'antd';
import TagFilterModal from './TagFilterModal';
import { TagGroup } from 'src/utils/interface';
import { DownOutlined } from '@ant-design/icons';

import styles from './tag.module.less';

interface ComponentsProps {
  onChange?: (value?: { logicType: 1 | 2; tagList: TagGroup[] }) => void;
  value?: { logicType: 1 | 2; tagList: TagGroup[] };
}
const TagFilterComponents: React.FC<ComponentsProps> = (props) => {
  const { value, onChange } = props;
  const [visible, setVisible] = useState(false);
  const filterClients = (tag: { logicType: 1 | 2; tagList: TagGroup[] }) => {
    // setTag(tag);
    setVisible(false);
    onChange && onChange(tag);
  };
  useEffect(() => {
    value && filterClients(value);
  }, [value]);
  const onClose = () => {
    setVisible(false);
  };

  return (
    <>
      <Input
        readOnly
        suffix={<DownOutlined />}
        className={styles.viewInput}
        // value={tag?.groupName}
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
