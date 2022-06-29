import React, { useState, useEffect } from 'react';
import { Input } from 'antd';
import TagFilter from './TagFilter';
import { TagInterface } from 'src/utils/interface';
import { DownOutlined } from '@ant-design/icons';
interface ComponentsProps {
  onChange?: (values: TagInterface) => void;
  value?: TagInterface;
}
const TagFilterComponents: React.FC<ComponentsProps> = (props) => {
  const { value, onChange } = props;
  const [tag, setTag] = useState<TagInterface>();
  const [visible, setVisible] = useState(false);
  const filterClients = async (tag: TagInterface) => {
    setTag(tag);

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
        className="width320"
        value={tag?.groupName}
        style={{ color: '#E1E2E6' }}
        onClick={() => setVisible(true)}
      ></Input>
      <TagFilter
        onChoose={(tags: TagInterface) => {
          filterClients(tags);
        }}
        currentTag={tag}
        visible={visible}
        onClose={() => {
          onClose();
        }}
      />
    </>
  );
};

export default React.memo(TagFilterComponents);
