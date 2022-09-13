import { Breadcrumb, Button, Divider, Form, Select, Input, Avatar, Image, Spin, message } from 'antd';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
  activityDetail,
  getMomentDetail,
  getNewsDetail,
  getPosterDetail,
  productDetail,
  searchRecommendGoodsList,
  updateMoment
} from 'src/apis/marketing';
import { debounce, URLSearchParams } from 'src/utils/base';
import { RecommendMarketProps } from '../Article/Components/TabView3';
import { PictureCard } from './components/PictureCard';
import { tplTypeOptions } from './ListConfig';
import styles from './style.module.less';

const MomentEdit: React.FC<RouteComponentProps> = ({ history, location }) => {
  const [tplType, setTplType] = useState(0);
  const [fetching, setFetching] = useState(false);
  const [momentForm] = Form.useForm();
  const [formValues, setFormValues] = useState<any>({});
  const [recommendList, setRecommendList] = useState<RecommendMarketProps[]>([]);
  const [shareInfo, setShareInfo] = useState<any[]>([]);
  const navigatorToList = () => {
    history.goBack();
  };

  const getDetail = async () => {
    const { feedId } = URLSearchParams(location.search) as { feedId: string };
    if (feedId) {
      const res = await getMomentDetail({ feedId });
      if (res) {
        setFormValues(res);
        const { name, tplType, itemList, speechcraft } = res;
        setShareInfo(itemList);
        if (tplType === 5) {
          const oldList = itemList.map((item: any) => item.itemUrl);
          const newList = new Array(9).fill('');
          newList.splice(0, oldList.length, ...oldList);

          momentForm.setFieldsValue({
            name,
            tplType,
            itemList: newList,
            speechcraft
          });
        } else {
          setRecommendList([
            {
              marketId: itemList[0].itemId,
              title: itemList[0].itemName
            }
          ]);
          momentForm.setFieldsValue({
            name,
            tplType,
            itemId: itemList[0].itemId,
            speechcraft
          });
        }
        setTplType(tplType);
      }
    }
  };

  useEffect(() => {
    getDetail();
  }, []);

  const onRecommendSearch = async (value: string, newTplType?: number) => {
    setFetching(true);
    const TplType = newTplType || tplType;
    const res: RecommendMarketProps[] = await searchRecommendGoodsList({
      title: value,
      specType: 0,
      feedId: formValues.feedId,
      type: 1,
      // 查询推荐接口
      recommendType: TplType === 1 ? 0 : TplType === 2 ? 2 : TplType === 3 ? 1 : 3
    });

    setRecommendList(res);
    setFetching(false);
  };

  // 防抖处理
  const debounceFetcher = debounce<string>(async (value: string) => {
    await onRecommendSearch(value);
  }, 300);

  /**
   * 模板类型切换
   */
  const tplTypeChange = (value: number) => {
    setTplType(+value);
    // 多图朋友圈不需要查询
    if (value < 5) {
      onRecommendSearch('', value);
      momentForm.setFieldsValue({
        itemId: undefined,
        speechcraft: ''
      });
    } else {
      momentForm.setFieldsValue({
        itemList: new Array(9).fill(''),
        name: ''
      });
    }
  };

  const onSubmit = async (values: any) => {
    const { speechcraft, tplType, name, itemId, itemList } = values;
    const res = await updateMoment({
      feedId: formValues.feedId,
      name,
      tplType,
      speechcraft,
      itemList:
        tplType < 5
          ? [{ itemId }]
          : itemList.filter((item: string) => !!item).map((item: string) => ({ itemUrl: item, localUpload: 1 }))
    });
    if (res) {
      message.success('添加成功');
      history.goBack();
    }
  };

  // 选择的内容切换
  const onItemChange = async (itemId: string) => {
    if (tplType === 1) {
      // 文章
      const res = await getNewsDetail({ newsId: itemId });
      setShareInfo([
        {
          itemName: res.title,
          itemShareTitle: res.summary,
          itemShareImgUrl: res.defaultImg
        }
      ]);
      setFormValues((formValues: any) => ({ ...formValues, speechcraft: res.summary }));
      momentForm.setFieldsValue({
        speechcraft: res.summary
      });
    } else if (tplType === 2) {
      // 产品
      const res = await productDetail({ productId: itemId });
      setShareInfo([
        {
          itemName: res.productName,
          itemShareTitle: res.shareTitle,
          itemShareImgUrl: res.shareCoverImgUrl
        }
      ]);
      momentForm.setFieldsValue({
        speechcraft: res.speechcraft
      });
      setFormValues((formValues: any) => ({ ...formValues, speechcraft: res.speechcraft }));
    } else if (tplType === 3) {
      // 活动
      const res = await activityDetail({ activityId: itemId });
      setShareInfo([
        {
          itemShareTitle: res.shareTitle,
          itemName: res.activityName,
          itemShareImgUrl: res.shareCoverImgUrl
        }
      ]);
      momentForm.setFieldsValue({
        speechcraft: res.speechcraft
      });
      setFormValues((formValues: any) => ({ ...formValues, speechcraft: res.speechcraft }));
    } else if (tplType === 4) {
      let res: any;
      // 单张海报
      if (itemId) {
        res = await getPosterDetail({ posterId: itemId });
      }
      setShareInfo([
        {
          itemUrl: itemId ? res.imgUrl : ''
        }
      ]);
      momentForm.setFieldsValue({
        speechcraft: itemId ? res.speechcraft : ''
      });
      setFormValues((formValues: any) => ({ ...formValues, speechcraft: itemId ? res.speechcraft : '' }));
    }
  };

  const formValuesChange = (changeValues: any) => {
    const { itemList, speechcraft } = changeValues;
    if (speechcraft) {
      setFormValues((formValues: any) => ({ ...formValues, speechcraft }));
    }
    if (itemList) {
      const res = itemList.filter((item: string) => !!item).map((item: string) => ({ itemUrl: item }));
      setShareInfo(res);
    }
  };

  return (
    <div className={styles.momentEdit}>
      <div className="edit container">
        <div className={'breadcrumbWrap'}>
          <span>当前位置：</span>
          <Breadcrumb>
            <Breadcrumb.Item onClick={() => navigatorToList()}>朋友圈内容库</Breadcrumb.Item>
            <Breadcrumb.Item>创建朋友圈内容</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="">
          <h3 className="f18">创建朋友圈内容</h3>
          <Divider></Divider>

          <Form onFinish={onSubmit} form={momentForm} onValuesChange={(changeValues) => formValuesChange(changeValues)}>
            <Form.Item label="展示模版" rules={[{ required: true }]} name="tplType">
              <Select placeholder="请选择" className={styles.smallSelect} onChange={tplTypeChange}>
                {tplTypeOptions.map((option) => (
                  <Select.Option key={option.id} value={option.id}>
                    {option.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            {tplType !== 5 && (
              <Form.Item label="选择内容" required>
                <div className={classNames(styles.lineWrap, 'flex')}>
                  {tplType === 4 && (
                    <>
                      <Select placeholder="请选择" value={'1'} className={styles.smallSelect} disabled>
                        <Select.Option value="1">海报库</Select.Option>
                      </Select>
                      <span className={styles.lineLabel}>内容：</span>
                    </>
                  )}
                  <Form.Item name="itemId" rules={[{ required: true, message: '请选择内容' }]}>
                    <Select
                      placeholder="请选择"
                      allowClear
                      showSearch={true}
                      defaultActiveFirstOption={false}
                      showArrow={false}
                      filterOption={false}
                      onChange={onItemChange}
                      className={styles.bigSelect}
                      onSearch={(value) => debounceFetcher(value)}
                      notFoundContent={fetching ? <Spin size="small" /> : <span>暂无相关素材，请试试其他内容</span>}
                    >
                      {recommendList.map((option) => (
                        <Select.Option key={option.marketId} value={option.marketId}>
                          {option.title}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </Form.Item>
            )}

            {tplType === 5 && (
              <>
                <Form.Item name={'name'} label="内容名称" rules={[{ required: true }]}>
                  <Input placeholder="请输入" className="width400"></Input>
                </Form.Item>
                <Form.Item
                  label="上传内容"
                  name="itemList"
                  rules={[
                    { required: true },
                    {
                      validator: (_, value) => {
                        const res = value.filter((item: string) => item !== '');

                        if (res.length >= 2) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('至少上传两张图片'));
                      }
                    }
                  ]}
                >
                  <PictureCard />
                </Form.Item>
              </>
            )}

            <Form.Item
              label="营销话术"
              name={'speechcraft'}
              rules={[
                {
                  required: true,
                  message: '请输入营销话术'
                }
              ]}
            >
              <Input.TextArea className={styles.textAreaWrap} placeholder="请输入" />
            </Form.Item>
            <Form.Item label="预览效果">
              <div className={classNames(styles.previewWrap, 'flex')}>
                <Avatar shape="square" size={40} icon={<span className="f16">头像</span>} />
                <div className={classNames(styles.marketBox, 'cell ml10')}>
                  <h4>客户经理姓名</h4>
                  <p className="f12">{formValues.speechcraft}</p>
                  {tplType === 4 && (
                    <div className={styles.picIsOnly}>
                      <Image src={shareInfo[0]?.itemUrl}></Image>
                    </div>
                  )}
                  {tplType === 5 && (
                    <div className={styles.picSmallWrap}>
                      {shareInfo?.map((item: any) => (
                        <Image src={item.itemUrl} key={item.itemUrl}></Image>
                      ))}
                    </div>
                  )}
                  {tplType < 4 && (
                    <div className={classNames(styles.shearLinkWrap, 'flex')}>
                      <img className={styles.pic} src={shareInfo[0]?.itemShareImgUrl} alt="" />
                      <div className="cell ml5">
                        <div className={classNames(styles.shearTitle, 'ellipsis')}>{shareInfo[0]?.itemName}</div>
                        <div className={classNames(styles.shearDesc, 'ellipsis')}>{shareInfo[0]?.itemShareTitle}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Form.Item>

            <Form.Item>
              <Button
                shape="round"
                className="mt20"
                style={{ width: 128, marginLeft: '400px' }}
                type="primary"
                htmlType="submit"
              >
                确认
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default MomentEdit;
