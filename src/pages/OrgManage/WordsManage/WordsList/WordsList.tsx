import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Select, Space, Button, Input, Card } from 'antd';
import { NgTable } from 'src/components/index';
import style from './style.module.less';

const WordsList: React.FC = () => {
  const [form] = Form.useForm();
  const [searchParam, setSearchParam] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsloading] = useState(true);
  const [wordsList, setWrodsList] = useState<any>([]);
  const [paginationParam, setPaginationParam] = useState({ current: 1, pageSize: 10 });
  const [disabledColumnType, setDisabledColumnType] = useState('2');
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  const history = useHistory();

  // 单个新增/编辑
  const singleAdd = (type: string) => {
    history.push('/wordsManage/editWords?type=' + type);
  };

  const wordsTypeList = [
    { value: '**A', label: '**A' },
    { value: '**B', label: '**B' },
    { value: '**C', label: '**C' }
  ];
  const statusList = [
    { value: '1', label: '未上架' },
    { value: '2', label: '已上架' },
    { value: '4', label: '已下架' }
  ];
  const columns: any[] = [
    { title: '敏感词类型', dataIndex: 'wrodsType' },
    { title: '敏感词内容', dataIndex: 'wordsContent' },
    { title: '创建时间', dataIndex: 'createdTime' },
    { title: '创建人', dataIndex: 'creater' },
    { title: '更新时间', dataIndex: 'updateTime' },
    { title: '更新人', dataIndex: 'updater' },
    { title: '状态', dataIndex: 'status' },
    {
      title: '操作',
      fixed: 'right',
      render () {
        return (
          <span className={style.edit} onClick={() => singleAdd('edit')}>
            编辑
          </span>
        );
      }
    }
  ];
  // 获取敏感词列表
  const getWordsList = (current: number, pageSize: number) => {
    console.log(current, pageSize, '获取敏感词列表');
    setSearchParam(form.getFieldsValue());
    const wordsListItem = {
      wrodsType: '监管合规',
      wordsContent: '免费',
      createdTime: '2021-11-11',
      creater: 'jeff',
      updateTime: '2021-11-11',
      updater: 'jeff',
      status: '未上架'
    };
    const wordsList = new Array(51);
    wordsList.fill(wordsListItem);
    setWrodsList(wordsList);
    setIsloading(false);
  };
  // 切换分页
  const paginationChange = (value: number, pageSize?: number) => {
    console.log('切换分页');
    getWordsList(value, pageSize as number);
    setPaginationParam({ current: value, pageSize: pageSize as number });
    setSelectedRowKeys([]);
    const { accountStatus } = searchParam;
    setDisabledColumnType(accountStatus === undefined ? '2' : accountStatus === '1' ? '4' : '1');
  };
  // 分页器参数
  const pagination = {
    total: wordsList.length,
    current: paginationParam.current
  };
  // 点击选择框
  const onSelectChange = (newSelectedRowKeys: unknown[]) => {
    console.log('点击选择框');
    if (newSelectedRowKeys.length) {
      !selectedRowKeys.length && setDisabledColumnType('0');
      setSelectedRowKeys(newSelectedRowKeys as string[]);
    } else {
      setSelectedRowKeys([]);
      setDisabledColumnType('2');
    }
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    hideSelectAll: false, // 是否显示全选
    getCheckboxProps: (record: any) => ({
      disabled: record.accountStatus === '2' || record.accountStatus === disabledColumnType,
      name: ''
    })
  };
  // 查询
  const onFinish = () => {
    console.log('查询了');
    console.log(form.getFieldsValue());
  };
  // 重置
  const onReset = () => {
    console.log('重置了');
  };
  useEffect(() => {
    getWordsList(paginationParam.current, paginationParam.pageSize);
  }, []);
  return (
    <div className={style.wrap}>
      <Card bordered={false}>
        <Form name="base" className={style.form} layout="inline" form={form}>
          <Space className={style.antSpace}>
            <Form.Item className={style.label} name="wordsType" label="敏感词类型：">
              <Select placeholder="待选择" className={style.selectBox} allowClear>
                {wordsTypeList.map((item) => (
                  <Select.Option key={item.label} value={item.value}>
                    {item.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item className={style.label} name="wordsContent" label="敏感词内容：">
              <Input placeholder="待输入" className={style.inputBox} allowClear />
            </Form.Item>
            <Form.Item className={style.label} name="status" label="状态：">
              <Select placeholder="待选择" className={style.selectBox} allowClear>
                {statusList.map((item) => (
                  <Select.Option key={item.label} value={item.value}>
                    {item.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Space size="small">
                <Button className={style.searchBtn} type="primary" htmlType="submit" onClick={onFinish}>
                  查询
                </Button>
                <Button className={style.resetBtn} htmlType="button" onClick={onReset}>
                  重置
                </Button>
              </Space>
            </Form.Item>
          </Space>
        </Form>
        <NgTable
          dataSource={wordsList}
          columns={columns}
          loading={isLoading}
          pagination={pagination}
          rowSelection={rowSelection}
          paginationChange={paginationChange}
        />
        <div className={style.multiOperation}>
          <div className={style.btnWrap}>
            <Button htmlType="button" onClick={() => singleAdd('add')}>
              新增
            </Button>
            <Button htmlType="button">批量新增</Button>
            <Button htmlType="button">全量导出</Button>
            <Button htmlType="button">上架</Button>
            <Button htmlType="button">下架</Button>
            <Button htmlType="button">删除</Button>
          </div>
          <div className={style.paginationWrap} />
        </div>
      </Card>
    </div>
  );
};
export default WordsList;
