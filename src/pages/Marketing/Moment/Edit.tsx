import { Breadcrumb, Button, Divider, Form, Select, Input, Avatar, Image, Spin, message } from 'antd';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { getMomentDetail, searchRecommendGoodsList, updateMoment } from 'src/apis/marketing';
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
  const navigatorToList = () => {
    history.goBack();
  };

  const getDetail = async () => {
    const { feedId } = URLSearchParams(location.search) as { feedId: string };
    if (feedId) {
      const res = await getMomentDetail({ feedId });
      console.log(res);
      if (res) {
        setFormValues(res);
        const { name, tplType, itemList, speechcraft } = res;
        if (tplType === 5) {
          const oldList = itemList.map((item: any) => item.itemUrl);
          const newList = new Array(9).fill('');
          newList.splice(0, oldList.length, ...oldList);

          console.log(oldList, newList);
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
  const tplTypeChange = (value: number) => {
    setTplType(value);
    // 多图朋友圈不需要查询
    if (value < 5) {
      onRecommendSearch('', value);
    } else {
      momentForm.setFieldsValue({
        itemList: new Array(9).fill('')
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

          <Form onFinish={onSubmit} form={momentForm}>
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
                        console.log(res, value);

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
                  <p className="f12">有了健康时的未雨绸缪，才有患病时的踏实安心，把其他担忧交给保险吧。</p>
                  {/* <div className={styles.picIsOnly}>
                    <Image src="https://insure-dev-server-1305111576.cos.ap-guangzhou.myqcloud.com/news/20220531/b6dfadf9398d44d69e2f27730af9f904.jpg?timestamp=1653990077454"></Image>
                  </div> */}
                  <div className={styles.picSmallWrap}>
                    <Image src="https://insure-dev-server-1305111576.cos.ap-guangzhou.myqcloud.com/news/20220531/b6dfadf9398d44d69e2f27730af9f904.jpg?timestamp=1653990077454"></Image>
                    <Image src="https://insure-dev-server-1305111576.cos.ap-guangzhou.myqcloud.com/news/20220531/b6dfadf9398d44d69e2f27730af9f904.jpg?timestamp=1653990077454"></Image>
                    <Image src="https://insure-dev-server-1305111576.cos.ap-guangzhou.myqcloud.com/news/20220531/b6dfadf9398d44d69e2f27730af9f904.jpg?timestamp=1653990077454"></Image>
                    <Image src="https://insure-dev-server-1305111576.cos.ap-guangzhou.myqcloud.com/news/20220531/b6dfadf9398d44d69e2f27730af9f904.jpg?timestamp=1653990077454"></Image>
                  </div>
                  <div className={classNames(styles.shearLinkWrap, 'flex')}>
                    <img
                      className={styles.pic}
                      src="https://insure-dev-server-1305111576.cos.ap-guangzhou.myqcloud.com/news/20220531/b6dfadf9398d44d69e2f27730af9f904.jpg?timestamp=1653990077454"
                      alt=""
                    />
                    <div className="cell ml5">
                      <div className={classNames(styles.shearTitle, 'ellipsis')}>文章标题</div>
                      <div className={classNames(styles.shearDesc, 'ellipsis')}>
                        这里是描述，快来safdasnihcadfasdasfdfasfdas体验吧
                      </div>
                    </div>
                  </div>
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
