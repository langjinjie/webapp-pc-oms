import React, { useEffect, useState, useRef, MutableRefObject } from 'react';
import { useHistory } from 'react-router';
import { Button, Card, Form, Input, Select, Space, Table, Modal } from 'antd';
import { requestGetStaffList } from 'src/apis/OrgManage';
import { IStaffList } from 'src/utils/interface';
import { Icon } from 'src/components/index';
import style from './style.module.less';

const StaffList: React.FC = () => {
  const [staffList, setStaffList] = useState<IStaffList[]>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const history = useHistory();

  const formRef: MutableRefObject<any> = useRef();

  // 获取员工列表
  const getStaffList = async () => {
    const coprId = history.location.state;
    const res = await requestGetStaffList({ coprId });
    if (res.list) {
      setStaffList(res.list);
      setIsLoading(false);
    }
  };

  const onSelectChange = (newSelectedRowKeys: any[]) => {
    // console.log('selectedRowKeys: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: (record: IStaffList) => ({ disabled: record.accountStatus === '停用' }),
    selections: []
  };

  // 定义columns
  const columns = [
    {
      title: '员工姓名',
      dataIndex: 'staffName'
    },
    {
      title: '员工ID',
      dataIndex: 'staffId'
    },
    {
      title: '团队经理',
      dataIndex: 'mangerName'
    },
    {
      title: '业务类型',
      dataIndex: 'serviceType'
    },
    {
      title: '最后操作',
      dataIndex: 'lastLoginTime'
    },
    {
      title: '员工状态',
      dataIndex: 'staffStatus'
    },
    {
      title: '账号状态',
      dataIndex: 'accountStatus'
    },
    {
      title: '操作',
      render (row: IStaffList) {
        return (
          <span className={style.edit} onClick={() => console.log(row)}>
            {row.accountStatus === '在用' ? '停用' : '激活'}
          </span>
        );
      }
    }
  ];

  // 重置
  const onReset = () => {
    formRef.current!.resetFields();
  };

  // 提交
  const onFinish = (values: any) => {
    console.log(values);
  };

  // 手动同步通讯录
  const syncAccount = () => {
    setIsModalVisible(true);
  };

  useEffect(() => {
    getStaffList();
  }, []);
  return (
    <>
      <Modal
        title="容量通知"
        visible={isModalVisible}
        centered
        onCancel={() => setIsModalVisible(false)}
        closeIcon={<span />}
      >
        <div className={style.modalContent}>
          <p className={style.title}>
            <span className={style.icon}></span>账号告罄
          </p>
          <p className={style.content}>当前启用账号已超出系统设定账号，请联系管理员修改后台账号容量</p>
        </div>
      </Modal>
      <Card bordered={false}>
        <Form name="base" layout="inline" ref={formRef} onFinish={onFinish}>
          <Space className={style.antSpace}>
            <Form.Item label="员工姓名">
              <Input placeholder="待选择" className={style.inputBox} />
            </Form.Item>
            <Form.Item label="经理姓名">
              <Input placeholder="待选择" className={style.inputBox} />
            </Form.Item>
          </Space>
          <Space className={style.antSpace}>
            <Form.Item label="业务类型">
              <Select placeholder="待选择" className={style.inputBox}>
                <Select.Option value="male">male</Select.Option>
                <Select.Option value="female">female</Select.Option>
                <Select.Option value="other">other</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="员工状态">
              <Select placeholder="待选择" className={style.inputBox}>
                <Select.Option value="male">male</Select.Option>
                <Select.Option value="female">female</Select.Option>
                <Select.Option value="other">other</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="账号状态">
              <Select placeholder="待选择" className={style.inputBox}>
                <Select.Option value="male">male</Select.Option>
                <Select.Option value="female">female</Select.Option>
                <Select.Option value="other">other</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Space size="small">
                <Button className={style.btn} type="primary" htmlType="submit">
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
          <span>{999}/1000</span>
          <Icon className={style.icon} name="shuaxin" />
          <span className={style.refresh} onClick={syncAccount}>
            手动同步通讯录
          </span>
        </div>
        <Table
          rowKey="staffId"
          rowSelection={rowSelection}
          columns={columns}
          dataSource={staffList}
          loading={isLoading}
        ></Table>
      </Card>
    </>
  );
};
export default StaffList;
