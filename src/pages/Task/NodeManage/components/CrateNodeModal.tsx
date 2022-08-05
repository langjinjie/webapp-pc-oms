import React, { useEffect, useState } from 'react';
import { Cascader, Form, Input, Select } from 'antd';
import { NgModal } from 'src/components';
import { getNodeNameWithDate, queryTargetList } from 'src/apis/task';

import TagFilterComponents from '../components/TagModal/TagFilterComponent';
import { useResetFormOnCloseModal } from 'src/utils/use-ResetFormOnCloseModal';

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
  const [nodeForm] = Form.useForm();
  const [currentNodeType, setCurrentNodeType] = useState<CodeType>();
  const [dateCodeOptions, setDateCodeOptions] = useState<any[]>([]);
  const [quotaOptions, setQuotaOptions] = useState<any[]>([]);
  const getDateList = async () => {
    const res = await getNodeNameWithDate({
      pageSize: 1000,
      pageNum: 1
    });
    if (res) {
      setDateCodeOptions(res.list || []);
    }
  };
  useResetFormOnCloseModal({ form: nodeForm, visible: props.visible! });
  useEffect(() => {
    if (props.visible) {
      getDateList();
    }
  }, [props.visible]);

  const getOptions = async () => {
    const res = await queryTargetList({ pageSize: 1000, pageNum: 1 });
    if (res) {
      const { list } = res;
      const formatList = list.map((item: any) => ({ ...item, name: item.category }));
      setQuotaOptions(formatList || []);
    }
  };
  const onNodeTypeChange = (typeCode: CodeType) => {
    setCurrentNodeType(typeCode);
    if (typeCode === 'node_quota') {
      getOptions();
    }
  };

  const handleOk = () => {
    nodeForm
      .validateFields()
      .then((values) => {
        onSubmit(values);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  return (
    <NgModal {...props} width={520} title="新建节点" onOk={handleOk}>
      <Form form={nodeForm} labelAlign="right" labelCol={{ span: 6 }}>
        <Form.Item label="选择节点类别" name={'nodeTypeCode'} rules={[{ required: true }]}>
          <Select className="width320" onChange={onNodeTypeChange}>
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
        {currentNodeType === 'node_quota' && (
          <Form.Item label="节点名称" name={'nodeQuotaName'} rules={[{ required: true }]}>
            <Cascader
              className="width320"
              options={quotaOptions}
              fieldNames={{ children: 'nameList', label: 'name', value: 'name' }}
            ></Cascader>
          </Form.Item>
        )}

        <Form.Item label="节点说明" name={'nodeDesc'} rules={[{ required: true }]}>
          <Input.TextArea className="width320" maxLength={200}></Input.TextArea>
        </Form.Item>
      </Form>
    </NgModal>
  );
};
