import { Button, Drawer, Form, Input, Divider, Space, Avatar, List, PaginationProps } from 'antd';
import React, { useState, useEffect } from 'react';
import { getChatSearchList } from 'src/apis/orgManage';
import moment from 'moment';
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
  staffName: string;
}
const CreateDrawer: React.FC<CreateDrawerProps> = ({ visible, onClose, value, chatProposalId }) => {
  const [list, setList] = useState<ChatListProps[]>([]);
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0,
    showTotal: (total) => {
      return `共 ${total} 条记录`;
    }
  });
  const { Item } = Form;
  const [form] = Form.useForm();

  // 获取列表数据
  const getList = async (param: any) => {
    const pageNum = param?.pageNum || pagination.current;
    const pageSize = param?.pageSize || pagination.pageSize;
    const params: any = {
      ...param,
      proposalId: chatProposalId,
      pageNum,
      pageSize
    };
    const res: any = await getChatSearchList({ ...params });

    if (res) {
      const { list, total } = res;
      setList(list || []);
      setPagination((pagination) => ({ ...pagination, current: pageNum, pageSize, total }));
    }
  };
  const onSearch = (values: any) => {
    const param: any = {
      ...values,
      pageNum: 1,
      pageSize: 10
    };
    getList(param);
  };
  const paginationChange = (pageNum: number, pageSize?: number) => {
    getList({ pageNum, pageSize });
  };
  useEffect(() => {
    if (chatProposalId && visible) {
      getList({ chatProposalId });
    }
  }, [chatProposalId, visible]);
  return (
    <>
      <Drawer
        title={`${moment(value?.dateCreated).format('YYYYMM-DD')}
        经理${value?.staffName}与${value?.externalName}的详细沟通记录`}
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
                    <Input type="text" placeholder="请输入" allowClear />
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
                  ...pagination,
                  hideOnSinglePage: true,
                  onChange: paginationChange
                }}
                renderItem={(item) => (
                  <List.Item key={item.dynamicId}>
                    <List.Item.Meta
                      avatar={<Avatar src={item.avatar} />}
                      title={
                        <>
                          <div className={style.chatName}>
                            <Space>
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
