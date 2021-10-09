import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Button, Card, Form, Input, Select, Space, Table, Modal } from 'antd';
import { requestGetStaffList, requestSetStaffOpstatus, requestSyncSpcontentdel } from 'src/apis/OrgManage';
import { IStaffList } from 'src/utils/interface';
import { Icon } from 'src/components/index';
import { serviceType2Name, accountStatus2Name, accountStatusEdit2Name, staffStatus2Name } from 'src/utils/commonData';
import classNames from 'classnames';
import style from './style.module.less';

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

  const history = useHistory();

  // 获取员工列表
  const getStaffList = async (pageNum = 1, params = {}) => {
    setIsLoading(true);
    const { corpId } = history.location.state as { [key: string]: unknown };
    const res = await requestGetStaffList({ corpId, pageNum, ...params });
    if (res.list) {
      setTotal(res.total);
      setUsedCount(res.usedCount);
      setLlicenseCount(res.licenseCount || 1000);
      setStaffList(res.list);
    }
    setIsLoading(false);
  };

  const onSelectChange = (newSelectedRowKeys: any[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: (record: IStaffList) => ({ disabled: record.accountStatus === '2' }),
    selections: []
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
          <span
            className={classNames(style.edit, { [style.disabled]: row.accountStatus === '2' })}
            onClick={async () => {
              const { corpId, userId, accountStatus } = row;
              if (accountStatus === '2') return;
              // 判断是否超过最大
              if (usedCount >= licenseCount) return setIsModalVisible(true);
              const params = {
                opType: accountStatus !== '1' ? 1 : 0,
                corpId,
                userIds: [userId]
              };
              console.log(params);
              await requestSetStaffOpstatus(params);
              getStaffList(current, form.getFieldsValue());
            }}
          >
            {accountStatusEdit2Name[row.accountStatus]}
          </span>
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
    setStaffList([]);
    await getStaffList(1, form.getFieldsValue());
    setCurrent(1);
  };

  // 重置
  const onReset = () => {
    form.resetFields();
    getStaffList();
  };

  // 手动同步通讯录
  const syncAccount = async () => {
    setIsLoading(true);
    const res = await requestSyncSpcontentdel();
    if (res) {
      form.resetFields();
      getStaffList(current);
    } else {
      setIsLoading(false);
    }
  };

  // 批量激活/停用
  const staffPpstatus = (opType: number) => {
    return async () => {
      if (!selectedRowKeys.length) return;
      const { corpId } = staffList![0];
      const params = {
        opType,
        corpId,
        userIds: selectedRowKeys
      };
      await requestSetStaffOpstatus(params);
      getStaffList(current, form.getFieldsValue());
      setSelectedRowKeys([]);
    };
  };

  useEffect(() => {
    getStaffList();
  }, []);
  return (
    <>
      <Modal
        title="容量通知"
        closeIcon={<span />}
        visible={isModalVisible}
        centered
        onCancel={() => setIsModalVisible(false)}
        onOk={() => setIsModalVisible(false)}
      >
        <div className={style.modalContent}>
          <p className={style.title}>
            <span className={style.icon}></span>账号告罄
          </p>
          <p className={style.content}>当前启用账号已超出系统设定账号，请联系管理员修改后台账号容量</p>
        </div>
      </Modal>
      <Card bordered={false}>
        <Form name="base" layout="inline" form={form}>
          <Space className={style.antSpace}>
            <Form.Item name="staffName" label="员工姓名">
              <Input placeholder="待选择" className={style.inputBox} />
            </Form.Item>
            <Form.Item name="mangerName" label="经理姓名">
              <Input placeholder="待选择" className={style.inputBox} />
            </Form.Item>
          </Space>
          <Space className={style.antSpace}>
            <Form.Item name="serviceType" label="业务类型">
              <Select placeholder="待选择" className={style.inputBox}>
                {serviceTypeList.map((item) => (
                  <Select.Option key={item.label} value={item.value}>
                    {item.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="staffStatus" label="员工状态">
              <Select placeholder="待选择" className={style.inputBox}>
                {staffStatusList.map((item) => (
                  <Select.Option key={item.label} value={item.value}>
                    {item.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="accountStatus" label="账号状态">
              <Select placeholder="待选择" className={style.inputBox}>
                {accountStatusList.map((item) => (
                  <Select.Option key={item.label} value={item.value}>
                    {item.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Space size="small">
                <Button className={style.btn} type="primary" htmlType="submit" onClick={onFinish}>
                  查询
                </Button>
                <Button className={style.btn} htmlType="button" onClick={onReset}>
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
          rowKey="userId"
          dataSource={staffList}
          columns={columns}
          rowSelection={rowSelection}
          loading={isLoading}
          pagination={{
            style: { marginTop: 20 },
            total,
            current,
            showQuickJumper: true,
            onChange: async (value) => {
              await getStaffList(value);
              setCurrent(value);
            }
          }}
        />

        <div className={style.btn}>
          <Button disabled={!selectedRowKeys.length} onClick={staffPpstatus(0)}>
            批量停用
          </Button>
          <Button disabled={!selectedRowKeys.length} onClick={staffPpstatus(1)}>
            批量激活
          </Button>
        </div>
      </Card>
    </>
  );
};
export default StaffList;
