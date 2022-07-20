import { Breadcrumb, Form, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { getSceneDetail } from 'src/apis/task';
import { NgTable } from 'src/components';
import { URLSearchParams } from 'src/utils/base';
import { tableColumnsFun } from './DetailConfig';

const TaskSceneDetail: React.FC<RouteComponentProps> = ({ location }) => {
  const [detail, setDetail] = useState<any>({});
  const navigatorToList = () => {
    console.log('1');
  };
  const getDetail = async () => {
    const { sceneId } = URLSearchParams(location.search);
    const res = await getSceneDetail({ sceneId });
    console.log(res);
    setDetail(res || {});
  };
  useEffect(() => {
    getDetail();
  }, []);
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
            <Input className={'width320'} value={detail.sceneName} readOnly></Input>
          </Form.Item>
          <Form.Item label="场景关联节点类别">
            <Input className={'width320'} value={detail.nodeTypeName} readOnly />
          </Form.Item>
          <Form.Item label="场景关联节点" extra="*保险到期日选择为：用户投保的商业车险到期日以及交强险到期日。">
            <Input className={'width320'} value={detail.nodeName} readOnly />
          </Form.Item>
          <Form.Item label="场景修改人">{detail.updateBy}</Form.Item>
          <Form.Item label="场景修改时间">{detail.updateTime}</Form.Item>
        </Form>
        <div className="formListTitle mb20">场景规则信息</div>
        <NgTable
          dataSource={detail.sceneRuleList || []}
          columns={tableColumnsFun({
            onOperate: () => console.log('查看')
          })}
        ></NgTable>
      </div>
    </div>
  );
};

export default TaskSceneDetail;
