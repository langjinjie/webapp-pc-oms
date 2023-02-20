import React, { useState } from 'react';
import classNames from 'classnames';
import style from './style.module.less';
import { Form, Modal, Input } from 'antd';
import { ArticleSelectComponent } from 'src/pages/Marketing/HotSpecial/components/ArticleSelectComponent';
import { PosterSelectComponent } from 'src/pages/Marketing/HotSpecial/components/PosterSelectComponent';
import { ProductSelectComponent } from 'src/pages/Marketing/HotSpecial/components/ProductSelectComponent';
import { ActivitySelectComponent } from 'src/pages/Marketing/HotSpecial/components/ActivitySelectComponent';
import { ImageUpload } from 'src/components';

interface IAddMarketProps {
  value?: any[];
  onChange?: (value?: any[]) => void;
}

const AddMarket: React.FC<IAddMarketProps> = ({ onChange }) => {
  const [visible, setVisible] = useState(false);
  /**
   *
   */
  const [marketType, setMarketType] = useState<number>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([]);
  const [selectRows, setSelectRows] = useState<any[]>([]);

  const [form] = Form.useForm();

  // 列表选择时数据处理
  const handleChange = (keys: React.Key[], rows: any[]) => {
    // 针对海报选中未加载的数据进行过滤重组处理
    console.log(rows);

    const res = rows.filter((row) => row.itemId !== undefined);
    const filterKeys = keys.filter((key) => !res.map((item) => item.itemId).includes(key));

    const filterRows = selectRows.filter((item) => filterKeys.includes(item.itemId!));
    console.log({ filterRows });
    setSelectRows([...res, ...filterRows]);
    onChange?.([...res, ...filterRows]);
    setSelectedRowKeys(keys);
  };

  /**
   * @description 添加素材
   * @param marketType 1、文章库；2、海报库、3、活动库；4、产品库 ；10、图片；11、外链
   */
  const addMarketHandle = (marketType: number) => {
    setVisible(true);
    setMarketType(marketType);
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
      <div className={style.value}></div>
      <Modal
        title={'添加素材'}
        className={style.modalWrap}
        visible={visible}
        width={720}
        centered
        onCancel={() => setVisible(false)}
        maskClosable={false}
      >
        {[10, 11].includes(marketType as number) && (
          <Form form={form} className={style.form}>
            {marketType === 10 && (
              <Form.Item
                className={style.formItem}
                name="welcomeUrl"
                label="图片:"
                rules={[{ required: true, message: '请上传图片' }]}
              >
                <ImageUpload />
              </Form.Item>
            )}
            {marketType === 11 && (
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
        {marketType === 1 && (
          <ArticleSelectComponent selectedLength="infinity" selectedRowKeys={selectedRowKeys} onChange={handleChange} />
        )}
        {marketType === 2 && (
          <PosterSelectComponent selectedLength="infinity" selectedRowKeys={selectedRowKeys} onChange={handleChange} />
        )}
        {marketType === 3 && (
          <ActivitySelectComponent
            selectedLength="infinity"
            selectedRowKeys={selectedRowKeys}
            onChange={handleChange}
          />
        )}
        {marketType === 4 && (
          <ProductSelectComponent selectedLength="infinity" selectedRowKeys={selectedRowKeys} onChange={handleChange} />
        )}
      </Modal>
    </div>
  );
};
export default AddMarket;
