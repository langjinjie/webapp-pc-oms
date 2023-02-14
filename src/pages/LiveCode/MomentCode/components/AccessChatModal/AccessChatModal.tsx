import React, { useState } from 'react';
import { Form, Modal, DatePicker, Button, Image } from 'antd';
import { ImageUpload, NgTable } from 'src/components';
import { PlusOutlined } from '@ant-design/icons';
import ChooseMoment from 'src/pages/LiveCode/MomentCode/components/AccessChatModal/ChooseMoment';
import style from './style.module.less';
import moment from 'moment';
import classNames from 'classnames';

interface IAccessChatProps {
  value?: ICodeList[];
  onChange?: (value?: any) => void;
  disabled?: boolean;
}

interface ICodeList {
  codeId?: string; // 是 群id
  chatId: string; // 是 企微客户群id
  chatName: string; // 是 群名称
  chatCode: string; // 是 群二维码
  expireDate: string; // 是 群码有效期
}

const AccessChat: React.FC<IAccessChatProps> = ({ value, onChange, disabled }) => {
  const [accessChatModalVisible, setAccessChatModalVisivle] = useState(false);
  const [chatId, setChatId] = useState('');

  const { Item } = Form;
  const [form] = Form.useForm();

  const onCancelHandle = () => {
    setAccessChatModalVisivle(false);
  };

  const onOkHandle = async () => {
    await form.validateFields();
    const { addChat, chatCode, expireDate } = form.getFieldsValue();
    if (chatId) {
      const item: any = value?.find((findItem) => findItem.chatId === chatId) || {};
      item.chatId = addChat.chatId;
      item.chatName = addChat.chatName;
      item.chatCode = chatCode;
      item.expireDate = expireDate.format('YYYY-MM-DD');
      onChange?.([...(value || [])]);
    } else {
      onChange?.([
        ...(value || []),
        {
          chatId: addChat.chatId,
          chatName: addChat.chatName,
          chatCode,
          expireDate: expireDate.format('YYYY-MM-DD')
        }
      ]);
    }
    setChatId('');
    setAccessChatModalVisivle(false);
    form.resetFields();
  };

  // 接入群聊
  const addGroupHandle = () => {
    form.resetFields();
    setAccessChatModalVisivle(true);
  };

  // 编辑群聊
  const editChat = (value: ICodeList) => {
    if (disabled) return;
    setAccessChatModalVisivle(true);
    setChatId(value?.chatId || '');
    form.setFieldsValue({
      addChat: {
        chatId: value.chatId,
        chatName: value.chatName
      },
      chatCode: value.chatCode,
      expireDate: moment(value.expireDate)
    });
  };
  // 删除群聊
  const delGroupChat = (groupChat: ICodeList) => {
    if (disabled) return;
    onChange?.(value?.filter((filterItem) => filterItem.chatId !== groupChat.chatId));
  };

  return (
    <>
      <Button className={style.addMoment} icon={<PlusOutlined />} onClick={addGroupHandle} disabled={disabled}>
        接入群聊
      </Button>
      <div className={style.tips}>入群人数超过200人将自动切换到下一个群</div>
      <NgTable
        setRowKey={(record: ICodeList) =>
          record.codeId + record.chatId + record.expireDate + record.chatCode + record.chatName
        }
        className={style.table}
        scroll={{ x: 600 }}
        dataSource={value}
        columns={[
          {
            title: '群二维码',
            width: 100,
            render (value: ICodeList) {
              return <Image title="" width={48} height={48} src={value.chatCode} />;
            }
          },
          { title: '群名称', dataIndex: 'chatName', ellipsis: true },
          { title: '群二维码有效期', dataIndex: 'expireDate', width: 130 },
          {
            title: '操作',
            width: 100,
            render (value: ICodeList) {
              return (
                <>
                  <span
                    className={classNames('mr5 text-primary', { disabled: disabled })}
                    onClick={() => editChat(value)}
                  >
                    编辑
                  </span>
                  <span
                    className={classNames('text-primary', { disabled: disabled })}
                    onClick={() => delGroupChat(value)}
                  >
                    删除
                  </span>
                </>
              );
            }
          }
        ]}
      />
      <Modal
        title="接入企业微信群聊"
        visible={accessChatModalVisible}
        className={style.modalWrap}
        onCancel={onCancelHandle}
        centered
        maskClosable={false}
        onOk={onOkHandle}
        width={620}
      >
        <Form form={form}>
          {/* chatId chatName */}
          <Item
            label="企业微信群"
            name="addChat"
            rules={[{ required: true, message: '请选择客户群' }]}
            extra="员工或管理员可在企业微信后台或移动客户端"
          >
            <ChooseMoment />
          </Item>
          <Item
            label="群二维码"
            name="chatCode"
            rules={[{ required: true, message: '请上传群二维码' }]}
            extra="群二维码需和客户群对应；支持jpg/png格式图片，且大小不超过2M"
          >
            <ImageUpload />
          </Item>
          <Item
            label="群码有效期"
            name="expireDate"
            rules={[{ required: true, message: '请选择群有效期' }]}
            extra="群二维码有效期为7天，请选择实际客户群二维码的有效日期"
          >
            <DatePicker className={style.datePicker} />
          </Item>
        </Form>
      </Modal>
    </>
  );
};
export default AccessChat;
