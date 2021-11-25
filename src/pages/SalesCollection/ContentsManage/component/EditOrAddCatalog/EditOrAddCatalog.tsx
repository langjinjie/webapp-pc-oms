import React, { useContext, useEffect, useState } from 'react';
import { Modal, Upload, message } from 'antd';
import { IFirmModalParam, IEditOrAddCatalogParam } from 'src/utils/interface';
import { Icon } from 'src/components';
import { requestEditCatalog } from 'src/apis/salesCollection';
import style from './style.module.less';
import { Context } from 'src/store';

interface IAddOrEditContentProps {
  editOrAddCatalogVisible: boolean;
  setEditOrAddCatalogVisible: (param: boolean) => void;
  editOrAddCatalogParam: IEditOrAddCatalogParam;
  setFirmModalParam: (param: IFirmModalParam) => void;
}

const AddOrEditContent: React.FC<IAddOrEditContentProps> = ({
  editOrAddCatalogVisible,
  setEditOrAddCatalogVisible,
  editOrAddCatalogParam,
  setFirmModalParam
}) => {
  const { currentCorpId: corpId } = useContext(Context);
  const [iconImg, setIconImg] = useState('');
  console.log(setIconImg);
  const [catalog, setCatalog] = useState('');

  const inputOnChangHangle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCatalog(e.target.value.trim());
  };

  // 确认修改/增加目录handle
  const firmModalOnOk = async () => {
    const { parentId, catalog } = editOrAddCatalogParam;
    const { sceneId, catalogId, name, level, lastLevel } = catalog;
    const param = { corpId, parentId, sceneId, catalogId, name, level, lastLevel };
    const res = await requestEditCatalog(param);
    return res;
  };
  // modal确认
  const modalOnOkHandle = async () => {
    setEditOrAddCatalogVisible(false);
    setFirmModalParam({
      title: '修改提醒',
      content: '修改目录会对已上架话术产生影响，企微前端能实时看到变化',
      visible: true,
      onOk: firmModalOnOk
    });
  };
  // updaload beforeUpload
  const beforeUploadHandle = (file: File): Promise<boolean> => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只允许上传JPG/PNG文件!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过2MB!');
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
          if (!(width === 750)) {
            message.error('海报宽度必须为 750px');
          }
          resolve(width === 750 && isJpgOrPng && isLt2M);
          resolve(true);
        };
      };
      reader.readAsDataURL(file);
    });
  };
  const onCancelHandle = () => {
    setEditOrAddCatalogVisible(false);
  };
  useEffect(() => {
    if (editOrAddCatalogVisible) {
      setCatalog(editOrAddCatalogParam.catalog.name || '');
    }
  }, [editOrAddCatalogVisible]);
  return (
    <Modal
      width={320}
      centered
      wrapClassName={style.modalWrap}
      closable={false}
      visible={editOrAddCatalogVisible}
      title={editOrAddCatalogParam?.title + '目录'}
      onCancel={onCancelHandle}
      onOk={modalOnOkHandle}
      maskClosable={false}
      destroyOnClose
    >
      {editOrAddCatalogParam && (
        <>
          <input
            value={catalog}
            className={style.input}
            maxLength={4}
            onChange={(e) => inputOnChangHangle(e)}
            placeholder={'输入目录名称（文字不超过4个字）'}
          />
          {[4, 5].includes(editOrAddCatalogParam.catalog.sceneId) && editOrAddCatalogParam.catalog.level === 2 && (
            <div className={style.uploadWrap}>
              <div className={style.tip}>该目录需上传icon，请上传40x40像素的图片</div>
              <Upload
                accept="image/*"
                maxCount={1}
                listType="picture-card"
                action="/tenacity-admin/api/file/upload"
                data={{ bizKey: 'news' }}
                className={style.upload}
                showUploadList={false}
                beforeUpload={beforeUploadHandle}
              >
                {iconImg
                  ? (
                  <img src={iconImg} alt="icon" style={{ width: '100%' }} />
                    )
                  : (
                  <div className={style.iconWrap}>
                    <Icon className={style.uploadIcon} name="upload" />
                    <div className={style.uploadTip}>点击上传</div>
                  </div>
                    )}
              </Upload>
            </div>
          )}
        </>
      )}
    </Modal>
  );
};
export default AddOrEditContent;
