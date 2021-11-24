import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Select, Space, Button, Input, Card, DatePicker } from 'antd';
import { NgTable } from 'src/components/index';
import { ISensitiveType, ISensitiveSearchParam, ISensitiveList } from 'src/utils/interface';
import { requestGetSensitiveTypeList, requestGetSensitiveList } from 'src/apis/orgManage';
import { Context } from 'src/store';
import { sensitiveStatusList } from 'src/utils/commonData';
import ExportModal from 'src/pages/SalesCollection/SpeechManage/Components/ExportModal/ExportModal';
import style from './style.module.less';

const SensitiveList: React.FC = () => {
  const { currentCorpId } = useContext(Context);
  const [form] = Form.useForm();
  const [searchParam, setSearchParam] = useState<ISensitiveSearchParam>({
    typeId: '',
    word: '',
    status: -1,
    updateBeginTime: '',
    updateEndTime: ''
  });
  const [isLoading, setIsloading] = useState(true);
  const [sensitiveList, setSensitiveList] = useState<{ total: number; list: ISensitiveList[] }>({ total: 0, list: [] });
  const [paginationParam, setPaginationParam] = useState({ current: 1, pageSize: 10 });
  // const [disabledColumnType, setDisabledColumnType] = useState(2);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [sensitiveType, setSensitiveType] = useState<ISensitiveType[]>([]);
  const [visible, setVisible] = useState(false);

  const history = useHistory();
  const { RangePicker } = DatePicker;

  // 获取敏感词类型列表
  const getSensitiveTypeList = async () => {
    const res = await requestGetSensitiveTypeList({
      corpId: currentCorpId
    });
    setSensitiveType(res.list);
  };

  // 获取敏感词列表
  const getSensitiveList = async () => {
    const { typeId, word, updateBeginTime, updateEndTime, status } = searchParam;
    const { current, pageSize } = paginationParam;
    setIsloading(true);
    const res = await requestGetSensitiveList({
      corpId: currentCorpId,
      typeId,
      word,
      status: status === -1 ? undefined : status, // status要么传,要么不传
      updateBeginTime,
      updateEndTime,
      pageNum: current,
      pageSize
    });
    setSensitiveList(res);
    setIsloading(false);
  };

  // 单个新增/编辑
  const singleAdd = (type: string, row = {}) => {
    console.log(row);
    history.push('/sensitiveManage/editWords?type=' + type, {
      sensitiveType,
      sensitiveItem: type === 'edit' ? row : {}
    });
  };
  const columns: any[] = [
    {
      title: '敏感词类型',
      align: 'center',
      render (row: ISensitiveList) {
        return <span>{sensitiveType.find((item) => row.typeId === item.typeId)?.name}</span>;
      }
    },
    { title: '敏感词内容', align: 'center', dataIndex: 'word' },
    { title: '创建时间', width: 200, align: 'center', dataIndex: 'dateCreated' },
    { title: '创建人', align: 'center', dataIndex: 'createBy' },
    { title: '更新时间', width: 200, align: 'center', dataIndex: 'lastUpdated' },
    { title: '更新人', align: 'center', dataIndex: 'updateBy' },
    {
      title: '状态',
      align: 'center',
      render (row: ISensitiveList) {
        return <span>{sensitiveStatusList.find((item) => item.value === row.status)?.label}</span>;
      }
    },
    {
      title: '操作',
      fixed: 'right',
      render (row: ISensitiveList) {
        return (
          <span className={style.edit} onClick={() => singleAdd('edit', row)}>
            编辑
          </span>
        );
      }
    }
  ];

  // 切换分页
  const paginationChange = (value: number, pageSize?: number) => {
    console.log('点击分页器');
    setPaginationParam({ current: value, pageSize: pageSize as number });
    setSelectedRowKeys([]);
    // const { status } = searchParam;
    // setDisabledColumnType(2);
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
      // !selectedRowKeys.length && setDisabledColumnType(0);
      setSelectedRowKeys(newSelectedRowKeys as string[]);
    } else {
      setSelectedRowKeys([]);
      // setDisabledColumnType(2);
    }
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    hideSelectAll: false, // 是否隐藏全选
    getCheckboxProps: (/* record: any */) => ({
      disabled: false,
      name: ''
    })
  };
  // 查询
  const onFinish = async () => {
    const { typeId, word, status, updateTime } = form.getFieldsValue();
    console.log(updateTime);
    let updateBeginTime = '';
    let updateEndTime = '';
    if (updateTime) {
      console.log(updateTime);
      updateBeginTime = updateTime[0].format('YYYY-MM-DD hh:mm:ss');
      updateEndTime = updateTime[1].format('YYYY-MM-DD hh:mm:ss');
    }
    setSearchParam({ typeId, word, status, updateBeginTime, updateEndTime });
    setPaginationParam({ current: 1, pageSize: 10 });
  };
  // 重置
  const onReset = () => {
    console.log('重置了');
    form.resetFields();
    setSearchParam({ typeId: '', word: '', status: -1, updateBeginTime: '', updateEndTime: '' });
    setPaginationParam({ current: 1, pageSize: 10 });
  };
  useEffect(() => {
    getSensitiveTypeList();
  }, []);
  useEffect(() => {
    getSensitiveList();
  }, [searchParam, paginationParam]);
  return (
    <div className={style.wrap}>
      <Card bordered={false}>
        <Form name="base" className={style.form} layout="inline" form={form}>
          <Space className={style.antSpace}>
            <Form.Item className={style.label} name="typeId" label="敏感词类型：">
              <Select placeholder="待选择" className={style.selectBox} allowClear>
                {sensitiveType.map((item) => (
                  <Select.Option key={item.typeId} value={item.typeId}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item className={style.label} name="word" label="敏感词内容：">
              <Input placeholder="待输入" className={style.inputBox} allowClear />
            </Form.Item>
          </Space>
          <Space className={style.antSpace}>
            <Form.Item className={style.label} name="status" label="敏感词状态：">
              <Select placeholder="待选择" className={style.selectBox} allowClear>
                {sensitiveStatusList.map((item) => (
                  <Select.Option key={item.label} value={item.value}>
                    {item.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item className={style.label} name="updateTime" label="更新时间">
              <RangePicker format="YYYY-MM-DD" className={style.rangePicker} />
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
          setRowKey={(record: any) => record.sensitiveId}
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
            <Button htmlType="button" onClick={() => setVisible(true)}>
              批量新增
            </Button>
            <Button htmlType="button">全量导出</Button>
            <Button htmlType="button">上架</Button>
            <Button htmlType="button">下架</Button>
            <Button htmlType="button">删除</Button>
          </div>
          <div className={style.paginationWrap} />
        </div>
      </Card>
      <ExportModal visible={visible} onOK={() => setVisible(false)} onCancel={() => setVisible(false)} />
    </div>
  );
};
export default SensitiveList;
