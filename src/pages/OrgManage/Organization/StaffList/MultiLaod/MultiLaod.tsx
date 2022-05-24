import React, { useContext, useEffect, useState } from 'react';
import { Button, Form, Space, Select, Input, DatePicker, message } from 'antd';
import { NgTable, AuthBtn } from 'src/components';
import { TableColumns, TablePagination } from './Config';
import { useHistory } from 'react-router-dom';
import { Context } from 'src/store';
import { requestGetHistoryLoad, requestImportStaffList, requestDownStaffList } from 'src/apis/orgManage';
import { IStaffImpList } from 'src/utils/interface';
import ExportModal from 'src/pages/SalesCollection/SpeechManage/Components/ExportModal/ExportModal';
import style from './style.module.less';

interface ISearchParam {
  status: number;
  createBy: string;
  startTime: string;
  endTime: string;
}

interface IExportList {
  total: number;
  list: IStaffImpList[];
}

const MultiLaod: React.FC = () => {
  const { currentCorpId: corpId } = useContext(Context);
  const [exportList, setExportList] = useState<IExportList>({ total: 0, list: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [paginationParam, setPaginationParam] = useState({ pageNum: 1, pageSize: 10 });
  const [exportModal, setExportModal] = useState(false);

  const [searchParam, setSearchParam] = useState<ISearchParam>({
    status: -1,
    createBy: '',
    startTime: '',
    endTime: ''
  });
  const statusList = [
    {
      value: 0,
      label: '成功'
    },
    { value: 1, label: '异常' },
    { value: 2, label: '校验中' }
  ];
  const [form] = Form.useForm();
  const { RangePicker } = DatePicker;

  const history = useHistory();

  // 获取列表
  const getExportList = async () => {
    setIsLoading(true);
    const { status, createBy, startTime, endTime } = searchParam;
    const res = await requestGetHistoryLoad({
      ...paginationParam,
      status: status === -1 ? undefined : status,
      createBy,
      startTime,
      endTime
    });
    if (res) {
      setExportList(res);
      setIsLoading(false);
    }
  };
  // 查询
  const onFinishHandle = () => {
    const { status, createBy, createTime } = form.getFieldsValue();
    let startTime = '';
    let endTime = '';
    if (createTime) {
      startTime = createTime[0].format('YYYY-MM-DD') + ' 00:00:00';
      endTime = createTime[1].format('YYYY-MM-DD') + ' 23:59:59';
    }
    setSearchParam({ status, createBy, startTime, endTime });
    setPaginationParam({ ...paginationParam, pageNum: 1 });
  };
  // 重置
  const onResetHandle = () => {
    form.resetFields();
    setSearchParam({
      status: -1,
      createBy: '',
      startTime: '',
      endTime: ''
    });
    setPaginationParam({ ...paginationParam, pageNum: 1 });
  };
  // 批量上传
  const mulitiUpload = async (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('corpId', corpId);
    const res = await requestImportStaffList(formData);
    if (res) {
      message.success('上传成功');
      setExportModal(false);
    }
  };
  // 下载新增员工信息表
  const downLoadNewStaffList = async () => {
    const res = await requestDownStaffList({
      deptType: 2
    });
    if (res) {
      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.setAttribute('download', '信息未完善员工信息表.xlsx');
      document.body.appendChild(link);
      link.click(); // 点击下载
      link.remove(); // 下载完成移除元素
      window.URL.revokeObjectURL(link.href); // 用完之后使用URL.revokeObjectURL()释放；
    }
  };

  useEffect(() => {
    getExportList();
  }, [paginationParam, searchParam]);
  return (
    <div className={style.wrap}>
      <div className={style.crumbs}>
        <span className={style.title}>当前位置：</span>
        <span className={style.lastName} onClick={() => history.push('/organization')}>
          组织架构管理
        </span>
        /<span className={style.currentName}>批量导入信息</span>
      </div>
      <div className={style.operation}>
        <AuthBtn path="/import/upload">
          <Button type="primary" className={style.btn} onClick={() => setExportModal(true)}>
            上传表格
          </Button>
        </AuthBtn>
        <AuthBtn path="/import/unPerfection">
          <Button type="primary" className={style.btn} onClick={downLoadNewStaffList}>
            下载信息未完善员工信息表
          </Button>
        </AuthBtn>
        <AuthBtn path="/import/downTemplate">
          <a
            className={style.btn}
            href={
              'https://insure-prod-server-1305111576.cos.ap-guangzhou.myqcloud.com/file/stafforg/%E7%BB%84%E7%BB%87%E6%9E%B6%E6%9E%84%E4%BF%A1%E6%81%AF%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx?' +
              Date.now().toString(16)
            }
          >
            下载模板
          </a>
        </AuthBtn>
      </div>
      <AuthBtn path="/import/query">
        <Form name="base" className={style.form} layout="inline" form={form}>
          <Space className={style.antSpace}>
            <Form.Item className={style.label} name="status" label="状态：">
              <Select placeholder="待选择" className={style.selectBox} allowClear style={{ width: 180 }}>
                {statusList.map((item) => (
                  <Select.Option key={item.value} value={item.value}>
                    {item.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item className={style.label} name="createBy" label="创建人：">
              <Input placeholder="待输入" className={style.inputBox} allowClear style={{ width: 180 }} />
            </Form.Item>
            <Form.Item className={style.label} name="createTime" label="创建时间：">
              <RangePicker className={style.rangePicker} style={{ width: 300 }} />
            </Form.Item>
            <Form.Item>
              <Space size="small">
                <Button className={style.searchBtn} type="primary" htmlType="submit" onClick={onFinishHandle}>
                  查询
                </Button>
                <Button className={style.resetBtn} htmlType="reset" onClick={onResetHandle}>
                  重置
                </Button>
              </Space>
            </Form.Item>
          </Space>
        </Form>
      </AuthBtn>
      <NgTable
        className={style.tableWrap}
        setRowKey={(record: any) => record.batchId}
        dataSource={exportList.list}
        columns={TableColumns()}
        loading={isLoading}
        scroll={{ x: 'max-content' }}
        {...TablePagination({
          exportList,
          paginationParam,
          setPaginationParam
        })}
      />
      <ExportModal
        visible={exportModal}
        title={'批量导入信息'}
        onOK={mulitiUpload}
        onCancel={() => setExportModal(false)}
        isShowDownLoad={false}
      />
    </div>
  );
};
export default MultiLaod;
