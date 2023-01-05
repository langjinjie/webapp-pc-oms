import React, { useContext, useEffect, useState } from 'react';
import { Modal, message, Form, Input } from 'antd';
import { IFirmModalParam, IEditOrAddCatalogParam } from 'src/utils/interface';
import { requestEditCatalog } from 'src/apis/salesCollection';
import { catalogLmitLengtg, catalogLmitLengtgTip } from 'src/utils/commonData';
import style from './style.module.less';
import { Context } from 'src/store';
import { SetUserRightFormItem } from 'src/pages/Marketing/Components/SetUserRight/SetUserRight';
import NgUpload from 'src/pages/Marketing/Components/Upload/Upload';

interface IAddOrEditContentProps {
  editOrAddCatalogParam: IEditOrAddCatalogParam;
  setEditOrAddCatalogParam: (param: IEditOrAddCatalogParam) => void;
  setFirmModalParam: (param: IFirmModalParam) => void;
}

interface ICatalogSenceAndLevel {
  sence: number;
  level: number;
}

const AddOrEditContent: React.FC<IAddOrEditContentProps> = ({
  editOrAddCatalogParam,
  setEditOrAddCatalogParam,
  setFirmModalParam
}) => {
  const [editForm] = Form.useForm();
  const { currentCorpId: corpId } = useContext(Context);
  const [catalogSenceAndLevel, setCatalogSenceAndLevel] = useState<ICatalogSenceAndLevel>({ sence: 0, level: 0 });
  const resetHandle = () => {
    setCatalogSenceAndLevel({ sence: 0, level: 0 });
    setEditOrAddCatalogParam({ ...editOrAddCatalogParam, visible: false });
  };

  // 确认修改/增加目录handle
  const firmModalOnOk = async () => {
    const { parentId, catalog } = editOrAddCatalogParam;
    const { sceneId, catalogId, level, lastLevel } = catalog;
    const { groupId, name, logoUrl } = editForm.getFieldsValue();
    const res = await requestEditCatalog({
      corpId,
      parentId,
      sceneId,
      name,
      level,
      lastLevel,
      groupId: groupId || '',
      catalogId: editOrAddCatalogParam.title === '新增' ? undefined : catalogId,
      logoUrl
    });
    if (res) {
      setFirmModalParam({ title: '', content: '', visible: false });
      message.success(`目录${editOrAddCatalogParam.title}成功`);
      editOrAddCatalogParam.getParentChildrenList();
      resetHandle();
    }
  };
  // modal确认
  const modalOnOkHandle = async () => {
    const title = '修改提醒';
    const content = '修改目录会对已上架话术产生影响，企微前端能实时看到变化';
    editForm
      .validateFields()
      .then(() => {
        if (editOrAddCatalogParam.title === '新增') {
          firmModalOnOk();
        } else {
          setFirmModalParam({
            title,
            content,
            visible: true,
            onOk: firmModalOnOk,
            onCancel () {
              setFirmModalParam({ title: '', content: '', visible: false });
              setEditOrAddCatalogParam({ ...editOrAddCatalogParam, visible: true });
            }
          });
          // setEditOrAddCatalogParam({ ...editOrAddCatalogParam, visible:  });
        }
      })
      .catch((e) => console.error(e));
  };
  // updaload beforeUpload
  const beforeUploadHandle = (file: File): Promise<boolean> => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只允许上传JPG/PNG文件!');
    }
    const isLt2M = file.size / 1024 / 1024 < 5;
    if (!isLt2M) {
      message.error('图片大小不能超过5MB!');
    }
    // 获取图片的真实尺寸
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        // @ts-ignore
        const data = e.target.result;
        // 加载图片获取图片真实宽度和高度
        const image = new Image();
        // @ts-ignore
        image.src = data;
        image.onload = function () {
          const width = image.width;
          const height = image.width;
          if (!(width === 80) && !(height === 80)) {
            message.error('icon尺寸为80x80');
          }
          resolve(width === 80 && height === 80 && isJpgOrPng && isLt2M);
        };
      };
      reader.readAsDataURL(file);
    });
  };

  const onCancelHandle = () => {
    editForm.resetFields();
    resetHandle();
    setEditOrAddCatalogParam({ ...editOrAddCatalogParam, visible: false });
  };
  useEffect(() => {
    if (editOrAddCatalogParam?.visible) {
      if (editOrAddCatalogParam.title === '编辑') {
        console.log(editOrAddCatalogParam.catalog);
        const { name, logoUrl, groupId } = editOrAddCatalogParam.catalog;
        editForm.setFieldsValue({ name, logoUrl, groupId });
        // iconImg || setIconImg(editOrAddCatalogParam.catalog.logoUrl);
      }
      setCatalogSenceAndLevel({
        sence: editOrAddCatalogParam.catalog.sceneId - 1,
        level: editOrAddCatalogParam.catalog.level
      });
    }
  }, [editOrAddCatalogParam]);
  return (
    <Modal
      width={600}
      centered
      forceRender
      wrapClassName={style.modalWrap}
      closable={false}
      visible={editOrAddCatalogParam?.visible}
      title={editOrAddCatalogParam?.title + '目录'}
      onCancel={onCancelHandle}
      onOk={modalOnOkHandle}
      maskClosable={false}
    >
      <Form form={editForm} labelCol={{ span: 5 }} initialValues={{ isSet: 0 }}>
        <Form.Item
          label="目录名称"
          name={'name'}
          rules={[
            {
              required: true,
              type: 'string',
              max: catalogLmitLengtg[catalogSenceAndLevel.sence][catalogSenceAndLevel.level][1],
              min: catalogLmitLengtg[catalogSenceAndLevel.sence][catalogSenceAndLevel.level][0]
            }
          ]}
        >
          <Input
            className={style.input}
            placeholder={`输入目录名称（${
              catalogLmitLengtgTip[catalogSenceAndLevel.sence][catalogSenceAndLevel.level]
            }）`}
          />
        </Form.Item>
        {editOrAddCatalogParam?.catalog.level !== 0 && (
          <Form.Item label="可见范围设置" name={'groupId'}>
            <SetUserRightFormItem form={editForm} />
          </Form.Item>
        )}
        {((editOrAddCatalogParam?.catalog.sceneId === 4 && editOrAddCatalogParam?.catalog.level === 2) ||
          (editOrAddCatalogParam?.catalog.sceneId === 5 && editOrAddCatalogParam?.catalog.level === 1)) && (
          <Form.Item
            label="请上传Icon"
            name={'logoUrl'}
            rules={[{ required: true }]}
            className={style.uploadWrap}
            extra="该目录需上传icon，请上传80x80像素的图片"
          >
            <NgUpload beforeUpload={beforeUploadHandle}></NgUpload>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};
export default AddOrEditContent;
