import React, { Key, useEffect, useState } from 'react';
import { Button, DatePicker, Form, Input, message, Modal, Row, Select } from 'antd';
import { AuthBtn, NgTable } from 'src/components';
import { tableColumnsFun, statusList, IGroupChatLiveCode } from './Config';
import { PlusOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import {
  requestDownloadGroupLiveCode,
  requestGetGroupLiveCodeList,
  requestManageGroupLiveCode
} from 'src/apis/liveCode';
import { requestGetChannelGroupList } from 'src/apis/channelTag';
import { IChannelTagList } from 'src/pages/Operation/ChannelTag/Config';
import { IPagination } from 'src/utils/interface';
import { exportFile } from 'src/utils/base';
import style from './style.module.less';

const MomentCode: React.FC = () => {
  const [channelTagList, setChannelTagList] = useState<IChannelTagList[]>([]);
  const [pagination, setPagination] = useState<IPagination>({ current: 1, pageSize: 10, total: 0 });
  const [list, setList] = useState<any[]>([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [formParam, setFormParam] = useState<{ [key: string]: any }>({});
  const [recordItem, setRecordItem] = useState<IGroupChatLiveCode>();

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

  const getList = async (values?: any) => {
    setTableLoading(true);
    const res = await requestGetGroupLiveCodeList({ ...values });
    if (res) {
      setList(res.list);
      setSelectedRowKeys([]);
      setRecordItem(undefined);
    }
    setTableLoading(false);
  };

  const onFinishHandle = (values?: any) => {
    const { liveId, name, channel, createTime, updateTime, status } = values;
    let createStartTime;
    let createEndTime;
    let updateStartTime;
    let updateEndTime;
    if (createTime) {
      createStartTime = createTime[0].startOf('day').format('YYYY-MM-DD HH:mm:ss');
      createEndTime = createTime[1].endOf('day').format('YYYY-MM-DD HH:mm:ss');
    }
    if (updateTime) {
      updateStartTime = updateTime[0].startOf('day').format('YYYY-MM-DD HH:mm:ss');
      updateEndTime = updateTime[1].endOf('day').format('YYYY-MM-DD HH:mm:ss');
    }
    getList({ liveId, name, channel, createStartTime, createEndTime, updateStartTime, updateEndTime, status });
    setPagination((pagination) => ({ ...pagination, current: 1 }));
    setFormParam({ liveId, name, channel, createStartTime, createEndTime, updateStartTime, updateEndTime, status });
  };

  // 重置
  const onResetHandle = () => {
    getList();
    setPagination((pagination) => ({ ...pagination, current: 1 }));
    setFormParam({});
  };

  const onSelectChange = (selectedRowKeys: Key[]) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  // 切换分页
  const paginationChange = (current: number, pageSize?: number) => {
    const pageNum = pageSize !== pagination.pageSize ? 1 : current;
    setPagination((pagination) => ({ ...pagination, current: pageNum, pageSize: pageSize as number }));
    getList({ ...formParam, pageNum, pageSize: pageSize as number });
  };

  const rowSelection: any = {
    hideSelectAll: true,
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: Key[], records: IGroupChatLiveCode[]) => {
      onSelectChange(selectedRowKeys);
      setRecordItem(records[0]);
    },
    getCheckboxProps: (record: IGroupChatLiveCode) => {
      return {
        disabled: recordItem && record.status !== recordItem?.status
      };
    }
  };

  // 批量下载
  const batchDownLoadHandle = async () => {
    Modal.confirm({
      title: '操作提醒',
      centered: true,
      content: `此次下载${selectedRowKeys.length}条数据，确定要下载吗？`,
      async onOk () {
        const res = await requestDownloadGroupLiveCode({ liveIdList: selectedRowKeys });
        if (res) {
          const fileName = decodeURI(res.headers['content-disposition'].split('=')[1]);
          exportFile(res.data, fileName.split('.')[0], fileName.split('.')[1]);
          setSelectedRowKeys([]);
        }
      }
    });
  };
  // 作废/删除 1-作废 2-删除
  const batchManageGroupLive = (type: number) => {
    Modal.confirm({
      title: '操作提醒',
      centered: true,
      content: `确定${type === 1 ? '作废' : '删除'}群活码吗？`,
      async onOk () {
        const res = await requestManageGroupLiveCode({ type, liveIdList: selectedRowKeys });
        if (res) {
          message.success(`群活码${type === 1 ? '作废' : '删除'}成功`);
          getList({ ...formParam, ...pagination });
        }
      }
    });
  };
  useEffect(() => {
    getChannelGroupList();
    getList();
  }, []);
  return (
    <div className={style.wrap}>
      <h1>群活码列表</h1>
      <AuthBtn path="/query">
        <Form className={style.form} form={form} onFinish={onFinishHandle} onReset={onResetHandle}>
          <Row>
            <Item label="群活码ID" name="liveId">
              <Input placeholder="请输入" allowClear />
            </Item>
            <Item label="群活码名称" name="name">
              <Input placeholder="请输入" allowClear />
            </Item>
            <Item label="投放渠道" name="channel">
              <Select
                options={channelTagList}
                fieldNames={{ label: 'tagName', value: 'tagName' }}
                placeholder="请选择"
                allowClear
              />
            </Item>
            <Item label="活码状态" name="status">
              <Select options={statusList} placeholder="请选择" allowClear />
            </Item>
          </Row>
          <Row>
            <Item label="创建时间" name="createTime">
              <RangePicker allowClear />
            </Item>
            <Item label="更新时间" name="updateTime">
              <RangePicker allowClear />
            </Item>
            <Button className={style.submitBtn} type="primary" htmlType="submit" loading={tableLoading}>
              查询
            </Button>
            <Button className={style.resetBtn} htmlType="reset" loading={tableLoading}>
              重置
            </Button>
          </Row>
        </Form>
      </AuthBtn>
      <AuthBtn path="/add">
        <div className={style.addCode}>
          <Button
            className={style.addCodeBtn}
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => history.push('/momentCode/addCode')}
          >
            新增群活码
          </Button>
        </div>
      </AuthBtn>
      <NgTable
        rowKey="liveId"
        columns={tableColumnsFun({ updateListHandle: () => getList({ ...formParam, ...pagination }) })}
        scroll={{ x: 'max-content' }}
        dataSource={list}
        rowSelection={rowSelection}
        pagination={{ ...pagination }}
        paginationChange={paginationChange}
        loading={tableLoading}
      />
      <div className={style.batch}>
        <AuthBtn path="/batchVoid">
          <Button
            className={style.batchVoid}
            disabled={selectedRowKeys.length === 0 || recordItem?.status === 2}
            onClick={() => batchManageGroupLive(1)}
          >
            批量作废
          </Button>
        </AuthBtn>
        <AuthBtn path="/batchDelete">
          <Button
            className={style.batchDel}
            disabled={selectedRowKeys.length === 0 || recordItem?.status !== 2}
            onClick={() => batchManageGroupLive(2)}
          >
            批量删除
          </Button>
        </AuthBtn>
        <AuthBtn path="/batchDownload">
          <Button
            className={style.batchDownLoad}
            disabled={selectedRowKeys.length === 0 || recordItem?.status !== 0}
            onClick={batchDownLoadHandle}
          >
            批量下载
          </Button>
        </AuthBtn>
      </div>
    </div>
  );
};
export default MomentCode;
