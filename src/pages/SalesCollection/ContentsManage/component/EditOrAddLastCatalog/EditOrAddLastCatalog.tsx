import React, { useContext, useEffect, useState } from 'react';
import { Modal, Form, Input, Select /* , message */, message } from 'antd';
import { ICatalogDetail, IFirmModalParam, IEditOrAddCatalogParam } from 'src/utils/interface';
import { SpeechTypeLabel } from 'src/pages/SalesCollection/ContentsManage/component';
import { requestGetCatalogDetail, requestEditCatalog } from 'src/apis/salesCollection';
import { Context } from 'src/store';
import { catalogType2Name } from 'src/utils/commonData';
import style from './style.module.less';
// import classNames from 'classnames';

interface IAddOrEditContentProps {
  editOrAddLastCatalogParam: IEditOrAddCatalogParam;
  setEditOrAddLastCatalogParam: (param: IEditOrAddCatalogParam) => void;
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
    setSubmitDisabled(true);
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
      // 处理长图回写
      if (res.contentType === 3) {
        setPosterImg(res.contentUrl);
      } else {
        setPosterImg(res.thumbnail);
      }
      // 处理小程序数据回写
      if (res.contentType === 9) {
        console.log(JSON.parse(res.contentUrl));
        form.setFieldsValue({ appId: JSON.parse(res.contentUrl).appId });
        form.setFieldsValue({ appPath: JSON.parse(res.contentUrl).appPath });
      }
      // 处理音视频的会写
      if (res.contentType === 7 || res.contentType === 6) {
        // setDefaultFileList([{ uid: '1', name: res.contentType === 7 ? 'video.mp4' : 'audio.mp3', status: 'done', url: res.contentUrl }]);
        form.setFieldsValue({
          contentUrl: {
            uid: '1',
            name: res.contentType === 7 ? 'video.mp4' : 'audio.mp3',
            status: 'done',
            url: res.contentUrl
          }
        });
      }
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
      if (e === 3) {
        setPosterImg(catalogDetail.contentUrl as string);
      } else {
        setPosterImg(catalogDetail.thumbnail as string);
      }
    } else {
      form.resetFields();
      form.setFieldsValue({ name, contentType: e });
      setPosterImg('');
    }
  };

  const onOk = async (updataCatalog: any) => {
    const { parentId, catalog, title } = editOrAddLastCatalogParam;
    const { sceneId, catalogId, level, lastLevel } = catalog;
    const res = await requestEditCatalog({
      corpId,
      parentId,
      sceneId,
      level,
      lastLevel,
      catalogId: title === '新增' ? undefined : catalogId,
      ...updataCatalog
    });
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
    console.log(updataCatalog.contentUrl);
    updataCatalog.contentUrl = updataCatalog.contentUrl.url;
    if (updataCatalog.contentUrl && updataCatalog.contentType !== 9 && !updataCatalog.contentUrl.startsWith('http')) {
      updataCatalog.contentUrl = 'http://' + updataCatalog.contentUrl;
    } else if (updataCatalog.contentType === 9) {
      updataCatalog.contentUrl = JSON.stringify({ appId: updataCatalog.appId, appPath: updataCatalog.appPath || '' });
    }
    // 长图请求参数
    if (updataCatalog.contentType === 2) {
      updataCatalog.contentUrl = updataCatalog.thumbnail;
      delete updataCatalog.thumbnail;
    }
    console.log(updataCatalog);
    const title = '修改提醒';
    const content = '修改目录会对已上架话术产生影响，企微前端能实时看到变化,您确定要修改目录吗?';
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
  if (editOrAddLastCatalogParam) {
    return (
      <Modal
        width={720}
        centered
        wrapClassName={style.modalWrap}
        closable={false}
        maskClosable={false}
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
            <Form.Item name="name" rules={[{ required: true, message: '请输入目录名称' }]} noStyle>
              <Input
                className={style.modalContentInput}
                placeholder={'请输入目录名称'}
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
