import React, { useContext, useEffect, useState } from 'react';
import { Form, Input, Radio, Select, Button, Modal, message } from 'antd';
import { Icon } from 'src/components/index';
import { useHistory, useLocation } from 'react-router-dom';
import { getQueryParam } from 'lester-tools';
import { ISensitiveType, ISensitiveList } from 'src/utils/interface';
import { requestGetSensitiveTypeList, requestAddSensitiveType, requestEditSensitiveWord } from 'src/apis/orgManage';
import { Context } from 'src/store';
import style from './style.module.less';

const AddOrEditWords: React.FC = () => {
  const { currentCorpId: corpId } = useContext(Context);
  const [wordLength, setWordLengtg] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [addSensitiveType, setAddSensitiveType] = useState('');
  const [sensitiveType, setSensitiveType] = useState<ISensitiveType[]>([]);
  const [addedType, setAddedType] = useState(false);
  const [form] = Form.useForm();
  const history = useHistory();
  const location = useLocation();
  const { sensitiveItem } = location.state as {
    sensitiveItem: ISensitiveList;
  };
  // 获取敏感词类型列表
  const getSensitiveTypeList = async () => {
    const res = await requestGetSensitiveTypeList({
      corpId
    });
    setSensitiveType(res.list);
    addedType && (await form.setFieldsValue({ typeId: res.list[0].typeId }));
    setAddedType(false);
  };
  // 敏感词内容
  const inputOnChangeHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWordLengtg(e.target.value.length);
    form.setFieldsValue({ word: e.target.value.trim() });
  };
  // 保存/返回 1 保存 0 返回
  const btnClickHandle = async (type: number) => {
    type && (await form.validateFields());
    const res =
      type &&
      (await requestEditSensitiveWord({
        corpId,
        sensitiveId: sensitiveItem && sensitiveItem.sensitiveId,
        ...form.getFieldsValue()
      }));
    if (res !== null) {
      type && message.success(`话术${getQueryParam().type === 'edit' ? '编辑' : '增加'}成功`);
      history.replace('/sensitiveManage');
    }
  };
  const addWordsTypeHandle = () => {
    setIsVisible(true);
  };
  // 请求添加敏感词类型
  const modalOnOkHandle = async () => {
    const res = await requestAddSensitiveType({ name: addSensitiveType });
    if (res) {
      message.success('敏感词类型添加成功');
      setAddedType(true);
      setIsVisible(false);
    }
  };
  // 增加敏感词类型
  const addSensitiveTypeInputHandle = (e: any) => {
    setAddSensitiveType(e.target.value.trim());
  };
  useEffect(() => {
    getSensitiveTypeList();
    setWordLengtg((form.getFieldsValue().word || '').length);
  }, [isVisible]);
  return (
    <div className={style.wrap}>
      <div className={style.title}>{(getQueryParam().type === 'add' ? '新增' : '修改') + '敏感词'}</div>
      <Form className={style.form} form={form}>
        <div className={style.chooseWordsType}>
          <Form.Item name="typeId" initialValue={sensitiveItem.typeId} label="敏感词类型" rules={[{ required: true }]}>
            <Select className={style.selectBox} placeholder="请选择" allowClear>
              {sensitiveType.map((item) => (
                <Select.Option value={item.typeId} key={item.typeId}>
                  {item.name}
                </Select.Option>
              ))}
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
          <Form.Item name="word" initialValue={sensitiveItem.word} label="敏感词内容" rules={[{ required: true }]}>
            <Input
              onChange={(word) => inputOnChangeHandle(word)}
              placeholder="请输入"
              className={style.inputBox}
              maxLength={20}
            />
          </Form.Item>
          <span className={style.limitLength}>{wordLength}/20</span>
        </div>
        <div className={style.radioWrap}>
          <span className={style.checkoutStatus}>状态:</span>
          <Form.Item name="status" initialValue={sensitiveItem.status || 0}>
            <Radio.Group>
              <Radio value={0}>待上架</Radio>
              <Radio value={1}>上架</Radio>
              <Radio value={2}>下架</Radio>
            </Radio.Group>
          </Form.Item>
        </div>
      </Form>
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
        maskClosable={false}
        okButtonProps={{
          disabled: !addSensitiveType,
          htmlType: 'submit'
        }}
        destroyOnClose
      >
        <div className={style.title}>添加敏感词类型</div>
        <input
          className={style.input}
          value={addSensitiveType}
          type="text"
          placeholder="输入敏感词类型名称（限制10个字）"
          maxLength={10}
          onChange={addSensitiveTypeInputHandle}
        />
      </Modal>
    </div>
  );
};
export default AddOrEditWords;
