import React, { useEffect, useState } from 'react';
import { Form, Input, Radio, Select, Button, Modal } from 'antd';
import { Icon } from 'src/components/index';
import { useHistory } from 'react-router-dom';
import { getQueryParam } from 'lester-tools';
import style from './style.module.less';

interface IEditConfig {
  wordsType: string;
  editContent: string;
  wordsStatus: number;
}

const AddOrEditWords: React.FC = () => {
  const [editConfig, setEditConfig] = useState<IEditConfig>({
    wordsType: '',
    editContent: '',
    wordsStatus: 1
  });
  const [isVisible, setIsVisible] = useState(false);
  const [form] = Form.useForm();
  const history = useHistory();

  const inputOnChangeHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditConfig({ ...editConfig, editContent: e.target.value });
  };
  const radioOnChangeHandle = (event: any) => {
    console.log(event.target.value);
    setEditConfig({ ...editConfig, wordsStatus: event.target.value });
  };
  const btnClickHandle = (type: number) => {
    console.log(type ? '保存' : '返回');
    if (!type) history.push('/wordsManage');
    console.log(editConfig.wordsStatus);
  };
  const addWordsTypeHandle = () => {
    setIsVisible(true);
  };
  const modalOnOkHandle = () => {
    console.log('提交数据');
    setIsVisible(false);
  };
  useEffect(() => {
    console.log('挂载');
    console.log(getQueryParam());
  }, []);
  return (
    <div className={style.wrap}>
      <div className={style.title}>{(getQueryParam().type === 'add' ? '新增' : '修改') + '敏感词'}</div>
      <Form className={style.form} form={form}>
        <div className={style.chooseWordsType}>
          <Form.Item name="wordsType" label="敏感词类型" rules={[{ required: true }]}>
            <Select
              className={style.selectBox}
              placeholder="请选择"
              // onChange={}
              allowClear
            >
              <Select.Option value="male">male</Select.Option>
              <Select.Option value="female">female</Select.Option>
              <Select.Option value="other">other</Select.Option>
            </Select>
          </Form.Item>
          {getQueryParam().type === 'add' && (
            <div className={style.addWordsType} onClick={addWordsTypeHandle}>
              <Icon className={style.icon} name="tianjiafenzu" />
              增加
            </div>
          )}
        </div>
        <div className={style.inputWrap}>
          <Form.Item name="wordsContent" label="敏感词内容" rules={[{ required: true }]}>
            <Input
              value={editConfig.editContent}
              onChange={(e) => inputOnChangeHandle(e)}
              placeholder="请输入"
              className={style.inputBox}
              maxLength={20}
            />
          </Form.Item>
          <span className={style.limitLength}>{editConfig.editContent.length}/20</span>
        </div>
      </Form>
      <div className={style.radioWrap}>
        <span className={style.checkoutStatus}>状态:</span>
        <Radio.Group defaultValue={editConfig.wordsStatus} onChange={radioOnChangeHandle}>
          <Radio value={1}>下架</Radio>
          <Radio value={2}>上架</Radio>
        </Radio.Group>
      </div>
      <div className={style.btnWrap}>
        <Button className={style.keep} type="primary" onClick={() => btnClickHandle(1)}>
          保存
        </Button>
        <Button className={style.back} onClick={() => btnClickHandle(0)}>
          返回
        </Button>
      </div>
      <Modal
        width={320}
        centered
        wrapClassName={style.modalWrap}
        closable={false}
        visible={isVisible}
        onCancel={() => setIsVisible(false)}
        onOk={modalOnOkHandle}
      >
        <div className={style.title}>添加敏感词</div>
        <input className={style.input} type="text" placeholder="输入目录名称（限制4个字）" maxLength={4} />
      </Modal>
    </div>
  );
};
export default AddOrEditWords;
