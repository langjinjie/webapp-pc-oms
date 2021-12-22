import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Form, Space, Select, Input } from 'antd';
import { NgTable } from 'src/components';
import { TableColumns, TablePagination } from './Config';
import MultiSetting from './MultiSetting/MultiSetting';
import { requestGetDepStaffList } from 'src/apis/orgManage';
import { IDepStaffList } from 'src/utils/interface';
import style from './style.module.less';

interface IStaffListProps {
  departmentId: string;
  setDisplayType: (param: number) => void;
  setStaffId: (param: string) => void;
}

interface ISearchParam {
  resource: string;
  businessModel: string;
  businessArea: string;
  officePlace: string;
  isDeleted?: number;
}

const StaffList: React.FC<IStaffListProps> = ({ departmentId: deptId = '1', setDisplayType, setStaffId }) => {
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
    const res = await requestGetDepStaffList({ ...searchParam, ...paginationParam, deptId, deptType: 0, queryType: 1 });
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
  // Table行点击
  const onRowHandle = (row: IDepStaffList) => {
    return {
      onDoubleClick: () => {
        setStaffId(row.staffId);
        setDisplayType(1);
      },
      style: {
        cursor: 'pointer'
      }
    };
  };

  useEffect(() => {
    console.log('deptId', deptId);
    getStaffList(searchParam);
  }, [paginationParam, searchParam]);
  return (
    <div className={style.wrap}>
      <div className={style.operation}>
        <Button type="primary" className={style.btn} onClick={multiSettingHandle}>
          批量修改信息
        </Button>
        <Button type="primary" className={style.btn} onClick={multiLaodingInHangle}>
          批量导入信息
        </Button>
        <Button type="primary" className={style.btn}>
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
      <Form name="base" className={style.form} layout="inline" form={form} onFinish={resetHandle} onReset={resetHandle}>
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
              <Button className={style.searchBtn} type="primary" htmlType="submit">
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
