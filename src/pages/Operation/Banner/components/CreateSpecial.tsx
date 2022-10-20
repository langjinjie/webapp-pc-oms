import React, { useEffect, useState } from 'react';
import { Button, Form, Input, message, Modal, Space, Select, DatePicker } from 'antd';
import NgUpload from '../components/Upload/Upload';
import { setHotConfig } from 'src/apis/marketing';
import { HotColumns } from '../ListConfig';
import styles from './style.module.less';
import { tplTypeOptions } from './config';
// import moment from 'moment';
interface CreateSpecialProps {
  visible: boolean;
  onClose: () => void;
  value?: HotColumns;
  onSuccess: () => void;
}
const CreateSpecial: React.FC<CreateSpecialProps> = ({ visible, onClose, value, onSuccess }) => {
  console.log(visible);

  const [topForm] = Form.useForm();
  const [formValues, setFormValues] = useState<Partial<HotColumns>>({
    topicName: '',
    topicImg: '',
    topicDesc: '',
    descChanged: '',
    createTime: ''
  });
  const [tplType, setTplType] = useState(0);
  const [bannerId, setBannerId] = useState('');
  useEffect(() => {
    if (visible && value) {
      console.log(value.createTime);
      setBannerId(value.topicId);
      topForm.setFieldsValue({
        ...value
      });
      setFormValues({ ...value });
    } else {
      setFormValues({
        topicName: '',
        topicImg: '',
        topicDesc: '',
        descChanged: '',
        createTime: ''
      });
      topForm.resetFields();
    }
  }, [visible]);
  const onConfirm = () => {
    topForm.validateFields().then(async (values) => {
      const desc = formValues.descChanged || formValues.topicDesc;
      if (!desc) return;
      const res = await setHotConfig({ ...values, desc: desc, topicId: formValues.topicId });
      if (res) {
        setBannerId('');
        message.success(value ? '编辑成功' : '新增成功');
        onSuccess();
        onClose();
      }
    });
  };

  /**
   * 模板类型切换
   */
  const tplTypeChange = (value: number) => {
    setTplType(+value);
    // 多图朋友圈不需要查询
    if (value < 5) {
      // onRecommendSearch('', value);
      topForm.setFieldsValue({
        itemId: undefined,
        speechcraft: '',
        tplType
      });
    } else {
      topForm.setFieldsValue({
        itemList: new Array(9).fill(''),
        name: ''
      });
    }
  };
  const onCloseBtn = () => {
    onClose();
    setBannerId('');
  };
  return (
    <Modal
      title={bannerId ? '编辑' : '新增'}
      className={styles.modalBox}
      visible={visible}
      closable={false}
      footer={
        <div className="flex justify-end">
          <Space size={20}>
            <Button onClick={() => onCloseBtn()} shape="round">
              取消
            </Button>
            <Button type="primary" onClick={onConfirm} shape="round">
              确定
            </Button>
          </Space>
        </div>
      }
    >
      <Form form={topForm} initialValues={formValues}>
        <Form.Item name="tplType1" label="选择类型：" rules={[{ required: true }]}>
          <Select placeholder="请选择" className={styles.typeSelect1} onChange={tplTypeChange}>
            {tplTypeOptions.map((option) => (
              <Select.Option key={option.id} value={option.id}>
                {option.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        {!bannerId
          ? (
              tplType === 2
                ? (
            <Form.Item name="tplType2" label="选择内容：" rules={[{ required: true }]}>
              <Input defaultValue={'系统自动取每周最新的周报内容'} disabled className={styles.typeSelect2}></Input>
            </Form.Item>
                  )
                : (
            <Form.Item name="tplType2" label="选择内容：" rules={[{ required: true }]}>
              <Select placeholder="请选择" className={styles.typeSelect2} onChange={tplTypeChange}>
                {tplTypeOptions.map((option) => (
                  <Select.Option key={option.id} value={option.id}>
                    {option.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
                  )
            )
          : (
          <>
            <Form.Item label="内容标题" required name={'topicName'}>
              <Input type="text" placeholder="请输入" className={styles.typeSelect2} />
            </Form.Item>
            <Form.Item label="链接地址" required>
              <Input type="text" placeholder="请输入链接地址" className={styles.typeSelect2} />
            </Form.Item>
          </>
            )}

        <Form.Item
          name="topicImg"
          label="上传图片"
          rules={[{ required: true, message: '请上传专题图片' }]}
          extra="banner710*180像素高清图片,仅支持.jpg格式"
        >
          <NgUpload />
        </Form.Item>
        <Form.Item label="展示时间" required>
          <DatePicker name="createTime" className={styles.typeSelect2} showTime placeholder="请选择" allowClear />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateSpecial;
