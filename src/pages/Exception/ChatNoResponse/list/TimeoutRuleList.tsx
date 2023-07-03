import React, { useEffect, useState } from 'react';
import { Button, message, Modal, Space } from 'antd';
import { NgFormSearch, NgTable, ExportModal, AuthBtn } from 'src/components';
import { RuleColumns, searchCols, tableColumnsFun } from './Config';
import { useHistory } from 'react-router-dom';
import { delChatTimeoutRule, getChatTimeoutRuleList, getChatTimeoutTpl, uploadFileWithMark } from 'src/apis/exception';
import { OnOperateType } from 'src/utils/interface';
import { useDidRecover } from 'react-router-cache-route';

const TimeoutRuleList: React.FC = () => {
  const [dateVisible, setDateVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formatVisible, setFormatVisible] = useState(false);
  const [selectedRows, setSelectedRows] = useState<RuleColumns[]>([]);
  const [dataSource, setDataSource] = useState<Partial<RuleColumns>[]>([]);
  const history = useHistory();
  const [pagination, setPagination] = useState({
    pageNum: 1,
    pageSize: 10,
    total: 0
  });
  const [searchValues, setSearchValues] = useState<any>({});

  const uploadFile = async (file: File, fileType: number) => {
    const formData = new FormData();
    formData.append('fileName', file);
    formData.append('type', fileType + '');
    const res = await uploadFileWithMark(formData);
    if (res) {
      message.success('导入成功！');
      fileType === 1 ? setDateVisible(false) : setFormatVisible(false);
    }
  };
  const onRowSelectChange = (selectedRows: RuleColumns[]) => {
    setSelectedRows(selectedRows);
  };

  const getList = async (params?: any) => {
    setLoading(true);
    const res = await getChatTimeoutRuleList({
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      ...searchValues,
      ...params
    });
    setLoading(false);
    if (res) {
      const { list, total } = res;
      setDataSource(list);
      setPagination((pagination) => ({
        ...pagination,
        total,
        pageNum: params?.pageNum || 1,
        pageSize: params?.pageSize || pagination.pageSize
      }));
    }
  };

  const onSearch = (values: any) => {
    setSearchValues(values);
    getList({ ...values, pageNum: 1 });
  };

  useEffect(() => {
    getList();
  }, []);

  // 删除列表选中的规则
  const onDeleteItems = async (items: RuleColumns[], index?: number) => {
    const res = await delChatTimeoutRule({ ruleIds: items.map((item) => item.ruleId) });
    if (res) {
      message.success('删除成功');
      if (index !== undefined) {
        const copyData = [...dataSource];
        copyData.splice(index, 1);
        if (copyData.length === 0) {
          getList({ pageNum: 1 });
        } else {
          setDataSource(copyData);
        }
      } else {
        getList({ pageNum: 1 });
      }
    }
  };

  // 批量删除按钮点击
  const batchDelete = () => {
    Modal.confirm({
      content: '是否确定删除规则',
      onOk: () => {
        console.log('我确定了');
        onDeleteItems(selectedRows);
      }
    });
  };

  // 获取模板链接并下载
  const onDownloadTpl = async (tplType: 1 | 2) => {
    const res = await getChatTimeoutTpl({
      type: tplType
    });
    if (res) {
      window.location.href = res.tplUrl;
    }
  };

  // 规则操作按钮点击
  const onOperate: OnOperateType<RuleColumns> = (type, record, index) => {
    if (type === 'delete') {
      onDeleteItems([record!], index);
    } else {
      history.push('/chatNR/detail?ruleId=' + record?.ruleId, { record });
    }
  };
  // 监听页面是否需要刷新
  useDidRecover(() => {
    if (window.location.href.indexOf('pageNum') > 0) {
      setPagination((pagination) => ({ ...pagination, pageNum: 1 }));
      getList({ pageNum: 1 });
      history.replace('/chatNR', {});
    }
  });

  return (
    <div className="mt14">
      <Space size={20}>
        <AuthBtn path="/create">
          <Button
            type="primary"
            shape="round"
            onClick={() => {
              history.push('/chatNR/detail');
            }}
          >
            新建规则
          </Button>
        </AuthBtn>
        <AuthBtn path="/workday">
          <Button
            type="primary"
            shape="round"
            onClick={() => {
              setDateVisible(true);
            }}
          >
            工作日维护
          </Button>
        </AuthBtn>
        <AuthBtn path="/markFilter">
          <Button
            type="primary"
            shape="round"
            onClick={() => {
              setFormatVisible(true);
            }}
          >
            结束词过滤
          </Button>
        </AuthBtn>
      </Space>
      <AuthBtn path="/query">
        <NgFormSearch className="mt30" searchCols={searchCols} onSearch={onSearch} />
      </AuthBtn>
      <NgTable
        rowKey="ruleId"
        rowSelection={{
          type: 'checkbox',
          onChange: (selectedRowKeys, selectedRows) => onRowSelectChange(selectedRows)
        }}
        loading={loading}
        loadData={getList}
        dataSource={dataSource}
        pagination={pagination}
        className="mt16"
        columns={tableColumnsFun(onOperate)}
      ></NgTable>
      {dataSource.length > 0 && (
        <AuthBtn path="/delete">
          <div className={'operationWrap'}>
            <Button
              type="primary"
              shape={'round'}
              disabled={selectedRows.length === 0}
              ghost
              onClick={() => batchDelete()}
            >
              批量删除
            </Button>
          </div>
        </AuthBtn>
      )}

      <ExportModal
        title="工作日维护"
        onDownLoad={() => {
          onDownloadTpl(1);
        }}
        okText={'更新'}
        onOK={(file) => uploadFile(file, 1)}
        visible={dateVisible}
        onCancel={() => setDateVisible(false)}
      ></ExportModal>
      <ExportModal
        title="结束词过滤配置"
        onDownLoad={() => {
          onDownloadTpl(2);
        }}
        okText={'更新'}
        onOK={(file) => uploadFile(file, 2)}
        visible={formatVisible}
        onCancel={() => setFormatVisible(false)}
      ></ExportModal>
    </div>
  );
};

export default TimeoutRuleList;
