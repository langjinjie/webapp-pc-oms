import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, DatePicker, Divider, Form, Input, message, Select, Space, TimePicker, Typography } from 'antd';
import classNames from 'classnames';
import moment, { Moment } from 'moment';
import { ManuallyAddSpeech } from '../ManuallyAddSpeech/ManuallyAddSpeech';
import CreateNodeRuleModal from '../../../RuleManage/components/CreateNodeRuleModal';

import NodePreview from '../NodePreview/NodePreview';
import styles from './style.module.less';
import { getDateNodeList, getNodeList, getNodeRuleList, getNodeTypeList, getTouchWayList } from 'src/apis/task';
import RuleActionSetModal from '../RuleActionSetModal/RuleActionSetModal';
import { NodeCodeType } from 'src/utils/interface';
import { debounce } from 'src/utils/base';
import { FormBlockPreview } from '../ManuallyAddSpeech/FormBlockPreview/FormBlockPreview';
interface FormBlockProps {
  value?: any[];
  isCorp?: boolean;
  isReadonly?: boolean;
  hideAdd?: boolean;
  onChange?: (value: any) => void;
}
const FormBlock: React.FC<FormBlockProps> = ({ value, hideAdd, isCorp, isReadonly }) => {
  const [formValues, setFormValues] = useState<any>();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [nodeOptions, setNodeOptions] = useState<any[]>([]);
  const [nodeDetails, setNodeDetails] = useState<any[]>([]);
  const [nodeTypeOptions, setNodeTypeOptions] = useState<any[]>([]);
  const [nodeName, setNodeName] = useState('');
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
    console.log(values);
    setTimeout(() => {
      const res = blockForm.getFieldsValue();
      setFormValues(res);
    }, 500);
  };
  // 预览内容
  const [previewValue, setPreviewVale] = useState<any>({});

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
        nodeOptions.push([{ nodeId: item.nodeId, nodeName: item.nodeName, nodeDesc: item.nodeDesc }]);
        nodeDetails[index] = {
          node: { nodeId: item.nodeId, nodeName: item.nodeName, nodeDesc: item.nodeDesc },
          options: []
        };
        item.date = moment(item.date, 'MMDD') || undefined;
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
    let res: any;
    if (params.nodeTypeCode !== 'node_calendar') {
      res = await getNodeList({ pageNum: 1, pageSize: 20, ...params });
    } else {
      const date = formValues?.sceneList?.[index]?.date.format('MMDD');
      res = await getDateNodeList({ type: 2, date, nodeDesc: params.nodeName });
    }
    if (res) {
      const copyData = [...nodeOptions];
      copyData[index] = res.list || [];
      setNodeOptions(() => copyData);
    }
  };

  /**
   * @desc 获取节点里边 防抖处理
   */
  const debounceFetcherNodeOptions = debounce<{ value: string; index: number }>(
    async ({ value, index }: { value: string; index: number }) => {
      await getNodeOptions({ nodeTypeCode: formValues?.sceneList[index].nodeTypeCode, nodeName: value }, index);
    },
    300
  );

  const onFocusNodeSelect = async (index: number) => {
    await getNodeOptions({ nodeTypeCode: formValues?.sceneList[index].nodeTypeCode, nodeName: '' }, index);
  };

  // 节点类别改变
  const onNodeTypeChange = (typeCode: NodeCodeType, index: number) => {
    const sceneListValues = [...blockForm.getFieldValue('sceneList')];
    const values = { ...sceneListValues[index] };
    values.nodeId = '';
    values.date = undefined;
    values.nodeRuleList = values.nodeRuleList.map((item: any) => ({ ...item, nodeRuleId: undefined }));
    sceneListValues.splice(index, 1, values);
    console.log(sceneListValues);
    console.log(values);

    blockForm.setFieldsValue({
      sceneList: sceneListValues
    });
    setFormValues({ sceneList: sceneListValues });

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

  const onFocusNodeRuleItem = async (index: number) => {
    const currentItem = formValues?.sceneList[index] || {};
    if (!currentItem.nodeTypeCode || !currentItem.nodeId) {
      blockForm.validateFields();
      message.warning('请选择节点信息');
    } else {
      const copyData = [...nodeDetails];

      // 获取节点规则列表
      const res = await getNodeRuleList({ nodeId: currentItem.nodeId, nodeTypeCode: currentItem.nodeTypeCode });
      if (res) {
        copyData[index].options = res.list || [];
      }
      setNodeDetails(copyData);
    }
  };

  // 新增节点规则
  const addNodeRule = (item: any, index: number) => {
    item.node = nodeDetails[index].node;
    setVisibleRule(true);
    setCurrentItem(item);
  };
  const preViewNodeAndAction = (index: number, nodeIndex: number) => {
    console.log(index, nodeIndex);
    setPreviewVale(formValues?.sceneList?.[index]?.nodeRuleList?.[nodeIndex] || {});
    setPreviewVisible(true);
  };

  // 日历切换
  const onDateChange = async (value: Moment | null, index: number) => {
    if (value) {
      const res = await getDateNodeList({
        type: 2,
        date: value.format('MMDD')
      });
      const { list } = res;
      nodeOptions[index] = list;
    }
  };

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNodeName(event.target.value);
  };

  const addDateNode = async (index: number) => {
    const res = await getDateNodeList({
      type: 1,
      date: formValues.sceneList?.[index].date.format('MMDD'),
      nodeDesc: nodeName
    });
    if (res) {
      message.success('添加成功');
      console.log(nodeOptions);
      const copyData = [...nodeOptions];
      copyData[index].push(res.list[0]);
      setNodeName('');

      setNodeOptions(copyData);
    }
  };

  return (
    <>
      <Form form={blockForm} name="blockForm" className={styles.blockWrap} onValuesChange={onFieldsChange}>
        <Form.List name={'sceneList'}>
          {(fields, { add, remove: listItemRemove }) => (
            <>
              {fields.map(({ name, key, ...restFiled }, index) => (
                <Form.Item key={key + name} className={styles.formBlock} {...restFiled}>
                  <div className={classNames(styles.blockTitle, 'flex justify-between align-center')}>
                    <span>序号 {index + 1}</span>
                    {!isCorp && (
                      <Button
                        className={styles.blockDelete}
                        type="link"
                        disabled={index === 0}
                        onClick={() => listItemRemove(index)}
                      >
                        删除
                      </Button>
                    )}
                  </div>
                  <div className="ph20">
                    <div className={classNames(styles.blockAttr, 'flex align-start')}>
                      <Form.Item
                        name={[name, 'nodeTypeCode']}
                        label="节点类别"
                        rules={[{ required: true }]}
                        className={classNames(styles.nodeType, styles.attrItem, 'flex align-center')}
                      >
                        <Select
                          disabled={isCorp}
                          className={styles.attrItemContent}
                          onChange={(value) => onNodeTypeChange(value, index)}
                        >
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
                          <Form.Item
                            label="选择日期"
                            name={[name, 'date']}
                            className={classNames(styles.attrItem, 'flex align-center')}
                          >
                            <DatePicker
                              onChange={(date) => onDateChange(date, index)}
                              disabled={isCorp}
                              format={'MM-DD'}
                            />
                          </Form.Item>
                          <Form.Item
                            label="节点说明"
                            name={[name, 'nodeId']}
                            className={classNames(styles.attrItem, 'flex align-center')}
                          >
                            <Select
                              className={styles.nodeDate}
                              disabled={!formValues?.sceneList?.[index]?.date || !!isCorp}
                              filterOption={false}
                              onFocus={() => onFocusNodeSelect(index)}
                              onSearch={(value) => debounceFetcherNodeOptions({ value, index })}
                              onChange={(value) => onNodeChange(value, index)}
                              showSearch={true}
                              placeholder="请选择"
                              dropdownRender={(menu) => (
                                <>
                                  {menu}
                                  <Divider style={{ margin: '8px 0' }} />
                                  <Space align="center" style={{ padding: '0 8px 4px' }}>
                                    <Input
                                      className="width200"
                                      placeholder="请输入节点说明"
                                      value={nodeName}
                                      maxLength={10}
                                      onChange={onNameChange}
                                    />
                                    <Typography.Link
                                      onClick={() => addDateNode(index)}
                                      style={{ whiteSpace: 'nowrap' }}
                                    >
                                      <PlusOutlined /> 新增
                                    </Typography.Link>
                                  </Space>
                                </>
                              )}
                            >
                              {nodeOptions[index]?.map((option: any) => (
                                <Select.Option value={option.nodeId} key={option.nodeId}>
                                  {option.nodeDesc}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                          <Form.Item
                            rules={[{ required: true }]}
                            label="节点名称"
                            className={classNames(styles.attrItem, 'flex align-center ml30')}
                          >
                            <span>{nodeDetails[index]?.node?.nodeName || '--'}</span>
                          </Form.Item>
                        </>
                          )
                        : (
                        <>
                          <Form.Item
                            label="选择节点"
                            name={[name, 'nodeId']}
                            rules={[{ required: true }]}
                            className={classNames(styles.attrItem, 'flex align-center')}
                          >
                            <Select
                              disabled={isCorp}
                              filterOption={false}
                              onFocus={() => onFocusNodeSelect(index)}
                              onSearch={(value) => debounceFetcherNodeOptions({ value, index })}
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
                        <li className={styles.speechCol}>手工自定义话术(点击可修改)</li>
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
                                    <Form.Item
                                      className={styles.nodeCol}
                                      name={[nodeName, 'nodeRuleId']}
                                      rules={[{ required: true, message: '请选择节点规则' }]}
                                    >
                                      <Select
                                        disabled={isReadonly}
                                        onFocus={() => {
                                          onFocusNodeRuleItem(index);
                                        }}
                                        placeholder="请选择"
                                        dropdownRender={(menu) => (
                                          <>
                                            {menu}
                                            <Button
                                              type="primary"
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
                                    <Form.Item
                                      className={styles.nodeCol}
                                      name={[nodeName, 'wayCode']}
                                      rules={[{ required: true, message: '请选择触达方式' }]}
                                    >
                                      <Select placeholder="请选择" disabled={isReadonly}>
                                        {touchWayOptions.map((touchWay) => (
                                          <Select.Option key={touchWay.wayId} value={touchWay.wayCode}>
                                            {touchWay.wayName}
                                          </Select.Option>
                                        ))}
                                      </Select>
                                    </Form.Item>
                                    <Form.Item
                                      rules={[{ required: true, message: '请配置动作规则' }]}
                                      className={styles.ruleCol}
                                      name={[nodeName, 'actionRule']}
                                    >
                                      <RuleActionSetModal isReadonly={isReadonly} />
                                    </Form.Item>
                                    <Form.Item
                                      name={[nodeName, 'speechcraft']}
                                      rules={[{ required: true, message: '请输入自定义话术' }]}
                                      className={styles.speechCol}
                                    >
                                      <ManuallyAddSpeech isReadonly={isReadonly} />
                                    </Form.Item>
                                    <Form.Item
                                      name={[nodeName, 'pushTime']}
                                      rules={[{ required: true, message: '请选择推送时间' }]}
                                      className={classNames(styles.timeCol)}
                                    >
                                      <TimePicker disabled={isReadonly} bordered={false} format={'HH:mm'} />
                                    </Form.Item>
                                    <div className={styles.operateCol}>
                                      <Space>
                                        <Button type="link" onClick={() => preViewNodeAndAction(index, nodeIndex)}>
                                          查看
                                        </Button>
                                        <Button type="link" disabled={isReadonly} onClick={() => remove(nodeIndex)}>
                                          删除
                                        </Button>
                                        <Button
                                          type="link"
                                          disabled={isReadonly}
                                          onClick={() => add(formValues?.sceneList?.[index]?.nodeRuleList?.[nodeIndex])}
                                        >
                                          复制
                                        </Button>
                                      </Space>
                                    </div>
                                  </div>
                                </Form.Item>
                              ))}
                              <li className={styles.nodeItem}>
                                <Button
                                  shape="round"
                                  ghost
                                  type="primary"
                                  onClick={() => add({ pushTime: moment('09:00', 'HH:mm') })}
                                >
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
              {!hideAdd && !isCorp && (
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
      <div className="formListTitle">策略行事历预览</div>
      <FormBlockPreview value={formValues?.sceneList || []} />
    </>
  );
};

export default FormBlock;
