/**
 * @name AddWeeklyConfig
 * @author Lester
 * @date 2021-11-06 13:49
 */
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Card, Button, Form, FormProps, Input, Select, Upload, DatePicker, message } from 'antd';
import { getQueryParam } from 'lester-tools';
import { Icon } from 'src/components';
import style from './style.module.less';

const { Item, List, useForm } = Form;
const { Option } = Select;
const { TextArea } = Input;

const AddWeeklyConfig: React.FC<RouteComponentProps> = () => {
  const [articleList, setArticle] = useState([]);
  const [editFields, setEditFields] = useState<string[]>([]);
  const [editFieldValue, setEditFieldValues] = useState<any>({});
  const [categoryMessage, setCategoryMessage] = useState<string[]>([]);

  const [form] = useForm();
  const type: string = getQueryParam('type');

  const formLayout: FormProps = {
    labelAlign: 'right',
    labelCol: { span: 4 },
    wrapperCol: { span: 8 }
  };

  const chineseNumbers = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

  const getWeeklyDetail = async () => {
    const id: string = getQueryParam('id');
    console.log(id);
    form.setFieldsValue({
      thisWeek: '本周快讯',
      newsList: [{}, {}, {}, {}, {}, {}],
      categoryList: [{}]
    });
    setEditFieldValues({
      thisWeek: '本周快讯'
    });
  };

  const onSubmit = (values: any) => {
    console.log(values);
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e.slice(e.length - 1);
    }
    return e && e.fileList.slice(e.fileList.length - 1);
  };

  const beforeUpload = (file: any) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只允许上传JPG/PNG文件!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  /**
   * 编辑字段处理
   * @param filed
   * @param type 0-编辑 1-取消编辑
   */
  const editHandle = (filed: string, type: number) => {
    if (type === 0) {
      setEditFields([...editFields, filed]);
    } else {
      setEditFields(editFields.filter((val) => val !== filed));
    }
  };

  const isEdit = (filed: string) => editFields.includes(filed);

  useEffect(() => {
    getWeeklyDetail();
    console.log(setArticle, articleList, Option, categoryMessage);
    setCategoryMessage([]);
  }, []);

  return (
    <Card title="新增周报配置">
      <Form className={style.formWrap} form={form} onFinish={onSubmit} {...formLayout}>
        <Item name="title" label="周报标题">
          <Input disabled={+type === 1} placeholder="如不填则采用机构名称+为您精选" maxLength={32} allowClear />
        </Item>
        <Item name="title" label="分享副标题">
          <Input disabled={+type === 1} placeholder="如无则默认为“查看更多" allowClear />
        </Item>
        <Item
          name="shareImg"
          label="分享主图"
          rules={[{ required: true, message: '请上传图片' }]}
          getValueFromEvent={normFile}
          valuePropName="fileList"
          extra="为确保最佳展示效果，请上传154*154像素高清图片，仅支持.jpg和.png格式"
        >
          <Upload
            accept="image/*"
            disabled={+type === 1}
            listType="picture-card"
            action="/tenacity-admin/api/file/upload"
            data={{ bizKey: 'news' }}
            beforeUpload={beforeUpload}
          >
            <div className={style.uploadBtn}>
              <div className={style.uploadCircle}>
                <Icon className={style.uploadIcon} name="icon_daohang_28_jiahaoyou" />
              </div>
              <div className={style.gray}>上传图片</div>
            </div>
          </Upload>
        </Item>
        <Item name="publishTime" label="推送时间">
          <DatePicker showTime placeholder="请选择推送时间" allowClear />
        </Item>
        <section className={style.sectionWrap}>
          <div className={style.titleWrap}>
            {isEdit('thisWeek')
              ? (
              <Item name="thisWeek">
                <Input
                  placeholder="请输入"
                  maxLength={12}
                  allowClear
                  onKeyDown={({ keyCode }) => {
                    if (keyCode === 13) {
                      editHandle('thisWeek', 1);
                      setEditFieldValues({
                        ...editFieldValue,
                        thisWeek: form.getFieldValue('thisWeek')
                      });
                    }
                  }}
                  onBlur={() => {
                    editHandle('thisWeek', 1);
                    setEditFieldValues({
                      ...editFieldValue,
                      thisWeek: form.getFieldValue('thisWeek')
                    });
                  }}
                />
              </Item>
                )
              : (
              <>
                <strong>{editFieldValue.thisWeek}</strong>
                <div className={style.editBtn} onClick={() => editHandle('thisWeek', 0)}>
                  <Icon name="bianji" />
                  编辑
                </div>
              </>
                )}
          </div>
          <List name="newsList">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Item key={field.key} className={style.formItemWrap} wrapperCol={{ span: 10 }}>
                    <Item noStyle shouldUpdate={(prevValues, curValues) => prevValues.newsList !== curValues.newsList}>
                      <Item
                        {...field}
                        labelCol={{ span: 7 }}
                        wrapperCol={{ span: 15 }}
                        label={`新闻${chineseNumbers[index]}`}
                        name={[field.name, 'title']}
                        fieldKey={[field.fieldKey, 'title']}
                        rules={[{ required: true, message: '请输入' }]}
                        className={style.listFormItem}
                      >
                        <TextArea
                          placeholder="请输入"
                          showCount
                          maxLength={100}
                          autoSize={{ minRows: 3, maxRows: 4 }}
                        />
                      </Item>
                    </Item>
                    <Item
                      {...field}
                      labelCol={{ span: 7 }}
                      wrapperCol={{ span: 15 }}
                      label={`解读${chineseNumbers[index]}`}
                      name={[field.name, 'desc']}
                      fieldKey={[field.fieldKey, 'desc']}
                      rules={[{ required: true, message: '请输入' }]}
                      className={style.listFormItem}
                    >
                      <TextArea placeholder="请输入" showCount maxLength={200} autoSize={{ minRows: 4, maxRows: 6 }} />
                    </Item>
                    {+type === 0 && index > 5 && (
                      <Icon
                        className={style.deleteIcon}
                        name="cangpeitubiao_shanchu"
                        onClick={() => remove(field.name)}
                      />
                    )}
                  </Item>
                ))}
                {+type === 0 && (
                  <Item wrapperCol={{ offset: 3 }}>
                    <Button
                      className={style.addBtn}
                      onClick={() => {
                        const value = form.getFieldValue('newsList');
                        if (value && value.length >= 10) {
                          message.warn('最多可配置10个快讯！');
                        } else {
                          add();
                        }
                      }}
                    >
                      <Icon className={style.addIcon} name="icon_daohang_28_jiahaoyou" />
                      新建
                    </Button>
                  </Item>
                )}
              </>
            )}
          </List>
          <List name="categoryList">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <section key={field.key} className={style.sectionWrap}>
                    <div className={style.titleWrap}></div>
                    <Item className={style.formItemWrap} wrapperCol={{ span: 10 }}>
                      <Item
                        noStyle
                        shouldUpdate={(prevValues, curValues) => prevValues.newsList !== curValues.newsList}
                      >
                        <Item
                          {...field}
                          labelCol={{ span: 7 }}
                          wrapperCol={{ span: 15 }}
                          label={`新闻${chineseNumbers[index]}`}
                          name={[field.name, 'title']}
                          fieldKey={[field.fieldKey, 'title']}
                          rules={[{ required: true, message: '请输入' }]}
                          className={style.listFormItem}
                        >
                          <TextArea
                            placeholder="请输入"
                            showCount
                            maxLength={100}
                            autoSize={{ minRows: 3, maxRows: 4 }}
                          />
                        </Item>
                      </Item>
                      <Item
                        {...field}
                        labelCol={{ span: 7 }}
                        wrapperCol={{ span: 15 }}
                        label={`解读${chineseNumbers[index]}`}
                        name={[field.name, 'desc']}
                        fieldKey={[field.fieldKey, 'desc']}
                        rules={[{ required: true, message: '请输入' }]}
                        className={style.listFormItem}
                      >
                        <TextArea
                          placeholder="请输入"
                          showCount
                          maxLength={200}
                          autoSize={{ minRows: 4, maxRows: 6 }}
                        />
                      </Item>
                      {+type === 0 && index > 5 && (
                        <Icon
                          className={style.deleteIcon}
                          name="cangpeitubiao_shanchu"
                          onClick={() => remove(field.name)}
                        />
                      )}
                    </Item>
                  </section>
                ))}
                {+type === 0 && (
                  <Item wrapperCol={{ offset: 3 }}>
                    <Button
                      className={style.addBtn}
                      onClick={() => {
                        const value = form.getFieldValue('categoryList');
                        if (value && value.length >= 6) {
                          message.warn('最多可配置6个分类！');
                        } else {
                          add();
                        }
                      }}
                    >
                      <Icon className={style.addIcon} name="icon_daohang_28_jiahaoyou" />
                      新建
                    </Button>
                  </Item>
                )}
              </>
            )}
          </List>
        </section>
        <div className={style.btnWrap}>
          <Button type="primary">保存</Button>
          <Button>预览</Button>
        </div>
      </Form>
    </Card>
  );
};

export default AddWeeklyConfig;
