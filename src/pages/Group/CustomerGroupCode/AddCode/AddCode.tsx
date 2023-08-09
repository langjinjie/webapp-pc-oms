import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Form, Input } from 'antd';
import { BreadCrumbs, ImageUpload } from 'src/components';
import { SetUserRightFormItem } from 'src/pages/Marketing/Components/SetUserRight/SetUserRight';
import ChatGroupSelected from './ChatGroupSelected/ChatGroupSelected';
import Preview from './Preview/Preview';
const Item = Form.Item;
const AddCode: React.FC = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [formValues, setFormValues] = useState<any>();
  const [codeForm] = Form.useForm();
  useEffect(() => {
    setIsEdit(false);
  });
  return (
    <div className="edit container">
      <BreadCrumbs
        navList={[
          {
            name: '群活码管理'
          },
          { name: isEdit ? '编辑群活码' : '新增群活码' }
        ]}
      />
      <div className="flex">
        <Form className="mt20" form={codeForm} onValuesChange={(_, values) => setFormValues(values)}>
          <Item label="群活码名称" name="name">
            <Input placeholder="请输入" className="width400" />
          </Item>
          <Item
            style={{
              width: '600px'
            }}
            label="企业微信群"
            name={'chatList'}
            extra="最多支持5个群，外部群（客户群）上限500，入群人数超过200人将自动进入下一个群，超过200的群不在支持二维码入群，需群里人手动邀请人员加入群聊直到上限500"
          >
            <ChatGroupSelected />
          </Item>
          <Item label="有效期" name={'expireDate'}>
            <DatePicker></DatePicker>
          </Item>
          <Item label="使用员工">
            <SetUserRightFormItem allText="全部员工" partText="部分员工" form={codeForm} />
          </Item>
          <Item name={'liveCode'} label="添加群二维码" extra="支持jpg/png格式，大小不超过2M">
            <ImageUpload />
          </Item>

          <Item className="formFooter" style={{ marginLeft: '140px' }}>
            <Button type="primary" shape="round">
              保存
            </Button>
          </Item>
        </Form>

        <Preview value={formValues} />
      </div>
    </div>
  );
};

export default AddCode;
