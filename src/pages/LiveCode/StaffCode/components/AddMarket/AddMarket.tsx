import React, { Key, useState } from 'react';
import { Form, Modal, Input } from 'antd';
import { ArticleSelectComponent } from 'src/pages/Marketing/HotSpecial/components/ArticleSelectComponent';
import { PosterSelectComponent } from 'src/pages/Marketing/HotSpecial/components/PosterSelectComponent';
import { ProductSelectComponent } from 'src/pages/Marketing/HotSpecial/components/ProductSelectComponent';
import { ActivitySelectComponent } from 'src/pages/Marketing/HotSpecial/components/ActivitySelectComponent';
import { Icon, ImageUpload } from 'src/components';
import { isArray } from 'src/utils/tools';
import { activityDetail, getNewsDetail, productDetail } from 'src/apis/marketing';
import { Preview } from 'src/pages/LiveCode/StaffCode/components';
import classNames from 'classnames';
import style from './style.module.less';

interface IAddMarketProps {
  value?: any[];
  onChange?: (value?: any[]) => void;
}

const welcomeTypeList = [
  { value: 1, name: '文章' },
  { value: 2, name: '海报' },
  { value: 3, name: '活动' },
  { value: 4, name: '产品' },
  { value: 10, name: '图片' },
  { value: 11, name: '链接' }
];

const AddMarket: React.FC<IAddMarketProps> = ({ value, onChange }) => {
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
    // onChange?.([...res, ...filterRows]);
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
    setVisible(true);
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
        arr = arr.map(({ title, summary, defaultImg }: any) => ({
          welcomeTitle: title,
          welcomeDesc: summary,
          welcomeLogo: defaultImg
        }));

        break;
      case 2:
        // 使海报与图片的字段相同
        arr = selectRows.map(({ imgUrl }) => ({ welcomeUrl: imgUrl }));
        break;
      case 3:
        arr = await Promise.all(selectedRowKeys.map((itemId) => activityDetail({ activityId: itemId })));
        arr = arr.map(({ activityName, shareTitle, shareCoverImgUrl }: any) => ({
          welcomeTitle: activityName,
          welcomeDesc: shareTitle,
          welcomeLogo: shareCoverImgUrl
        }));
        break;
      case 4:
        arr = await Promise.all(selectedRowKeys.map((itemId) => productDetail({ productId: itemId })));
        arr = arr.map(({ productName, shareTitle, shareCoverImgUrl }: any) => ({
          welcomeTitle: productName,
          welcomeDesc: shareTitle,
          welcomeLogo: shareCoverImgUrl
        }));
        break;
      default:
        break;
    }
    console.log('arr', arr);
    let newWVal = [
      ...(value || []).filter((filterItem) => filterItem.welcomeType !== welcomeType),
      ...selectRows.map((mapItem, index: number) => ({ ...mapItem, welcomeType, ...arr[index] }))
    ];
    if ([10, 11].includes(welcomeType as number)) {
      newWVal = [...newWVal, form.getFieldsValue()];
    }
    onChange?.(newWVal);
    onCancelHandle();
  };
  return (
    <div className={style.wrap}>
      <div className={style.addWrap}>
        <div className={classNames(style.addItem, style.addImg, 'pointer')} onClick={() => addMarketHandle(10)}>
          添加图片
        </div>
        <div className={classNames(style.addItem, style.addLink, 'pointer')} onClick={() => addMarketHandle(11)}>
          添加链接
        </div>
        <div className={classNames(style.addItem, style.addArticle, 'pointer')} onClick={() => addMarketHandle(1)}>
          添加文章
        </div>
        <div className={classNames(style.addItem, style.addPoster, 'pointer')} onClick={() => addMarketHandle(2)}>
          添加海报
        </div>
        <div className={classNames(style.addItem, style.addActivity, 'pointer')} onClick={() => addMarketHandle(3)}>
          添加活动
        </div>
        <div className={classNames(style.addItem, style.addProduct, 'pointer')} onClick={() => addMarketHandle(4)}>
          添加产品
        </div>
      </div>
      <div className={style.value}>
        {(value || []).map((val) => (
          <div className={classNames(style.customTag, 'block')} key={val.itemId || val.welcomeUrl}>
            <span className={classNames(style.itemName, 'ellipsis')}>
              {val.itemName || val.welcomeTitle || val.welcomeUrl}（
              {welcomeTypeList.find((findItem) => findItem.value === welcomeType)?.name}）
            </span>
            <Icon className={style.closeIcon} name="biaoqian_quxiao" onClick={() => removeValue(val)}></Icon>
          </div>
        ))}
      </div>
      <Modal
        title={'添加素材'}
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
                  label="图文标题:"
                  // rules={[{ required: true, message: '请输入图文标题' }]}
                >
                  <Input
                    className={classNames(style.input, 'width320')}
                    placeholder={'请输入图文摘要'}
                    maxLength={30}
                  />
                </Form.Item>
                <Form.Item
                  className={style.formItem}
                  name="welcomeDesc"
                  label="图文摘要:"
                  // rules={[{ required: true, message: '请输入图文摘要' }]}
                >
                  <Input
                    className={classNames(style.input, 'width320')}
                    placeholder={'请输入图文摘要'}
                    maxLength={30}
                  />
                </Form.Item>
                <Form.Item
                  className={style.formItem}
                  name="welcomeUrl"
                  label="图文链接:"
                  rules={[{ required: true, message: '请输入图文链接' }]}
                >
                  <Input className={classNames(style.input, 'width320')} placeholder={'请输入图文链接'} />
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
                      <span>{row.itemName}</span>
                      <Icon className={style.closeIcon} name="biaoqian_quxiao" onClick={() => removeItem(row)}></Icon>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
      <Preview className={style.preview} />
    </div>
  );
};
export default AddMarket;
