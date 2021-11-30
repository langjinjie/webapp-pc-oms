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
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [fileList, setFileList] = useState<{ name: string; uid: string; status: string; url: string }[]>([]);
  const [form] = Form.useForm();
  const [maxLengthParam, setMaxLengthParam] = useState({
    titleLength: 0,
    summaryLength: 0
  });
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
    setMaxLengthParam({ titleLength: 0, summaryLength: 0 });
  };
  // 切换目录类型重置部分表单
  const resetOnchange = (name: string, contentType: number) => {
    form.resetFields();
    form.setFieldsValue({ name, contentType });
    setPosterImg('');
    setFileList([]);
    setMaxLengthParam({ titleLength: 0, summaryLength: 0 });
  };
  // 获取最后一级目录详情
  const getLastCatalogDetail = async () => {
    const res = await requestGetCatalogDetail({
      corpId,
      sceneId: editOrAddLastCatalogParam.catalog.sceneId,
      catalogId: editOrAddLastCatalogParam.catalog.catalogId
    });
    if (res) {
      // 处理音视频的回写
      setCatalogDetail(res);
      if (res.contentType === 6 || res.contentType === 7) {
        setFileList([
          { uid: '1', name: `media.${res.contentType === 6 ? 'mp3' : 'mp4'}`, url: res.contentUrl, status: 'done' }
        ]);
        // delete res.contentUrl;
        // res.contentUrl = [{ uid: '1', name: `media.${res.contentType === 6 ? 'mp3' : 'mp4'}`, url: res.contentUrl, status: 'done' }];
      }
      form.setFieldsValue(res);
      setCatalogParam({ name: res.name, contentType: res.contentType });
      setMaxLengthParam({ titleLength: res.title.length, summaryLength: res.summary.length });
      // 处理长图回写
      if (res.contentType === 3) {
        setPosterImg(res.contentUrl);
      } else {
        setPosterImg(res.thumbnail);
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
    setMaxLengthParam({
      titleLength: catalogDetail.title?.length || 0,
      summaryLength: catalogDetail.summary?.length || 0
    });
  };
  // 选择目录类型
  const selectOnchangeHandle = (e: any) => {
    const name = form.getFieldValue('name');
    setCatalogParam({ ...catalogParam, contentType: e });
    if (e === catalogDetail.contentType) {
      form.setFieldsValue({ ...catalogDetail });
      setPosterImg(catalogDetail.contentUrl as string);
      setMaxLengthParam({
        titleLength: catalogDetail.title?.length || 0,
        summaryLength: catalogDetail.summary?.length || 0
      });
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
        setPosterImg(catalogDetail.contentUrl as string);
      } else {
        setPosterImg(catalogDetail.thumbnail as string);
      }
    } else {
      resetOnchange(name, e);
    }
  };

  // 提交新增/修改请求
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
    console.log(form.getFieldsValue());
    await form.validateFields();
    const updataCatalog = form.getFieldsValue();
    // 小程序请求参数
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
          <SpeechTypeLabel
            type={catalogParam.contentType}
            posterImg={posterImg}
            setPosterImg={setPosterImg}
            fileList={fileList}
            setFileList={setFileList}
            maxLengthParam={maxLengthParam}
            setMaxLengthParam={setMaxLengthParam}
          />
        </Form>
      </Modal>
    );
  }
  return null;
};

export default EditOrAddLastCatalog;
