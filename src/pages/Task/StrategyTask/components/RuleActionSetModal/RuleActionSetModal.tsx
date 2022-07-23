import { Button, Form, message, PaginationProps, Radio, Select } from 'antd';
import classNames from 'classnames';
import React, { useContext, useEffect, useState } from 'react';
import { getNewsList, getTagsOrCategorys } from 'src/apis/marketing';
import { Icon, NgFormSearch, NgModal, NgTable } from 'src/components';
import { Article } from 'src/pages/Marketing/Article/Config';
import { Context } from 'src/store';
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
}
const RuleActionSetModal: React.FC<RuleActionSetModalProps> = ({ value, onChange, ...props }) => {
  const { articleCategoryList, setArticleCategoryList } = useContext(Context);
  const [values, setValues] = useState<any>({});
  const [actionForm] = Form.useForm();
  const [visible, setVisible] = useState(true);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [selectRowKeys, setSelectRowKeys] = useState<React.Key[]>([]);
  const [selectRows, setSelectRows] = useState<RowProps[]>([]);
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 9,
    total: 0,
    simple: true
  });
  useEffect(() => {
    if (value) {
      setValues(value);
      actionForm.setFieldsValue({
        ...value
      });
      if (value.contentSource === 1) {
        setSelectRows(value?.itemIds || []);
        setSelectRowKeys(value?.itemIds.map((item: any) => item.itemId) || []);
      }
    }
  }, [value]);
  const asyncGetTagsOrCategory = async () => {
    try {
      if (articleCategoryList.length > 0) return;
      const res = await getTagsOrCategorys({ type: 'category' });
      if (res) {
        setArticleCategoryList(res);
      }
    } catch (err) {
      // throw Error(err);
    }
  };

  useEffect(() => {
    asyncGetTagsOrCategory();
  }, []);

  const handleOk = () => {
    actionForm.validateFields().then((values) => {
      // 对表单数据进行拷贝，防止污染表单渲染
      const copyData = JSON.parse(JSON.stringify(values));
      const { contentSource } = copyData;

      // 1. 判断来源
      // 公有库
      if (contentSource === 1) {
        if (selectRowKeys.length === 0) return message.warning('请选择营销素材');
        copyData.itemIds = selectRowKeys.map((key) => ({ itemId: key }));
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

  const getList = async (params?: any) => {
    const pageNum = params.pageNum || pagination.current;
    const res = await getNewsList({
      syncBank: 1,
      pageSize: pagination.pageSize,
      ...params,
      pageNum
    });
    if (res) {
      const { newsList: list, total } = res;
      setDataSource(list || []);
      setPagination((pagination) => ({ ...pagination, total, current: pageNum }));
    }
  };
  const onSearch = async (values: any) => {
    getList({ ...values, pageNum: 1 });
  };

  const paginationChange = (pageNum: number) => {
    setPagination((pagination) => ({ ...pagination, current: pageNum }));
    getList({ pageNum });
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

  const onSelectChange = (selectedRowKeys: React.Key[], selectedRows: Article[]) => {
    console.log(selectRows, selectRowKeys);
    setSelectRowKeys(selectedRowKeys);
    setSelectRows(selectedRows);
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
        {/* {values.contentSource === 1 && ( */}
        <div>
          <div className={classNames(styles.marketingWarp, 'container')}>
            <NgFormSearch
              onSearch={onSearch}
              searchCols={[
                {
                  name: 'title',
                  type: 'input',
                  label: '文章名称',
                  width: '200px',
                  placeholder: '待输入'
                },
                {
                  name: 'categoryId',
                  type: 'select',
                  label: '文章分类',
                  options: articleCategoryList,
                  width: '200px',
                  placeholder: '待输入'
                }
              ]}
              hideReset
            />
            <NgTable
              className="mt20"
              size="small"
              scroll={{ x: 600 }}
              dataSource={dataSource}
              bordered
              pagination={pagination}
              rowSelection={{
                type: 'radio',
                onChange: (selectedRowKeys: React.Key[], selectedRows: Article[]) => {
                  onSelectChange(selectedRowKeys, selectedRows);
                }
              }}
              rowKey="newsId"
              paginationChange={paginationChange}
              columns={[
                { title: '文章名称', dataIndex: 'title', key: 'title', width: 300 },
                {
                  title: '文章分类',
                  dataIndex: 'tagNameList',
                  key: 'tagNameList',
                  width: 100
                },
                {
                  title: '详情',

                  width: 80,
                  render: (text: string, record: any) => (
                    <Button
                      type="link"
                      onClick={() => {
                        console.log(record);
                      }}
                    >
                      详情
                    </Button>
                  )
                }
              ]}
            ></NgTable>
          </div>

          {/* 已经选择的 */}
          <div>
            <div className="color-text-primary mt22">已选择</div>
            <div className={classNames(styles.marketingWarp, 'mt12')}>
              {selectRows.map((row, index) => (
                <div className={classNames(styles.customTag)} key={row.newsId || row.itemId}>
                  <span>{row.title || row.itemName}</span>
                  <Icon className={styles.closeIcon} name="biaoqian_quxiao" onClick={() => removeItem(index)}></Icon>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* )} */}
      </NgModal>
    </>
  );
};

export default RuleActionSetModal;
