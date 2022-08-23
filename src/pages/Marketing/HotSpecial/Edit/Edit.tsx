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
  }>({ contentList: [], topicId: '' });
  const getDetail = async () => {
    const { topicId } = URLSearchParams(location.search) as { topicId: string };
    const res = await getHotContentDetail({ topicId });
    if (res) {
      const { contentList } = res;
      const resList = contentList.map((item: any) => {
        item.isTip = item.tip ? 1 : 0;
        return item;
      });
      listForm.setFieldsValue({
        contentList: resList.length > 0 ? resList : [{ tplType: 0 }]
      });
      setFormValues({ contentList: resList.length > 0 ? resList : [{ tplType: 0 }], topicId });
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
            item.itemlist = item.itemlist.map((market: any) => ({ itemId: market.itemId }));
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
          <Button type="primary" shape="round" onClick={() => onSubmit()} className={styles.btn}>
            提交
          </Button>
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
                          <Select placeholder="请选择" className={styles.tmpSelect}>
                            <Select.Option value={0}>纯话术</Select.Option>
                            <Select.Option value={1}>文章</Select.Option>
                            <Select.Option value={2}>海报</Select.Option>
                            <Select.Option value={3}>产品</Select.Option>
                            <Select.Option value={4}>活动</Select.Option>
                          </Select>
                        </Form.Item>
                      </div>
                      {listForm.getFieldValue('contentList').length > 1 && (
                        <Button type="primary" shape="round" ghost onClick={() => remove(index)}>
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
                        rules={[{ required: true, message: '话术不可以为空' }]}
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
                          <Form.Item name={[name, 'tip']}>
                            <Input></Input>
                          </Form.Item>
                        )}
                      </div>
                    </Form.Item>
                  </Form.Item>
                ))}

                <Button type="primary" shape="round" icon={<PlusOutlined />} ghost onClick={() => add({ tplType: 0 })}>
                  添加
                </Button>
              </>
            )}
          </Form.List>
        </Form>
      </div>
    </div>
  );
};

export default HotSpecialEdit;
