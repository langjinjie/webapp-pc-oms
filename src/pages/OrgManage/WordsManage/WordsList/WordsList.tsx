import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Select, Space, Button, Input, Card } from 'antd';
import { NgTable } from 'src/components/index';
import { ISensitiveType } from 'src/utils/interface';
import { requestGetSensitiveTypeList, requestGetSensitiveList } from 'src/apis/orgManage';
import { Context } from 'src/store';
import { sensitiveStatusList } from 'src/utils/commonData';
import style from './style.module.less';

const WordsList: React.FC = () => {
  const { currentCorpId } = useContext(Context);
  const [form] = Form.useForm();
  const [searchParam, setSearchParam] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsloading] = useState(true);
  const [sensitiveList, setSensitiveList] = useState<any>([]);
  const [paginationParam, setPaginationParam] = useState({ current: 1, pageSize: 10 });
  const [disabledColumnType, setDisabledColumnType] = useState('2');
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [sensitiveType, setSensitiveType] = useState<ISensitiveType[]>([]);

  const history = useHistory();

  // 获取敏感词类型列表
  const getSensitiveTypeList = async () => {
    const res = await requestGetSensitiveTypeList({ corpId: currentCorpId });
    console.log(res);
    setSensitiveType(res);
  };

  // 获取敏感词列表
  const getSensitiveList = async () => {
    const res = await requestGetSensitiveList({ corpId: currentCorpId });
    console.log(res);
    setSensitiveList(res.list);
  };

  // 单个新增/编辑
  const singleAdd = (type: string) => {
    history.push('/wordsManage/editWords?type=' + type);
  };

  // 切换分页
  const paginationChange = (value: number, pageSize?: number) => {
    getSensitiveList();
    setPaginationParam({ current: value, pageSize: pageSize as number });
    setSelectedRowKeys([]);
    const { accountStatus } = searchParam;
    setDisabledColumnType(accountStatus === undefined ? '2' : accountStatus === '1' ? '4' : '1');
  };
  // 分页器参数
  const pagination = {
    total: sensitiveList.total,
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
    getSensitiveTypeList();
    getWordsList(paginationParam.current, paginationParam.pageSize);
  }, []);
  return (
    <div className={style.wrap}>
      <Card bordered={false}>
        <Form name="base" className={style.form} layout="inline" form={form}>
          <Space className={style.antSpace}>
            <Form.Item className={style.label} name="wordsType" label="敏感词类型：">
              <Select placeholder="待选择" className={style.selectBox} allowClear>
                {sensitiveType.map((item) => (
                  <Select.Option key={item.typeId} value={item.typeId}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item className={style.label} name="wordsContent" label="敏感词内容：">
              <Input placeholder="待输入" className={style.inputBox} allowClear />
            </Form.Item>
            <Form.Item className={style.label} name="status" label="状态：">
              <Select placeholder="待选择" className={style.selectBox} allowClear>
                {sensitiveStatusList.map((item) => (
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
          dataSource={sensitiveList.list}
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
