import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { Icon } from 'src/components';
import TagFilter from './TagFilter';
import { TagInterface } from 'src/utils/interface';
import style from './tag.module.less';
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
      <Button shape="round" className={style.addBtn} style={{ color: '#E1E2E6' }} onClick={() => setVisible(true)}>
        <Icon className="font20" name="xinjian"></Icon>
      </Button>
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
