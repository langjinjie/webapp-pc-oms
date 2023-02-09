import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Image, Input, Modal, Radio } from 'antd';
import style from './style.module.less';
import { Icon } from 'src/components';

interface IGroupChat {
  chatId: string; // 是 客户群id
  name: string; // 是 群名
  ownerName: string; // 是 群主姓名
}

interface IChooseMomentProps {
  value?: IGroupChat;
  onChange?: (value?: any) => void;
}

const ChooseMoment: React.FC<IChooseMomentProps> = ({ value, onChange }) => {
  const [groupChatListVisible, setGroupChatList] = useState(false);

  const onCancelHandle = () => {
    setGroupChatList(false);
  };
  const onOkHandle = () => {
    onChange?.({});
  };
  // 选择群聊
  const radioOnChange = (value: any) => {
    console.log('value', value);
  };
  return (
    <div>
      <div>
        <div>{value?.name}</div>
        <Button icon={<PlusOutlined />} className={style.btn} onClick={() => setGroupChatList(true)}>
          选择客户群
        </Button>
      </div>
      <Modal
        title="群聊列表"
        centered
        width={480}
        visible={groupChatListVisible}
        onCancel={onCancelHandle}
        onOk={onOkHandle}
        maskClosable={false}
      >
        <div className={style.inputWrap}>
          <Input prefix={<Icon name="icon_common_16_seach" />} className={style.searchInput} />
          <Button className={style.searchBtn} type="primary">
            搜索
          </Button>
        </div>
        <Radio.Group className={style.gruopWrap} onChange={radioOnChange}>
          <Radio className={style.radioItem} value={1}>
            <div className={style.radioLabel}>
              <Image className={style.gruopImg} src={require('src/assets/images/avater.jpg')} />
              <div className={style.chatGroupInfo}>
                <div className={style.groupName}>信息沟通交流群</div>
                <div className={style.leader}>群主：张三</div>
              </div>
            </div>
          </Radio>
          <Radio className={style.radioItem} value={2}>
            <div className={style.radioLabel}>
              <Image className={style.gruopImg} src={require('src/assets/images/avater.jpg')} />
              <div className={style.chatGroupInfo}>
                <div className={style.groupName}>信息沟通交流群</div>
                <div className={style.leader}>群主：张三</div>
              </div>
            </div>
          </Radio>
        </Radio.Group>
      </Modal>
    </div>
  );
};

export default ChooseMoment;
