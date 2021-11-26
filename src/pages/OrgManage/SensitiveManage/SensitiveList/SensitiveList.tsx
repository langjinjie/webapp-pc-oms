import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Select, Space, Button, Input, Card, DatePicker, message, Modal } from 'antd';
import { NgTable } from 'src/components/index';
import { ISensitiveType, ISensitiveSearchParam, ISensitiveList } from 'src/utils/interface';
import {
  requestGetSensitiveTypeList,
  requestGetSensitiveList,
  requestDownLoadSensitiveList,
  requestAddSensitiveList,
  requestManageSensitiveWord
} from 'src/apis/orgManage';
import { Context } from 'src/store';
import { sensitiveStatusList } from 'src/utils/commonData';
import ExportModal from 'src/pages/SalesCollection/SpeechManage/Components/ExportModal/ExportModal';
import classNames from 'classnames';
import style from './style.module.less';

interface IDeleteTipsParam {
  visible: boolean;
  title: string;
  content: string;
  type: number;
}

const SensitiveList: React.FC = () => {
  const { currentCorpId: corpId } = useContext(Context);
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
  const [disabledColumnType, setDisabledColumnType] = useState(-1);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [sensitiveType, setSensitiveType] = useState<ISensitiveType[]>([]);
  const [visible, setVisible] = useState(false);
  const [deleteTips, setDeleteTip] = useState<IDeleteTipsParam>({ visible: false, title: '', content: '', type: 0 });

  const history = useHistory();
  const { RangePicker } = DatePicker;

  // 获取敏感词类型列表
  const getSensitiveTypeList = async () => {
    const res = await requestGetSensitiveTypeList({
      corpId
    });
    setSensitiveType(res.list);
  };

  // 获取敏感词列表
  const getSensitiveList = async () => {
    const { typeId, word, updateBeginTime, updateEndTime, status } = searchParam;
    const { current, pageSize } = paginationParam;
    setIsloading(true);
    const res = await requestGetSensitiveList({
      corpId,
      typeId,
      word,
      status: status === -1 ? undefined : status, // status要么传,要么不传
      updateBeginTime,
      updateEndTime,
      pageNum: current,
      pageSize
    });
    if (res) {
      setSensitiveList(res);
      setIsloading(false);
      setSelectedRowKeys([]);
      setDisabledColumnType(-1);
    }
  };

  // 单个新增/编辑
  const singleAdd = (type: string, row: ISensitiveList | {} = {}) => {
    if ((row as ISensitiveList).status === 1) return;
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
      width: 70,
      render (row: ISensitiveList) {
        return (
          <span
            className={classNames(style.edit, { [style.disabled]: row.status === 1 })}
            onClick={() => singleAdd('edit', row)}
          >
            编辑
          </span>
        );
      }
    }
  ];

  // 切换分页
  const paginationChange = (value: number, pageSize?: number) => {
    setPaginationParam({ current: value, pageSize: pageSize as number });
    setSelectedRowKeys([]);
    setDisabledColumnType(-1);
  };
  // 分页器参数
  const pagination = {
    total: sensitiveList.total,
    current: paginationParam.current
  };
  // 点击选择框
  const onSelectChange = async (newSelectedRowKeys: any[]) => {
    // 判断是取消选择还是开始选择
    if (newSelectedRowKeys.length) {
      let filterRowKeys: string[] = newSelectedRowKeys;
      // 判断是否是首次选择
      if (disabledColumnType === -1) {
        // 获取第一个的状态作为全选筛选条件
        const disabledColumnType = sensitiveList.list.find((item) => item.sensitiveId === newSelectedRowKeys[0])
          ?.status as number;
        setDisabledColumnType(disabledColumnType);
        // 判断是否是点击的全选
        if (newSelectedRowKeys.length > 1) {
          // 过滤得到需要被全选的
          filterRowKeys = sensitiveList.list
            .filter((item) => item.status === disabledColumnType)
            .map((item) => item.sensitiveId);
        }
      }
      setSelectedRowKeys(filterRowKeys as string[]);
    } else {
      setSelectedRowKeys([]);
      setDisabledColumnType(-1);
    }
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    hideSelectAll: false, // 是否隐藏全选
    getCheckboxProps: (record: ISensitiveList) => ({
      disabled: disabledColumnType === -1 ? false : record.status !== disabledColumnType,
      name: record.name
    })
  };
  // 查询
  const onFinish = async () => {
    const { typeId, word, status, updateTime } = form.getFieldsValue();
    let updateBeginTime = '';
    let updateEndTime = '';
    if (updateTime) {
      updateBeginTime = updateTime[0].format('YYYY-MM-DD') + ' 00:00:00';
      updateEndTime = updateTime[1].format('YYYY-MM-DD') + ' 23:59:59';
    }
    setSearchParam({ typeId, word, status, updateBeginTime, updateEndTime });
    setPaginationParam({ ...paginationParam, current: 1 });
  };
  // 重置
  const onReset = () => {
    form.resetFields();
    setSearchParam({ typeId: '', word: '', status: -1, updateBeginTime: '', updateEndTime: '' });
    setPaginationParam({ ...paginationParam, current: 1 });
  };
  // 敏感词全量导出接口、下载敏感词模板
  const onDownLoadExcel = async (interfaceType: number, fileName: string) => {
    const { status, word, updateBeginTime, updateEndTime, typeId } = searchParam;
    const res = await requestDownLoadSensitiveList({
      corpId,
      interfaceType,
      status: status === -1 ? undefined : status,
      word: word || undefined,
      updateBeginTime,
      updateEndTime,
      typeId: typeId || undefined
    });
    if (res) {
      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.setAttribute('download', fileName + '.xlsx');
      document.body.appendChild(link);
      link.click(); // 点击下载
      link.remove(); // 下载完成移除元素
      window.URL.revokeObjectURL(link.href); // 用完之后使用URL.revokeObjectURL()释放；
    }
  };
  // 批量上传
  const mulitiUpload = async (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('corpId', corpId);
    const res = await requestAddSensitiveList(formData);
    if (res) {
      message.success('上传成功');
      setVisible(false);
    }
  };
  // 敏感词(上架/下架/删除)
  const batchSensitive = async (type: number) => {
    const res = await requestManageSensitiveWord({ corpId, sensitiveIds: selectedRowKeys, type });
    if (res) {
      message.success(`${type === 1 ? '上架' : type === 2 ? '下架' : '删除'}成功`);
      getSensitiveList();
      setDeleteTip({ ...deleteTips, visible: false });
    }
  };
  // 删除/上架/下架
  const buttonHandle = (title: string, type: number) => {
    setDeleteTip({
      title,
      content: `${selectedRowKeys.length === 1 ? '' : '批量'}${title}${selectedRowKeys.length === 1 ? '该' : ''}`,
      visible: true,
      type
    });
  };
  useEffect(() => {
    getSensitiveTypeList();
  }, []);
  useEffect(() => {
    getSensitiveList();
  }, [searchParam, paginationParam, visible]);
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
        <div className={classNames(style.multiOperation, { [style.empty]: !sensitiveList.total })}>
          <div className={style.btnWrap}>
            <Button htmlType="button" onClick={() => singleAdd('add')}>
              新增
            </Button>
            <Button htmlType="button" onClick={() => setVisible(true)}>
              批量新增
            </Button>
            <Button onClick={() => onDownLoadExcel(1, '敏感词列表')}>全量导出</Button>
            {!!sensitiveList.total && (
              <>
                <Button
                  disabled={disabledColumnType !== 0 && disabledColumnType !== 2}
                  onClick={() => buttonHandle('上架', 1)}
                >
                  上架
                </Button>
                <Button disabled={disabledColumnType !== 1} onClick={() => buttonHandle('下架', 2)}>
                  下架
                </Button>
                <Button
                  disabled={disabledColumnType === 1 || disabledColumnType === -1}
                  onClick={() => buttonHandle('删除', 3)}
                >
                  删除
                </Button>
              </>
            )}
          </div>
          <div className={style.paginationWrap} />
        </div>
      </Card>
      <ExportModal
        visible={visible}
        onOK={mulitiUpload}
        onCancel={() => setVisible(false)}
        onDownLoad={() => onDownLoadExcel(2, '敏感词列表模板')}
      />
      <Modal
        className={style.modalWrap}
        centered
        visible={deleteTips.visible}
        width={300}
        title={`${deleteTips.title}提醒`}
        onOk={() => batchSensitive(deleteTips.type)}
        onCancel={() => setDeleteTip({ ...deleteTips, visible: false })}
        maskClosable={false}
        destroyOnClose
      >
        <div className={style.content}>{`您确定要${deleteTips.content}敏感词吗?`}</div>
      </Modal>
    </div>
  );
};
export default SensitiveList;
