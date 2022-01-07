import React, { useEffect, useState, useContext } from 'react';
import { /* useHistory, */ useLocation } from 'react-router';
import { Button, Card, Form, Input, Select, Space, Table, Modal, Popconfirm /* , message */ } from 'antd';
import {
  requestGetStaffList,
  requestSetStaffOpstatus,
  requestSyncSpcontentdel,
  requestLeadingOutExcel
} from 'src/apis/orgManage';
import { IStaffList, ICurrentSearchParam, IMoalParam, IStaffListInfo } from 'src/utils/interface';
import { Icon } from 'src/components/index';
import {
  /* serviceType2Name, */ accountStatus2Name,
  accountStatusEdit2Name,
  staffStatus2Name
} from 'src/utils/commonData';
import { Context } from 'src/store';
import { useDocumentTitle } from 'src/utils/base';
import classNames from 'classnames';
import style from './style.module.less';

const StaffList: React.FC = () => {
  useDocumentTitle('机构管理-账号管理');
  const { currentCorpId: corpId } = useContext(Context);
  const [form] = Form.useForm();
  const [paginationParam, setPaginationParam] = useState({ current: 1, pageSize: 10 });
  const [staffListInfo, setStaffListInfo] = useState<IStaffListInfo>({
    usedCount: 0,
    licenseCount: 0,
    staffList: [],
    total: 0
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalParam, setModalParam] = useState<IMoalParam>({
    isModalVisible: false,
    modalType: '',
    modalContentTitle: '',
    modalContent: ''
  });
  const [disabledColumnType, setDisabledColumnType] = useState('2');
  const [currentSearchParam, setCurrentSearchParam] = useState<ICurrentSearchParam>({});
  const [popconfirmVisible, setPopconfirmVisible] = useState('');
  const [opType, setOpType] = useState(0);

  // const history = useHistory();
  const location = useLocation();

  // 获取员工列表
  const getStaffList = async (pageNum = paginationParam.current, pageSize = paginationParam.pageSize, params = {}) => {
    setIsLoading(true);
    const res = await requestGetStaffList({ corpId, pageNum, pageSize, ...params });
    if (res.list) {
      setStaffListInfo({
        total: res.total,
        usedCount: res.usedCount,
        licenseCount: res.licenseCount || 1000,
        staffList: res.list
      });
    }
    setIsLoading(false);
  };

  // 激活/停用账号请求
  const updateStaffPpstatus = async (userIds: string[]) => {
    if (opType) {
      // 前端校验激活上限
      if (staffListInfo.usedCount + userIds.length > staffListInfo.licenseCount) {
        return setModalParam({
          isModalVisible: true,
          modalType: '容量通知',
          modalContentTitle: '账号告罄',
          modalContent: '当前启用账号已超出系统设定账号，请联系管理员修改后台账号容量'
        });
      }
    }
    const { corpId } = location.state as { [key: string]: unknown };
    const params = {
      opType,
      corpId,
      userIds: userIds
    };
    await requestSetStaffOpstatus(params);
    await getStaffList(paginationParam.current, paginationParam.pageSize, currentSearchParam);
  };
  // 点击单行操作
  const clickCurrentRowHandle = (row: IStaffList) => {
    // 停用操作不可逆
    if (row.accountStatus === '2') return;
    setOpType(row.accountStatus === '4' ? 1 : 0);
    setPopconfirmVisible(row.staffId);
  };
  // 定义单个激活/停用onfirem
  const popOnconfirmHandle = async (row: IStaffList) => {
    setPopconfirmVisible('');
    const { staffId } = row;
    updateStaffPpstatus([staffId]);
  };
  // 定义columns
  const columns: any = [
    {
      title: '员工姓名',
      dataIndex: 'staffName'
    },
    {
      title: '员工ID',
      dataIndex: 'staffId',
      align: 'center'
    },
    {
      title: '企微账号',
      dataIndex: 'userId',
      align: 'center'
    },
    {
      title: '直属上级',
      dataIndex: 'mangerName',
      align: 'center'
    },
    {
      title: '最后操作',
      render (row: IStaffList) {
        return row.lastLoginTime || '--';
      },
      align: 'center'
    },
    {
      title: '数据录入',
      dataIndex: 'entryValue'
    },
    {
      title: '员工状态',
      render (row: IStaffList) {
        return staffStatus2Name[row.staffStatus];
      },
      align: 'center'
    },
    {
      title: '账号状态',
      render (row: IStaffList) {
        return accountStatus2Name[row.accountStatus];
      },
      align: 'center'
    },
    {
      title: '操作',
      align: 'center',
      render (row: IStaffList) {
        return (
          <Popconfirm
            title={'确认' + (row.accountStatus === '1' ? '停用' : '激活') + '该账号吗'}
            visible={popconfirmVisible === row.staffId}
            onConfirm={async () => popOnconfirmHandle(row)}
            onCancel={() => setPopconfirmVisible('')}
          >
            <span
              key={row.staffId}
              className={classNames(style.edit, { [style.disabled]: row.accountStatus === '2' })}
              onClick={() => clickCurrentRowHandle(row)}
            >
              {accountStatusEdit2Name[row.accountStatus]}
            </span>
          </Popconfirm>
        );
      }
    }
  ];
  // 点击选择框
  const onSelectChange = (newSelectedRowKeys: unknown[]) => {
    if (newSelectedRowKeys.length) {
      !selectedRowKeys.length &&
        setDisabledColumnType(
          staffListInfo.staffList?.find((staffItem) => newSelectedRowKeys[0] === staffItem.staffId)?.accountStatus ===
            '1'
            ? '4'
            : '1'
        );
      setSelectedRowKeys(newSelectedRowKeys as string[]);
    } else {
      setSelectedRowKeys([]);
      setDisabledColumnType('2');
    }
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    hideSelectAll: currentSearchParam.accountStatus === '2' || currentSearchParam.accountStatus === undefined, // 是否显示全选
    getCheckboxProps: (record: IStaffList) => ({
      disabled: record.accountStatus === '2' || record.accountStatus === disabledColumnType
    })
  };
  const staffStatusList = [
    { value: '0', label: '在职' },
    { value: '1', label: '离职' }
  ];
  const accountStatusList = [
    { value: '1', label: '在用' },
    { value: '2', label: '停用' },
    { value: '4', label: '未激活' }
  ];
  // 分页器参数
  const tablePaginationConfig = {
    total: staffListInfo.total,
    current: paginationParam.current,
    showQuickJumper: true,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50', '100', '500'],
    onChange (value: number, pageSize?: number) {
      getStaffList(value, pageSize, currentSearchParam);
      setPaginationParam({ current: value, pageSize: pageSize as number });
      setSelectedRowKeys([]);
      const { accountStatus } = currentSearchParam;
      setDisabledColumnType(accountStatus === undefined ? '2' : accountStatus === '1' ? '4' : '1');
    }
  };
  // 查询
  const onFinish = async () => {
    setSelectedRowKeys([]);
    const { accountStatus } = form.getFieldsValue();
    setDisabledColumnType(accountStatus === undefined ? '2' : accountStatus === '1' ? '4' : '1');
    await getStaffList(1, paginationParam.pageSize, form.getFieldsValue());
    setCurrentSearchParam(form.getFieldsValue());
    setPaginationParam({ ...paginationParam, current: 1 });
  };
  // 重置
  const onReset = async () => {
    setSelectedRowKeys([]);
    setDisabledColumnType('2');
    form.resetFields();
    await getStaffList(1);
    setCurrentSearchParam({});
    setPaginationParam({ ...paginationParam, current: 1 });
  };
  // 手动同步通讯录
  const syncAccount = async () => {
    setPaginationParam({ ...paginationParam, current: 1 });
    setSelectedRowKeys([]);
    setDisabledColumnType('2');
    setIsLoading(true);
    const res = await requestSyncSpcontentdel({ corpId: (location.state as { [key: string]: string }).corpId });
    if (res) {
      form.resetFields();
      getStaffList(1);
      setCurrentSearchParam({});
    } else {
      setIsLoading(false);
    }
  };
  // 点击批量激活/停用 按钮
  const buttonClickHandle = (opType: number) => {
    setModalParam({
      isModalVisible: true,
      modalType: '操作通知',
      modalContentTitle: `确认批量${opType ? '激活' : '停用'}账号吗`,
      modalContent: ''
    });
    setOpType(opType);
  };
  // modal的onOk
  const modalOnOkHandle = () => {
    setModalParam({ ...modalParam, isModalVisible: false });
    if (modalParam.modalType === '操作通知') {
      updateStaffPpstatus(selectedRowKeys);
      setSelectedRowKeys([]);
    }
  };
  // 导出表格
  const downLoad = async () => {
    const res = await requestLeadingOutExcel({ corpId: (location.state as { [key: string]: unknown }).corpId });
    if (res) {
      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.setAttribute('download', '员工列表.xlsx');
      document.body.appendChild(link);
      link.click(); // 点击下载
      link.remove(); // 下载完成移除元素
      window.URL.revokeObjectURL(link.href); // 用完之后使用URL.revokeObjectURL()释放；
    }
  };
  useEffect(() => {
    // if (!(location.state as { [key: string]: string }) || !(location.state as { [key: string]: string }).corpId) {
    //   return history.push('/orgManage');
    // }
    getStaffList();
  }, []);
  return (
    <div className={style.wrap}>
      <Modal
        title={modalParam.modalType}
        closeIcon={<span />}
        visible={modalParam.isModalVisible}
        centered
        onCancel={() => setModalParam({ ...modalParam, isModalVisible: false })}
        onOk={modalOnOkHandle}
      >
        <div className={style.modalContent}>
          <p className={style.title}>
            <span className={style.icon} />
            {modalParam.modalContentTitle}
          </p>
          <p className={style.content}>{modalParam.modalContent}</p>
        </div>
      </Modal>
      <Card bordered={false}>
        <Form name="base" layout="inline" form={form}>
          <Space className={style.antSpace}>
            <Form.Item name="staffName" label="员工姓名">
              <Input placeholder="待输入" className={style.inputBox} allowClear />
            </Form.Item>
            <Form.Item name="mangerName" label="直属上级">
              <Input placeholder="待输入" className={style.inputBox} allowClear />
            </Form.Item>
          </Space>
          <Space className={style.antSpace}>
            <Form.Item name="staffStatus" label="员工状态">
              <Select placeholder="待选择" className={style.inputBox} allowClear>
                {staffStatusList.map((item) => (
                  <Select.Option key={item.label} value={item.value}>
                    {item.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="accountStatus" label="账号状态">
              <Select placeholder="待选择" className={style.inputBox} allowClear>
                {accountStatusList.map((item) => (
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
        <div className={style.accountSituation}>
          <span className={style.text}>*机构使用情况: </span>
          <span>
            {staffListInfo.usedCount}/{staffListInfo.licenseCount}
          </span>
          <Icon className={style.icon} name="shuaxin" />
          <span className={style.refresh} onClick={syncAccount}>
            手动同步通讯录
          </span>
        </div>
        <Table
          rowKey="staffId"
          dataSource={staffListInfo.staffList}
          columns={columns}
          rowSelection={rowSelection}
          loading={isLoading}
          pagination={tablePaginationConfig}
          scroll={{ x: 'max-content' }}
        />

        {!!staffListInfo.staffList?.length && (
          <div className={style.btnWrap}>
            <Button
              disabled={disabledColumnType !== '4' || !selectedRowKeys.length}
              onClick={() => buttonClickHandle(0)}
            >
              {'批量停用' +
                (disabledColumnType !== '4' || !selectedRowKeys.length ? '' : '(' + selectedRowKeys.length + ')')}
            </Button>
            <Button
              disabled={disabledColumnType !== '1' || !selectedRowKeys.length}
              onClick={() => buttonClickHandle(1)}
            >
              {'批量激活' +
                (disabledColumnType !== '1' || !selectedRowKeys.length ? '' : '(' + selectedRowKeys.length + ')')}
            </Button>
            <Button onClick={downLoad}>导出表格</Button>
          </div>
        )}
      </Card>
    </div>
  );
};
export default StaffList;
