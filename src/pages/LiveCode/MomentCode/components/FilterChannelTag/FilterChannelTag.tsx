import { PlusOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { Button, Tag } from 'antd';
import { IChannelTagList } from 'src/pages/Operation/ChannelTag/Config';
import TagModal from './TagModal';
import style from './style.module.less';

interface IFilterChannelTagProps {
  value?: IChannelTagList[];
  onChange?: (value?: IChannelTagList[]) => void;
  disabled?: boolean;
}

const FilterChannelTag: React.FC<IFilterChannelTagProps> = ({ value, onChange, disabled }) => {
  const [tagModalVisible, setTagModalVisible] = useState(false);
  // 删除标签
  const tagOnCloseHandle = (tagItem: IChannelTagList) => {
    onChange?.(value?.filter((filterItem) => filterItem.tagId !== tagItem.tagId));
  };
  return (
    <div className={style.wrap}>
      <div className={style.valueList}>
        {value?.map((tagItem) => (
          <Tag
            key={tagItem.tagId}
            color="blue"
            className={style.tag}
            closable={!disabled}
            onClose={() => tagOnCloseHandle(tagItem)}
          >
            {tagItem.tagName}
          </Tag>
        ))}
      </div>
      <Button
        size="small"
        className={style.addTag}
        icon={<PlusOutlined />}
        onClick={() => setTagModalVisible(true)}
        disabled={disabled}
      >
        添加标签
      </Button>
      <TagModal
        value={value}
        onChange={onChange}
        visible={tagModalVisible}
        onCancel={() => setTagModalVisible(false)}
      />
    </div>
  );
};
export default FilterChannelTag;
