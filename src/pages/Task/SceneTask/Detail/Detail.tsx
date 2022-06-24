import { Breadcrumb, Form, Input } from 'antd';
import React from 'react';
import { NgTable } from 'src/components';
import { tableColumnsFun } from './DetailConfig';

const TaskSceneDetail: React.FC = () => {
  const navigatorToList = () => {
    console.log('1');
  };
  return (
    <div className="edit container">
      <div className={'breadcrumbWrap'}>
        <span>当前位置：</span>
        <Breadcrumb>
          <Breadcrumb.Item onClick={() => navigatorToList()}>场景管理</Breadcrumb.Item>
          <Breadcrumb.Item>场景详情</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div>
        <div className="formListTitle">基本信息</div>
        <Form className="mt20">
          <Form.Item label="场景名称">
            <Input className={'width320'}></Input>
          </Form.Item>
          <Form.Item label="场景关联节点类别">
            <Input className={'width320'}></Input>
          </Form.Item>
          <Form.Item label="场景关联节点类别" extra="*保险到期日选择为：用户投保的商业车险到期日以及交强险到期日。">
            <Input className={'width320'}></Input>
          </Form.Item>
          <Form.Item label="场景修改人">Yuyd</Form.Item>
          <Form.Item label="场景修改时间">2022-06-24 09:00</Form.Item>
        </Form>
        <div className="formListTitle mb20">场景规则信息</div>
        <NgTable
          dataSource={[{}]}
          columns={tableColumnsFun({
            onOperate: () => console.log('查看')
          })}
        ></NgTable>
      </div>
    </div>
  );
};

export default TaskSceneDetail;
