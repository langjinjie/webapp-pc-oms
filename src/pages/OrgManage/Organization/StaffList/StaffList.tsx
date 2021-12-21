import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Form, Space, Select, Input } from 'antd';
import { NgTable } from 'src/components';
import { TableColumns, TablePagination } from './Config';
import MultiSetting from './MultiSetting/MultiSetting';
import style from './style.module.less';

interface IStaffListProps {
  departmentId: string;
  setDisplayType: (param: number) => void;
  setStaffId: (param: string) => void;
}

interface ISearchParam {
  business: string;
  area: string;
  location: string;
  status: string;
}

const StaffList: React.FC<IStaffListProps> = ({ departmentId, setDisplayType, setStaffId }) => {
  const [staffList, setStaffList] = useState<{ total: number; list: any[] }>({ total: 0, list: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [paginationParam, setPaginationParam] = useState({ current: 1, pageSize: 10 });
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [disabledColumnType, setDisabledColumnType] = useState(-1);
  const [multiVisible, setMultiVisible] = useState<boolean>(false);
  const [searchParam, setSearchParam] = useState<ISearchParam>({ business: '', area: '', location: '', status: '' });
  const history = useHistory();
  const [form] = Form.useForm();
  // 获取员工列表
  const getStaffList = (searchParam: ISearchParam) => {
    console.log('请求参数', searchParam);
    const staffItem = {
      name: '李思',
      account: 'lisisi',
      number: '0',
      department: '深圳团队',
      post: '客户经理',
      business: '电销',
      area: '上海',
      location: '上海',
      openingTime: '2021-04-30 11:23',
      downTime: '2021-04-30 11:23',
      status: 0,
      staffId: '0'
    };
    const staffLsit = [];
    for (let i = 0; i < 20; i++) {
      const initalStaffItem = { ...staffItem };
      initalStaffItem.number = i + '';
      i % 2 === 0 ? (initalStaffItem.status = 0) : (initalStaffItem.status = 1);
      staffLsit.push(initalStaffItem);
    }
    setStaffList({ total: staffLsit.length, list: staffLsit });
  };
  // 批量设置信息
  const multiSettingHandle = () => {
    setMultiVisible((visible) => !visible);
  };
  // 批量导入信息
  const multiLaodingInHangle = () => {
    history.push('/organization/laod');
  };
  // 搜索
  const onFinishHandle = () => {
    console.log(form.getFieldsValue());
    getStaffList(form.getFieldsValue());
    setSearchParam(form.getFieldsValue());
  };
  // 重置
  const onResetHandle = () => {
    console.log(searchParam);
    console.log('重置');
  };
  // Table行点击
  const onRowHandle = (row: object) => {
    return {
      onClick: () => {
        console.log('该行的数据', row);
        setStaffId('000');
        setDisplayType(1);
      },
      style: {
        cursor: 'pointer'
      }
    };
  };

  useEffect(() => {
    console.log(departmentId);
    setIsLoading(true);
    getStaffList(searchParam);
    setIsLoading(false);
  }, []);
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
        <Button type="primary" className={style.btn}>
          删除
        </Button>
      </div>
      <Form
        name="base"
        className={style.form}
        layout="inline"
        form={form}
        onFinish={onFinishHandle}
        onReset={onResetHandle}
      >
        <Space className={style.antSpace}>
          <Form.Item className={style.label} name="business" label="业务模式：">
            <Input placeholder="待输入" className={style.inputBox} allowClear style={{ width: 180 }} />
          </Form.Item>
          <Form.Item className={style.label} name="area" label="业务地区：">
            <Input placeholder="待输入" className={style.inputBox} allowClear style={{ width: 180 }} />
          </Form.Item>
          <Form.Item className={style.label} name="location" label="办公职场：">
            <Input placeholder="待输入" className={style.inputBox} allowClear style={{ width: 180 }} />
          </Form.Item>
          <Form.Item className={style.label} name="status" label="状态：">
            <Select placeholder="待选择" className={style.selectBox} allowClear style={{ width: 100 }}>
              {[1, 2, 3].map((item) => (
                <Select.Option key={item} value={item}>
                  {item}
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
        setRowKey={(record: any) => record.number}
        dataSource={staffList.list}
        columns={TableColumns()}
        loading={isLoading}
        {...TablePagination({
          staffList,
          paginationParam,
          setPaginationParam,
          selectedRowKeys,
          setSelectedRowKeys,
          disabledColumnType,
          setDisabledColumnType
        })}
        onRow={(row) => onRowHandle(row)}
      />
      <MultiSetting visible={multiVisible} setMultiVisible={setMultiVisible} />
    </div>
  );
};
export default StaffList;
