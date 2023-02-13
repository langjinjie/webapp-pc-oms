import React, { useEffect, useState } from 'react';
import { Modal, Collapse } from 'antd';
import { requestGetChannelGroupList } from 'src/apis/channelTag';
import { IChannelTagList, IChannelItem } from 'src/pages/Operation/ChannelTag/Config';
import style from './style.module.less';
import classNames from 'classnames';

const { Panel } = Collapse;

interface IModalProps {
  visible: boolean;
  onCancel?: () => void;
  value?: IChannelTagList[];
  onChange?: (value?: IChannelTagList[]) => void;
}

const TagModal: React.FC<IModalProps> = ({ visible, onCancel, onChange }) => {
  const [groupList, setGroupList] = useState<IChannelItem[]>([]);
  const [chooseTags, setChooseTags] = useState<IChannelTagList[]>([]);
  // 获取渠道标签
  const getChannelGroupList = async () => {
    const res = await requestGetChannelGroupList({ pageSize: 999, status: 1 });
    if (res) {
      setGroupList(res.list.filter((groupItem: IChannelItem) => groupItem.groupName !== '投放渠道'));
    }
  };
  // 选择标签
  const handleTagClick = (item: IChannelTagList) => {
    let newChooseTags = [];
    if (chooseTags.some((tagItem) => tagItem.tagId === item.tagId)) {
      newChooseTags = chooseTags.filter((filterItem) => filterItem.tagId !== item.tagId);
    } else {
      newChooseTags = [...chooseTags, item];
    }
    setChooseTags(newChooseTags);
  };
  const onOkHandle = () => {
    onChange?.(chooseTags.map(({ tagId, tagName }) => ({ tagId, tagName })));
    onCancel?.();
  };
  useEffect(() => {
    getChannelGroupList();
  }, []);
  return (
    <Modal
      title="添加标签"
      centered
      className={style.wrap}
      visible={visible}
      onCancel={onCancel}
      onOk={onOkHandle}
      maskClosable={false}
    >
      {groupList.length === 0 || (
        <Collapse className={style.collapse} defaultActiveKey={['0']}>
          {groupList.map((groupItem) => (
            <Panel className={style.panel} key={groupItem.groupId} header={groupItem.groupName}>
              <ul className={style.tagList}>
                {groupItem.tagList.map((tagItem) => (
                  <li
                    key={tagItem.tagId}
                    className={classNames(style.tagItem, {
                      [style.active]: chooseTags?.some((chooseTagItem) => chooseTagItem.tagId === tagItem.tagId)
                    })}
                    onClick={() => handleTagClick(tagItem)}
                  >
                    {tagItem.tagName}
                  </li>
                ))}
              </ul>
            </Panel>
          ))}
        </Collapse>
      )}
    </Modal>
  );
};
export default TagModal;
