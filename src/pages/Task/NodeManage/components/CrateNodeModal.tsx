import React, { useEffect, useState } from 'react';
import { Form, Input, Select } from 'antd';
import { NgModal } from 'src/components';
import { getNodeNameWithDate, queryTargetList } from 'src/apis/task';

import TagFilterComponents from '../components/TagModal/TagFilterComponent';

export interface NodeTypeProps {
  typeId: string;
  typeCode: string;
  typeName: string;
}
type CreateNodeModalProps = React.ComponentProps<typeof NgModal> & {
  options: NodeTypeProps[];
  onSubmit: (values: any) => void;
};
type CodeType = 'node_tag' | 'node_date' | 'node_quota';
export const CreateNodeModal: React.FC<CreateNodeModalProps> = ({ options, onSubmit, ...props }) => {
  const [currentNodeType, setCurrentNodeType] = useState<CodeType>();
  const [dateCodeOptions, setDateCodeOptions] = useState<any[]>([]);
  const getDateList = async () => {
    const res = await getNodeNameWithDate({
      pageSize: 100,
      pageNum: 1
    });
    if (res) {
      setDateCodeOptions(res.list || []);
    }
    console.log(dateCodeOptions);
  };
  useEffect(() => {
    if (props.visible) {
      getDateList();
    }
  }, [props.visible]);
  const [nodeForm] = Form.useForm();

  const getOptions = async () => {
    const res = await queryTargetList();
    console.log(res);
  };
  const onNodeTypeChange = (typeCode: CodeType) => {
    console.log(typeCode);
    setCurrentNodeType(typeCode);
    if (typeCode === 'node_quota') {
      getOptions();
    }
  };

  const handleOk = () => {
    nodeForm.validateFields().then((values) => {
      console.log(values);
      onSubmit(values);
    });
  };
  return (
    <NgModal {...props} width={520} title="新建节点规则" onOk={handleOk}>
      <Form form={nodeForm} labelAlign="right" labelCol={{ span: 6 }}>
        <Form.Item label="选择节点类别" name={'nodeTypeCode'} rules={[{ required: true }]}>
          <Select className="width180" onChange={onNodeTypeChange}>
            {options.map((option) => (
              <Select.Option value={option.typeCode} key={option.typeId}>
                {option.typeName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {currentNodeType === 'node_tag' && (
          <Form.Item label="节点名称" name={'nodeTagName'} key="node_tag" rules={[{ required: true }]}>
            <TagFilterComponents />
          </Form.Item>
        )}

        {currentNodeType === 'node_date' && (
          <Form.Item label="节点名称" name={'nodeDateName'} key="node_date" rules={[{ required: true }]}>
            <Select className="width320">
              {dateCodeOptions.map((item: any) => {
                return (
                  <Select.Option value={item.name} key={item.name}>
                    {item.name}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
        )}

        {/*
        <Form.Item label="节点名称">
          <Select className="width320">
            <Select.Option value={1}>标签类</Select.Option>
            <Select.Option value={2}>日期类</Select.Option>
            <Select.Option value={3}>指标类</Select.Option>
          </Select>
        </Form.Item> */}
        <Form.Item label="节点说明" name={'nodeDesc'} rules={[{ required: true }]}>
          <Input.TextArea className="width320"></Input.TextArea>
        </Form.Item>
      </Form>
    </NgModal>
  );
};
