import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Select, Space, TimePicker } from 'antd';
import classNames from 'classnames';
import moment from 'moment';
import { ManuallyAddSpeech } from '../ManuallyAddSpeech/ManuallyAddSpeech';
import CreateNodeRuleModal from '../../../RuleManage/components/CreateNodeRuleModal';

import NodePreview from '../NodePreview/NodePreview';
import styles from './style.module.less';
import { getNodeList, getNodeRuleList, getNodeTypeList, getTouchWayList } from 'src/apis/task';
import RuleActionSetModal from '../RuleActionSetModal/RuleActionSetModal';
import { CodeType } from 'src/utils/interface';
import { debounce } from 'src/utils/base';
interface FormBlockProps {
  value?: any[];
  hideAdd?: boolean;
  onChange?: (value: any) => void;
}
const FormBlock: React.FC<FormBlockProps> = ({ value, hideAdd }) => {
  const [formValues, setFormValues] = useState<any>();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [nodeOptions, setNodeOptions] = useState<any[]>([]);
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
  const getNodeTypeOptions = async () => {
    const res = await getNodeTypeList();
    setNodeTypeOptions(res || []);
  };

  const onFieldsChange = (changedValues: any, values: any) => {
    console.log('=====values=====', values);
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
      itemIds: []
    }
  };

  const getTouchWayOptions = async () => {
    const res = await getTouchWayList();
    if (res) setTouchWayOptions(res.list || []);
  };

  // form表单数据初始化
  const initFormData = (value: any) => {
    if (value) {
      const copyValue = [...value];
      // 节点下拉列表数据
      const nodeOptions: any[] = [];
      // 节点规则数据回显
      const nodeDetails: any[] = [];
      copyValue.map((item, index) => {
        nodeOptions.push([{ nodeId: item.nodeId, nodeName: item.nodeName }]);
        nodeDetails[index] = {
          node: { nodeId: item.nodeId, nodeName: item.nodeName, nodeDesc: item.nodeDesc },
          options: []
        };
        item?.nodeRuleList.map((child: any) => {
          nodeDetails[index].options.push({ nodeRuleId: child.nodeRuleId, nodeRuleName: child.nodeRuleName });
          child.pushTime = moment(child.pushTime, 'HH:mm') || undefined;

          return child;
        });
        return item;
      });
      setNodeDetails(nodeDetails);
      setNodeOptions(nodeOptions);
      blockForm.setFieldsValue({
        sceneList: copyValue
      });
      setFormValues({
        sceneList: copyValue
      });
    } else {
      blockForm.setFieldsValue({
        sceneList: [
          {
            nodeRuleList: [
              {
                pushTime: moment('09:00', 'HH:mm')
              }
            ]
          }
        ]
      });
    }
  };

  useEffect(() => {
    initFormData(value);
  }, [value]);
  useEffect(() => {
    getTouchWayOptions();
    getNodeTypeOptions();
  }, []);

  // 获取列表数据
  const getNodeOptions = async (params: any, index: number) => {
    const res = await getNodeList({ pageNum: 1, pageSize: 20, ...params });
    if (res) {
      const copyData = [...nodeOptions];
      copyData[index] = res.list || [];
      setNodeOptions(() => copyData);
    }
  };

  /**
   * @desc 获取节点里边 防抖处理
   */
  const debounceFetcherNodeOptions = (index: number) =>
    debounce(async (value: string) => {
      await getNodeOptions({ nodeTypeCode: formValues?.sceneList[index].nodeTypeCode, codeName: value }, index);
    }, 300);

  // 节点类别改变
  const onNodeTypeChange = (typeCode: CodeType, index: number) => {
    getNodeOptions({ nodeTypeCode: typeCode }, index);
  };

  // 节点改变时，设置节点说明
  const onNodeChange = async (nodeId: string, index: number) => {
    const nodeTypeCode = blockForm.getFieldValue('sceneList')[index].nodeTypeCode;
    const node = nodeOptions[index].filter((item: any) => item.nodeId === nodeId)[0];
    const copyData = [...nodeDetails];
    copyData[index] = { node };

    // 获取节点规则列表
    const res = await getNodeRuleList({ nodeId: nodeId, nodeTypeCode: nodeTypeCode });
    if (res) {
      copyData[index].options = res.list || [];
    }
    setNodeDetails(copyData);
  };

  const onFocusNodeRuleItem = (index: number) => {
    const currentItem = formValues?.sceneList[index] || {};
    if (!currentItem.nodeTypeCode || !currentItem.nodeId) {
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
                <Form.Item key={key + name} className={styles.formBlock} {...restFiled}>
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
                        name={[name, 'nodeTypeCode']}
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

                      {formValues?.sceneList?.[index]?.nodeTypeCode === 'node_calendar'
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
                            <Select
                              filterOption={false}
                              onSearch={debounceFetcherNodeOptions(index)}
                              onChange={(value) => onNodeChange(value, index)}
                              showSearch={true}
                            >
                              {nodeOptions[index]?.map((option: any) => (
                                <Select.Option value={option.nodeId} key={option.nodeId}>
                                  {option.nodeName}
                                </Select.Option>
                              ))}
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
                                    <Form.Item className={styles.nodeCol} name={[nodeName, 'nodeRuleId']}>
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
                                                !formValues?.sceneList?.[index]?.nodeTypeCode ||
                                                !formValues?.sceneList?.[index]?.nodeId
                                              }
                                              onClick={() => addNodeRule(formValues?.sceneList?.[index], index)}
                                            >
                                              新增
                                            </Button>
                                          </>
                                        )}
                                      >
                                        {nodeDetails[index]?.options?.map((rule: any) => (
                                          <Select.Option value={rule.nodeRuleId} key={rule.nodeRuleId}>
                                            {rule.nodeRuleName}
                                          </Select.Option>
                                        ))}
                                      </Select>
                                    </Form.Item>
                                    <Form.Item className={styles.nodeCol} name={[nodeName, 'wayCode']}>
                                      <Select placeholder="待输入">
                                        {touchWayOptions.map((touchWay) => (
                                          <Select.Option key={touchWay.wayId} value={touchWay.wayCode}>
                                            {touchWay.wayName}
                                          </Select.Option>
                                        ))}
                                      </Select>
                                    </Form.Item>
                                    <Form.Item className={styles.ruleCol} name={[nodeName, 'actionRule']}>
                                      <RuleActionSetModal />
                                    </Form.Item>
                                    <Form.Item name={[nodeName, 'speechcraft']} className={styles.speechCol}>
                                      <ManuallyAddSpeech />
                                    </Form.Item>
                                    <Form.Item name={[nodeName, 'pushTime']} className={classNames(styles.timeCol)}>
                                      <TimePicker bordered={false} format={'HH:mm'} />
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

      <CreateNodeRuleModal
        options={nodeTypeOptions}
        visible={visibleRule}
        onCancel={() => setVisibleRule(false)}
        nodeCode={currentItem?.nodeTypeCode}
        childOption={[currentItem?.node]}
        onSubmit={() => setVisibleRule(false)}
      />
    </>
  );
};

export default FormBlock;
