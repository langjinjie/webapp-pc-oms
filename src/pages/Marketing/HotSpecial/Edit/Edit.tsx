import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Breadcrumb, Button, Divider, Form, Input, message, Radio, Select } from 'antd';
import { RouteComponentProps } from 'react-router-dom';

import styles from './style.module.less';
import { MeatComponent } from '../components/MateComponent';
import { PlusOutlined } from '@ant-design/icons';
import { URLSearchParams } from 'src/utils/base';
import { getHotContentDetail, setHotContent } from 'src/apis/marketing';

const HotSpecialEdit: React.FC<RouteComponentProps> = ({ history, location }) => {
  const [listForm] = Form.useForm();
  const [formValues, setFormValues] = useState<{
    contentList: any[];
    topicId: string;
    isTip?: number;
  }>({
    contentList: [
      { isTip: 0, tplType: 0 },
      { isTip: 0, tplType: 0 },
      { isTip: 0, tplType: 0 }
    ],
    topicId: ''
  });
  const getDetail = async () => {
    const { topicId } = URLSearchParams(location.search) as { topicId: string };
    const res = await getHotContentDetail({ topicId });
    if (res) {
      const { contentList } = res;
      const resList = contentList.map((item: any) => {
        item.isTip = item.tip ? 1 : 0;
        return item;
      });

      setFormValues({ contentList: resList.length > 0 ? resList : formValues.contentList, topicId });
      listForm.setFieldsValue({
        contentList: resList.length > 0 ? resList : formValues.contentList
      });
    }
  };
  const navigatorToList = () => {
    history.goBack();
  };
  useEffect(() => {
    getDetail();
  }, []);

  const onSubmit = () => {
    listForm
      .validateFields()
      .then(async ({ contentList }) => {
        const list = contentList.map((item: any) => {
          if (item.isTip === 0) {
            delete item.tip;
          }
          delete item.isTip;
          delete item.contentId;
          if (item.tplType === 0) {
            item.itemlist = [];
          } else {
            delete item.speechcraft;
            item.itemlist = item.itemlist.map((market: any) => ({
              itemId: market.itemId || market.newsId || item.posterId
            }));
          }
          return item;
        });
        const res = await setHotContent({
          topicId: formValues.topicId,
          contentList: list
        });
        if (res) {
          message.success('提交成功！');
          history.goBack();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const tplTypeChange = (value: number, index: number) => {
    console.log(value, index);
    const contentList = listForm.getFieldValue('contentList');
    contentList[index].itemlist = [];
    listForm.setFieldsValue({
      contentList
    });
  };

  return (
    <div className="edit container">
      <div className={'breadcrumbWrap'}>
        <span>当前位置：</span>
        <Breadcrumb>
          <Breadcrumb.Item onClick={() => navigatorToList()}>热门专题</Breadcrumb.Item>
          <Breadcrumb.Item>配置内容</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className={styles.content}>
        <h3 className={classNames(styles.contentTitle, 'flex justify-between align-center')}>
          <div className="f18">配置内容</div>
        </h3>
        <Divider className={styles.divider} />
        <Form
          form={listForm}
          scrollToFirstError
          onValuesChange={(changedValue, values) => {
            setFormValues((formValues) => ({ ...formValues, ...values }));
          }}
        >
          <Form.List name={'contentList'}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ name }, index) => (
                  <Form.Item key={index + '-item'} className={styles.formBlock}>
                    <div
                      className={classNames('flex justify-between align-center', styles.blockHeader, styles.lineWrap)}
                    >
                      <div className="flex align-center">
                        <span>序号{index + 1}</span>
                        <span className="ml20">展示模版：</span>
                        <Form.Item name={[name, 'tplType']}>
                          <Select
                            placeholder="请选择"
                            className={styles.tmpSelect}
                            onChange={(value) => tplTypeChange(value, index)}
                          >
                            <Select.Option value={0}>纯话术</Select.Option>
                            <Select.Option value={1}>文章</Select.Option>
                            <Select.Option value={2}>海报</Select.Option>
                            <Select.Option value={3}>产品</Select.Option>
                            <Select.Option value={4}>活动</Select.Option>
                          </Select>
                        </Form.Item>
                      </div>
                      {listForm.getFieldValue('contentList').length > 1 && (
                        <Button
                          type="primary"
                          shape="round"
                          ghost
                          onClick={() => {
                            if (listForm.getFieldValue('contentList').length <= 3) {
                              message.warning('删除失败，最少需要展示三个模板');
                              return false;
                            }
                            remove(index);
                          }}
                        >
                          删除
                        </Button>
                      )}
                    </div>
                    {formValues.contentList?.[index]?.tplType !== 0
                      ? (
                      <Form.Item
                        className={styles.customItem}
                        name={[name, 'itemlist']}
                        rules={[{ required: true, type: 'array', message: '请选择内容' }]}
                      >
                        <MeatComponent type={formValues.contentList?.[index]?.tplType || 0}></MeatComponent>
                      </Form.Item>
                        )
                      : (
                      <Form.Item
                        className="mt20"
                        label="话术"
                        name={[name, 'speechcraft']}
                        rules={[
                          { required: true, message: '话术不可以为空' },
                          {
                            type: 'string',
                            max: 100,
                            message: '最多支持输入100个字符'
                          }
                        ]}
                      >
                        <MeatComponent type={formValues.contentList?.[index]?.tplType || 0}></MeatComponent>
                      </Form.Item>
                        )}

                    <Form.Item label="小贴士">
                      <div className={classNames(styles.lineWrap, 'flex')}>
                        <Form.Item name={[name, 'isTip']}>
                          <Radio.Group>
                            <Radio value={0}>无</Radio>
                            <Radio value={1}>有</Radio>
                          </Radio.Group>
                        </Form.Item>
                        {formValues.contentList?.[index]?.isTip === 1 && (
                          <Form.Item
                            name={[name, 'tip']}
                            rules={[{ type: 'string', max: 30, message: '最多支持输入30个字符' }]}
                          >
                            <Input></Input>
                          </Form.Item>
                        )}
                      </div>
                    </Form.Item>
                  </Form.Item>
                ))}
                {formValues.contentList.length < 10 && (
                  <Button
                    type="primary"
                    shape="round"
                    icon={<PlusOutlined />}
                    ghost
                    onClick={() => add({ tplType: 0, isTip: 0 })}
                  >
                    添加
                  </Button>
                )}
              </>
            )}
          </Form.List>
        </Form>
        <Button type="primary" shape="round" onClick={() => onSubmit()} className={classNames(styles.btn, 'mt20')}>
          提交
        </Button>
      </div>
    </div>
  );
};

export default HotSpecialEdit;
