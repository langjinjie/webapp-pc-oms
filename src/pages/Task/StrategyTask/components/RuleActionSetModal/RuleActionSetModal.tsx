import { Button, Form, message, Radio, Select } from 'antd';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Icon, NgModal } from 'src/components';
import { Article } from 'src/pages/Marketing/Article/Config';
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
};

interface RowProps extends Article {
  itemId?: string;
  itemName?: string;
  [prop: string]: any;
}
const RuleActionSetModal: React.FC<RuleActionSetModalProps> = ({ value, onChange, ...props }) => {
  const [values, setValues] = useState<any>({});
  const [actionForm] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [selectRowKeys, setSelectRowKeys] = useState<React.Key[]>([]);
  const [selectRows, setSelectRows] = useState<RowProps[]>([]);

  useEffect(() => {
    console.log(value);
    if (value && visible) {
      setValues(value);
      actionForm.setFieldsValue({
        ...value
      });
      if (value.contentSource === 1) {
        setSelectRows(value?.itemIds || []);
        setSelectRowKeys(value?.itemIds.map((item: any) => item.itemId) || []);
      }
    }
  }, [visible, value]);

  const handleOk = () => {
    actionForm.validateFields().then((values) => {
      // 对表单数据进行拷贝，防止污染表单渲染
      const copyData = JSON.parse(JSON.stringify(values));
      const { contentSource } = copyData;

      // 1. 判断来源
      // 公有库
      if (contentSource === 1) {
        if (selectRows.length === 0) return message.warning('请选择营销素材');
        copyData.itemIds = selectRows.map((item) => ({
          itemId: item.newsId || item.posterId,
          itemName: item.name || item.title
        }));
        onChange?.(copyData);
      } else {
        // 私有库
        onChange?.(values);
      }
      setVisible(false);
    });
  };

  const onCancel = () => {
    setVisible(false);
  };

  const onValuesChange = (changedValues: any, values: any) => {
    setValues(values);
  };

  const removeItem = (index: number) => {
    const copyRow = [...selectRows];
    const copyKeys = [...selectRowKeys];
    copyRow.splice(index, 1);
    copyKeys.splice(index, 1);
    setSelectRows(copyRow);
    setSelectRowKeys(copyKeys);
  };

  const contentSourceChange = (value: number) => {
    console.log(value);
  };

  return (
    <>
      {value?.contentType
        ? (
        <Button type="link" onClick={() => setVisible(true)}>
          {'发' + contentTypeList.filter((type) => type.value === value.contentType)[0].label}
        </Button>
          )
        : (
        <Button type="link" onClick={() => setVisible(true)}>
          配置
        </Button>
          )}

      <NgModal
        width={808}
        forceRender
        {...props}
        maskClosable={false}
        visible={visible}
        title="内容选择"
        onOk={handleOk}
        onCancel={() => onCancel()}
      >
        <Form form={actionForm} onValuesChange={onValuesChange} labelCol={{ span: 3 }}>
          <Form.Item label="内容来源" name={'contentSource'} rules={[{ required: true }]}>
            <Select className="width320" onChange={contentSourceChange} placeholder="请选择">
              <Select.Option value={1}>公有库</Select.Option>
              <Select.Option value={2}>机构库</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="动作类型" name={'contentType'}>
            <Radio.Group>
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
            <Form.Item label="选择内容">
              <Form.Item name={'contentCategory'}>
                <Radio.Group>
                  <Radio value={1}>机构自定义配置</Radio>
                  <Radio value={2}>按照规则配置</Radio>
                </Radio.Group>
              </Form.Item>
              {values.contentCategory === 2 && (
                <div className={styles.categoryWrap}>
                  <div className={styles.tipText}>按照</div>
                  <Form.Item className={styles.categoryItem} rules={[{ required: true }]} name="categoryId">
                    <Select placeholder="请选择类目">
                      <Select.Option value={1}>公有库</Select.Option>
                      <Select.Option value={2}>机构库</Select.Option>
                    </Select>
                  </Form.Item>
                  <div className={styles.tipText}>最新发布的类型</div>
                </div>
              )}
            </Form.Item>
          )}
        </Form>
        {values.contentSource === 1 && values.contentType && (
          <div>
            <div className={classNames(styles.marketingWarp, 'container')}>
              {values.contentType === 1
                ? (
                <ArticleSelectComponent
                  onChange={(keys, rows) => {
                    setSelectRowKeys(keys);
                    setSelectRows(rows);
                  }}
                />
                  )
                : values.contentType === 2
                  ? (
                <PosterSelectComponent
                  selectedRowKeys={selectRowKeys}
                  onChange={(keys, rows) => {
                    setSelectRowKeys(keys);
                    setSelectRows(rows);
                  }}
                />
                    )
                  : null}
            </div>

            {/* 已经选择的 */}
            <div>
              <div className="color-text-primary mt22">已选择</div>
              <div className={classNames(styles.marketingWarp, 'mt12')}>
                {selectRows.map((row, index) => (
                  <div
                    className={classNames(styles.customTag)}
                    key={(row.newsId || row.itemId || row.posterId) + index}
                  >
                    <span>{row.title || row.itemName || row.name}</span>
                    <Icon className={styles.closeIcon} name="biaoqian_quxiao" onClick={() => removeItem(index)}></Icon>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </NgModal>
    </>
  );
};

export default RuleActionSetModal;
