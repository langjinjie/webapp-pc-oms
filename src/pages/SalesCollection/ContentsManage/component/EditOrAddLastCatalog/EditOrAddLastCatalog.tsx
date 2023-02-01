import React, { useContext, useEffect, useState } from 'react';
import { Modal, Form, Input, Select /* , message */, message } from 'antd';
import { ICatalogDetail, IFirmModalParam, IEditOrAddCatalogParam, IContentParam } from 'src/utils/interface';
import { SpeechTypeLabel } from 'src/pages/SalesCollection/ContentsManage/component';
import { requestGetCatalogDetail, requestEditCatalog } from 'src/apis/salesCollection';
import { Context } from 'src/store';
import { catalogType2Name } from 'src/utils/commonData';
import style from './style.module.less';
import { SetUserRightFormItem } from 'src/pages/Marketing/Components/SetUserRight/SetUserRight';
// import classNames from 'classnames';

interface IAddOrEditContentProps {
  editOrAddLastCatalogParam: IEditOrAddCatalogParam;
  setEditOrAddLastCatalogParam: (param: IEditOrAddCatalogParam) => void;
  setFirmModalParam: (param: IFirmModalParam) => void;
}

const EditOrAddLastCatalog: React.FC<IAddOrEditContentProps> = ({
  editOrAddLastCatalogParam,
  setEditOrAddLastCatalogParam,
  setFirmModalParam
}) => {
  const { currentCorpId: corpId } = useContext(Context);
  const [catalogParam, setCatalogParam] = useState<IContentParam>({ name: '', contentType: 0 });
  const [uploadImg, setUploadImg] = useState('');
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [btnIsLoading, setBtnIsLoading] = useState(false);
  const [fileList, setFileList] = useState<{ name: string; uid: string; status: string; url: string }[]>([]);
  const [form] = Form.useForm();
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

  // 关闭modal重置
  const resetHandle = () => {
    form.resetFields();
    setUploadImg('');
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
    setSubmitDisabled(true);
    setBtnIsLoading(false);
  };
  // 切换目录类型重置部分表单
  const resetOnchange = (name: string, contentType: number) => {
    form.resetFields();
    form.setFieldsValue({ name, contentType });
    setUploadImg('');
    setFileList([]);
  };
  // 获取最后一级目录详情
  const getLastCatalogDetail = async () => {
    const res = await requestGetCatalogDetail({
      corpId,
      sceneId: editOrAddLastCatalogParam.catalog.sceneId,
      catalogId: editOrAddLastCatalogParam.catalog.catalogId
    });
    if (res) {
      // 处理音视频pdf的回写
      setCatalogDetail(res);
      if (res.contentType === 6 || res.contentType === 7 || res.contentType === 10) {
        setFileList([
          {
            uid: '1',
            name: res.contentUrl.split('/')[res.contentUrl.split('/').length - 1].split('?')[0],
            url: res.contentUrl,
            status: 'done'
          }
        ]);
      }
      form.setFieldsValue(res);
      setCatalogParam({ name: res.name, contentType: res.contentType });
      // 处理长图回写
      if (res.contentType === 3) {
        setUploadImg(res.contentUrl);
      } else {
        setUploadImg(res.thumbnail);
      }
      // 处理小程序数据回写
      if (res.contentType === 9) {
        form.setFieldsValue({ appId: JSON.parse(res.contentUrl).appId });
        form.setFieldsValue({ appPath: JSON.parse(res.contentUrl).appPath });
      }
    }
  };
  // 输入框input事件
  const inputOnChangeHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCatalogParam({ ...catalogParam, name: e.target.value.trim() });
    form.setFieldsValue({ name: e.target.value.trim() });
  };
  // 选择目录类型
  const selectOnchangeHandle = (e: any) => {
    const name = form.getFieldValue('name');
    setCatalogParam({ ...catalogParam, contentType: e });
    // 切换话术格式重置表单内容
    if (e === catalogDetail.contentType) {
      form.setFieldsValue({ ...catalogDetail });
      setUploadImg(catalogDetail.contentUrl as string);
      if (catalogDetail.contentType === 6 || catalogDetail.contentType === 7) {
        setFileList([
          {
            uid: '1',
            name: `media.${catalogDetail.contentType === 6 ? 'mp3' : 'mp4'}`,
            url: catalogDetail.contentUrl as string,
            status: 'done'
          }
        ]);
      }
      if (e === 3) {
        setUploadImg(catalogDetail.contentUrl as string);
      } else {
        setUploadImg(catalogDetail.thumbnail as string);
      }
    } else {
      resetOnchange(name, e);
    }
  };

  // 提交新增/修改请求
  const onOk = async (updataCatalog: any) => {
    setSubmitDisabled(true);
    setBtnIsLoading(true);
    delete updataCatalog.group1;
    delete updataCatalog.isSet;
    delete updataCatalog.group2;
    delete updataCatalog.groupType;
    const { parentId, catalog, title } = editOrAddLastCatalogParam;
    const { sceneId, catalogId, level, lastLevel } = catalog;
    const res = await requestEditCatalog({
      corpId,
      parentId,
      sceneId,
      level,
      lastLevel,
      catalogId: title === '新增' ? undefined : catalogId,
      ...updataCatalog,
      groupId: updataCatalog.groupId || ''
    });
    setSubmitDisabled(false);
    setBtnIsLoading(false);
    if (res) {
      message.success(`目录${editOrAddLastCatalogParam.title}成功`);
      setFirmModalParam({ title: '', content: '', visible: false });
      editOrAddLastCatalogParam.getParentChildrenList();
      resetHandle();
    }
  };

  // modal确认
  const modalOnOkHandle = async () => {
    await form.validateFields();
    const updataCatalog = form.getFieldsValue();
    // 小程序请求参数
    if (updataCatalog.contentUrl && updataCatalog.contentType !== 9 && !updataCatalog.contentUrl.startsWith('http')) {
      updataCatalog.contentUrl = 'http://' + updataCatalog.contentUrl;
    } else if (updataCatalog.contentType === 9) {
      updataCatalog.contentUrl = JSON.stringify({ appId: updataCatalog.appId, appPath: updataCatalog.appPath || '' });
    }
    // 图片请求参数
    if (updataCatalog.contentType === 2) {
      updataCatalog.contentUrl = updataCatalog.thumbnail;
      delete updataCatalog.thumbnail;
    }
    const title = '修改提醒';
    const content = '修改目录会对已上架话术产生影响，企微前端能实时看到变化';
    if (editOrAddLastCatalogParam.title === '新增') {
      onOk(updataCatalog);
    } else {
      setFirmModalParam({
        visible: true,
        title,
        content,
        onOk: () => onOk(updataCatalog),
        onCancel: () => {
          setFirmModalParam({ title: '', content: '', visible: false });
          setEditOrAddLastCatalogParam({ ...editOrAddLastCatalogParam, visible: true });
        }
      });
      setEditOrAddLastCatalogParam({ ...editOrAddLastCatalogParam, visible: false });
    }
  };
  // modal取消
  const onCancelHandle = () => {
    resetHandle();
  };
  useEffect(() => {
    if (editOrAddLastCatalogParam) {
      if (editOrAddLastCatalogParam.title === '编辑') {
        catalogDetail.catalogId || getLastCatalogDetail();
      }
    }
  }, [editOrAddLastCatalogParam]);
  return (
    <Modal
      width={720}
      centered
      wrapClassName={style.modalWrap}
      closable={false}
      maskClosable={false}
      visible={editOrAddLastCatalogParam?.visible}
      title={editOrAddLastCatalogParam?.title + '目录'}
      onCancel={onCancelHandle}
      onOk={modalOnOkHandle}
      okButtonProps={{
        disabled: submitDisabled,
        loading: btnIsLoading
      }}
    >
      <Form form={form} onValuesChange={() => setSubmitDisabled(false)} initialValues={{ isSet: 0 }}>
        <Form.Item
          className={style.modalContentFormItem}
          label="目录名称:"
          name="name"
          rules={[{ required: true, message: '请输入目录名称' }]}
        >
          <Input
            className={style.modalContentInput}
            placeholder={'请输入目录名称'}
            showCount
            maxLength={50}
            onChange={inputOnChangeHandle}
          />
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
        <SpeechTypeLabel
          form={form}
          setSubmitDisabled={setSubmitDisabled}
          type={catalogParam}
          uploadImg={uploadImg}
          setUploadImg={setUploadImg}
          fileList={fileList}
        />
        <Form.Item name={'groupId'} label="可见范围设置">
          <SetUserRightFormItem form={form} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditOrAddLastCatalog;
