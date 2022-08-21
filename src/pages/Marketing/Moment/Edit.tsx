import { Breadcrumb, Button, Divider, Form, Select, Input, Avatar, Image } from 'antd';
import classNames from 'classnames';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { PictureCard } from './components/PictureCard';
import styles from './style.module.less';

const MomentEdit: React.FC<RouteComponentProps> = ({ history }) => {
  const navigatorToList = () => {
    history.goBack();
  };
  return (
    <div className={styles.momentEdit}>
      <div className="edit container">
        <div className={'breadcrumbWrap'}>
          <span>当前位置：</span>
          <Breadcrumb>
            <Breadcrumb.Item onClick={() => navigatorToList()}>朋友圈内容库</Breadcrumb.Item>
            <Breadcrumb.Item>创建朋友圈内容</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="">
          <h3 className="f18">创建朋友圈内容</h3>
          <Divider></Divider>

          <Form>
            <Form.Item label="展示模版" rules={[{ required: true }]}>
              <Select placeholder="请选择" className={styles.smallSelect}>
                <Select.Option value="1">海报</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="选择内容">
              <div className={classNames(styles.lineWrap, 'flex')}>
                <Select placeholder="请选择" className={styles.smallSelect}>
                  <Select.Option value="1">海报库</Select.Option>
                </Select>
                <span className={styles.lineLabel}>内容：</span>
                <Form.Item>
                  <Select placeholder="请选择" className={styles.bigSelect}>
                    <Select.Option value="1">海报库</Select.Option>
                  </Select>
                </Form.Item>
              </div>
            </Form.Item>
            <Form.Item label="上传内容">
              <PictureCard
                value={[
                  'https://insure-dev-server-1305111576.cos.ap-guangzhou.myqcloud.com/news/20220531/b6dfadf9398d44d69e2f27730af9f904.jpg?timestamp=1653990077454',
                  'https://insure-dev-server-1305111576.cos.ap-guangzhou.myqcloud.com/news/20220107/5fff8599f86145618dedd9069fa5b156.jpg?timestamp=1641538806196',
                  'https://insure-dev-server-1305111576.cos.ap-guangzhou.myqcloud.com/img/wwcb58cb32fb9b697a/20210720/6f7db5c0-a57b-482e-b095-58697e1e4308_1626760751798.png',
                  'https://insure-dev-server-1305111576.cos.ap-guangzhou.myqcloud.com/news/20220816/61bc82e5e78842cdac5236d1a420f1e7.jpg?timestamp=1660647714632',
                  'https://insure-dev-server-1305111576.cos.ap-guangzhou.myqcloud.com/news/20220531/b6dfadf9398d44d69e2f27730af9f904.jpg?timestamp=1653990077454',
                  'https://insure-dev-server-1305111576.cos.ap-guangzhou.myqcloud.com/news/20220531/b6dfadf9398d44d69e2f27730af9f904.jpg?timestamp=1653990077454',
                  'https://insure-dev-server-1305111576.cos.ap-guangzhou.myqcloud.com/news/20220531/b6dfadf9398d44d69e2f27730af9f904.jpg?timestamp=1653990077454',
                  'https://insure-dev-server-1305111576.cos.ap-guangzhou.myqcloud.com/news/20220531/b6dfadf9398d44d69e2f27730af9f904.jpg?timestamp=1653990077454',
                  'https://insure-dev-server-1305111576.cos.ap-guangzhou.myqcloud.com/news/20220531/b6dfadf9398d44d69e2f27730af9f904.jpg?timestamp=1653990077454'
                ]}
              />
            </Form.Item>
            <Form.Item label="营销话术">
              <Input.TextArea className={styles.textAreaWrap} placeholder="请输入" />
            </Form.Item>
            <Form.Item label="预览效果">
              <div className={classNames(styles.previewWrap, 'flex')}>
                <Avatar shape="square" size={40} icon={<span className="f16">头像</span>} />
                <div className={classNames(styles.marketBox, 'cell ml10')}>
                  <h4>客户经理姓名</h4>
                  <p className="f12">有了健康时的未雨绸缪，才有患病时的踏实安心，把其他担忧交给保险吧。</p>
                  {/* <div className={styles.picIsOnly}>
                    <Image src="https://insure-dev-server-1305111576.cos.ap-guangzhou.myqcloud.com/news/20220531/b6dfadf9398d44d69e2f27730af9f904.jpg?timestamp=1653990077454"></Image>
                  </div> */}
                  <div className={styles.picSmallWrap}>
                    <Image src="https://insure-dev-server-1305111576.cos.ap-guangzhou.myqcloud.com/news/20220531/b6dfadf9398d44d69e2f27730af9f904.jpg?timestamp=1653990077454"></Image>
                    <Image src="https://insure-dev-server-1305111576.cos.ap-guangzhou.myqcloud.com/news/20220531/b6dfadf9398d44d69e2f27730af9f904.jpg?timestamp=1653990077454"></Image>
                    <Image src="https://insure-dev-server-1305111576.cos.ap-guangzhou.myqcloud.com/news/20220531/b6dfadf9398d44d69e2f27730af9f904.jpg?timestamp=1653990077454"></Image>
                    <Image src="https://insure-dev-server-1305111576.cos.ap-guangzhou.myqcloud.com/news/20220531/b6dfadf9398d44d69e2f27730af9f904.jpg?timestamp=1653990077454"></Image>
                  </div>
                  <div className={classNames(styles.shearLinkWrap, 'flex')}>
                    <img
                      className={styles.pic}
                      src="https://insure-dev-server-1305111576.cos.ap-guangzhou.myqcloud.com/news/20220531/b6dfadf9398d44d69e2f27730af9f904.jpg?timestamp=1653990077454"
                      alt=""
                    />
                    <div className="cell ml5">
                      <div className={classNames(styles.shearTitle, 'ellipsis')}>文章标题</div>
                      <div className={classNames(styles.shearDesc, 'ellipsis')}>
                        这里是描述，快来safdasnihcadfasdasfdfasfdas体验吧
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Form.Item>

            <Form.Item>
              <Button ghost shape="round" type="primary">
                确认
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default MomentEdit;
