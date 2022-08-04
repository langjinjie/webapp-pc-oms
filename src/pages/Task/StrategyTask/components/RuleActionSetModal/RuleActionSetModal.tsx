import { Button, Cascader, Form, Input, message, Radio, Select } from 'antd';
import classNames from 'classnames';
import React, { useContext, useEffect, useState } from 'react';
import { getPosterCategoryList, getTagsOrCategorys, productConfig } from 'src/apis/marketing';
import { Icon, NgModal } from 'src/components';
import { Article } from 'src/pages/Marketing/Article/Config';
import { Context } from 'src/store';
import { ArticleSelectComponent } from './components/ArticleSelectComponent';
import { PosterSelectComponent } from './components/PosterSelectComponent';
import { contentTypeList } from './config';

import styles from './style.module.less';

interface ActinRuleProps {
  contentSource: number;
  contentType: number;
  contentCategory: number;
  [prop: string]: any;
}
type RuleActionSetModalProps = React.ComponentProps<typeof NgModal> & {
  value?: ActinRuleProps;
  onChange?: (value: any) => void;
  isReadonly?: boolean;
  hideBtn?: boolean;
};

interface RowProps extends Article {
  itemId?: string;
  itemName?: string;
  [prop: string]: any;
}
const RuleActionSetModal: React.FC<RuleActionSetModalProps> = ({
  value,
  onCancel,
  onChange,
  hideBtn,
  isReadonly,
  ...props
}) => {
  const { articleCategoryList, setArticleCategoryList } = useContext(Context);
  const [values, setValues] = useState<any>({});
  const [actionForm] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [selectRowKeys, setSelectRowKeys] = useState<React.Key[]>([]);
  const [selectRows, setSelectRows] = useState<RowProps[]>([]);
  const [contentTypeOptions, setContentTypeOptions] = useState<any[]>([]);

  const handleOk = () => {
    actionForm.validateFields().then((values) => {
      // 对表单数据进行拷贝，防止污染表单渲染
      const copyData = JSON.parse(JSON.stringify(values));
      const { contentSource } = copyData;
      console.log(values);
      // 1. 判断来源
      // 公有库
      if (contentSource === 1) {
        if (selectRows.length === 0) return message.warning('请选择营销素材');
        copyData.itemIds = selectRows.map((item) => ({
          ...item,
          itemId: item.newsId || item.posterId || item.itemId,
          itemName: item.name || item.title || item.itemName
        }));
        onChange?.(copyData);
      } else {
        // 私有库
        onChange?.(values);
      }
      setVisible(false);
    });
  };

  const handleCancel = (e: any) => {
    setVisible(false);
    onCancel?.(e);
  };

  const onValuesChange = (changedValues: any, values: any) => {
    if (changedValues.contentType === 4 || changedValues.contentType === 5) {
      actionForm.setFieldsValue({
        contentCategory: 1
      });
    }

    setValues({
      ...values,
      contentCategory: changedValues.contentType === 4 || changedValues.contentType === 5 ? 1 : values.contentCategory
    });
  };

  const removeItem = (index: number) => {
    const copyRow = [...selectRows];
    const copyKeys = [...selectRowKeys];
    copyRow.splice(index, 1);
    copyKeys.splice(index, 1);
    setSelectRows(copyRow);
    setSelectRowKeys(copyKeys);
  };

  const getActionTypeList = async (actionType: number) => {
    // 文章
    if (actionType === 1) {
      if (articleCategoryList.length > 0) {
        setContentTypeOptions(articleCategoryList);
      } else {
        const res = await getTagsOrCategorys({ type: 'category' });
        if (res) {
          setContentTypeOptions(res);
          setArticleCategoryList(res);
        }
      }
      // 海报
    } else if (actionType === 2) {
      const res = (await getPosterCategoryList({})) || [];
      setContentTypeOptions(res);
      // 产品
    } else if (actionType === 3) {
      const res = await productConfig({ type: [1] });
      if (res) {
        setContentTypeOptions(res.productTypeList || []);
      }
    }
  };

  const onContentChange = (contentType: number) => {
    getActionTypeList(contentType);
    setSelectRows([]);
    setSelectRowKeys([]);
    actionForm.setFieldsValue({ categoryId: undefined });
  };

  useEffect(() => {
    if (value && (!!visible || !!props.visible)) {
      setValues(value);

      if (value.contentSource === 1) {
        setSelectRows(value?.itemIds || []);
        setSelectRowKeys(value?.itemIds.map((item: any) => item.itemId) || []);
      }
      if (value.contentSource === 2 && value.contentCategory === 2) {
        getActionTypeList(value.contentType);
        value.categoryId =
          typeof value?.categoryId === 'string' && value?.categoryId?.indexOf(';') > -1
            ? value.categoryId?.split(';')
            : value.categoryId;
      }

      actionForm.setFieldsValue({
        ...value
      });
    }
  }, [visible, value, props.visible]);

  const contentSourceChange = (value: number) => {
    console.log(value);
  };

  const posterTypeChange = (values: any, selectedOptions: any) => {
    actionForm.setFieldsValue({
      category: selectedOptions ? selectedOptions.map((item: any) => item.name).join(';') : ''
    });
  };
  const catagoryChange = (option: any) => {
    actionForm.setFieldsValue({
      category: option.children
    });
  };

  const onContentCategoryChange = (value: number) => {
    if (value === 2) {
      getActionTypeList(values.contentType);
    }
  };

  // 海报选中
  const posterSelectChange = (keys: React.Key[], rows: any[]) => {
    setSelectRowKeys(keys);
    // 针对海报选中未加载的数据进行过滤重组处理
    const res = rows.filter((row) => row !== undefined);
    const filterKeys = keys.filter((key) => !res.map((item) => item.posterId).includes(key));

    const filterRows = selectRows.filter((row) => filterKeys.includes(row.itemId!));
    setSelectRows([...res, ...filterRows]);
  };

  return (
    <>
      {!hideBtn && (
        <>
          {value?.contentType
            ? (
            <Button type="link" disabled={isReadonly} onClick={() => setVisible(true)}>
              {'发' + contentTypeList.filter((type) => type.value === value.contentType)[0].label}
            </Button>
              )
            : (
            <Button type="link" onClick={() => setVisible(true)}>
              配置
            </Button>
              )}
        </>
      )}

      <NgModal
        width={808}
        forceRender
        {...props}
        maskClosable={!!props.visible}
        visible={visible || props.visible}
        title="内容选择"
        onOk={handleOk}
        onCancel={(e) => handleCancel(e)}
      >
        <Form form={actionForm} onValuesChange={onValuesChange} labelCol={{ span: 3 }}>
          <Form.Item label="内容来源" name={'contentSource'} rules={[{ required: true }]}>
            <Select
              className="width320"
              onChange={contentSourceChange}
              placeholder="请选择"
              disabled={props.footer === null}
            >
              <Select.Option value={1}>公有库</Select.Option>
              <Select.Option value={2}>机构库</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="动作类型" name={'contentType'} rules={[{ required: true }]}>
            <Radio.Group onChange={(e) => onContentChange(e.target.value)} disabled={props.footer === null}>
              <Radio value={1}>文章</Radio>
              <Radio value={2}>海报</Radio>
              {values.contentSource === 2 && (
                <>
                  <Radio value={3}>产品</Radio>
                  <Radio value={4}>活动</Radio>
                  <Radio value={5}>话术</Radio>
                </>
              )}
            </Radio.Group>
          </Form.Item>
          {values.contentSource === 2 && (
            <Form.Item label="选择内容" required>
              <Form.Item name={'contentCategory'} rules={[{ required: true, message: '请选择内容' }]}>
                <Radio.Group
                  disabled={props.footer === null}
                  onChange={(e) => {
                    setSelectRows([]);
                    setSelectRowKeys([]);
                    onContentCategoryChange(e.target.value);
                  }}
                >
                  <Radio value={1}>机构自定义配置</Radio>
                  {values.contentType < 4 && <Radio value={2}>按照规则配置</Radio>}
                </Radio.Group>
              </Form.Item>
              {values.contentCategory === 2 && (
                <div className={styles.categoryWrap}>
                  <div className={styles.tipText}>按照</div>
                  {values.contentType === 2
                    ? (
                    <Form.Item
                      className={styles.categoryItem}
                      rules={[{ required: true, type: 'array', message: '请选择分类' }]}
                      name="categoryId"
                    >
                      <Cascader
                        disabled={props.footer === null}
                        placeholder="请选择"
                        options={contentTypeOptions}
                        onChange={posterTypeChange}
                        fieldNames={{
                          label: 'name',
                          value: 'typeId',
                          children: 'childs'
                        }}
                      />
                    </Form.Item>
                      )
                    : (
                    <Form.Item
                      className={styles.categoryItem}
                      rules={[{ required: true, message: '请选择分类' }]}
                      name="categoryId"
                    >
                      <Select
                        disabled={props.footer === null}
                        placeholder="请选择类目"
                        onChange={(value, options) => {
                          catagoryChange(options);
                        }}
                      >
                        {contentTypeOptions.map((option) => (
                          <Select.Option key={option.id} value={option.id + ''}>
                            {option.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                      )}
                  <Form.Item hidden name={'category'}>
                    <Input></Input>
                  </Form.Item>

                  <div className={styles.tipText}>最新发布的内容</div>
                </div>
              )}
            </Form.Item>
          )}
        </Form>
        {values.contentSource === 1 && values.contentType && props.footer !== null && (
          <div>
            <div className={classNames(styles.marketingWarp, 'container')}>
              {values.contentType === 1
                ? (
                <ArticleSelectComponent
                  selectedRowKeys={selectRowKeys}
                  onChange={(keys, rows) => {
                    setSelectRowKeys(keys);
                    setSelectRows(rows);
                  }}
                />
                  )
                : values.contentType === 2
                  ? (
                <PosterSelectComponent selectedRowKeys={selectRowKeys} onChange={posterSelectChange} />
                    )
                  : null}
            </div>
          </div>
        )}
        {/* 已经选择的 */}
        {values.contentSource === 1 && values.contentType && (
          <div>
            <div className="color-text-primary mt22">已选择</div>
            <div className={classNames(styles.marketingWarp, 'mt12')}>
              {selectRows.map((row, index) => (
                <div className={classNames(styles.customTag)} key={(row.newsId || row.itemId || row.posterId) + index}>
                  <span>{row.title || row.itemName || row.name}</span>
                  <Icon className={styles.closeIcon} name="biaoqian_quxiao" onClick={() => removeItem(index)}></Icon>
                </div>
              ))}
            </div>
          </div>
        )}
      </NgModal>
    </>
  );
};

export default RuleActionSetModal;
