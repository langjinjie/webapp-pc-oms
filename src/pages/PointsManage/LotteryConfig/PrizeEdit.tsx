/**
 * @name PrizeEdit
 * @author Lester
 * @date 2022-05-26 14:22
 */
import React from 'react';
import { Button, Form, Input, Space } from 'antd';
import classNames from 'classnames';
import { BreadCrumbs } from 'src/components';
import style from './style.module.less';
import NgUpload from 'src/pages/Marketing/Components/Upload/Upload';

const PrizeEdit: React.FC = () => {
  const [editForm] = Form.useForm();
  return (
    <div className={classNames(style.prizeEdit, 'container')}>
      <BreadCrumbs navList={[{ name: '抽奖配置' }, { name: '奖品配置' }, { name: '奖品编辑' }]} />
      <Form form={editForm} className="edit mt30" labelCol={{ span: 4 }} wrapperCol={{ span: 14 }}>
        <Form.Item name={''} label="奖品名称">
          <Input placeholder="请输入" className="width420" />
        </Form.Item>
        <Form.Item
          label="奖品图片"
          extra="为确保最佳展示效果，请上传300*300像素透明底图片，大小不超过200k，仅支持.jpg格式"
        >
          <NgUpload showDeleteBtn></NgUpload>
        </Form.Item>
        <Form.Item label="奖品库存" extra="件" className="customExtra">
          <Input className="width100"></Input>
        </Form.Item>
        <Form.Item label="中奖概率" extra="%" className="customExtra">
          <Input className="width100"></Input>
        </Form.Item>
        <Form.Item label="兑换流程说明">
          <Input.TextArea maxLength={300}></Input.TextArea>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 4 }} className="formFooter">
          <Space size={20} className="ml20">
            <Button type="primary" shape="round" ghost>
              返回
            </Button>
            <Button type="primary" shape="round">
              保存
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default PrizeEdit;
