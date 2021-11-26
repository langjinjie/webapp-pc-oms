import React, { useContext, useEffect, useState } from 'react';
import { Modal, Upload, message } from 'antd';
import { IFirmModalParam, IEditOrAddCatalogParam } from 'src/utils/interface';
import { Icon } from 'src/components';
import { requestEditCatalog } from 'src/apis/salesCollection';
import { catalogLmitLengtg, catalogLmitLengtgTip } from 'src/utils/commonData';
import style from './style.module.less';
import { Context } from 'src/store';

interface IAddOrEditContentProps {
  editOrAddCatalogVisible: boolean;
  setEditOrAddCatalogVisible: (param: boolean) => void;
  editOrAddCatalogParam: IEditOrAddCatalogParam;
  setFirmModalParam: (param: IFirmModalParam) => void;
}

interface ICatalogSenceAndLevel {
  sence: number;
  level: number;
}

const AddOrEditContent: React.FC<IAddOrEditContentProps> = ({
  editOrAddCatalogVisible,
  setEditOrAddCatalogVisible,
  editOrAddCatalogParam,
  setFirmModalParam
}) => {
  const { currentCorpId: corpId } = useContext(Context);
  const [iconImg, setIconImg] = useState('');
  const [catalogName, setCatalogName] = useState('');
  const [catalogSenceAndLevel, setCatalogSenceAndLevel] = useState<ICatalogSenceAndLevel>({ sence: 0, level: 0 });

  const inputOnChangHangle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCatalogName(e.target.value.trim());
  };

  // 确认修改/增加目录handle
  const firmModalOnOk = async () => {
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
    if (res) {
      setFirmModalParam({ title: '成功', content: '', visible: false });
      message.success(`目录${editOrAddCatalogParam.title}成功`);
    }
  };
  // modal确认
  const modalOnOkHandle = async () => {
    setEditOrAddCatalogVisible(false);
    let title = '修改提醒';
    let content = '修改目录会对已上架话术产生影响，企微前端能实时看到变化,您确定要修改目录吗?';
    editOrAddCatalogParam.title === '新增' && (title = '新增提醒');
    editOrAddCatalogParam.title === '新增' && (content = '您确定要新增目录吗?');
    setFirmModalParam({
      title,
      content,
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
    }
  };
  const onCancelHandle = () => {
    setIconImg('');
    setEditOrAddCatalogVisible(false);
  };
  useEffect(() => {
    if (editOrAddCatalogVisible) {
      if (editOrAddCatalogParam.title === '编辑') {
        setCatalogName(editOrAddCatalogParam.catalog.name || '');
        setIconImg(editOrAddCatalogParam.catalog.logoUrl);
      } else {
        setCatalogName('');
      }
      setCatalogSenceAndLevel({
        sence: editOrAddCatalogParam.catalog.sceneId - 1,
        level: editOrAddCatalogParam.catalog.level
      });
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
      okButtonProps={{
        // 判断必填项目为空或者是未发生修改则状态为:disabled
        disabled:
          catalogName.length < catalogLmitLengtg[catalogSenceAndLevel.sence][catalogSenceAndLevel.level][0] ||
          catalogName.length > catalogLmitLengtg[catalogSenceAndLevel.sence][catalogSenceAndLevel.level][1] ||
          (editOrAddCatalogParam.title === '编辑' &&
            editOrAddCatalogParam.catalog.name === catalogName &&
            iconImg === editOrAddCatalogParam.catalog.logoUrl) ||
          ([4, 5].includes(editOrAddCatalogParam.catalog.sceneId) &&
            editOrAddCatalogParam.catalog.level === 2 &&
            !iconImg)
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
          {[4, 5].includes(editOrAddCatalogParam.catalog.sceneId) && editOrAddCatalogParam.catalog.level === 2 && (
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
