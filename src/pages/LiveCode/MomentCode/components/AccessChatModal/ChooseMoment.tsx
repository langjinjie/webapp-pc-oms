import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, /* Image, */ Input, message, Modal, Pagination, Radio, Spin } from 'antd';
import { requestSyncGroupChat, requestGetGroupChatList } from 'src/apis/liveCode';
import style from './style.module.less';
import { Icon } from 'src/components';
import { IPagination } from 'src/utils/interface';
import classNames from 'classnames';

interface IGroupChat {
  chatId: string; // 是 客户群id
  name: string; // 是 群名
  chatName?: string; //
  ownerName: string; // 是 群主姓名
}

interface IChooseMomentProps {
  value?: IGroupChat;
  onChange?: (value?: any) => void;
}

const ChooseMoment: React.FC<IChooseMomentProps> = ({ value, onChange }) => {
  const [groupChatListVisible, setGroupChatListVisible] = useState(false);
  const [groupChatList, setGroupChatList] = useState<IGroupChat[]>([]);
  const [pagination, setPagination] = useState<IPagination>({ current: 1, pageSize: 10, total: 0 });
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [chooseChat, setChooseChat] = useState<IGroupChat>();

  const { Item } = Form;
  const [form] = Form.useForm();

  const onCancelHandle = () => {
    setGroupChatListVisible(false);
  };
  const onOkHandle = () => {
    console.log('chooseChat', chooseChat);
    onChange?.(chooseChat);
    onCancelHandle();
  };

  // 获取群聊列表
  const getGroupChatList = async (value?: any) => {
    setLoading(true);
    const res = await requestGetGroupChatList({ ...value });
    if (res) {
      const { list, total } = res;
      list && setGroupChatList(list);
      setPagination((pagination) => ({ ...pagination, total }));
    }
    setLoading(false);
  };

  // 更新列表
  const updateListHandle = async () => {
    const res = await requestSyncGroupChat();
    if (res) {
      setPagination((pagination) => ({ ...pagination, current: 1 }));
      setName('');
      await getGroupChatList();
      message.success('数据更新成功');
    }
  };

  // 搜索
  const searchHandle = async () => {
    const { name } = form.getFieldsValue();
    await getGroupChatList({ name });
    setName(name);
    setPagination((pagination) => ({ ...pagination, current: 1 }));
  };
  // 切换分页
  const paginationChange = (page: number, pageSize: number) => {
    setPagination((pagination) => ({ ...pagination, current: page, pageSize }));
    getGroupChatList({ pageNum: page, name });
  };

  const onValuesChangeHandle = (changedValues: any) => {
    const keys = Object.entries(changedValues)?.[0];
    if (keys[0] === 'chatId') {
      const chooseChat = groupChatList.find((findItem) => findItem.chatId === keys[1]);
      if (chooseChat) {
        const { name: chatName } = chooseChat;
        setChooseChat({ ...chooseChat, chatName });
      }
    }
  };

  useEffect(() => {
    // 每次进入弹窗都在第一页并且搜索条件为空
    if (groupChatListVisible) {
      form.setFieldsValue({ name: '', chatId: value?.chatId || '' });
      if (groupChatList.length === 0 || name || pagination.current !== 1) {
        setPagination((pagination) => ({ ...pagination, current: 1 }));
        setName('');
        getGroupChatList();
      }
    }
  }, [groupChatListVisible]);
  return (
    <div>
      <div className={style.chooseChat}>
        <div className={style.name}>{value?.chatName}</div>
        <Button icon={<PlusOutlined />} className={style.btn} onClick={() => setGroupChatListVisible(true)}>
          选择客户群
        </Button>
      </div>
      <Modal
        title={
          <>
            群聊列表
            <span className="ml10 text-primary font14 pointer " onClick={updateListHandle}>
              <Icon className="font16" name="tongbu" />
              更新数据
            </span>
          </>
        }
        centered
        width={480}
        visible={groupChatListVisible}
        onCancel={onCancelHandle}
        onOk={onOkHandle}
        maskClosable={false}
        okButtonProps={{
          disabled: !chooseChat
        }}
      >
        <Form form={form} onValuesChange={onValuesChangeHandle}>
          <div className={style.inputWrap}>
            <Item name="name" className={style.item}>
              <Input prefix={<Icon name="icon_common_16_seach" />} className={style.searchInput} />
            </Item>
            <Button className={style.searchBtn} type="primary" onClick={searchHandle}>
              搜索
            </Button>
          </div>
          <Spin tip="加载中..." spinning={loading}>
            <Item name="chatId">
              <Radio.Group className={style.gruopWrap}>
                {groupChatList.map((mapItem) => (
                  <Radio key={mapItem.chatId} className={style.radioItem} value={mapItem.chatId}>
                    {/* <div className={style.radioLabel}> */}
                    {/* <Image className={style.gruopImg} src={require(mapItem.)} /> */}
                    <div className={style.chatGroupInfo}>
                      <div className={classNames(style.groupName, 'ellipsis')} title={mapItem.name}>
                        {mapItem.name || '--'}
                      </div>
                      <div className={style.leader}>群主：{mapItem.ownerName}</div>
                    </div>
                    {/* </div> */}
                  </Radio>
                ))}
              </Radio.Group>
            </Item>
          </Spin>
        </Form>
        <Pagination size="small" {...pagination} onChange={paginationChange} showSizeChanger={false} />
      </Modal>
    </div>
  );
};

export default ChooseMoment;
