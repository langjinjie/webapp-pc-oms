import React, { useEffect, useState } from 'react';
import { Modal, Collapse } from 'antd';
import { requestGetChannelGroupList } from 'src/apis/channelTag';
import { IChannelTagList, IChannelItem } from 'src/pages/Operation/ChannelTag/Config';
import style from './style.module.less';

const { Panel } = Collapse;

interface IModalProps {
  visible: boolean;
  onCancel?: () => void;
  value?: IChannelTagList[];
  onChange?: (value?: IChannelTagList[]) => void;
}

const TagModal: React.FC<IModalProps> = ({ visible, onCancel }) => {
  const [groupList, setGroupList] = useState<IChannelItem[]>([]);
  // 获取渠道标签
  const getChannelGroupList = async () => {
    const res = await requestGetChannelGroupList({ pageSize: 999, status: 1 });
    console.log('res', res.list);
    if (res) {
      setGroupList(res.list.filter((groupItem: IChannelItem) => groupItem.groupName !== '投放渠道'));
    }
  };
  useEffect(() => {
    getChannelGroupList();
  }, []);
  return (
    <Modal title="添加标签" centered className={style.wrap} visible={visible} onCancel={onCancel} maskClosable={false}>
      <Collapse defaultActiveKey={['0']}>
        {groupList.map((groupItem) => (
          <Panel key={groupItem.groupId} header={groupItem.groupName}></Panel>
        ))}
      </Collapse>
    </Modal>
  );
};
export default TagModal;
