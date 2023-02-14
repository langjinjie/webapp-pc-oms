import React, { useEffect, useState } from 'react';
import { Modal, Collapse } from 'antd';
import { requestGetChannelGroupList } from 'src/apis/channelTag';
import { IChannelTagList, IChannelItem } from 'src/pages/Operation/ChannelTag/Config';
import style from './style.module.less';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';

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

  const history = useHistory();
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
    onChange?.(chooseTags);
    onCancel?.();
  };
  // 添加渠道标签
  const addTagHandle = () => {
    history.push('/channelTag');
    onCancel?.();
  };
  useEffect(() => {
    if (visible && groupList.length === 0) {
      getChannelGroupList();
    }
  }, [visible]);
  return (
    <Modal title="添加标签" centered visible={visible} onCancel={onCancel} onOk={onOkHandle} maskClosable={false}>
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
      <div className={style.addChannelTag}>
        *如未找到适合的标签或需编辑标签，
        <span className={style.goAdd} onClick={addTagHandle}>
          去标签页面进行修改
        </span>
      </div>
    </Modal>
  );
};
export default TagModal;
