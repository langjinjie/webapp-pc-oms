import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Select, Space, TimePicker } from 'antd';
import classNames from 'classnames';
// import moment from 'moment';
import { ManuallyAddSpeech } from '../ManuallyAddSpeech/ManuallyAddSpeech';
import CreateNodeRuleModal from '../../../RuleManage/components/CreateNodeRuleModal';

import NodePreview from '../NodePreview/NodePreview';
import styles from './style.module.less';
import { getNodeList, getNodeRuleList, getNodeTypeList, getTouchWayList } from 'src/apis/task';
import RuleActionSetModal from '../RuleActionSetModal/RuleActionSetModal';
import { CodeType } from 'src/utils/interface';
interface FormBlockProps {
  value?: any[];
  hideAdd?: boolean;
  onChange?: (value: any) => void;
}
const FormBlock: React.FC<FormBlockProps> = ({ hideAdd }) => {
  const [formValues, setFormValues] = useState<any>();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [nodeOptions, setNodeOptions] = useState<any>({});
  const [nodeDetails, setNodeDetails] = useState<any[]>([]);
  const [nodeTypeOptions, setNodeTypeOptions] = useState<any[]>([]);

  const [currentItem, setCurrentItem] = useState<any>();
  const [visibleRule, setVisibleRule] = useState(false);
  const [touchWayOptions, setTouchWayOptions] = useState<
    {
      wayCode: string;
      wayId: string;
      wayName: string;
    }[]
  >([]);
  const [blockForm] = Form.useForm();
  const [visibleRuleActionModal, setVisibleRuleActionModal] = useState(false);
  const getNodeTypeOptions = async () => {
    const res = await getNodeTypeList();
    setNodeTypeOptions(res || []);
  };

  const onFieldsChange = (changedValues: any, values: any) => {
    console.log(formValues);
    setFormValues(values);
  };
  // 预览内容
  const previewValue = {
    nodeRuleCode: 'GZ0001',
    nodeRuleName: '保险到期前14天',
    contentType: 1,
    logicName: '前14天',
    wayName: '群发朋友圈', // 群发朋友圈 下发任务
    speechcraft: '送你一张专属4.8折【幸运有礼】专享券',
    pushTime: '2022/6/29 9:30',
    actionRule: {
      contentType: 2,
      itemIds: [
        {
          itemId: '1',
          imgUrl:
            'https://insure-dev-server-1305111576.cos.ap-guangzhou.myqcloud.com/news/20211211/a77373316d054f14ad8e430ab593bdd2.jpg?timestamp=1639212002250&imageView2/1/w/120',
          title: '无法抵达的远方，不如去川西，这9个美得纯粹的地方，在等你！',
          desc: '描述无法抵达的远方，不如去川西，这9个美得纯粹的地方，在等你！'
        },
        {
          itemId: '2',
          imgUrl:
            'https://insure-dev-server-1305111576.cos.ap-guangzhou.myqcloud.com/news/20211211/a77373316d054f14ad8e430ab593bdd2.jpg?timestamp=1639212002250&imageView2/1/w/120',
          title: '无法抵达的远方，不如去川西，这9个美得纯粹的地方，在等你！',
          desc: '描述无法抵达的远方，不如去川西，这9个美得纯粹的地方，在等你！'
        } /* ,
        {
          itemId: '3',
          imgUrl:
            'https://insure-dev-server-1305111576.cos.ap-guangzhou.myqcloud.com/news/20211211/a77373316d054f14ad8e430ab593bdd2.jpg?timestamp=1639212002250&imageView2/1/w/120',
          title: '无法抵达的远方，不如去川西，这9个美得纯粹的地方，在等你！',
          desc: '描述无法抵达的远方，不如去川西，这9个美得纯粹的地方，在等你！'
        } */
      ]
    }
  };

  const getTouchWayOptions = async () => {
    const res = await getTouchWayList();
    if (res) setTouchWayOptions(res.list || []);
  };
  useEffect(() => {
    blockForm.setFieldsValue({
      sceneList: [
        {
          nodeRuleList: [{}]
        }
      ]
    });
    getTouchWayOptions();
    getNodeTypeOptions();
  }, []);

  const setAction = (sceneIndex: number, nodeIndex: number) => {
    console.log(sceneIndex, nodeIndex);
    setVisibleRuleActionModal(true);
  };

  // 获取列表数据
  const getNodeOptions = async (params?: any) => {
    const res = await getNodeList({ pageNum: 1, pageSize: 20, ...params });
    if (res) {
      setNodeOptions(() => ({ ...nodeOptions, [params.nodeTypeCode]: res.list || [] }));
    }
  };

  // 节点类别改变
  const onNodeTypeChange = (typeCode: CodeType, index: number) => {
    console.log(index);
    getNodeOptions({ nodeTypeCode: typeCode });
  };

  // 节点改变时，设置节点说明
  const onNodeChange = async (nodeId: string, index: number) => {
    const nodeTypeId = blockForm.getFieldValue('sceneList')[index].nodeTypeId;
    const node = nodeOptions[nodeTypeId].filter((item: any) => item.nodeId === nodeId)[0];
    console.log(node);
    const copyData = [...nodeDetails];
    copyData[index] = { node };

    // 获取节点规则列表
    const res = await getNodeRuleList({ nodeId: nodeId, nodeTypeCode: nodeTypeId });
    if (res) {
      copyData[index].options = res.list || [];
    }
    setNodeDetails(copyData);
  };

  const onFocusNodeRuleItem = (index: number) => {
    const currentItem = formValues?.sceneList[index] || {};
    console.log(currentItem);
    if (!currentItem.nodeTypeId || !currentItem.nodeId) {
      blockForm.validateFields();
      message.warning('请选择节点信息');
    }
  };

  // 新增节点规则
  const addNodeRule = (item: any, index: number) => {
    item.node = nodeDetails[index].node;
    setVisibleRule(true);
    setCurrentItem(item);
  };

  return (
    <>
      <Form form={blockForm} name="blockForm" className={styles.blockWrap} onValuesChange={onFieldsChange}>
        <Form.List name={'sceneList'}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ name, key, ...restFiled }, index) => (
                <Form.Item key={key} className={styles.formBlock} {...restFiled}>
                  <div className={classNames(styles.blockTitle, 'flex justify-between align-center')}>
                    <span>序号 {index + 1}</span>
                    <Button
                      className={styles.blockDelete}
                      type="link"
                      disabled={index === 0}
                      onClick={() => remove(index)}
                    >
                      删除
                    </Button>
                  </div>
                  <div className="ph20">
                    <div className={classNames(styles.blockAttr, 'flex align-start')}>
                      <Form.Item
                        name={[name, 'nodeTypeId']}
                        label="节点类别"
                        rules={[{ required: true }]}
                        className={classNames(styles.nodeType, styles.attrItem, 'flex align-center')}
                      >
                        <Select className={styles.attrItemContent} onChange={(value) => onNodeTypeChange(value, index)}>
                          {nodeTypeOptions.map((option) => (
                            <Select.Option value={option.typeCode} key={option.typeId}>
                              {option.typeName}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>

                      {blockForm.getFieldValue('sceneList')[index]?.nodeTypeId === 'node_calendar'
                        ? (
                        <>
                          <Form.Item label="选择日期" className={classNames(styles.attrItem, 'flex align-center')}>
                            <Input className={styles.attrItemContent}></Input>
                          </Form.Item>
                          <Form.Item
                            name={[name, 'nodeName']}
                            label="节点名称"
                            className={classNames(styles.attrItem, 'flex align-center')}
                          >
                            <span>{'10月1日(国庆节)'}</span>
                          </Form.Item>
                        </>
                          )
                        : (
                        <>
                          <Form.Item
                            label="选择节点"
                            name={[name, 'nodeId']}
                            className={classNames(styles.attrItem, 'flex align-center')}
                          >
                            <Select onChange={(value) => onNodeChange(value, index)}>
                              {nodeOptions[blockForm.getFieldValue('sceneList')[index]?.nodeTypeId]?.map(
                                (option: any) => (
                                  <Select.Option value={option.nodeId} key={option.nodeId}>
                                    {option.nodeName}
                                  </Select.Option>
                                )
                              )}
                            </Select>
                          </Form.Item>
                          <Form.Item label="节点说明" className={classNames(styles.attrItem, 'flex align-center')}>
                            <span>{nodeDetails[index]?.node?.nodeDesc || '--'}</span>
                          </Form.Item>
                        </>
                          )}
                    </div>

                    <div className={styles.taskNode}>
                      <ul className={classNames(styles.nodeTitle, 'flex justify-between')}>
                        <li className={styles.nodeCol}>配置节点规则</li>
                        <li className={styles.nodeCol}>触达方式</li>
                        <li className={styles.ruleCol}>动作规则区</li>
                        <li className={styles.speechCol}>手工自定义话(点击可修改)</li>
                        <li className={styles.timeCol}>建议推送时间</li>
                        <li className={classNames(styles.operateCol, 'flex justify-center')}>操作</li>
                      </ul>
                      <div className={styles.nodeBody}>
                        <Form.List name={[name, 'nodeRuleList']}>
                          {(fields, { add, remove }) => (
                            <>
                              {fields.map(({ name: nodeName, key }, nodeIndex) => (
                                <Form.Item key={key + nodeIndex}>
                                  <div className={classNames(styles.nodeItem, 'flex justify-between')}>
                                    <Form.Item className={styles.nodeCol} name={[name, nodeName, 'nodeRuleId']}>
                                      <Select
                                        onFocus={() => {
                                          onFocusNodeRuleItem(index);
                                        }}
                                        placeholder="待输入"
                                        dropdownRender={(menu) => (
                                          <>
                                            {menu}
                                            <Button
                                              disabled={
                                                !formValues?.sceneList?.[index]?.nodeTypeId ||
                                                !formValues?.sceneList?.[index]?.nodeId
                                              }
                                              onClick={() => addNodeRule(formValues?.sceneList?.[index], index)}
                                            >
                                              添加节点规则
                                            </Button>
                                          </>
                                        )}
                                      >
                                        {nodeDetails[index]?.options.map((rule: any) => (
                                          <Select.Option value={rule.nodeRuleId} key={rule.nodeRuleId}>
                                            {rule.nodeRuleName}
                                          </Select.Option>
                                        ))}
                                      </Select>
                                    </Form.Item>
                                    <Form.Item className={styles.nodeCol} name={[name, nodeName, 'wayCode']}>
                                      <Select placeholder="待输入">
                                        {touchWayOptions.map((touchWay) => (
                                          <Select.Option key={touchWay.wayId} value={touchWay.wayCode}>
                                            {touchWay.wayName}
                                          </Select.Option>
                                        ))}
                                      </Select>
                                    </Form.Item>
                                    <Form.Item className={styles.ruleCol}>
                                      <Button type="link" onClick={() => setAction(index, nodeIndex)}>
                                        配置
                                      </Button>
                                    </Form.Item>
                                    <Form.Item name={[name, nodeName, 'speechcraft']} className={styles.speechCol}>
                                      <ManuallyAddSpeech />
                                    </Form.Item>
                                    <Form.Item
                                      name={[name, nodeName, 'pushTime']}
                                      className={classNames(styles.timeCol)}
                                    >
                                      <TimePicker
                                        bordered={false}
                                        // defaultValue={moment('09:00', 'HH:mm')}
                                        format={'HH:mm'}
                                      />
                                    </Form.Item>
                                    <div className={styles.operateCol}>
                                      <Space>
                                        <Button type="link" onClick={() => setPreviewVisible(true)}>
                                          查看
                                        </Button>
                                        <Button type="link" onClick={() => remove(nodeIndex)}>
                                          删除
                                        </Button>
                                        <Button type="link">复制</Button>
                                      </Space>
                                    </div>
                                  </div>
                                </Form.Item>
                              ))}
                              <li className={styles.nodeItem}>
                                <Button shape="round" ghost type="primary" onClick={() => add()}>
                                  新增
                                </Button>
                              </li>
                            </>
                          )}
                        </Form.List>
                      </div>
                    </div>
                  </div>
                </Form.Item>
              ))}
              {!hideAdd && (
                <li className={classNames(styles.nodeItem, 'mt20 mb20')}>
                  <Button
                    className="ml20"
                    icon={<PlusOutlined />}
                    type="primary"
                    shape="round"
                    ghost
                    onClick={() => add()}
                    size="large"
                  >
                    新增场景
                  </Button>
                </li>
              )}
            </>
          )}
        </Form.List>
      </Form>
      <NodePreview value={previewValue} visible={previewVisible} onClose={() => setPreviewVisible(false)} />
      <RuleActionSetModal visible={visibleRuleActionModal} onCancel={() => setVisibleRuleActionModal(false)} />
      <CreateNodeRuleModal
        options={nodeTypeOptions}
        visible={visibleRule}
        onCancel={() => setVisibleRule(false)}
        nodeCode={currentItem?.nodeTypeId}
        childOption={[currentItem?.node]}
        onSubmit={() => setVisibleRule(false)}
      />
    </>
  );
};

export default FormBlock;
