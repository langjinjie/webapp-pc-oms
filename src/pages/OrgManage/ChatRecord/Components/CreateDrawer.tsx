import { Button, Drawer, Form, Input, Divider, Space, Avatar, List, PaginationProps, Image } from 'antd';
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
  contentType: number;
}
const CreateDrawer: React.FC<CreateDrawerProps> = ({ visible, onClose, value, chatProposalId }) => {
  const [list, setList] = useState<ChatListProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0,
    showTotal: (total) => {
      return `共 ${total} 条记录`;
    }
  });
  const [visiblePic, setVisiblePic] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const { Item } = Form;
  const [form] = Form.useForm();

  // 获取列表数据
  const getList = async (param: any) => {
    setLoading(true);
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
    setLoading(false);
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
  const showDrawer = () => {
    onClose();
    setPagination((pagination) => ({ ...pagination, current: 1, pageSize: 10 }));
    form.resetFields();
  };
  useEffect(() => {
    if (chatProposalId) {
      getList({ chatProposalId });
    }
  }, [chatProposalId, visible]);
  const previewImage = (src: string) => {
    setVisiblePic(true);
    setCurrentImage(src);
  };
  return (
    <>
      <Drawer
        title={`${moment(value?.dateCreated).format('YYYYMM-DD')}
        经理${value?.staffName}与${value?.externalName}的详细沟通记录`}
        placement="right"
        width={466}
        visible={visible}
        closable={true}
        onClose={showDrawer}
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
                loading={loading}
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
                      description={
                        item.contentType === undefined
                          ? (
                          <Image
                            src={item.content}
                            preview={{ visible: false }}
                            onClick={() => previewImage(item.content)}
                            fallback="data:image/png;base64,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"
                            width={100}
                          />
                            )
                          : (
                              item.content
                            )
                      }
                    />
                  </List.Item>
                )}
              />
            </div>
          </div>
        </div>
      </Drawer>
      <Image
        src={currentImage}
        preview={{ visible: visiblePic, onVisibleChange: (visible) => setVisiblePic(visible) }}
      ></Image>
    </>
  );
};

export default CreateDrawer;
