import { Form, Input, InputNumber, Radio, Select, Space, Switch } from 'antd';
import classNames from 'classnames';
import React, { useState } from 'react';
import { getNodeList, searchTagList } from 'src/apis/task';
import { NgModal } from 'src/components';
import { CodeType, NodeType, TagInterface } from 'src/utils/interface';
import styles from './style.module.less';

type CreateNodeModalProps = React.ComponentProps<typeof NgModal> & {
  options: NodeType[];
  onSubmit: (values: any) => void;
};

const CreateNodeModal: React.FC<CreateNodeModalProps> = ({ options, onSubmit, ...props }) => {
  const [ruleForm] = Form.useForm();
  const [currentNodeType, setCurrentNodeType] = useState<CodeType>();
  const [currentNode, setCurrentNode] = useState<any>();
  const [nodeOptions, setNodeOptions] = useState<any[]>([]);
  const [tagOptions, setTagOptions] = useState<TagInterface[]>([]);
  const [formValues, setFormValues] = useState<any>({});
  // 获取列表数据
  const getNodeOptions = async (params?: any) => {
    const res = await getNodeList({ pageNum: 1, pageSize: 20, ...params });
    if (res) {
      setNodeOptions(res.list || []);
    }
  };
  const onNodeTypeChange = (typeCode: CodeType) => {
    setCurrentNodeType(typeCode);
    getNodeOptions({ nodeTypeCode: typeCode });
    if (typeCode === 'node_quota') {
      // getOptions();
      console.log('a');
    }
  };

  const getTagList = async (tagGroupName: string) => {
    const res = await searchTagList({ groupName: tagGroupName });
    console.log(res);
    if (res) {
      setTagOptions(res.tagList || []);
    }
  };

  const nodeChange = async (value: string) => {
    console.log(value);
    const node = nodeOptions.filter((node) => node.nodeId === value)?.[0];
    setCurrentNode(node);
    // 如果是标签类型
    if (currentNodeType === 'node_tag') {
      getTagList(node.nodeName);
    }
  };

  const onValuesChange = (values: any) => {
    setFormValues(values);
  };

  const onConfirm = () => {
    ruleForm
      .validateFields()
      .then((values) => {
        console.log(values);
        // 1. 节点类型时
        if (currentNodeType === 'node_tag') {
          const { dateLogicType, ...otherValues } = values;
          // 1.1当天
          if (dateLogicType === 1) {
            onSubmit({ ...otherValues, days: 0 });
          } else {
            // 1.2 后多少天
            onSubmit({ ...otherValues });
          }
          return false;
        }
        onSubmit(values);
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
        <Form.Item label="选择节点类别" labelAlign="right">
          <Select className="width240" onChange={onNodeTypeChange} placeholder="请选择">
            {options.map((option) => (
              <Select.Option value={option.typeCode} key={option.typeId}>
                {option.typeName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        {currentNodeType === 'node_date' && (
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
                  <Form.Item>
                    <Switch checkedChildren="开启" unCheckedChildren="关闭" defaultChecked />
                  </Form.Item>
                  <div className={classNames('flex', styles.lineWrap)}>
                    <Space size={8}>
                      <Form.Item name={'sourceTagName'}>
                        <Select style={{ width: '120px' }}>
                          {tagOptions.map((tag) => (
                            <Select.Option key={tag.tagId + tag.tagName} value={tag.tagName}>
                              {tag.tagName}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <span className={styles.lineText}>修改成</span>
                      <Form.Item name={'targetTagName'}>
                        <Select style={{ width: '120px' }}>
                          {tagOptions.map((tag) => (
                            <Select.Option key={tag.tagId + tag.tagName} value={tag.tagName}>
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
      </Form>
    </NgModal>
  );
};

export default CreateNodeModal;
