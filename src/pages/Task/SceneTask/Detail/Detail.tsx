import { Breadcrumb, Form, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { getActionRuleDetail, getSceneDetail } from 'src/apis/task';
import { NgTable } from 'src/components';
import { URLSearchParams } from 'src/utils/base';
import NodePreview, { IValue } from '../../StrategyTask/components/NodePreview/NodePreview';
import { tableColumnsFun } from './DetailConfig';

const TaskSceneDetail: React.FC<RouteComponentProps> = ({ location, history }) => {
  const [detail, setDetail] = useState<any>({});
  const [visible, setVisible] = useState(false);
  const [nodeValue, setNodeValue] = useState<IValue>();
  const navigatorToList = () => {
    history.goBack();
  };
  const getDetail = async () => {
    const { sceneId } = URLSearchParams(location.search);
    const res = await getSceneDetail({ sceneId });
    console.log(res);
    setDetail(res || {});
  };
  const previewItem = async (actionRuleId: string) => {
    const res = await getActionRuleDetail({ actionRuleId });
    console.log(res);
    setVisible(true);
    setNodeValue(undefined);
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
          rowKey={'nodeRuleId'}
          dataSource={detail.sceneRuleList || []}
          columns={tableColumnsFun({
            onOperate: previewItem
          })}
        ></NgTable>
      </div>

      <NodePreview value={nodeValue} visible={visible} onClose={() => setVisible(false)} />
    </div>
  );
};

export default TaskSceneDetail;
