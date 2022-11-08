import { Button, Drawer, Form, Input, Divider, Space, Avatar, List } from 'antd';
import React from 'react';
import style from './style.module.less';
interface CreateDrawerProps {
  visible: boolean;
  onClose: () => void;
  value?: any;
  // onSuccess: () => void;
}
const CreateDrawer: React.FC<CreateDrawerProps> = ({ visible, onClose, value }) => {
  const { Item } = Form;
  const [form] = Form.useForm();
  console.log(value);
  /**
   * 查询
   * @param values
   */
  const onSearch = (values: any) => {
    console.log(values);

    // const param: any = {
    //   ...values,
    //   pageNum: 1
    // };
    // setStaffName(values);
    // getList(param);
  };
  const data = [
    {
      title: '李斯 客户经理   2022-11-11 12:20'
    },
    {
      title: '李斯 客户经理   2022-11-11 12:20'
    },
    {
      title: '李斯 客户经理   2022-11-11 12:20'
    },
    {
      title: '李斯 客户经理   2022-11-11 12:20'
    }
  ];
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
              {/* <Space>
                                <Avatar src="https://joeschmoe.io/api/v1/random" size={28} />
                                <div className={style.chatName}>{'李斯'}</div>
                                <div className={style.chatcard}>{'客户经理'}</div>
                                <div className={style.chatTime}>{'2022-11-11 12:20'}</div>
                            </Space>
                            <div className={style.chatFormText}>
                                {'公安备案号11010502030143经营性网站备案信息北京互联网违法和不良信息举报中心 家长监网络110报警服务'}
                            </div> */}
              <List
                itemLayout="horizontal"
                dataSource={data}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                      title={`${item.title}`}
                      description="Ant Design, a design language for background applications, is refined by Ant UED Team"
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
