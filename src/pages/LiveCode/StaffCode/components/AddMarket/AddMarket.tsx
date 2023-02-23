import React, { Key, useState } from 'react';
import { Form, Modal, Input } from 'antd';
import { ArticleSelectComponent } from 'src/pages/Marketing/HotSpecial/components/ArticleSelectComponent';
import { PosterSelectComponent } from 'src/pages/Marketing/HotSpecial/components/PosterSelectComponent';
import { ProductSelectComponent } from 'src/pages/Marketing/HotSpecial/components/ProductSelectComponent';
import { ActivitySelectComponent } from 'src/pages/Marketing/HotSpecial/components/ActivitySelectComponent';
import { Icon, ImageUpload } from 'src/components';
import { isArray } from 'src/utils/tools';
import { activityDetail, getNewsDetail, productDetail } from 'src/apis/marketing';
import classNames from 'classnames';
import style from './style.module.less';

interface IAddMarketProps {
  value?: any[];
  onChange?: (value?: any[]) => void;
  disabled?: boolean;
}

const welcomeTypeList = [
  { value: 1, name: '文章' },
  { value: 2, name: '海报' },
  { value: 3, name: '活动' },
  { value: 4, name: '产品' },
  { value: 10, name: '图片' },
  { value: 11, name: '链接' }
];

