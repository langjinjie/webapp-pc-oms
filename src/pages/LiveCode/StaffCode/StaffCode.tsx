import React, { Key, useEffect, useState } from 'react';
import { Button, DatePicker, Form, Input, message, Modal, Row, Select } from 'antd';
import { SelectStaff /* , TagModal */ } from 'src/pages/StaffManage/components';
import { NgTable } from 'src/components';
import { tableColumnsFun, IStaffLiveCode, liveTypeList } from './Config';
import { PlusOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { statusList } from 'src/pages/LiveCode/MomentCode/Config';
import { requestGetChannelGroupList } from 'src/apis/channelTag';
import { requestGetStaffLiveList, requestDownloadStaffLiveCode, requestManageStaffLiveCode } from 'src/apis/liveCode';
import { IChannelTagList } from 'src/pages/Operation/ChannelTag/Config';
import { IPagination } from 'src/utils/interface';
import style from './style.module.less';
import { exportFile } from 'src/utils/base';

const StaffCode: React.FC = () => {
  const [list, setList] = useState<IStaffLiveCode[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [channelTagList, setChannelTagList] = useState<IChannelTagList[]>([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [formParam, setFormParam] = useState<{ [key: string]: any }>({});
  const [recordItem, setRecordItem] = useState<IStaffLiveCode>();
  const [pagination, setPagination] = useState<IPagination>({ current: 1, pageSize: 10, total: 0 });

  const [form] = Form.useForm();
  const { Item } = Form;
  const { RangePicker } = DatePicker;

  const history = useHistory();

  // 获取投放渠道标签
  const getChannelGroupList = async () => {
    const res = await requestGetChannelGroupList({ groupName: '投放渠道' });
    if (res) {
      setChannelTagList(res.list?.[0]?.tagList || []);
    }
  };

  // 获取列表
  const getList = async (values?: any) => {
    setTableLoading(true);
    const res = await requestGetStaffLiveList({ ...values });
    if (res) {
      setList(res.list);
      setSelectedRowKeys([]);
      setRecordItem(undefined);
      setPagination((pagination) => ({ ...pagination, total: res.total }));
    }
    setTableLoading(false);
  };

  const onFinishHandle = (values?: any) => {
    const { expireDay, createTime, updateTime, staffId } = values;
    let beginCreateTime;
    let endCreateTime;
    let beginUpdateTime;
    let endUpdateTime;
    if (createTime) {
      beginCreateTime = createTime[0].startOf('day').format('YYYY-MM-DD HH:mm:ss');
      endCreateTime = createTime[1].endOf('day').format('YYYY-MM-DD HH:mm:ss');
    }
    if (updateTime) {
      beginUpdateTime = updateTime[0].startOf('day').format('YYYY-MM-DD HH:mm:ss');
      endUpdateTime = updateTime[1].endOf('day').format('YYYY-MM-DD HH:mm:ss');
    }
    if (expireDay) {
      values.expireDay = expireDay.endOf('day').format('YYYY-MM-DD HH:mm:ss');
    }
    delete values.createTime;
    delete values.updateTime;
    const param = {
      ...values,
      beginCreateTime,
      endCreateTime,
      beginUpdateTime,
      endUpdateTime,
      staffId: staffId?.[0]?.staffId
    };
    getList(param);
    setPagination((pagination) => ({ ...pagination, current: 1 }));
    setFormParam(param);
  };

  // 重置
  const onResetHandle = async () => {
    await getList();
    setPagination((pagination) => ({ ...pagination, current: 1, pageSize: 10 }));
    setFormParam({});
  };

  // 切换分页
  const paginationChange = (current: number, pageSize?: number) => {
    const pageNum = pageSize !== pagination.pageSize ? 1 : current;
    setPagination((pagination) => ({ ...pagination, current: pageNum, pageSize: pageSize as number }));
    getList({ ...formParam, pageNum, pageSize: pageSize as number });
  };

  const onSelectChange = (selectedRowKeys: Key[]) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection: any = {
    hideSelectAll: true,
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: Key[], records: IStaffLiveCode[]) => {
      onSelectChange(selectedRowKeys);
      setRecordItem(records[0]);
    },
    getCheckboxProps: (record: IStaffLiveCode) => {
      return {
        disabled: recordItem && record.status !== recordItem?.status
      };
    }
  };

  // 批量下载
  const batchDownLoadHandle = async () => {
    Modal.confirm({
      title: '批量下载提醒',
      centered: true,
      content: `此次操作共下载：${selectedRowKeys.length}个活码。请您确认`,
      async onOk () {
        const res = await requestDownloadStaffLiveCode({ liveIdList: selectedRowKeys });
        if (res) {
          const fileName = decodeURI(res.headers['content-disposition'].split('=')[1]);
          exportFile(res.data, fileName.split('.')[0], fileName.split('.')[1]);
          setSelectedRowKeys([]);
          setRecordItem(undefined);
        }
      }
    });
  };
  // 作废/删除 2-作废 1-删除
  const batchManageGroupLive = async (option: number, keys: Key[]) => {
    const onOk = async () => {
      const res = await requestManageStaffLiveCode({ option, liveIdList: keys });
      if (res) {
        const { current, pageSize } = pagination;
        let pageNum = current;
        message.success(`员工活码${option === 1 ? '删除' : '作废'}成功`);
        if (option === 1 && list.length <= keys.length && current !== 1) {
          pageNum -= 1;
        }
        getList({ ...formParam, pageNum, pageSize });
      }
    };
    Modal.confirm({
      title: `批量${option === 1 ? '删除' : '作废'}提醒`,
      centered: true,
      content: `此次操作共${option === 1 ? '删除' : '作废'}：${keys.length}个活码。请您确认`,
      onOk
    });
  };

  useEffect(() => {
    getChannelGroupList();
    getList();
  }, []);
  return (
    <div className={style.wrap}>
      <h1>员工活码列表</h1>
      <Form className={style.form} form={form} onFinish={onFinishHandle} onReset={onResetHandle}>
        <Row>
          <Item label="活码ID" name="liveId">
            <Input placeholder="请输入" allowClear />
          </Item>
          <Item label="活码名称" name="name">
            <Input placeholder="请输入" allowClear />
          </Item>
          <Item label="创建时间" name="createTime">
            <RangePicker allowClear />
          </Item>
          <Item label="更新时间" name="updateTime">
            <RangePicker allowClear />
          </Item>
        </Row>
        <Row>
          <Item label="投放渠道" name="tagName">
            <Select
              options={channelTagList}
              fieldNames={{ label: 'tagName', value: 'tagName' }}
              placeholder="请选择"
              allowClear
            />
          </Item>
          <Item label="使用员工" name="staffId">
            <SelectStaff type="staff" singleChoice />
          </Item>
          <Item label="活码类型" name="liveType">
            <Select options={liveTypeList} placeholder="请选择" allowClear />
          </Item>
          <Item label="活码状态" name="status">
            <Select options={statusList} placeholder="请选择" allowClear />
          </Item>
          <Item label="有效期" name="expireDay">
            <DatePicker allowClear />
          </Item>
          <Button className={style.submitBtn} type="primary" htmlType="submit">
            查询
          </Button>
          <Button className={style.resetBtn} htmlType="reset">
            重置
          </Button>
        </Row>
      </Form>
      <div className={style.addCode}>
        <Button
          className={style.addCodeBtn}
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => history.push('/staffCode/addCode?add=true')}
        >
          新增活码
        </Button>
      </div>
      <NgTable
        rowKey="liveId"
        loading={tableLoading}
        columns={tableColumnsFun(batchManageGroupLive)}
        scroll={{ x: 'max-content' }}
        dataSource={list}
        rowSelection={rowSelection}
        pagination={pagination}
        paginationChange={paginationChange}
      />
      <div className={style.batch}>
        <Button
          className={style.batchVoid}
          disabled={selectedRowKeys.length === 0 || ![0, 1].includes(recordItem?.status as number)}
          onClick={() => batchManageGroupLive(2, selectedRowKeys)}
        >
          批量作废
        </Button>
        <Button
          className={style.batchDel}
          disabled={selectedRowKeys.length === 0 || recordItem?.status !== 2}
          onClick={() => batchManageGroupLive(1, selectedRowKeys)}
        >
          批量删除
        </Button>
        <Button
          className={style.batchDownLoad}
          onClick={batchDownLoadHandle}
          disabled={selectedRowKeys.length === 0 || recordItem?.status !== 0}
        >
          批量下载
        </Button>
      </div>
    </div>
  );
};
export default StaffCode;
