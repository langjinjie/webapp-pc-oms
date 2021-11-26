import React, { useContext, useEffect, useState } from 'react';
import { Modal, Form, Input, Select /* , message */ } from 'antd';
import { IEditOrAddLastCatalogParam, ICatalogDetail } from 'src/utils/interface';
import { SpeechTypeLabel } from 'src/pages/SalesCollection/ContentsManage/component';
import { requestGetCatalogDetail } from 'src/apis/salesCollection';
import { Context } from 'src/store';
import style from './style.module.less';
// import classNames from 'classnames';

interface IAddOrEditContentProps {
  editOrAddLastCatalogParam: IEditOrAddLastCatalogParam;
  setEditOrAddLastCatalogParam: (param: IEditOrAddLastCatalogParam) => void;
}

interface ISpeechParam {
  name: string;
  type: number;
}

const EditOrAddLastCatalog: React.FC<IAddOrEditContentProps> = ({
  editOrAddLastCatalogParam,
  setEditOrAddLastCatalogParam
}) => {
  const { currentCorpId: corpId } = useContext(Context);
  const [speechParam, setSpeechParam] = useState<ISpeechParam>({ name: '', type: 1 });
  const [catalogDetail, setCatalogDetail] = useState<ICatalogDetail>({
    sceneId: '',
    catalogId: '',
    name: '',
    fullName: '',
    fullCatalogId: '',
    level: 0,
    lastLevel: 0,
    contentType: 0
  });
  const [form] = Form.useForm();
  const speechTypeList = [
    { value: 1, label: '话术' },
    { value: 2, label: '海报' },
    { value: 3, label: '名片' },
    { value: 4, label: '小站' },
    { value: 5, label: '单图文' },
    { value: 6, label: '单语音' },
    { value: 7, label: '单视频' },
    { value: 8, label: '第三方链接' },
    { value: 9, label: '小程序' }
  ];
  // 获取最后一级目录详情
  const getLastCatalogDetail = async () => {
    const res = await requestGetCatalogDetail({
      corpId,
      sceneId: editOrAddLastCatalogParam.catalog.sceneId,
      catalogId: editOrAddLastCatalogParam.catalog.catalogId
    });
    if (res) {
      setCatalogDetail(res);
      form.setFieldsValue(res);
      console.log(catalogDetail);
    }
  };
  // inputOnchang
  const inputOnChangeHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpeechParam({ ...speechParam, name: e.target.value.trim() });
  };
  // selectOnchange
  const selectOnchangeHandle = (e: any) => {
    setSpeechParam({ ...speechParam, type: e });
  };
  // modal确认
  const modalOnOkHandle = async () => {
    await form.validateFields();
    setEditOrAddLastCatalogParam({ ...editOrAddLastCatalogParam, visible: false, title: '' });
    form.resetFields();
  };
  const onCancelHandle = () => {
    setEditOrAddLastCatalogParam({ ...editOrAddLastCatalogParam, visible: false, title: '' });
    form.resetFields();
  };
  useEffect(() => {
    if (editOrAddLastCatalogParam) {
      if (editOrAddLastCatalogParam.title === '编辑') {
        console.log('编辑');
        getLastCatalogDetail();
      }
    }
  }, [editOrAddLastCatalogParam]);
  if (editOrAddLastCatalogParam) {
    return (
      <Modal
        width={720}
        centered
        wrapClassName={style.modalWrap}
        closable={false}
        visible={editOrAddLastCatalogParam.visible}
        title={editOrAddLastCatalogParam.title}
        onCancel={onCancelHandle}
        onOk={modalOnOkHandle}
        destroyOnClose
      >
        <Form form={form}>
          <Form.Item className={style.modalContentFormItem} label="目录名称:" required>
            <Form.Item name="name" rules={[{ required: true, message: '请输入话术名称' }]} noStyle>
              <Input
                className={style.modalContentInput}
                placeholder={'请输入'}
                maxLength={10}
                onChange={inputOnChangeHandle}
              />
            </Form.Item>
            <span className={style.limitLength}>{speechParam.name.length}/10</span>
          </Form.Item>
          <Form.Item
            className={style.modalContentFormItem}
            label="话术格式:"
            name="contentType"
            rules={[{ required: true, message: '请选择话术格式' }]}
          >
            <Select className={style.modalContentSelect} placeholder={'请选择'} onChange={selectOnchangeHandle}>
              {speechTypeList.map((item) => (
                <Select.Option key={item.value} value={item.value}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <SpeechTypeLabel type={speechParam.type} />
        </Form>
      </Modal>
    );
  }
  return null;
};

export default EditOrAddLastCatalog;
