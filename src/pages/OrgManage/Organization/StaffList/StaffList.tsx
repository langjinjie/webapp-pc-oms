import React, { useEffect, useState, useImperativeHandle, MutableRefObject } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Form, Space, Select, Input, message, Modal } from 'antd';
import { NgTable, AuthBtn } from 'src/components';
import { exportFile } from 'src/utils/base';
import { TableColumns, TablePagination } from './Config';
import MultiSetting from './MultiSetting/MultiSetting';
import {
  requestGetDepStaffList,
  requestDownStaffList,
  requestDelStaffList,
  exportSpecialList
} from 'src/apis/orgManage';
import { IDepStaffList, IOrganizationItem } from 'src/utils/interface';
import style from './style.module.less';

interface IStaffListProps {
  department: IOrganizationItem;
  deptType: number;
  staffListRef?: MutableRefObject<any>;
}

interface ISearchParam {
  resource: string;
  businessModel: string;
  businessArea: string;
  officePlace: string;
  isDeleted?: number;
}

const StaffList: React.FC<IStaffListProps> = ({ department, deptType = 1, staffListRef }) => {
  const [staffList, setStaffList] = useState<{ total: number; list: any[] }>({ total: 0, list: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [paginationParam, setPaginationParam] = useState({ pageNum: 1, pageSize: 10 });
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [disabledColumnType, setDisabledColumnType] = useState(-1);
  const [multiVisible, setMultiVisible] = useState<boolean>(false);
  const [deleteTips, setDeleteTip] = useState(false);
  const [searchParam, setSearchParam] = useState<ISearchParam>({
    resource: '',
    businessModel: '',
    businessArea: '',
    officePlace: ''
  });
  const history = useHistory();
  const [form] = Form.useForm();
  // 员工状态对照表
  const staffStatusList = [
    { value: 0, label: '在职' },
    { value: 1, label: '离职' }
  ];
  // 获取员工列表
  const getStaffList = async () => {
    setIsLoading(true);
    const res = await requestGetDepStaffList({
      ...searchParam,
      ...paginationParam,
      deptId: department.deptId || '1',
      deptType,
      queryType: 1
    });
    if (res) {
      // 找出第一个不是当前部门下的员工
      const index = res.list.findIndex((item: IDepStaffList) => item.deptId !== +(department.deptId || '1'));
      if (index > 0) {
        res.list[index - 1].sign = true;
      }
      setStaffList(res);
    } else {
      setStaffList({ total: 0, list: [] });
    }
    setDisabledColumnType(-1);
    setIsLoading(false);
    setSelectedRowKeys([]);
  };
  // 查询
  const onSearchHandle = () => {
    setPaginationParam((paginationParam) => ({ ...paginationParam, pageNum: 1 }));
    setSearchParam(form.getFieldsValue());
  };
  // 重置
  const resetHandle = () => {
    setPaginationParam((paginationParam) => ({ ...paginationParam, pageNum: 1 }));
    form.resetFields();
    setSearchParam({
      resource: '',
      businessModel: '',
      businessArea: '',
      officePlace: ''
    });
  };
  // 批量设置信息
  const multiSettingHandle = () => {
    setMultiVisible((visible) => !visible);
  };
  // 批量导入信息
  const multiLaodingInHangle = () => {
    history.push('/organization/laod');
  };
  // Table行双击
  const onRowHandle = (row: IDepStaffList) => {
    return {
      onDoubleClick: () => {
        history.push('/organization/staff-detail?staffId=' + row.staffId);
      },
      style: {
        cursor: 'pointer'
      }
    };
  };
  // 批量导出
  const downLoadStaffList = async () => {
    const res = await requestDownStaffList({
      deptType,
      deptId: department.deptId || '1',
      staffIds: selectedRowKeys,
      ...searchParam
    });
    if (res) {
      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.setAttribute('download', '员工信息表.xlsx');
      document.body.appendChild(link);
      link.click(); // 点击下载
      link.remove(); // 下载完成移除元素
      window.URL.revokeObjectURL(link.href); // 用完之后使用URL.revokeObjectURL()释放；
    }
  };

  const downloadSpecialList = async () => {
    const res = await exportSpecialList({
      deptType,
      deptId: department.deptId || '1',
      staffIds: selectedRowKeys,
      ...searchParam
    });
    if (res) {
      exportFile(res.data, '运营专属报表');
    }
  };

  // 确认删除
  const delOnOkHandle = async () => {
    const res = await requestDelStaffList({ staffIds: selectedRowKeys });
    if (res) {
      message.success('删除成功');
      let pageNum = paginationParam.pageNum;
      if (selectedRowKeys.length >= staffList.list.length) {
        pageNum = pageNum - 1;
        setPaginationParam({ ...paginationParam, pageNum: pageNum < 1 ? 1 : pageNum });
      } else {
        setPaginationParam({ ...paginationParam, pageNum });
      }
      setDeleteTip(false);
    } else {
      message.error('删除失败');
    }
  };

  useImperativeHandle(staffListRef, () => ({
    resetHandle
  }));

  useEffect(() => {
    getStaffList();
  }, [paginationParam, searchParam]);

  useEffect(() => {
    resetHandle();
  }, [department, deptType]);

  return (
    <div className={style.wrap}>
      <div className={style.operation}>
        <AuthBtn path="/edit">
          <Button type="primary" className={style.btn} onClick={multiSettingHandle}>
            批量修改信息
          </Button>
        </AuthBtn>
        <AuthBtn path="/import">
          <Button type="primary" className={style.btn} onClick={multiLaodingInHangle}>
            批量导入信息
          </Button>
        </AuthBtn>
        <AuthBtn path="/export">
          <Button type="primary" className={style.btn} onClick={downLoadStaffList}>
            批量导出信息
          </Button>
          <Button type="primary" className={style.btn} onClick={downloadSpecialList}>
            导出运营专属报表
          </Button>
        </AuthBtn>
        <AuthBtn path="/delete">
          <Button
            type="primary"
            className={style.btn}
            disabled={!(searchParam.isDeleted === 1 && selectedRowKeys.length)}
            onClick={() => setDeleteTip(true)}
          >
            删除
          </Button>
        </AuthBtn>
      </div>
      <AuthBtn path="/query">
        <Form name="base" className={style.form} layout="inline" form={form} onReset={resetHandle}>
          <Space className={style.antSpace}>
            <Form.Item className={style.label} name="resource" label="支公司：">
              <Input placeholder="待输入" className={style.inputBox} allowClear style={{ width: 180 }} />
            </Form.Item>
            <Form.Item className={style.label} name="businessModel" label="业务模式：">
              <Input placeholder="待输入" className={style.inputBox} allowClear style={{ width: 180 }} />
            </Form.Item>
            <Form.Item className={style.label} name="provinceCompany" label="省公司：">
              <Input placeholder="待输入" className={style.inputBox} allowClear style={{ width: 180 }} />
            </Form.Item>
          </Space>
          <Space className={style.antSpace}>
            <Form.Item className={style.label} name="businessArea" label="市公司：">
              <Input placeholder="待输入" className={style.inputBox} allowClear style={{ width: 180 }} />
            </Form.Item>
            <Form.Item className={style.label} name="officePlace" label="办公职场：">
              <Input placeholder="待输入" className={style.inputBox} allowClear style={{ width: 180 }} />
            </Form.Item>
            <Form.Item className={style.label} name="isDeleted" label="状态：">
              <Select placeholder="待选择" className={style.selectBox} allowClear style={{ width: 180 }}>
                {staffStatusList.map((item) => (
                  <Select.Option key={item.value} value={item.value}>
                    {item.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Space size="small">
                <Button className={style.searchBtn} type="primary" onClick={onSearchHandle}>
                  查询
                </Button>
                <Button className={style.resetBtn} htmlType="reset">
                  重置
                </Button>
              </Space>
            </Form.Item>
          </Space>
        </Form>
      </AuthBtn>
      <NgTable
        className={style.tableWrap}
        setRowKey={(record: any) => record.staffId}
        dataSource={staffList.list}
        columns={TableColumns({ updateList: () => setPaginationParam((param) => ({ ...param })) })}
        loading={isLoading}
        tableLayout={'fixed'}
        scroll={{ x: 'max-content' }}
        rowClassName={(row: IDepStaffList) => (row.sign ? style.sign : undefined)}
        {...TablePagination({
          staffList,
          paginationParam,
          setPaginationParam,
          selectedRowKeys,
          setSelectedRowKeys,
          disabledColumnType,
          setDisabledColumnType
        })}
        onRow={(row: IDepStaffList) => onRowHandle(row)}
      />
      <MultiSetting visible={multiVisible} setMultiVisible={setMultiVisible} />
      <Modal
        className={style.modalWrap}
        centered
        visible={deleteTips}
        width={300}
        title={'删除提醒'}
        onOk={delOnOkHandle}
        onCancel={() => setDeleteTip(false)}
        maskClosable={false}
      >
        <div className={style.content}>{'您确定要删除该员工吗?'}</div>
      </Modal>
    </div>
  );
};
export default StaffList;
