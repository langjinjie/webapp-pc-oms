import React, { useContext, useEffect, useState } from 'react';
import { Modal, Upload, message } from 'antd';
import { IFirmModalParam, IEditOrAddCatalogParam } from 'src/utils/interface';
import { Icon } from 'src/components';
import { requestEditCatalog } from 'src/apis/salesCollection';
import { catalogLmitLengtg, catalogLmitLengtgTip } from 'src/utils/commonData';
import style from './style.module.less';
import { Context } from 'src/store';

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
  const { currentCorpId: corpId } = useContext(Context);
  const [iconImg, setIconImg] = useState('');
  const [catalogName, setCatalogName] = useState('');
  const [catalogSenceAndLevel, setCatalogSenceAndLevel] = useState<ICatalogSenceAndLevel>({ sence: 0, level: 0 });
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [btnIsLoading, setBtnIsLoading] = useState(false);
  const resetHandle = () => {
    setIconImg('');
    setCatalogName('');
    setCatalogSenceAndLevel({ sence: 0, level: 0 });
    setEditOrAddCatalogParam({ ...editOrAddCatalogParam, visible: false });
    setSubmitDisabled(true);
    setBtnIsLoading(false);
  };

  // 更新Modal确定的disabled状态
  const updateOkBtnStatus = (catalogName: string, iconImg: string) => {
    const isShowIcon =
      (editOrAddCatalogParam.catalog.sceneId === 4 && editOrAddCatalogParam.catalog.level === 2) ||
      (editOrAddCatalogParam.catalog.sceneId === 5 && editOrAddCatalogParam.catalog.level === 1);
    setSubmitDisabled(
      catalogName.length < catalogLmitLengtg[catalogSenceAndLevel.sence][catalogSenceAndLevel.level][0] ||
        catalogName.length > catalogLmitLengtg[catalogSenceAndLevel.sence][catalogSenceAndLevel.level][1] ||
        (editOrAddCatalogParam.title === '编辑' &&
          editOrAddCatalogParam.catalog.name === catalogName &&
          iconImg === editOrAddCatalogParam.catalog.logoUrl) ||
        (isShowIcon && !iconImg)
    );
  };

  // 输入目录名称的onChange
  const inputOnChangHangle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCatalogName(e.target.value.trim());
    updateOkBtnStatus(e.target.value.trim(), iconImg);
  };

  // 确认修改/增加目录handle
  const firmModalOnOk = async () => {
    setSubmitDisabled(true);
    setBtnIsLoading(true);
    const { parentId, catalog } = editOrAddCatalogParam;
    const { sceneId, catalogId, level, lastLevel } = catalog;
    const res = await requestEditCatalog({
      corpId,
      parentId,
      sceneId,
      name: catalogName,
      level,
      lastLevel,
      catalogId: editOrAddCatalogParam.title === '新增' ? undefined : catalogId,
      logoUrl: iconImg
    });
    setSubmitDisabled(false);
    setBtnIsLoading(false);
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
    const content = '修改目录会对已上架话术产生影响，企微前端能实时看到变化,您确定要修改目录吗?';
    if (editOrAddCatalogParam.title === '新增') {
      await firmModalOnOk();
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
      setEditOrAddCatalogParam({ ...editOrAddCatalogParam, visible: false });
    }
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
  const handleChange = (info: any) => {
    if (info.file.status === 'done') {
      setIconImg(info.file.response.retdata.filePath);
      updateOkBtnStatus(catalogName, info.file.response.retdata.filePath);
    }
  };
  const onCancelHandle = () => {
    resetHandle();
    setEditOrAddCatalogParam({ ...editOrAddCatalogParam, visible: false });
  };
  useEffect(() => {
    if (editOrAddCatalogParam?.visible) {
      if (editOrAddCatalogParam.title === '编辑') {
        catalogName || setCatalogName(editOrAddCatalogParam.catalog.name || '');
        iconImg || setIconImg(editOrAddCatalogParam.catalog.logoUrl);
      } else {
        setCatalogName('');
      }
      setCatalogSenceAndLevel({
        sence: editOrAddCatalogParam.catalog.sceneId - 1,
        level: editOrAddCatalogParam.catalog.level
      });
    }
  }, [editOrAddCatalogParam]);
  return (
    <Modal
      width={320}
      centered
      wrapClassName={style.modalWrap}
      closable={false}
      visible={editOrAddCatalogParam?.visible}
      title={editOrAddCatalogParam?.title + '目录'}
      onCancel={onCancelHandle}
      onOk={modalOnOkHandle}
      maskClosable={false}
      okButtonProps={{
        disabled: submitDisabled,
        loading: btnIsLoading
      }}
    >
      {editOrAddCatalogParam && (
        <>
          <input
            value={catalogName}
            className={style.input}
            minLength={catalogLmitLengtg[catalogSenceAndLevel.sence][catalogSenceAndLevel.level][0]}
            maxLength={catalogLmitLengtg[catalogSenceAndLevel.sence][catalogSenceAndLevel.level][1]}
            onChange={(e) => inputOnChangHangle(e)}
            placeholder={`输入目录名称（${
              catalogLmitLengtgTip[catalogSenceAndLevel.sence][catalogSenceAndLevel.level]
            }）`}
          />
          {((editOrAddCatalogParam.catalog.sceneId === 4 && editOrAddCatalogParam.catalog.level === 2) ||
            (editOrAddCatalogParam.catalog.sceneId === 5 && editOrAddCatalogParam.catalog.level === 1)) && (
            <div className={style.uploadWrap}>
              <div className={style.tip}>该目录需上传icon，请上传80x80像素的图片</div>
              <Upload
                accept="image/*"
                maxCount={1}
                listType="picture-card"
                action="/tenacity-admin/api/file/upload"
                data={{ bizKey: 'news' }}
                className={style.upload}
                showUploadList={false}
                beforeUpload={beforeUploadHandle}
                onChange={handleChange}
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
