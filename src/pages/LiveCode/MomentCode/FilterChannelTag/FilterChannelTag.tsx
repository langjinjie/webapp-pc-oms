import { PlusOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { Button, Tag } from 'antd';
import { IChannelTagList } from 'src/pages/Operation/ChannelTag/Config';
import TagModal from './TagModal';
import style from './style.module.less';

interface IFilterChannelTagProps {
  value?: IChannelTagList[];
  onChange?: (value?: IChannelTagList[]) => void;
}

const FilterChannelTag: React.FC<IFilterChannelTagProps> = ({ value, onChange }) => {
  const [tagModalVisible, setTagModalVisible] = useState(false);
  return (
    <div className={style.wrap}>
      <div className={style.valueList}>
        {value?.map((tagItem) => (
          <Tag key={tagItem.tagId} closable>
            {tagItem.tagName}
          </Tag>
        ))}
      </div>
      <Button size="small" className={style.addTag} icon={<PlusOutlined />} onClick={() => setTagModalVisible(true)}>
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
