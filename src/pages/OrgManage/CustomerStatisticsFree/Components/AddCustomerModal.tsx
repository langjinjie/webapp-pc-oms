import { Form, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { getCustomerByExternalUserId } from 'src/apis/orgManage';
import { Icon } from 'src/components';
import { NgModal } from '../../StatisticsFree/Components/NgModal/NgModal';
import styles from './style.module.less';
interface AddStatisticsFreeModalProps {
  visible: boolean;
  onConfirm: (params: { staffIds: string[]; freeType: string }) => void;
  onCancel: () => void;
}

export const AddCustomerFreeModal: React.FC<AddStatisticsFreeModalProps> = ({ visible, onConfirm, onCancel }) => {
  const [addForm] = Form.useForm();
  const [customer, setCustomer] = useState<any>({});

  const handleOK = () => {
    addForm
      .validateFields()
      .then((values) => {
        console.log(values);
        const { userIds = [], freeType = [] } = values;
        onConfirm({
          staffIds: userIds.map((item: any) => item.value),
          freeType: freeType.join(',')
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
    }
  }, [visible]);

  const handleSearch = async (value: string) => {
    console.log(value);
    const res = await getCustomerByExternalUserId({ externalUserid: value });
    console.log(res);
    if (res) {
      setCustomer(res);
    }
  };

  return (
    <NgModal forceRender={true} visible={visible} title="新增免统计名单" onOk={handleOK} onCancel={onCancel}>
      <div className={styles.formWrap}>
        <Form layout="vertical" form={addForm} style={{ marginBottom: '40px' }}>
          <Form.Item label="外部联系人ID" name={'userIds'} rules={[{ required: true }]}>
            <Input.Search
              placeholder="待输入"
              onSearch={handleSearch}
              maxLength={30}
              enterButton={<Icon className={styles.searchBtn} name="icon_common_16_seach" />}
            ></Input.Search>
          </Form.Item>
          <div className={styles.formItem}>
            <span className={styles.formLabel}>客户姓名/昵称:</span>
            {customer.remarkName}
          </div>
          <div className={styles.formItem}>
            <span className={styles.formLabel}>客户经理:</span>
            {customer.staffFriends?.map((staff: any) => (
              <span key={staff.userId}>{`${staff.staffName}(${staff.userId})`}</span>
            ))}
          </div>
          <Form.Item name={'freeType'} rules={[{ required: true }]} label="添加理由">
            <Input placeholder="待输入" />
          </Form.Item>
        </Form>
      </div>
    </NgModal>
  );
};
