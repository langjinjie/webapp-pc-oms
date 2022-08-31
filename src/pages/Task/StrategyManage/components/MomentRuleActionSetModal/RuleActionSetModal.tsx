import { Button, Form, message, Radio, Select } from 'antd';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Icon, NgModal } from 'src/components';
import { MomentSelectComponent } from './components/MomentSelectComponent';
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

const MomentRuleActionSetModal: React.FC<RuleActionSetModalProps> = ({
  value,
  onCancel,
  onChange,
  hideBtn,
  isReadonly,
  ...props
}) => {
  const [values, setValues] = useState<any>({
    contentType: 11
  });
  const [actionForm] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [selectRowKeys, setSelectRowKeys] = useState<React.Key[]>([]);
  const [selectRows, setSelectRows] = useState<any[]>([]);

  const handleOk = () => {
    actionForm.validateFields().then((values) => {
      // 对表单数据进行拷贝，防止污染表单渲染
      const copyData = JSON.parse(JSON.stringify(values));
      const { contentSource } = copyData;
      // 1. 判断来源
      // 公有库
      if (contentSource === 1) {
        if (selectRows.length === 0) return message.warning('请选择营销素材');
        copyData.feedId = selectRowKeys[0];
        onChange?.(copyData);
      } else {
        // 私有库
        if (selectRows.length === 0) return message.warning('请选择营销素材');
        copyData.feedId = selectRowKeys[0];
        onChange?.(copyData);
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
    if (values.contentSource === 1) return;
    const copyRow = [...selectRows];
    const copyKeys = [...selectRowKeys];
    copyRow.splice(index, 1);
    copyKeys.splice(index, 1);
    setSelectRows(copyRow);
    setSelectRowKeys(copyKeys);
  };

  const onContentChange = (value: string) => {
    console.log(value);
    setSelectRows([]);
    setSelectRowKeys([]);
    actionForm.setFieldsValue({ categoryId: undefined });
  };

  useEffect(() => {
    if (value && (!!visible || !!props.visible)) {
      setValues(value);
      console.log(value);

      setSelectRows([
        {
          itemId: value?.feedId,
          itemName: value?.feedName
        }
      ]);
      setSelectRowKeys(value?.feedId ? [value?.feedId] : []);

      actionForm.setFieldsValue({
        ...value
      });
    }
  }, [visible, value, props.visible]);

  const contentSourceChange = (value: number) => {
    console.log(value);
  };

  // 海报选中
  const posterSelectChange = (keys: React.Key[], rows: any[]) => {
    setSelectRowKeys(keys);
    // 针对海报选中未加载的数据进行过滤重组处理
    const res = rows.filter((row) => row !== undefined);
    const filterKeys = keys.filter((key) => !res.map((item) => item.itemId).includes(key));

    const filterRows = selectRows.filter((row) => filterKeys.includes(row.itemId!));
    setSelectRows([...res, ...filterRows]);
  };

  return (
    <>
      {!hideBtn && (
        <>
          {value?.contentType
            ? (
            <div
              className={classNames('text-primary ellipsis', { disabled: isReadonly })}
              title={'发' + contentTypeList.filter((type) => type.value === value.contentType)?.[0]?.label}
              onClick={() => {
                if (isReadonly) return false;
                setVisible(true);
              }}
            ></div>
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
              <Select.Option value={1} disabled={value?.contentSource === 2}>
                公有库
              </Select.Option>
              <Select.Option value={2}>机构库</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="动作类型" name={'contentType'} rules={[{ required: true }]}>
            <Radio.Group
              onChange={(e) => onContentChange(e.target.value)}
              disabled={props.footer === null || value?.contentSource === 1}
            >
              <Radio value={11}>朋友圈Feed-文章</Radio>
              {values.contentSource === 2 && (
                <>
                  <Radio value={12}>朋友圈Feed-产品</Radio>
                  <Radio value={13}>朋友圈Feed-活动</Radio>
                </>
              )}

              <Radio value={14}>朋友圈Feed-单张海报</Radio>
              <Radio value={15}>朋友圈Feed-9宫格海报</Radio>
            </Radio.Group>
          </Form.Item>
          {values.contentSource === 2 && (
            <Form.Item label="选择内容" required>
              <Form.Item name={'contentCategory'} rules={[{ required: true, message: '请选择内容' }]}>
                <Radio.Group disabled={props.footer === null}>
                  <Radio value={1}>机构自定义配置</Radio>
                </Radio.Group>
              </Form.Item>
            </Form.Item>
          )}
        </Form>
        {values.contentType && props.footer !== null && values.contentSource === 2 && (
          <div>
            <div className={classNames(styles.marketingWarp, 'container')}>
              {
                <MomentSelectComponent
                  selectedRowKeys={selectRowKeys}
                  tplType={values.contentType}
                  onChange={posterSelectChange}
                />
              }
            </div>
          </div>
        )}
        {/* 已经选择的 */}
        {values.contentType && (
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

export default MomentRuleActionSetModal;
