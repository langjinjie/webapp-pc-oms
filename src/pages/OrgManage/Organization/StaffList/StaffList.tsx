import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Form, Space, Select, Input } from 'antd';
import { NgTable } from 'src/components';
import { TableColumns, TablePagination } from './Config';
import MultiSetting from './MultiSetting/MultiSetting';
import { requestGetDepStaffList, requestDownStaffList } from 'src/apis/orgManage';
import { IDepStaffList } from 'src/utils/interface';
import style from './style.module.less';

interface IStaffListProps {
  departmentId: string;
  deptType: number;
}

interface ISearchParam {
  resource: string;
  businessModel: string;
  businessArea: string;
  officePlace: string;
  isDeleted?: number;
}

const StaffList: React.FC<IStaffListProps> = ({ departmentId: deptId = '1', deptType = 1 }) => {
  const [staffList, setStaffList] = useState<{ total: number; list: any[] }>({ total: 0, list: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [paginationParam, setPaginationParam] = useState({ pageNum: 1, pageSize: 10 });
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [disabledColumnType, setDisabledColumnType] = useState(-1);
  const [multiVisible, setMultiVisible] = useState<boolean>(false);
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
  const getStaffList = async (searchParam: ISearchParam) => {
    setIsLoading(true);
    const res = await requestGetDepStaffList({ ...searchParam, ...paginationParam, deptId, deptType, queryType: 1 });
    if (res) {
      setStaffList(res);
      setIsLoading(false);
    }
  };
  // 重置
  const resetHandle = () => {
    setPaginationParam((paginationParam) => ({ ...paginationParam, pageNum: 1 }));
    setSearchParam(form.getFieldsValue());
    setDisabledColumnType(-1);
    setSelectedRowKeys([]);
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
      deptType: 1,
      deptId,
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

  useEffect(() => {
    getStaffList(searchParam);
  }, [paginationParam, searchParam]);
  useEffect(() => {
    setSearchParam({
      resource: '',
      businessModel: '',
      businessArea: '',
      officePlace: ''
    });
    setPaginationParam({ ...paginationParam, pageNum: 1 });
  }, [deptId, deptType]);
  return (
    <div className={style.wrap}>
      <div className={style.operation}>
        <Button type="primary" className={style.btn} onClick={multiSettingHandle}>
          批量修改信息
        </Button>
        <Button type="primary" className={style.btn} onClick={multiLaodingInHangle}>
          批量导入信息
        </Button>
        <Button type="primary" className={style.btn} onClick={downLoadStaffList}>
          批量导出信息
        </Button>
        <Button
          type="primary"
          className={style.btn}
          disabled={!(searchParam.isDeleted === 1 && selectedRowKeys.length)}
        >
          删除
        </Button>
      </div>
      <Form name="base" className={style.form} layout="inline" form={form} onReset={resetHandle}>
        <Space className={style.antSpace}>
          <Form.Item className={style.label} name="resource" label="资源：">
            <Input placeholder="待输入" className={style.inputBox} allowClear style={{ width: 180 }} />
          </Form.Item>
          <Form.Item className={style.label} name="businessModel" label="业务模式：">
            <Input placeholder="待输入" className={style.inputBox} allowClear style={{ width: 180 }} />
          </Form.Item>
        </Space>
        <Space className={style.antSpace}>
          <Form.Item className={style.label} name="businessArea" label="业务地区：">
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
              <Button className={style.searchBtn} type="primary" onClick={resetHandle}>
                查询
              </Button>
              <Button className={style.resetBtn} htmlType="reset">
                重置
              </Button>
            </Space>
          </Form.Item>
        </Space>
      </Form>
      <NgTable
        className={style.tableWrap}
        setRowKey={(record: any) => record.staffId}
        dataSource={staffList.list}
        columns={TableColumns()}
        loading={isLoading}
        tableLayout={'fixed'}
        scroll={{ x: 1300 }}
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
    </div>
  );
};
export default StaffList;
