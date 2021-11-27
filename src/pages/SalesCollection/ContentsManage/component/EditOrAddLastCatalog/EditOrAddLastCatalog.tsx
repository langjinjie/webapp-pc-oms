import React, { useContext, useEffect, useState } from 'react';
import { Modal, Form, Input, Select /* , message */, message } from 'antd';
import { IEditOrAddLastCatalogParam, ICatalogDetail, IFirmModalParam } from 'src/utils/interface';
import { SpeechTypeLabel } from 'src/pages/SalesCollection/ContentsManage/component';
import { requestGetCatalogDetail, requestEditCatalog } from 'src/apis/salesCollection';
import { Context } from 'src/store';
import { catalogType2Name } from 'src/utils/commonData';
import style from './style.module.less';
// import classNames from 'classnames';

interface IAddOrEditContentProps {
  editOrAddLastCatalogParam: IEditOrAddLastCatalogParam;
  setEditOrAddLastCatalogParam: (param: IEditOrAddLastCatalogParam) => void;
  setFirmModalParam: (param: IFirmModalParam) => void;
}

interface IContentParam {
  name: string;
  contentType: number;
}

const EditOrAddLastCatalog: React.FC<IAddOrEditContentProps> = ({
  editOrAddLastCatalogParam,
  setEditOrAddLastCatalogParam,
  setFirmModalParam
}) => {
  const { currentCorpId: corpId } = useContext(Context);
  const [catalogParam, setCatalogParam] = useState<IContentParam>({ name: '', contentType: 0 });
  const [posterImg, setPosterImg] = useState('');
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
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [form] = Form.useForm();

  // 重置
  const resetHandle = () => {
    form.resetFields();
    setPosterImg('');
    setCatalogDetail({
      sceneId: '',
      catalogId: '',
      name: '',
      fullName: '',
      fullCatalogId: '',
      level: 0,
      lastLevel: 0,
      contentType: 0
    });
    setCatalogParam({ name: '', contentType: 0 });
    setEditOrAddLastCatalogParam({ ...editOrAddLastCatalogParam, visible: false, title: '' });
  };
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
      setCatalogParam({ name: res.name, contentType: res.contentType });
      setPosterImg(res.contentUrl);
    }
  };
  // inputOnchang
  const inputOnChangeHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCatalogParam({ ...catalogParam, name: e.target.value.trim() });
  };
  // 选择目录类型
  const selectOnchangeHandle = (e: any) => {
    const name = form.getFieldValue('name');
    setCatalogParam({ ...catalogParam, contentType: e });
    if (e === catalogDetail.contentType) {
      form.setFieldsValue({ ...catalogDetail });
      setPosterImg(catalogDetail.contentUrl as string);
    } else {
      form.resetFields();
      form.setFieldsValue({ name, contentType: e });
      setPosterImg('');
    }
  };
  // modal确认
  const modalOnOkHandle = async () => {
    await form.validateFields();
    setEditOrAddLastCatalogParam({ ...editOrAddLastCatalogParam, visible: false });
    const updataCatalog = form.getFieldsValue();
    if (updataCatalog.contentType === 9) {
      updataCatalog.contentUrl = { appId: updataCatalog.appId, appPath: updataCatalog.appPath };
    }
    console.log(updataCatalog);
    let title = '修改提醒';
    let content = '修改目录会对已上架话术产生影响，企微前端能实时看到变化,您确定要修改目录吗?';
    editOrAddLastCatalogParam.title === '新增' && (title = '新增提醒');
    editOrAddLastCatalogParam.title === '新增' && (content = '您确定要新增目录吗');
    setFirmModalParam({
      visible: true,
      title,
      content,
      onOk: async () => {
        const res = await requestEditCatalog({
          corpId,
          ...editOrAddLastCatalogParam.catalog,
          ...updataCatalog,
          parentId: editOrAddLastCatalogParam.parentId,
          catalogId:
            editOrAddLastCatalogParam.title === '新增' ? undefined : editOrAddLastCatalogParam.catalog.catalogId
        });
        if (res) {
          message.success(`目录${editOrAddLastCatalogParam.title}成功`);
          setFirmModalParam({ title: '成功', content: '', visible: false });
          resetHandle();
        }
      },
      onCancel: () => {
        setFirmModalParam({ title: '', content: '', visible: false });
        setEditOrAddLastCatalogParam({ ...editOrAddLastCatalogParam, visible: true });
      }
    });
  };
  // modal取消
  const onCancelHandle = () => {
    resetHandle();
  };
  useEffect(() => {
    if (editOrAddLastCatalogParam) {
      if (editOrAddLastCatalogParam.title === '编辑') {
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
        title={editOrAddLastCatalogParam.title + '目录'}
        onCancel={onCancelHandle}
        onOk={modalOnOkHandle}
        okButtonProps={{
          disabled: submitDisabled
        }}
      >
        <Form form={form} onValuesChange={() => setSubmitDisabled(false)}>
          <Form.Item className={style.modalContentFormItem} label="目录名称:" required>
            <Form.Item name="name" rules={[{ required: true, message: '请输入话术名称' }]} noStyle>
              <Input
                className={style.modalContentInput}
                placeholder={'请输入'}
                maxLength={20}
                onChange={inputOnChangeHandle}
              />
            </Form.Item>
            <span className={style.limitLength}>{catalogParam.name.length}/20</span>
          </Form.Item>
          <Form.Item
            className={style.modalContentFormItem}
            label="话术格式:"
            name="contentType"
            rules={[{ required: true, message: '请选择话术格式' }]}
          >
            <Select className={style.modalContentSelect} placeholder={'请选择'} onChange={selectOnchangeHandle}>
              {catalogType2Name.map((item) => (
                <Select.Option key={item.value} value={item.value}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <SpeechTypeLabel type={catalogParam.contentType} posterImg={posterImg} setPosterImg={setPosterImg} />
        </Form>
      </Modal>
    );
  }
  return null;
};

export default EditOrAddLastCatalog;
