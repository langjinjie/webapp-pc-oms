import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, /* Image, */ Input, Modal, Pagination, Radio, Spin } from 'antd';
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

  const { Item } = Form;
  const [form] = Form.useForm();

  const onCancelHandle = () => {
    setGroupChatListVisible(false);
  };
  const onOkHandle = () => {
    onChange?.(form.getFieldsValue().chooseChat);
    onCancelHandle();
  };

  // 获取群聊列表
  const getGroupChatList = async (value?: any) => {
    setLoading(true);
    const res = await requestSyncGroupChat();
    if (res) {
      const { list, total } = await requestGetGroupChatList({ ...value });
      list && setGroupChatList(list);
      setPagination((pagination) => ({ ...pagination, total }));
    }
    setLoading(false);
  };
  // 搜索
  const searchHandle = async () => {
    await getGroupChatList({ name, pageNum: 1 });
    setPagination((pagination) => ({ ...pagination, current: 1 }));
  };
  // 切换分页
  const paginationChange = (page: number, pageSize: number) => {
    setPagination((pagination) => ({ ...pagination, current: page, pageSize }));
    getGroupChatList({ pageNum: page, name });
  };
  useEffect(() => {
    if (groupChatListVisible) {
      getGroupChatList();
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
        title="群聊列表"
        centered
        width={480}
        visible={groupChatListVisible}
        onCancel={onCancelHandle}
        onOk={onOkHandle}
        maskClosable={false}
      >
        <div className={style.inputWrap}>
          <Input
            prefix={<Icon name="icon_common_16_seach" />}
            value={name}
            onChange={(e) => setName(e.target.value || '')}
            className={style.searchInput}
          />
          <Button className={style.searchBtn} type="primary" onClick={searchHandle}>
            搜索
          </Button>
        </div>
        <Spin tip="加载中..." spinning={loading}>
          <Form form={form}>
            <Item name="chooseChat">
              <Radio.Group className={style.gruopWrap}>
                {groupChatList.map((mapItem) => (
                  <Radio
                    key={mapItem.chatId}
                    className={style.radioItem}
                    value={{ chatId: mapItem.chatId, chatName: mapItem.name }}
                  >
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
          </Form>
        </Spin>
        <Pagination size="small" {...pagination} onChange={paginationChange} showSizeChanger={false} />
      </Modal>
    </div>
  );
};

export default ChooseMoment;
