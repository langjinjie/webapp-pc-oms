import React, { useEffect, useMemo, useState } from 'react';
import { Button, Form, Input, Radio, Tooltip, message } from 'antd';
import { Icon, NgModal, NgTable } from 'src/components';
import { IFeeds } from 'src/pages/Marketing/TodayMoment/AddMoment/AddMoment';
import { getMomentList } from 'src/apis/marketing';
import { tplTypeOptions } from 'src/pages/Marketing/Moment/ListConfig';
import { PaginationProps } from 'antd/es/pagination';
import { UNKNOWN } from 'src/utils/base';
import classNames from 'classnames';
import styles from './style.module.less';

interface ActinRuleProps {
  contentType: number; // 内容类型，1-文章，2-产品，3-活动，4-单张海报，5-9宫格海报
  feeds: (IFeeds & { name?: string })[];
}
type RuleActionSetModalProps = React.ComponentProps<typeof NgModal> & {
  value?: ActinRuleProps;
  onChange?: (value: any) => void;
  isReadonly?: boolean;
};

const MomentRuleActionSetModal: React.FC<RuleActionSetModalProps> = ({ value, onCancel, onChange, isReadonly }) => {
  const [visible, setVisible] = useState(false);
  const [selectRowKeys, setSelectRowKeys] = useState<React.Key[]>([]);
  const [selectRows, setSelectRows] = useState<(IFeeds & { name?: string })[]>([]);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [formValues, setFormValues] = useState<{ [key: string]: any }>({});
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0,
    simple: true
  });

  const [form] = Form.useForm();

  const onResetHandle = () => {
    setDataSource([]);
    setFormValues({});
    setSelectRows([]);
    setSelectRowKeys([]);
    form.setFieldsValue({ tplType: 1, name: undefined });
    setFormValues({ tplType: 1 });
  };

  const getList = async (params?: any) => {
    const res = await getMomentList(params);
    if (res) {
      const { total, list } = res;
      setDataSource(list);
      setPagination((pagination) => ({ ...pagination, total }));
    }
  };

  const onFinishHandle = (values?: any) => {
    getList(values);
    setFormValues(values);
  };

  const handleCancel = (e: any) => {
    setVisible(false);
    onCancel?.(e);
  };

  const removeItem = (feedId: string) => {
    setSelectRows(selectRows.filter(({ feedId: rowFeedId }) => rowFeedId !== feedId));
    setSelectRowKeys(selectRowKeys.filter((key) => key !== feedId));
  };

  const onValuesChange = (value: any) => {
    if (Object.keys(value).includes('tplType')) {
      setSelectRows([]);
      setSelectRowKeys([]);
      form.setFieldsValue({ name: undefined });
      setFormValues((formValues) => ({ ...formValues, tplType: value.tplType }));
      getList(value);
    }
  };

  const onSelectChange = (selectedRowKeys: React.Key[], selectedRows: any[]) => {
    // 单张海报能多选
    if (+formValues.tplType === 4) {
      const curListKeys = dataSource.map(({ feedId }) => feedId);
      const noCurPageSelectKeys = selectRowKeys.filter((key) => !curListKeys.includes(key));
      const noCurPageSelectRows = selectRows.filter(({ feedId }) => !curListKeys.includes(feedId));
      const newSelectRowKeys = [...noCurPageSelectKeys, ...selectedRowKeys];
      if (newSelectRowKeys.length > 5) return message.warning('单张海报最多选择5张');
      setSelectRowKeys(newSelectRowKeys);
      setSelectRows([...noCurPageSelectRows, ...selectedRows]);
    } else {
      setSelectRowKeys(selectedRowKeys);
      setSelectRows(selectedRows);
    }
  };

  const paginationChange = (pageNum: number) => {
    setPagination((pagination) => ({ ...pagination, current: pageNum }));
    getList({ ...formValues, pageNum });
  };

  const handleOk = () => {
    console.log('selectRows', selectRows);
    onChange?.({ contentType: +formValues.tplType, feeds: selectRows });
    setVisible(false);
    onResetHandle();
  };

  const feedName = useMemo(() => {
    return `${(value?.feeds || [])
      // 列表的内容名称为name字段，编辑时候后端返回的朋友圈内容名称字段为feedName
      .map(({ feedName, name }) => feedName || name)
      .toString()
      .replace(/,/g, '，')}`;
  }, [value]);

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({ tplType: value?.contentType || 1 });
      setFormValues({ tplType: value?.contentType || 1 });
      getList({ tplType: value?.contentType || 1 });
      setSelectRowKeys((value?.feeds?.map(({ feedId }) => feedId) as string[]) || []);
      setSelectRows(value?.feeds || []);
    } else {
      onResetHandle();
    }
  }, [visible]);

  return (
    <>
      {(value?.feeds || []).length !== 0 && value?.contentType
        ? (
        <div
          className={classNames(styles.momentValue, 'text-primary pointer ellipsis', { disabled: isReadonly })}
          title={feedName}
          onClick={() => {
            if (isReadonly) return false;
            setVisible(true);
          }}
        >
          <span className={styles.titleTag}>{tplTypeOptions.find((type) => type.id === value?.contentType)?.name}</span>
          {feedName}
        </div>
          )
        : (
        <div className={styles.placeholder} onClick={() => setVisible(true)}>
          点击选择朋友圈内容库内容
        </div>
          )}

      <NgModal
        width={710}
        maskClosable={visible}
        visible={visible}
        title="内容选择"
        onOk={handleOk}
        onCancel={(e) => handleCancel(e)}
      >
        <Form form={form} onFinish={onFinishHandle} layout="inline" onValuesChange={onValuesChange}>
          <Form.Item name="tplType" label="内容类型" initialValue={1}>
            <Radio.Group>
              {tplTypeOptions.map(({ id, name }) => (
                <Radio key={id} value={id}>
                  {name}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
          <div className={styles.feedList}>
            <div className="flex">
              <Form.Item name="name" label="内容名称">
                <Input className="width320" placeholder="请输入" />
              </Form.Item>
              <Button className={styles.searchBtn} type="primary" htmlType="submit">
                查询
              </Button>
              <Button
                className={styles.resetBtn}
                onClick={() => {
                  form.setFieldsValue({ name: undefined });
                  setFormValues((formValues) => ({ ...formValues, name: '' }));
                  setPagination((pagination) => ({ ...pagination, current: 1 }));
                  getList({ tplType: formValues.tplType });
                }}
              >
                重置
              </Button>
            </div>
            <NgTable
              className="mt20"
              size="small"
              scroll={{ x: 600 }}
              rowSelection={{
                hideSelectAll: true,
                type: +formValues.tplType === 4 ? 'checkbox' : 'radio',
                preserveSelectedRowKeys: true,
                selectedRowKeys: selectRowKeys,

                onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
                  const rows = selectedRows.map((item) => ({
                    ...item,
                    itemId: item?.feedId,
                    itemName: item?.name
                  }));
                  onSelectChange(selectedRowKeys, rows);
                }
              }}
              columns={[
                {
                  title: '名称',
                  dataIndex: 'name',
                  align: 'left',
                  width: 500,
                  ellipsis: {
                    showTitle: false
                  },
                  render: (name: string) => (
                    <Tooltip placement="topLeft" title={name}>
                      {name || UNKNOWN}
                    </Tooltip>
                  )
                }
              ]}
              dataSource={dataSource}
              pagination={pagination}
              paginationChange={paginationChange}
              rowKey="feedId"
            />
          </div>
        </Form>

        {/* 已经选择的 */}
        <div>
          <div className="color-text-primary mt22">已选择</div>
          <div className={classNames(styles.marketingWarp, 'mt12')}>
            {selectRows.map(({ feedId, feedName, name }) => (
              <div className={classNames(styles.customTag)} key={feedId}>
                <span>{feedName || name}</span>
                <Icon className={styles.closeIcon} name="biaoqian_quxiao" onClick={() => removeItem(feedId)}></Icon>
              </div>
            ))}
          </div>
        </div>
      </NgModal>
    </>
  );
};

export default MomentRuleActionSetModal;
