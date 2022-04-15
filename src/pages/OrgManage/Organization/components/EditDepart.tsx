/**
 * @name EditDepart
 * @author Lester
 * @date 2022-04-01 14:10
 */
import React, { useEffect, useState } from 'react';
import { Modal } from 'src/components';
import { Form, FormProps, Input, Select } from 'antd';
import { queryDepartTypes } from 'src/apis/organization';
import style from '../style.module.less';

interface DepartType {
  dType: number;
  dName: string;
}

interface EditDepartProps {
  isAddDepart: boolean;
  deptName?: string;
  dType?: number;
  visible: boolean;
  onClose: () => void;
  onOk: (values: any) => void;
}

const { useForm, Item } = Form;
const { Option } = Select;

const EditDepart: React.FC<EditDepartProps> = (props) => {
  const { isAddDepart, deptName, dType, visible, onClose, onOk } = props;
  const [departTypes, setDepartTypes] = useState<DepartType[]>([]);

  const [form] = useForm();

  const formLayout: FormProps = {
    labelAlign: 'right',
    labelCol: { span: 6 },
    wrapperCol: { span: 16 }
  };

  /**
   * 获取部门类型数据
   */
  const getDepartTypes = async () => {
    const res: any = await queryDepartTypes();
    if (Array.isArray(res)) {
      setDepartTypes(res);
    }
  };

  useEffect(() => {
    if (visible) {
      !isAddDepart && form.setFieldsValue({ deptName, dType });
    } else {
      form.resetFields();
    }
  }, [visible]);

  useEffect(() => {
    getDepartTypes();
  }, []);

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={`${isAddDepart ? '添加' : '修改'}部门`}
      onOk={() => form.submit()}
    >
      <Form form={form} {...formLayout} onFinish={onOk}>
        <Item name="deptName" label="部门名称" rules={[{ required: true, message: '请输入部门名称' }]}>
          <Input className={style.inputRadius} placeholder="请输入部门名称" maxLength={40} />
        </Item>
        <Item name="dType" label="部门类型">
          <Select placeholder="请选择部门类型" allowClear>
            {departTypes.map((item) => (
              <Option key={item.dType} value={item.dType}>
                {item.dName}
              </Option>
            ))}
          </Select>
        </Item>
      </Form>
    </Modal>
  );
};

export default EditDepart;