const AddMarket: React.FC<IAddMarketProps> = ({ value, onChange, disabled }) => {
  const [visible, setVisible] = useState(false);
  /**
   *
   */
  const [welcomeType, setWelcomeType] = useState<number>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [selectRows, setSelectRows] = useState<any[]>([]);

  const [form] = Form.useForm();

  // 列表选择时数据处理
  const handleChange = (keys: React.Key[], rows: any[]) => {
    // 针对海报选中未加载的数据进行过滤重组处理
    const res = rows.filter((row) => row.itemId !== undefined);
    const filterKeys = keys.filter((key) => !res.map((item) => item.itemId).includes(key));
    const filterRows = selectRows.filter((item) => filterKeys.includes(item.itemId!));
    setSelectRows([...res, ...filterRows]);
    setSelectedRowKeys(keys);
  };

  /**
   * 删除选中的内容
   */
  const removeItem = (row: any) => {
    if (value) {
      setSelectRows((rows) => rows.filter((filterItem) => filterItem.itemId !== row.itemId));
      setSelectedRowKeys((keys) => keys.filter((key) => key !== row.itemId));
    }
  };
  /**
   * 删除选中的内容
   */
  const removeValue = (row: any) => {
    onChange?.(
      value?.filter((filterItem) => filterItem.welcomeUrl !== row.welcomeUrl || filterItem.itemId !== row.itemId)
    );
  };

  const onCancelHandle = () => {
    setSelectedRowKeys([]);
    setSelectRows([]);
    setVisible(false);
    [10, 11].includes(welcomeType as number) && form.resetFields();
  };

  /**
   * @description 添加素材
   * @param welcomeType 1、文章库；2、海报库、3、活动库；4、产品库 ；10、图片；11、外链
   */
  const addMarketHandle = (welcomeType: number) => {
    if (disabled) return;
    setVisible(true);
    // 将本类型素材筛选出来带到添加素材中共同处理
    const currentTypeRows = value?.filter((filterItem) => filterItem.welcomeType === welcomeType) || [];
    setSelectedRowKeys(currentTypeRows.map((mapItem) => mapItem.itemId));
    setSelectRows(currentTypeRows);
    setWelcomeType(welcomeType);
  };

  const onOkHandle = async () => {
    // 获取详情拿三要素
    let arr: any = [];
    switch (welcomeType) {
      case 1:
        arr = await Promise.all(selectedRowKeys.map((itemId) => getNewsDetail({ newsId: itemId })));
        arr = arr.map(({ newsId, title, summary, defaultImg }: any) => ({
          itemId: newsId,
          welcomeTitle: title,
          welcomeDesc: summary,
          welcomeLogo: defaultImg,
          welcomeType
        }));

        break;
      case 2:
        // 使海报与图片的字段相同
        arr = selectRows.map(({ itemId, welcomeTitle, welcomeUrl, imgUrl, name }) => ({
          itemId,
          welcomeUrl: welcomeUrl || imgUrl,
          welcomeTitle: welcomeTitle || name,
          welcomeType
        }));
        break;
      case 3:
        arr = await Promise.all(selectedRowKeys.map((itemId) => activityDetail({ activityId: itemId })));
        arr = arr.map(({ activityId, activityName, shareTitle, shareCoverImgUrl }: any) => ({
          itemId: activityId,
          welcomeTitle: activityName,
          welcomeDesc: shareTitle,
          welcomeLogo: shareCoverImgUrl,
          welcomeType
        }));
        break;
      case 4:
        arr = await Promise.all(selectedRowKeys.map((itemId) => productDetail({ productId: itemId })));
        arr = arr.map(({ productId, productName, shareTitle, shareCoverImgUrl }: any) => ({
          itemId: productId,
          welcomeTitle: productName,
          welcomeDesc: shareTitle,
          welcomeLogo: shareCoverImgUrl,
          welcomeType
        }));
        break;
      default:
        break;
    }
    let newWVal = [...(value || [])];
    if ([10, 11].includes(welcomeType as number)) {
      // 图片和链接直接追加
      newWVal = [...newWVal, { ...form.getFieldsValue(), welcomeType }];
    } else {
      // 文章/海报/活动/产品 对本类型重新处理
      newWVal = [...newWVal.filter((filterItem) => filterItem.welcomeType !== welcomeType), ...arr];
    }
    onChange?.(newWVal);
    onCancelHandle();
  };
  return (
    <div className={style.wrap}>
      <div className={style.addWrap}>
        <div
          className={classNames(style.addItem, style.addImg, 'pointer', { disabled: disabled })}
          onClick={() => addMarketHandle(10)}
        >
          添加图片
        </div>
        <div
          className={classNames(style.addItem, style.addLink, 'pointer', { disabled: disabled })}
          onClick={() => addMarketHandle(11)}
        >
          添加链接
        </div>
        <div
          className={classNames(style.addItem, style.addArticle, 'pointer', { disabled: disabled })}
          onClick={() => addMarketHandle(1)}
        >
          添加文章
        </div>
        <div
          className={classNames(style.addItem, style.addPoster, 'pointer', { disabled: disabled })}
          onClick={() => addMarketHandle(2)}
        >
          添加海报
        </div>
        <div
          className={classNames(style.addItem, style.addActivity, 'pointer', { disabled: disabled })}
          onClick={() => addMarketHandle(3)}
        >
          添加活动
        </div>
        <div
          className={classNames(style.addItem, style.addProduct, 'pointer', { disabled: disabled })}
          onClick={() => addMarketHandle(4)}
        >
          添加产品
        </div>
      </div>
      <div className={style.value}>
        {(value || []).map((val) => (
          <div className={classNames(style.customTag, 'block')} key={val.itemId || val.welcomeUrl}>
            <span className={classNames(style.itemName, 'ellipsis')}>
              {val.itemName || val.welcomeTitle || val.welcomeUrl}（
              {welcomeTypeList.find((findItem) => findItem.value === val.welcomeType)?.name}）
            </span>
            {disabled || <Icon className={style.closeIcon} name="biaoqian_quxiao" onClick={() => removeValue(val)} />}
          </div>
        ))}
      </div>
      <Modal
        title={`添加${welcomeTypeList.find((findItem) => findItem.value === welcomeType)?.name}`}
        className={style.modalWrap}
        visible={visible}
        width={720}
        centered
        onCancel={onCancelHandle}
        maskClosable={false}
        onOk={onOkHandle}
      >
        {[10, 11].includes(welcomeType as number) && (
          <Form form={form} className={style.form}>
            {welcomeType === 10 && (
              <Form.Item
                className={style.formItem}
                name="welcomeUrl"
                label="图片:"
                rules={[{ required: true, message: '请上传图片' }]}
              >
                <ImageUpload />
              </Form.Item>
            )}
            {welcomeType === 11 && (
              <>
                <Form.Item className={style.imgItem} name="welcomeLogo" label="分享logo">
                  <ImageUpload />
                </Form.Item>
                <Form.Item
                  className={style.formItem}
                  name="welcomeTitle"
                  label="链接标题:"
                  // rules={[{ required: true, message: '请输入链接标题' }]}
                >
                  <Input
                    className={classNames(style.input, 'width320')}
                    placeholder={'请输入链接标题'}
                    maxLength={30}
                  />
                </Form.Item>
                <Form.Item
                  className={style.formItem}
                  name="welcomeDesc"
                  label="链接摘要:"
                  // rules={[{ required: true, message: '请输入链接摘要' }]}
                >
                  <Input
                    className={classNames(style.input, 'width320')}
                    placeholder={'请输入链接摘要'}
                    maxLength={30}
                  />
                </Form.Item>
                <Form.Item
                  className={style.formItem}
                  name="welcomeUrl"
                  label="链接链接:"
                  rules={[{ required: true, message: '请输入链接链接' }]}
                >
                  <Input className={classNames(style.input, 'width320')} placeholder={'请输入链接链接'} />
                </Form.Item>
              </>
            )}
          </Form>
        )}
        {welcomeType === 1 && (
          <ArticleSelectComponent selectedLength="infinity" selectedRowKeys={selectedRowKeys} onChange={handleChange} />
        )}
        {welcomeType === 2 && (
          <PosterSelectComponent selectedLength="infinity" selectedRowKeys={selectedRowKeys} onChange={handleChange} />
        )}
        {welcomeType === 3 && (
          <ActivitySelectComponent
            selectedLength="infinity"
            selectedRowKeys={selectedRowKeys}
            onChange={handleChange}
          />
        )}
        {welcomeType === 4 && (
          <ProductSelectComponent selectedLength="infinity" selectedRowKeys={selectedRowKeys} onChange={handleChange} />
        )}
        {[1, 2, 3, 4].includes(welcomeType as number) && (
          <div className="ph20 mb20">
            <h3 className="pb20">已选择</h3>
            <div className={classNames(style.panelWrap, style.tagWrap)}>
              <div className={classNames(style.marketingWarp)}>
                {isArray(selectRows) &&
                  (selectRows as any[])?.map((row: any) => (
                    <div className={classNames(style.customTag)} key={row.itemId}>
                      <span>{row.itemName || row.welcomeTitle}</span>
                      <Icon className={style.closeIcon} name="biaoqian_quxiao" onClick={() => removeItem(row)} />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
export default AddMarket;
