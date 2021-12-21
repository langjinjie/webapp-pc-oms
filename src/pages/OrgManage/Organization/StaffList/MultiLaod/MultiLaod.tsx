import React, { useEffect, useState } from 'react';
import { Button, Form, Space, Select, Input, DatePicker } from 'antd';
import { NgTable } from 'src/components';
import { TableColumns, TablePagination } from './Config';
import { useHistory } from 'react-router-dom';
import ExportModal from 'src/pages/SalesCollection/SpeechManage/Components/ExportModal/ExportModal';
import style from './style.module.less';

interface ISearchParam {
  status: number;
  createName: string;
  createBeginTime: string;
  createEndTime: string;
}

interface IExportList {
  total: number;
  list: any[];
}

const MultiLaod: React.FC = () => {
  const [exportList, setExportList] = useState<IExportList>({ total: 0, list: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [paginationParam, setPaginationParam] = useState({ current: 1, pageSize: 10 });
  const [exportModal, setExportModal] = useState(false);
  const [searchParam, setSearchParam] = useState<ISearchParam>({
    status: 0,
    createName: '',
    createBeginTime: '',
    createEndTime: ''
  });
  const [form] = Form.useForm();
  const { RangePicker } = DatePicker;

  const history = useHistory();

  // 获取列表
  const getExportList = () => {
    setIsLoading(true);
    const listItem = {
      name: '人保贵州线上理赔一组坐席清单',
      number: '202112011200',
      createTime: '2021-04-30 11:23 ',
      createName: '李思',
      status: 0, // 0:校验中 1:成功 2:异常
      successCount: '12/1000'
    };
    const list = [];
    for (let i = 0; i < 20; i++) {
      const initalItem = { ...listItem };
      initalItem.number = +listItem.number + i + '';
      i % 2 === 0 ? (listItem.status = 0) : (listItem.status = 1);
      i % 3 === 0 && (listItem.status = 2);
      list.push(initalItem);
    }
    setExportList({ total: list.length, list: list });
    setIsLoading(false);
  };
  // 查询
  const onFinishHandle = () => {
    const { status, createName, createTime } = form.getFieldsValue();
    let createBeginTime = '';
    let createEndTime = '';
    if (createTime) {
      createBeginTime = createTime[0].format('YYYY-MM-DD') + ' 00:00:00';
      createEndTime = createTime[1].format('YYYY-MM-DD') + ' 23:59:59';
    }
    console.log({ status, createName, createBeginTime, createEndTime });
    setSearchParam({ status, createName, createBeginTime, createEndTime });
  };
  // 重置
  const onResetHandle = () => {
    console.log(searchParam);
    console.log('重置表格~');
  };
  // 批量上传
  const mulitiUpload = () => {
    console.log('批量上传');
  };
  /**
   * @interfaceType 1全量导出 2导出模板
   *  */
  const onDownLoadExcel = async (interfaceType: number, fileName: string) => {
    if (interfaceType === 1) {
      console.log('全量导出', fileName);
    } else {
      console.log('导出模板', fileName);
    }
  };
  useEffect(() => {
    getExportList();
  }, []);
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
        <Button type="primary" className={style.btn} onClick={() => setExportModal(true)}>
          上传表格
        </Button>
        <Button type="primary" className={style.btn}>
          下载新增员工信息表
        </Button>
        <Button type="primary" className={style.btn}>
          下载模板
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
          <Form.Item className={style.label} name="status" label="状态：">
            <Select placeholder="待选择" className={style.selectBox} allowClear style={{ width: 180 }}>
              {[1, 2, 3].map((item) => (
                <Select.Option key={item} value={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item className={style.label} name="createName" label="创建人：">
            <Input placeholder="待输入" className={style.inputBox} allowClear style={{ width: 180 }} />
          </Form.Item>
          <Form.Item className={style.label} name="createTime" label="创建时间：">
            <RangePicker className={style.rangePicker} style={{ width: 300 }} />
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
        dataSource={exportList.list}
        columns={TableColumns()}
        loading={isLoading}
        {...TablePagination({
          exportList,
          paginationParam,
          setPaginationParam
        })}
      />
      <ExportModal
        visible={exportModal}
        onOK={mulitiUpload}
        onCancel={() => setExportModal(false)}
        onDownLoad={() => onDownLoadExcel(2, '敏感词列表模板')}
      />
    </div>
  );
};
export default MultiLaod;
