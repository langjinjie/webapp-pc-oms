import { Form, Input } from 'antd';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { getCustomerByExternalUserId } from 'src/apis/orgManage';
import { Icon } from 'src/components';
import { NgModal } from 'src/components/NgModal/NgModal';
import styles from './style.module.less';
interface AddStatisticsFreeModalProps {
  visible: boolean;
  onConfirm: (params: { externalUserId: string; addReason: string }) => void;
  onCancel: () => void;
}

export const AddCustomerFreeModal: React.FC<AddStatisticsFreeModalProps> = ({ visible, onConfirm, onCancel }) => {
  const [addForm] = Form.useForm();
  const [customer, setCustomer] = useState<any>({});

  const handleOK = () => {
    addForm
      .validateFields()
      .then((values) => {
        const { externalUserId = '', addReason = '' } = values;
        onConfirm({
          externalUserId,
          addReason
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    // 每次显示时清空form表单
    if (visible) {
      addForm.resetFields();
      setCustomer(null);
    }
  }, [visible]);

  const handleSearch = async (value: string) => {
    const res = await getCustomerByExternalUserId({ externalUserId: value });
    if (res) {
      setCustomer(res);
    }
  };

  return (
    <NgModal forceRender={true} visible={visible} title="新增免统计名单" onOk={handleOK} onCancel={onCancel}>
      <div className={styles.formWrap}>
        <Form layout="vertical" form={addForm} style={{ marginBottom: '40px' }}>
          <Form.Item label="外部联系人ID" name={'externalUserId'} rules={[{ required: true }]}>
            <Input.Search
              placeholder="待输入"
              onSearch={handleSearch}
              maxLength={50}
              enterButton={<Icon className={styles.searchBtn} name="icon_common_16_seach" />}
            ></Input.Search>
          </Form.Item>
          <div className={styles.formItem}>
            <span className={styles.formLabel}>客户姓名/昵称:</span>
            {customer?.remarkName}
          </div>
          <div className={classNames(styles.formItem, 'flex')}>
            <span className={classNames(styles.formLabel, 'cell, fixed')}>客户经理:</span>
            <div className="flex cell">
              {customer?.staffFriends?.map((staff: any) => (
                <span key={staff.userId}>{`${staff.staffName}(${staff.userId})`}&nbsp;&nbsp; </span>
              ))}
            </div>
          </div>
          <Form.Item name={'addReason'} rules={[{ required: true }, { max: 20, message: '最多20字' }]} label="添加理由">
            <Input placeholder="待输入" maxLength={20} />
          </Form.Item>
        </Form>
      </div>
    </NgModal>
  );
};
