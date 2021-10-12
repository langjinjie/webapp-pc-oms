import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { Button, Card, Form, Input, Select, Space, Table, Modal, Popconfirm } from 'antd';
import { requestGetStaffList, requestSetStaffOpstatus, requestSyncSpcontentdel } from 'src/apis/OrgManage';
import { IStaffList } from 'src/utils/interface';
import { Icon } from 'src/components/index';
import { serviceType2Name, accountStatus2Name, accountStatusEdit2Name, staffStatus2Name } from 'src/utils/commonData';
import classNames from 'classnames';
import style from './style.module.less';

interface ICurrentSearchFlag {
  staffName?: string;
  mangerName?: string;
  serviceType?: string;
  staffStatus?: string;
  accountStatus?: string;
}

const StaffList: React.FC = () => {
  const [form] = Form.useForm();
  const [current, setCurrent] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [usedCount, setUsedCount] = useState<number>(0);
  const [licenseCount, setLlicenseCount] = useState<number>(0);
  const [staffList, setStaffList] = useState<IStaffList[]>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>('');
  const [modalContentTitle, setModalContentTitle] = useState<string>('');
  const [modalContent, setModalContent] = useState<string>('');
  const [disabledColumnType, setDisabledColumnType] = useState<string>('2');
  const [currentSearchFlag, setCurrentSearchFlag] = useState<ICurrentSearchFlag>({});
  const [popconfirmVisible, setPopconfirmVisible] = useState<string>('');
  const [isCommitEdit, setIsCommitEdit] = useState<boolean>(false);
  const [opType, setOpType] = useState<number>(0);
  const history = useHistory();
  const location = useLocation();

  // 获取员工列表
  const getStaffList = async (pageNum = 1, params = {}) => {
    console.log(location);

    setIsLoading(true);
    const { corpId } = location.state as { [key: string]: unknown };
    const res = await requestGetStaffList({ corpId, pageNum, ...params });
    if (res.list) {
      setTotal(res.total);
      setUsedCount(res.usedCount);
      setLlicenseCount(res.licenseCount || 1000);
      setStaffList(res.list);
    }
    setIsLoading(false);
  };

  const onSelectChange = (newSelectedRowKeys: unknown[]) => {
    if (newSelectedRowKeys.length) {
      !selectedRowKeys.length &&
        setDisabledColumnType(
          staffList?.find((staffItem) => newSelectedRowKeys[0] === staffItem.staffId)?.accountStatus === '1' ? '4' : '1'
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
    columnTitle: ' ', // 去掉全选
    hideDefaultSelections: true, // 去掉全选
    getCheckboxProps: (record: IStaffList) => ({
      disabled: record.accountStatus === '2' || record.accountStatus === disabledColumnType
    })
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
      title: '团队经理',
      dataIndex: 'mangerName',
      align: 'center'
    },
    {
      title: '业务类型',
      render (row: IStaffList) {
        return serviceType2Name[row.serviceType];
      },
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
            onConfirm={async () => {
              setPopconfirmVisible('');
              const { corpId, staffId, accountStatus } = row;
              if (accountStatus === '2') return;
              // 判断执行的是停用操作还是执行的激活操作
              if (accountStatus === '4') {
                if (usedCount >= licenseCount) {
                  setModalType('容量通知');
                  setModalContentTitle('账号告罄');
                  setModalContent('当前启用账号已超出系统设定账号，请联系管理员修改后台账号容量');
                  return setIsModalVisible(true);
                }
              }
              // 判断是否超过最大
              const params = {
                opType: accountStatus !== '1' ? 1 : 0,
                corpId,
                userIds: [staffId]
              };
              await requestSetStaffOpstatus(params);
              getStaffList(current, currentSearchFlag);
            }}
            onCancel={() => setPopconfirmVisible('')}
          >
            <span
              key={row.staffId}
              className={classNames(style.edit, { [style.disabled]: row.accountStatus === '2' })}
              onClick={async () => {
                if (row.accountStatus === '2') return;
                setPopconfirmVisible(row.staffId);
              }}
            >
              {accountStatusEdit2Name[row.accountStatus]}
            </span>
          </Popconfirm>
        );
      }
    }
  ];

  const serviceTypeList = [
    { value: '1', label: '对公业务' },
    { value: '2', label: '零售业务' },
    { value: '3', label: '对公+零售业务' }
  ];
  const staffStatusList = [
    { value: '0', label: '在职' },
    { value: '1', label: '离职' }
  ];
  const accountStatusList = [
    { value: '1', label: '在用' },
    { value: '2', label: '停用' },
    { value: '4', label: '未激活' }
  ];

  // 查询
  const onFinish = async () => {
    setSelectedRowKeys([]);
    const { accountStatus } = form.getFieldsValue();
    setDisabledColumnType(accountStatus === undefined ? '2' : accountStatus === '1' ? '4' : '1');
    await getStaffList(1, form.getFieldsValue());
    setCurrentSearchFlag(form.getFieldsValue());
    setCurrent(1);
  };

  // 重置
  const onReset = async () => {
    setSelectedRowKeys([]);
    setDisabledColumnType('2');
    form.resetFields();
    await getStaffList(1);
    setCurrentSearchFlag({});
    setCurrent(1);
  };

  // 手动同步通讯录
  const syncAccount = async () => {
    setCurrent(1);
    setSelectedRowKeys([]);
    setDisabledColumnType('2');
    setIsLoading(true);
    const res = await requestSyncSpcontentdel({ corpId: (location.state as { [key: string]: string }).corpId });
    if (res) {
      form.resetFields();
      getStaffList(1);
      setCurrentSearchFlag({});
    } else {
      setIsLoading(false);
    }
  };

  // 批量激活/停用
  const staffPpstatus = async (opType: number) => {
    if (opType) {
      if (usedCount + selectedRowKeys.length > licenseCount) {
        setModalType('容量通知');
        setModalContentTitle('账号告罄');
        setModalContent('当前启用账号已超出系统设定账号，请联系管理员修改后台账号容量');
        setIsCommitEdit(false);
        return setIsModalVisible(true);
      }
    }
    const { corpId } = staffList![0];
    const params = {
      opType,
      corpId,
      userIds: selectedRowKeys
    };
    await requestSetStaffOpstatus(params);
    await getStaffList(current, currentSearchFlag);
    setSelectedRowKeys([]);
    setIsCommitEdit(false);
  };
  const beforeunloadHandle = () => {
    history.push('/orgManage/detail', {}); // 清空state参数
  };
  useEffect(() => {
    if (!(location.state as { [key: string]: string }).corpId) return history.push('/orgManage');
    getStaffList();
    window.addEventListener('beforeunload', beforeunloadHandle);
    return () => {
      window.removeEventListener('beforeunload', beforeunloadHandle);
    };
  }, []);
  return (
    <>
      <Modal
        title={modalType}
        closeIcon={<span />}
        visible={isModalVisible}
        centered
        onCancel={() => setIsModalVisible(false)}
        onOk={() => {
          setIsModalVisible(false);
          isCommitEdit && staffPpstatus(opType);
        }}
      >
        <div className={style.modalContent}>
          <p className={style.title}>
            <span className={style.icon} />
            {modalContentTitle}
          </p>
          <p className={style.content}>{modalContent}</p>
        </div>
      </Modal>
      <Card bordered={false}>
        <Form name="base" layout="inline" form={form}>
          <Space className={style.antSpace}>
            <Form.Item name="staffName" label="员工姓名">
              <Input placeholder="待输入" className={style.inputBox} allowClear />
            </Form.Item>
            <Form.Item name="mangerName" label="经理姓名">
              <Input placeholder="待输入" className={style.inputBox} allowClear />
            </Form.Item>
          </Space>
          <Space className={style.antSpace}>
            <Form.Item name="serviceType" label="业务类型">
              <Select placeholder="待选择" className={style.inputBox} allowClear>
                {serviceTypeList.map((item) => (
                  <Select.Option key={item.label} value={item.value}>
                    {item.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
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
            {usedCount}/{licenseCount}
          </span>
          <Icon className={style.icon} name="shuaxin" />
          <span className={style.refresh} onClick={syncAccount}>
            手动同步通讯录
          </span>
        </div>
        <Table
          rowKey="staffId"
          dataSource={staffList}
          columns={columns}
          rowSelection={rowSelection}
          loading={isLoading}
          pagination={{
            style: { marginTop: 20 },
            total,
            current,
            showQuickJumper: true,
            onChange (value: number) {
              getStaffList(value, currentSearchFlag);
              setCurrent(value);
              setSelectedRowKeys([]);
              const { accountStatus } = currentSearchFlag;
              setDisabledColumnType(accountStatus === undefined ? '2' : accountStatus === '1' ? '4' : '1');
            }
          }}
        />

        {!!staffList?.length && (
          <div className={style.btnWrap}>
            <Button
              disabled={disabledColumnType !== '4' || !selectedRowKeys.length}
              onClick={() => {
                setModalType('操作通知');
                setModalContentTitle('确认批量停用账号吗');
                setModalContent('');
                setIsModalVisible(true);
                setIsCommitEdit(true);
                setOpType(0);
              }}
            >
              批量停用
            </Button>
            <Button
              disabled={disabledColumnType !== '1' || !selectedRowKeys.length}
              onClick={() => {
                setModalType('操作通知');
                setModalContentTitle('确认批量激活账号吗');
                setModalContent('');
                setIsModalVisible(true);
                setIsCommitEdit(true);
                setOpType(1);
              }}
            >
              批量激活
            </Button>
          </div>
        )}
      </Card>
    </>
  );
};
export default StaffList;
