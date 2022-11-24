import { Button, DatePicker, Form, message, PaginationProps, Select, Row } from 'antd';
import moment, { Moment } from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import {
  asyncCreateDownloadFile,
  dataDownloadList,
  exportFileWithTable,
  requestGetTempleList,
  requestGetDepttypeList
} from 'src/apis/dashboard';
import { AuthBtn, NgTable } from 'src/components';
import { Context } from 'src/store';
import { exportFile } from 'src/utils/base';
import { columns, fileProps } from './Config';
import style from './style.module.less';

export interface IDepts {
  corpId: string;
  deptId: string;
  deptName: string;
  deptDesc: string;
  typeNameAttribute: string;
}

const TableDownLoad: React.FC = () => {
  const { currentCorpId: corpId } = useContext(Context);
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0,
    showTotal: (total: number) => {
      return `共 ${total} 条记录`;
    }
  });

  const [dataSource, setDataSource] = useState<fileProps[]>([]);
  const [templeList, setTempleList] = useState<
    { templateName: string; tmpId: string; type: 0 | 1; chooseDept: 0 | 1 }[]
  >([]);
  const [templeType, setTempleType] = useState<0 | 1>(0);
  const [showSelect, setShowSelect] = useState(false);
  // // 销售中心=》分中心部门
  const [centerDeptIdList, setCenterDeptIdList] = useState<IDepts[]>([]);
  // const [centerDeptIds, setCenterDeptIds] = useState<IDepts[]>([]);
  // 销售大区=》营业区部门
  const [areaDeptIdList, setAreaDeptIdList] = useState<IDepts[]>([]);
  // const [areaDeptIds, setAreaDeptIds] = useState<IDepts[]>([]);
  // 销售区域=》营业部部门
  const [bossDeptIdList, setBossDeptIdList] = useState<IDepts[]>([]);
  // const [bossDeptIds, setBossDeptIds] = useState<IDepts[]>([]);
  // 销售团队=》团队部门
  const [leaderDeptIdList, setLeaderDeptIdList] = useState<IDepts[]>([]);
  // const [leaderDeptIds, setLeaderDeptIds] = useState<IDepts[]>([]);

  const [form] = Form.useForm();

  const getList = async (params?: any) => {
    const pageNum = params?.pageNum || pagination.current;
    const pageSize = params?.pageSize || pagination.pageSize;
    const res = await dataDownloadList({
      pageNum,
      pageSize
    });
    if (res) {
      const { list, total } = res;
      setDataSource(list);
      setPagination((pagination) => ({ ...pagination, total, current: pageNum, pageSize }));
    }
  };

  // 获取报表类别
  const getListCategory = async () => {
    const res = await requestGetTempleList();
    if (res) {
      setTempleList(res);
    }
  };

  // 选择报表类型
  const selectOnChange = (value: string) => {
    const typeItem = templeList.find((findItem) => findItem.tmpId === value);
    setTempleType(typeItem?.type || 0);
    setShowSelect(typeItem?.chooseDept === 1);
    if (typeItem?.chooseDept !== 1) {
      form.setFieldsValue({
        areaDeptIds: [],
        bossDeptIds: [],
        leaderDeptIds: []
      });
      setAreaDeptIdList([]);
      setBossDeptIdList([]);
      setLeaderDeptIdList([]);
    }
    if (typeItem?.type === 1) {
      form.setFieldsValue({ dateRange: null });
    }
  };

  // 获取中心大区
  const getDepttypeList = async ({
    typeNameAttribute,
    parentDeptIds
  }: {
    typeNameAttribute: string;
    parentDeptIds?: string[];
  }) => {
    const res = await requestGetDepttypeList({ corpId, typeNameAttribute, parentDeptIds });
    if (res) {
      setCenterDeptIdList(res.list);
    }
  };

  // 选择销售大区(分中心)
  const centerDeptIdsOnChange = async (val: string[]) => {
    form.setFieldsValue({
      areaDeptIds: [],
      bossDeptIds: [],
      leaderDeptIds: []
    });
    if (val.filter((filterItem) => filterItem).length) {
      const res = await requestGetDepttypeList({
        corpId,
        typeNameAttribute: 'businessZone',
        parentDeptIds: val.filter((filterItem) => filterItem)
      });
      if (res) {
        setAreaDeptIdList(res.list);
      }
    } else {
      setAreaDeptIdList([]);
      setBossDeptIdList([]);
      setLeaderDeptIdList([]);
    }
  };
  // 选择销售大区(营业区)
  const areaDeptIdsDeptIdsOnChange = async (val: string[]) => {
    form.setFieldsValue({
      bossDeptIds: [],
      leaderDeptIds: []
    });
    if (val.filter((filterItem) => filterItem).length) {
      const res = await requestGetDepttypeList({
        corpId,
        typeNameAttribute: 'businessDepartment',
        parentDeptIds: val.filter((filterItem) => filterItem)
      });
      if (res) {
        setBossDeptIdList(res.list);
      }
    } else {
      setBossDeptIdList([]);
      setLeaderDeptIdList([]);
    }
  };
  // 选择销售区域(营业区域)
  const bossDeptIdsOnChange = async (val: string[]) => {
    form.setFieldsValue({
      leaderDeptIds: []
    });
    if (val.filter((filterItem) => filterItem).length) {
      const res = await requestGetDepttypeList({
        corpId,
        typeNameAttribute: 'team',
        parentDeptIds: val.filter((filterItem) => filterItem)
      });
      if (res) {
        setLeaderDeptIdList(res.list);
      }
    } else {
      setLeaderDeptIdList([]);
    }
  };

  useEffect(() => {
    getList();
    getListCategory();
    // 获取分中心
    getDepttypeList({ typeNameAttribute: 'subCenter' });
  }, []);

  const exportFileExcel = async (record: fileProps) => {
    const { data } = await exportFileWithTable({ fileId: record.fileId });

    exportFile(data, record.fileName!);
  };
  const createFile = async (values: {
    tmpId: string;
    dateRange: [Moment, Moment];
    centerDeptIds: string[];
    areaDeptIds: string[];
    bossDeptIds: string[];
    leaderDeptIds: string[];
  }) => {
    const { tmpId, dateRange, centerDeptIds, areaDeptIds, bossDeptIds, leaderDeptIds } = values;
    // templeType为1时,时间的开始时间为2021-08-01, 结束时间为当前时间
    const startTime = dateRange?.[0].format('YYYY-MM-DD') || '2021-08-01';
    const endTime = dateRange?.[1].format('YYYY-MM-DD') || moment().format('YYYY-MM-DD');
    const res = await asyncCreateDownloadFile({
      tmpId,
      startTime,
      endTime,
      centerDeptIds,
      areaDeptIds,
      bossDeptIds,
      leaderDeptIds
    });
    if (res) {
      message.success('提交成功');
      getList({ pageNum: 1 });
    }
  };

  const paginationChange = (pageNum: number, pageSize?: number) => {
    getList({ pageNum, pageSize });
  };

  return (
    <div className="container">
      <AuthBtn path="/create">
        <Form form={form} layout="inline" className={style.form} onFinish={createFile}>
          <Row wrap>
            <Form.Item label="报表类别" name="tmpId" rules={[{ required: true }]}>
              <Select placeholder="请选择报表类别" allowClear onChange={selectOnChange}>
                {templeList.map((mapItem) => (
                  <Select.Option key={mapItem.tmpId} value={mapItem.tmpId}>
                    {mapItem.templateName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="日期" name="dateRange" rules={[{ required: templeType === 0 }]}>
              {/* type为1 不能选择时间 */}
              <DatePicker.RangePicker disabled={templeType === 1} allowClear />
            </Form.Item>
            <Form.Item extra="备注：点击生成报表按钮后，若列表还在处理中状态，请稍后手动刷新页面试试。">
              <Button type="primary" shape="round" htmlType="submit">
                生成报表
              </Button>
            </Form.Item>
          </Row>
          {showSelect && (
            <Row wrap>
              {/* 销售中心: 分中心部门 */}
              <Form.Item label="销售中心" name="centerDeptIds">
                <Select
                  fieldNames={{ label: 'deptName', value: 'deptId' }}
                  allowClear
                  mode="multiple"
                  style={{ width: '200px' }}
                  onChange={centerDeptIdsOnChange}
                  options={centerDeptIdList}
                  placeholder="全部"
                />
              </Form.Item>
              {/* 销售大区: 营业区 */}
              <Form.Item label="销售大区" name="areaDeptIds">
                <Select
                  fieldNames={{ label: 'deptName', value: 'deptId' }}
                  allowClear
                  mode="multiple"
                  style={{ width: '200px' }}
                  onChange={areaDeptIdsDeptIdsOnChange}
                  options={areaDeptIdList}
                  placeholder="全部"
                />
              </Form.Item>
              {/* 销售区域: 营业部门 */}
              <Form.Item label="销售区域" name="bossDeptIds">
                <Select
                  fieldNames={{ label: 'deptName', value: 'deptId' }}
                  allowClear
                  mode="multiple"
                  style={{ width: '200px' }}
                  onChange={bossDeptIdsOnChange}
                  options={bossDeptIdList}
                  placeholder="全部"
                />
              </Form.Item>
              {/* 销售团队: 团队部门 */}
              <Form.Item label="销售团队" name="leaderDeptIds">
                <Select
                  fieldNames={{ label: 'deptName', value: 'deptId' }}
                  allowClear
                  mode="multiple"
                  style={{ width: '200px' }}
                  options={leaderDeptIdList}
                  placeholder="全部"
                />
              </Form.Item>
            </Row>
          )}
        </Form>
      </AuthBtn>
      <div className="mt20">
        <NgTable
          rowKey={'id'}
          dataSource={dataSource}
          pagination={pagination}
          paginationChange={paginationChange}
          columns={columns({
            handleOperate: exportFileExcel
          })}
        ></NgTable>
      </div>
    </div>
  );
};

export default TableDownLoad;
