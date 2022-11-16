import { Button, Drawer, Form, Input, Divider, Space, Avatar, List, PaginationProps } from 'antd';
import React, { useState, useEffect } from 'react';
import { getChatSearchList } from 'src/apis/orgManage';
import style from './style.module.less';
interface CreateDrawerProps {
  visible: boolean;
  onClose: () => void;
  value?: any;
  chatProposalId?: string;
}
interface ChatListProps {
  avatar: string;
  content: string;
  dateCreated: string;
  dynamicId: string;
  name: string;
  source: string;
}
const CreateDrawer: React.FC<CreateDrawerProps> = ({ visible, onClose, value, chatProposalId }) => {
  const [list, setList] = useState<ChatListProps[]>([]);
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const { Item } = Form;
  const [form] = Form.useForm();
  console.log('value', value);

  // 获取列表数据
  const getList = async (param: any) => {
    const params: any = {
      ...param,
      proposalId: chatProposalId,
      pageNum: pagination.current,
      pageSize: pagination.pageSize
    };
    const res = await getChatSearchList({ ...params });
    console.log(res, '-----------res30');

    if (res) {
      const { list } = res;
      setList(list || []);

      // setPagination((pagination) => ({ ...pagination, total, current: pageNum, pageSize }));
      setPagination((pagination) => ({ ...pagination }));
    }
  };
  const onSearch = (values: any) => {
    console.log(values);
    const param: any = {
      ...values,
      pageNum: 1,
      pageSize: 10
    };
    getList(param);
  };
  useEffect(() => {
    if (chatProposalId) {
      getList({ value, chatProposalId });
    }
  }, [chatProposalId]);
  return (
    <>
      <Drawer
        title={`${value?.dateCreated}
        经理${value?.staffId}与${value?.externalName}的详细沟通记录"`}
        placement="right"
        width={466}
        visible={visible}
        closable={true}
        onClose={onClose}
      >
        <div className={style.chatBox}>
          <div>
            <div className={style.chatTitle}>沟通内容</div>
            <div className={style.chatText}>
              <span className={style.chatWord}>车牌号：</span>
              <span className={style.chatNum}>{value?.carNumber}</span>
              <span className={style.chatWord} style={{ marginLeft: '8px' }}>
                创建时间：
              </span>
              <span className={style.chatNumTime}>{value?.dateCreated}</span>
            </div>
            <div className={style.chatFootText}>{value?.content}</div>
          </div>
          <Divider />
          <div>
            <div className={style.chatTitle}>沟通记录</div>
            <div className={style.formBox}>
              <Form form={form} onFinish={onSearch}>
                <Space>
                  <Item label="关键词" name={'sontent'}>
                    <Input type="text" placeholder="请输入" />
                  </Item>
                  <Item>
                    <Button type="primary" htmlType="submit" shape="round">
                      查询
                    </Button>
                  </Item>
                </Space>
              </Form>
            </div>
            <div className={style.formFootBox}>
              <List
                itemLayout="horizontal"
                dataSource={list}
                pagination={{
                  onChange: (pageNum: number, pageSize?: number) => {
                    getList({ pageNum, pageSize });
                    console.log({ pageNum, pageSize });
                  },
                  pageSize: pagination.pageSize
                }}
                renderItem={(item) => (
                  <List.Item key={item.name}>
                    <List.Item.Meta
                      avatar={<Avatar src={item.avatar} />}
                      title={
                        <>
                          <div className={style.chatName}>
                            <Space key={item.content}>
                              <div className={style.chatName}>{item.name}</div>
                              {item.source
                                ? (
                                <div className={style.chatcard1}>客户经理</div>
                                  )
                                : (
                                <div className={style.chatcard2}>客户</div>
                                  )}
                              <div className={style.chatTime}>{item.dateCreated}</div>
                            </Space>
                          </div>
                        </>
                      }
                      description={item.content}
                    />
                  </List.Item>
                )}
              />
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default CreateDrawer;
