import { Button, Drawer, Form, Input, Divider, Space, Avatar, List, PaginationProps } from 'antd';
import React, { useState, useEffect } from 'react';
import { getChatSearchList } from 'src/apis/orgManage';
import style from './style.module.less';
interface CreateDrawerProps {
  visible: boolean;
  onClose: () => void;
  value?: any;
  // onSuccess: () => void;
}
const CreateDrawer: React.FC<CreateDrawerProps> = ({ visible, onClose, value }) => {
  const [list, setList] = useState<[]>([]);
  // const [chatProposalId, setChatProposalId] = useState<String>();
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 0,
    pageSize: 10,
    total: 0
  });
  const { Item } = Form;
  const [form] = Form.useForm();
  console.log(value);
  // 获取列表数据
  const getList = async (param: any) => {
    const params: any = {
      ...param,
      pageNum: param.pageNum,
      pageSize: param.pageSize,
      chatProposalId: value
    };

    console.log(params, '========================');
    const res = await getChatSearchList({ ...params });
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
    getList({});
  }, []);
  return (
    <>
      <Drawer
        title="202210-02 经理小王与张程程思的详细沟通记录"
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
              <span className={style.chatNum}>{'粤B-12345'}</span>
              <span className={style.chatWord} style={{ marginLeft: '8px' }}>
                创建时间：
              </span>
              <span className={style.chatNum}>{'2022-11-11 12:20'}</span>
            </div>
            <div className={style.chatFootText}>
              {'公安备案号11010502030143经营性网站备案信息北京互联网违法和不良信息举报中心 家长监网络110报警服务'}
            </div>
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
                  <List.Item key={'item'}>
                    <List.Item.Meta
                      avatar={<Avatar src={`${'item.avatar'}`} />}
                      title={
                        <>
                          <div className={style.chatName}>
                            <Space>
                              <div className={style.chatName}>{'item.name'}</div>
                              <div className={style.chatcard}>{'item.soure'}</div>
                              <div className={style.chatTime}>{'item.dateCreated'}</div>
                              <div className={style.chatTime}>{item}</div>
                            </Space>
                          </div>
                        </>
                      }
                      description={'item.content'}
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
