import React, { useEffect, useState } from 'react';
import { Modal } from 'src/components';
import { Button, Form, Input } from 'antd';
import { SelectOrg } from 'src/pages/CustomerManage/components';
import { IColumn } from './config';
import style from './style.module.less';

export interface INoticeValue extends IColumn {
  notifyList: { staff: IINotifyItem[] }[];
}

export interface IINotifyItem {
  userId: string;
  staffId?: string;
  staffName?: string;
}

interface IAddModalProps {
  value?: INoticeValue;
  visible: boolean;
  onOk?: (value: INoticeValue) => void;
  onCancel: () => void;
}

const { Item, List } = Form;

const AddNotice: React.FC<IAddModalProps> = ({ value, visible, onOk, onCancel }) => {
  const [okBtnLoading, setOkBtnLoading] = useState(false);

  const [form] = Form.useForm();

  const handleCancel = () => {
    onCancel?.();
  };

  const handleOk = async () => {
    const res = await form.validateFields();
    setOkBtnLoading(true);
    await onOk?.({ ...res, channelId: value?.channelId });
    setOkBtnLoading(false);
  };

  useEffect(() => {
    if (visible) {
      form.setFieldsValue(value);
    }
  }, [visible]);

  return (
    <Modal
      centered
      title="添加通知人"
      visible={visible}
      onClose={handleCancel}
      onOk={handleOk}
      okButtonProps={{ loading: okBtnLoading }}
    >
      <Form form={form} initialValues={{ notifyList: [{ staff: [] }] }}>
        <Item label="机构名称" className={style.item} name="channelName">
          <Input className="width320" readOnly />
        </Item>
        <Item label="渠道代码" className={style.item} name="channelCode">
          <Input className="width320" readOnly />
        </Item>
        <List name="notifyList" initialValue={[{ staff: undefined }]}>
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <div className="flex" key={field.key}>
                  <Item
                    className={style.item}
                    label={`通知人${index + 1}`}
                    name={[field.name, 'staff']}
                    rules={[{ required: true, message: '请选择人员' }]}
                  >
                    <SelectOrg singleChoice className="width210" type="staff" />
                  </Item>
                  <Button className="ml10" shape="round" onClick={() => remove(index)}>
                    删除
                  </Button>
                  {/* 最多添加三个通知人 */}
                  {fields.length - 1 === index && fields.length <= 2 && (
                    <Button className="ml10" shape="round" onClick={add}>
                      添加
                    </Button>
                  )}
                </div>
              ))}
              {fields.length === 0 && (
                <Button className="ml10" shape="round" onClick={add}>
                  添加
                </Button>
              )}
            </>
          )}
        </List>
      </Form>
    </Modal>
  );
};
export default AddNotice;
