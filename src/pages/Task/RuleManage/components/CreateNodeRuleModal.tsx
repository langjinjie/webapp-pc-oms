import { Form, Input, InputNumber, message, Radio, Select, Space, Switch } from 'antd';
import classNames from 'classnames';
import React, { useEffect, useMemo, useState } from 'react';
import { createNodeRule, getNodeList, searchTagList } from 'src/apis/task';
import { NgModal } from 'src/components';
import { CodeType, NodeType, TagInterface } from 'src/utils/interface';
import { useResetFormOnCloseModal } from 'src/utils/use-ResetFormOnCloseModal';
import styles from './style.module.less';

type CreateNodeModalProps = React.ComponentProps<typeof NgModal> & {
  options: NodeType[];
  onSubmit: () => void;
  childOption?: any[];
  nodeCode?: CodeType;
};

const CreateNodeModal: React.FC<CreateNodeModalProps> = ({ options, childOption, nodeCode, onSubmit, ...props }) => {
  const [ruleForm] = Form.useForm();
  const [currentNodeType, setCurrentNodeType] = useState<CodeType>();
  const [currentNode, setCurrentNode] = useState<any>();
  const [nodeOptions, setNodeOptions] = useState<any[]>([]);
  const [tagOptions, setTagOptions] = useState<TagInterface[]>([]);
  const [formValues, setFormValues] = useState<any>({});

  useResetFormOnCloseModal({ form: ruleForm, visible: props.visible! });
  // 获取列表数据
  const getNodeOptions = async (params?: any) => {
    const res = await getNodeList({ pageNum: 1, pageSize: 20, ...params });
    if (res) {
      setNodeOptions(res.list || []);
    }
  };

  const getTagList = async (tagGroupName: string) => {
    const res = await searchTagList({ groupName: tagGroupName });
    if (res) {
      setTagOptions(res.tagList || []);
    }
  };
  const nodeChange = async (value: string) => {
    const node = (nodeOptions.length > 0 ? nodeOptions : childOption!).filter((node) => node.nodeId === value)?.[0];
    setCurrentNode(node);
    // 如果是标签类型
    if (currentNodeType === 'node_tag') {
      getTagList(node.nodeName);
    }

    ruleForm.setFieldsValue({
      dateLogicType: undefined,
      days: undefined,
      tagLogicType: undefined,
      sourceTagName: undefined,
      targetTagName: undefined
    });
  };

  useMemo(() => {
    if (nodeCode) {
      setCurrentNodeType(nodeCode);
      setNodeOptions(childOption || []);
      const node = childOption?.[0];
      setCurrentNode(node);
      ruleForm.setFieldsValue({
        nodeId: node.nodeId
      });
      nodeChange(node.nodeId);
    }
  }, [nodeCode, childOption]);
  useEffect(() => {
    if (!props.visible) {
      setFormValues({});

      setCurrentNode(undefined);
    }
  }, [props.visible]);

  const onNodeTypeChange = (typeCode: CodeType) => {
    setCurrentNodeType(typeCode);
    getNodeOptions({ nodeTypeCode: typeCode });
    ruleForm.resetFields();
    setFormValues({});
    setCurrentNode(undefined);

    ruleForm.setFieldsValue({
      nodeCode: typeCode
    });
  };

  const onValuesChange = (values: any) => {
    setFormValues(values);
  };

  const handleSubmit = async (values: any) => {
    const res = await createNodeRule(values);
    if (res) {
      message.success('添加成功');
      onSubmit();
    }
  };
  const onConfirm = () => {
    ruleForm
      .validateFields()
      .then((values) => {
        // 1. 节点类型时
        if (currentNodeType === 'node_tag') {
          const { dateLogicType, tagLogicType, tagLogicSwitch, ...otherValues } = values;
          // 1.1当天
          if (dateLogicType === 1) {
            handleSubmit({
              ...otherValues,
              days: 0,
              tagLogicType,
              ...{ tagLogicSwitch: tagLogicType === 1 ? (tagLogicSwitch ? 1 : 0) : undefined }
            });
          } else {
            // 1.2 后多少天
            handleSubmit({
              ...otherValues,
              tagLogicType,
              ...{ tagLogicSwitch: tagLogicType === 1 ? (tagLogicSwitch ? 1 : 0) : undefined }
            });
          }
          return false;
        } else if (currentNodeType === 'node_quota') {
          const { dateLogicType, ...otherValues } = values;
          // 1.1当天
          if (dateLogicType === 1) {
            handleSubmit({ ...otherValues, days: 0 });
          } else {
            // 1.2 后多少天
            handleSubmit({ ...otherValues });
          }
          return;
        }
        handleSubmit(values);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  return (
    <NgModal {...props} width={780} title="新建节点规则" onOk={onConfirm}>
      <Form
        form={ruleForm}
        labelAlign="right"
        labelCol={{ span: 4 }}
        onValuesChange={(changedValues: any, values: any) => onValuesChange(values)}
      >
        <Form.Item label="选择节点类别" labelAlign="right" name={'nodeCode'}>
          <Select
            className="width240"
            disabled={!!nodeCode}
            onChange={onNodeTypeChange}
            placeholder="请选择"
            value={nodeCode}
          >
            {options.map((option) => (
              <Select.Option value={option.typeCode} key={option.typeId}>
                {option.typeName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        {(currentNodeType === 'node_date' || currentNodeType === 'node_calendar') && (
          <>
            <Form.Item label="触发节点" labelAlign="right" name={'nodeId'}>
              <Select className="width320" placeholder="请选择触发节点" onChange={nodeChange}>
                {nodeOptions.map((option: any) => (
                  <Select.Option value={option.nodeId} key={option.nodeId}>
                    {option.nodeName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="触发逻辑" labelAlign="right">
              <div className={classNames('flex', styles.lineWrap)}>
                <Space size={8}>
                  <Form.Item>
                    <Input className={styles.nodeName} value={currentNode?.nodeName} readOnly></Input>
                  </Form.Item>
                  <Form.Item name={'dateLogicType'}>
                    <Select className={styles.smallInput}>
                      <Select.Option value={0}>前</Select.Option>
                      <Select.Option value={1}>当天</Select.Option>
                      <Select.Option value={2}>后</Select.Option>
                    </Select>
                  </Form.Item>
                  {formValues.dateLogicType !== 1 && (
                    <>
                      <Form.Item name={'days'}>
                        <InputNumber min={1} className={styles.smallInput} controls={false}></InputNumber>
                      </Form.Item>
                      天
                    </>
                  )}
                </Space>
              </div>
            </Form.Item>
            <Form.Item label="节点规则名称" labelAlign="right">
              {currentNode?.nodeName}前{formValues.days || 0}天
            </Form.Item>
          </>
        )}

        {/* 标签类 */}
        {currentNodeType === 'node_tag' && (
          <>
            <Form.Item label="触发节点" labelAlign="right" name={'nodeId'}>
              <Select className="width320" placeholder="请选择触发节点" onChange={nodeChange}>
                {nodeOptions.map((option: any) => (
                  <Select.Option value={option.nodeId} key={option.nodeId}>
                    {option.nodeName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="触发逻辑" labelAlign="right">
              <Form.Item name={'tagLogicType'} rules={[{ required: true }]} className="mb6">
                <Radio.Group>
                  <Radio value={0}>单独触发</Radio>
                  <Radio value={1}>关联触发</Radio>
                </Radio.Group>
              </Form.Item>
              {formValues.tagLogicType === 1
                ? (
                <div className={styles.customItem}>
                  <Form.Item name={'tagLogicSwitch'} valuePropName="checked">
                    <Switch checkedChildren="开启" unCheckedChildren="关闭" defaultChecked />
                  </Form.Item>
                  <div className={classNames('flex', styles.lineWrap)}>
                    <Space size={8}>
                      <Form.Item name={'sourceTagName'} rules={[{ required: true, message: '请选择' }]}>
                        <Select style={{ width: '120px' }} allowClear>
                          {tagOptions.map((tag) => (
                            <Select.Option key={tag.tagId + tag.tagName} value={tag.tagName}>
                              {tag.tagName}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <span className={styles.lineText}>修改成</span>
                      <Form.Item name={'targetTagName'} rules={[{ required: true, message: '请选择' }]}>
                        <Select style={{ width: '120px' }} allowClear>
                          {tagOptions.map((tag) => (
                            <Select.Option
                              disabled={tag.tagName === formValues.sourceTagName}
                              key={tag.tagId + tag.tagName}
                              value={tag.tagName}
                            >
                              {tag.tagName}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <span className={styles.lineText}>的客户</span>
                      <Form.Item name={'dateLogicType'}>
                        <Select className={styles.smallInput}>
                          <Select.Option value={1}>当天</Select.Option>
                          <Select.Option value={2}>后</Select.Option>
                        </Select>
                      </Form.Item>
                      {formValues.dateLogicType !== 1 && (
                        <>
                          <Form.Item name={'days'} rules={[{ required: true }]}>
                            <InputNumber min={1} className={styles.smallInput} controls={false}></InputNumber>
                          </Form.Item>
                          <span className={styles.lineText}>天</span>
                        </>
                      )}
                    </Space>
                  </div>
                </div>
                  )
                : (
                <div className={classNames('flex', styles.lineWrap)}>
                  <Space size={8}>
                    <span className={styles.lineText}>属于</span>
                    <Form.Item name={'sourceTagName'}>
                      <Select style={{ width: '120px' }}>
                        {tagOptions.map((tag) => (
                          <Select.Option key={tag.tagId + tag.tagName} value={tag.tagName}>
                            {tag.tagName}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <span className={styles.lineText}>客户</span>
                    <Form.Item name={'dateLogicType'}>
                      <Select className={styles.smallInput}>
                        <Select.Option value={1}>当天</Select.Option>
                        <Select.Option value={2}>后</Select.Option>
                      </Select>
                    </Form.Item>
                    {formValues.dateLogicType !== 1 && (
                      <>
                        <Form.Item name={'days'} rules={[{ required: true }]}>
                          <InputNumber min={1} className={styles.smallInput} controls={false}></InputNumber>
                        </Form.Item>
                        <span className={styles.lineText}>天</span>
                      </>
                    )}
                  </Space>
                </div>
                  )}
            </Form.Item>
            <Form.Item label="节点规则名称" labelAlign="right">
              {currentNode?.nodeName}属于{formValues.sourceTagName || '--'} 客户
              {formValues.days || '当'}天
            </Form.Item>
          </>
        )}
        {/* 指标类 */}
        {currentNodeType === 'node_quota' && (
          <>
            <Form.Item label="触发节点" labelAlign="right" name={'nodeId'}>
              <Select className="width320" placeholder="请选择触发节点" onChange={nodeChange}>
                {nodeOptions.map((option: any) => (
                  <Select.Option value={option.nodeId} key={option.nodeId}>
                    {option.nodeName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="触发逻辑" labelAlign="right">
              <div className={classNames('flex', styles.lineWrap)}>
                <Space size={8}>
                  <span className={styles.lineText}>当</span>
                  <Form.Item>
                    <Input
                      className={styles.nodeName}
                      placeholder="请选择触发节点"
                      value={currentNode?.nodeName}
                      readOnly
                    ></Input>
                  </Form.Item>

                  <Form.Item name={'dataLogicType'}>
                    <Select className={styles.smallInput}>
                      <Select.Option value={0}>小于</Select.Option>
                      <Select.Option value={1}>等于</Select.Option>
                      <Select.Option value={2}>大于</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item name={'dataValue'}>
                    <InputNumber precision={2} min={1} className={styles.smallInput} controls={false}></InputNumber>
                  </Form.Item>
                  <span className={styles.lineText}>时</span>
                  <Form.Item name={'dateLogicType'}>
                    <Select className={styles.smallInput}>
                      <Select.Option value={1}>当天</Select.Option>
                      <Select.Option value={2}>后</Select.Option>
                    </Select>
                  </Form.Item>

                  {formValues.dateLogicType !== 1 && (
                    <>
                      <Form.Item name={'days'}>
                        <InputNumber min={1} className={styles.smallInput} controls={false}></InputNumber>
                      </Form.Item>
                      天
                    </>
                  )}
                </Space>
              </div>
            </Form.Item>
            <Form.Item label="节点规则名称" labelAlign="right">
              {currentNode?.nodeName}前{formValues.days || 0}天
            </Form.Item>
          </>
        )}
      </Form>
    </NgModal>
  );
};

export default CreateNodeModal;
