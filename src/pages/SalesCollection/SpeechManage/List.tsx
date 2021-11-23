import React, { useState, useEffect, useContext } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Modal, Space } from 'antd';
import { RouteComponentProps } from 'react-router';
import { getSpeechList, operateSpeechStatus } from 'src/apis/salesCollection';
import { Icon, NgFormSearch, NgTable } from 'src/components';
import { PaginationProps } from 'src/components/TableComponent/TableComponent';
import ExportModal from './Components/ExportModal/ExportModal';
import PreviewSpeech from './Components/PreviewSpeech/PreviewSpeech';
import { columns, searchCols, SpeechProps } from './Config';

import style from './style.module.less';
import { Context } from 'src/store';

const SpeechManage: React.FC<RouteComponentProps> = ({ history }) => {
  const { currentCorpId } = useContext(Context);
  const [formParams, setFormParams] = useState({
    catalogId: '',
    content: '',
    contentType: '',
    sensitive: '',
    status: '',
    tip: '',
    updateBeginTime: '',
    updateEndTime: ''
  });
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0,
    showTotal: (total) => {
      return `共 ${total} 条记录`;
    }
  });
  const [currentType, setCurrentType] = useState<number | null>(null);
  const [visibleExport, setVisibleExport] = useState(false);
  const [checking, setChecking] = useState(false);
  const [selectedRowKeys, setSelectRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<SpeechProps[]>([]);
  const [visiblePreview, setVisiblePreview] = useState(false);
  const [dataSource, setDataSource] = useState<SpeechProps[]>([]);
  const [loading] = useState(false);
  const onValuesChange = (values: any) => {
    const {
      catalogId = '',
      content = '',
      contentType = '',
      sensitive = '',
      status = '',
      times = undefined,
      tip = ''
    } = values;
    let updateBeginTime = '';
    let updateEndTime = '';
    if (times) {
      updateBeginTime = times[0].startOf('day').valueOf();
      updateEndTime = times[1].endOf('day')?.valueOf();
    }
    setFormParams((formParams) => ({
      ...formParams,
      catalogId,
      content,
      contentType,
      sensitive,
      status,
      tip,
      updateBeginTime,
      updateEndTime
    }));
  };

  // 查询话术列表
  const getList = async (params?: any) => {
    // 清空选中的列表
    setSelectRowKeys([]);
    // 重置当前操作状态
    setCurrentType(null);
    const { list, total } = await getSpeechList({ ...formParams, ...params });
    setDataSource(list || []);
    setPagination((pagination) => ({ ...pagination, total: total || 0 }));
  };
  // 点击查询按钮
  const onSearch = async (values: any) => {
    // 将页面重置为第一页
    setPagination((pagination) => ({ ...pagination, current: 1 }));
    const {
      catalogId = '',
      content = '',
      contentType = '',
      sensitive = '',
      status = '',
      times = undefined,
      tip = ''
    } = values;
    let updateBeginTime = '';
    let updateEndTime = '';
    if (times) {
      updateBeginTime = times[0].startOf('day').valueOf();
      updateEndTime = times[1].endOf('day')?.valueOf();
    }
    setFormParams((formParams) => ({
      ...formParams,
      catalogId,
      content,
      contentType,
      sensitive,
      status,
      tip,
      updateBeginTime,
      updateEndTime
    }));
    await getList({
      catalogId,
      content,
      contentType,
      sensitive,
      status,
      tip,
      updateBeginTime,
      updateEndTime
    });
  };

  useEffect(() => {
    getList();
  }, []);

  // 分页改变
  const paginationChange = (pageNum: number, pageSize?: number) => {
    setPagination((pagination) => ({ ...pagination, current: pageNum, pageSize: pageSize || pagination.pageSize }));
    getList({ pageNum, pageSize });
  };

  const isDisabled = (currentType: number | null, status: number) => {
    let _isDisabled = false;

    if (currentType !== null && currentType !== status) {
      _isDisabled = true;
    }
    return _isDisabled;
  };

  const onSelectChange = (selectedRowKeys: React.Key[], selectedRows: SpeechProps[]) => {
    setSelectRowKeys(selectedRowKeys);
    setSelectedRows(selectedRows);
    const current = selectedRows[0];
    if (current) {
      setCurrentType(current.status);
    } else {
      setCurrentType(null);
    }
  };

  const rowSelection = {
    hideSelectAll: true,
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: SpeechProps[]) => {
      onSelectChange(selectedRowKeys, selectedRows);
    },
    getCheckboxProps: (record: SpeechProps) => {
      return {
        disabled: isDisabled(currentType, record.status),
        name: record.content
      };
    }
  };

  // 编辑话术
  const handleEdit: (scored: SpeechProps) => void = (scored) => {
    history.push(`/speechManage/edit?sceneId=${scored.sceneId}&contentId=${scored.contentId}`);
  };
  const handleSort: (record: SpeechProps) => void = (record) => {
    console.log(record);
  };

  const handleAdd = () => {
    history.push('/speechManage/edit');
  };

  const handleChecked = () => {
    setChecking(true);
    setTimeout(() => {
      setChecking(false);
    }, 3000);
  };
  const handleExport = () => {
    if (dataSource.length > 0) {
      console.log(dataSource);
    }
  };
  const operateStatus = (operateType: number) => {
    Modal.confirm({
      title:
        operateType === 0 ? '待上架提醒' : operateType === 1 ? '上架提醒' : operateType === 2 ? '下架提醒' : '删除提醒',
      content:
        operateType === 0
          ? '确认将选中的话术改为待上架？'
          : operateType === 1
            ? '确定上架选中的话术吗？'
            : operateType === 2
              ? '确定下架选中的话术？'
              : '确定删除选中的话术？',
      cancelText: '取消',
      okText: '确定',
      onOk: async () => {
        const res = await operateSpeechStatus({
          corpId: currentCorpId,
          type: operateType,
          list: selectedRows.map((row) => ({ sceneId: row.sceneId, contentId: row.contentId }))
        });
        if (res) {
          // 清空选中的列表
          setSelectRowKeys([]);
          // 重置当前操作状态
          setCurrentType(null);

          const { successNum, failNum } = res;
          message.success(`已完成！操作成功${successNum}条，操作失败${failNum}条`);
          // 重新更新列表
          setPagination((pagination) => ({ ...pagination, current: 1 }));
          getList({ pageNum: 1 });
        }
      }
    });
  };
  return (
    <div className="container">
      <div className="flex justify-between">
        <Space size={20}>
          <Button
            className={style.btnAdd}
            type="primary"
            onClick={handleAdd}
            shape="round"
            icon={<PlusOutlined />}
            size="large"
            style={{ width: 128 }}
          >
            新增
          </Button>
          <Button
            className={style.btnAdd}
            type="primary"
            onClick={() => setVisibleExport(true)}
            shape="round"
            icon={<PlusOutlined />}
            size="large"
            style={{ width: 128 }}
          >
            批量新增
          </Button>
          <Button
            className={style.btnAdd}
            type="primary"
            onClick={() => handleChecked()}
            shape="round"
            size="large"
            style={{ width: 128 }}
            loading={checking}
          >
            {!checking ? '敏感词校验' : '正在校验'}
          </Button>
        </Space>
        <Button
          className={style.btnAdd}
          type="primary"
          onClick={() => setVisiblePreview(true)}
          shape="round"
          size="large"
        >
          <Icon className="font16" name="yulan" />
          <span className="ml10">预览</span>
        </Button>
      </div>
      <div className="form-inline pt20">
        <NgFormSearch searchCols={searchCols} onSearch={onSearch} onValuesChange={onValuesChange} />
      </div>

      <NgTable
        dataSource={dataSource}
        columns={columns({ handleEdit, handleSort })}
        setRowKey={(record: SpeechProps) => {
          return record.contentId;
        }}
        loading={loading}
        rowSelection={rowSelection}
        pagination={pagination}
        paginationChange={paginationChange}
      ></NgTable>
      {dataSource.length > 0 && (
        <div className={'operationWrap'}>
          <Space size={20}>
            <Button type="primary" shape={'round'} ghost onClick={() => handleExport()}>
              导出
            </Button>
            <Button
              type="primary"
              shape={'round'}
              ghost
              disabled={currentType === 1 || selectedRowKeys.length === 0}
              onClick={() => operateStatus(1)}
            >
              上架
            </Button>
            <Button
              type="primary"
              shape={'round'}
              ghost
              disabled={currentType === 0 || selectedRowKeys.length === 0}
              onClick={() => operateStatus(0)}
            >
              待上架
            </Button>
            <Button
              type="primary"
              shape={'round'}
              ghost
              disabled={currentType === 2 || selectedRowKeys.length === 0}
              onClick={() => operateStatus(2)}
            >
              下架
            </Button>
            <Button
              type="primary"
              shape={'round'}
              ghost
              disabled={currentType === 1 || selectedRowKeys.length === 0}
              onClick={() => operateStatus(3)}
            >
              删除
            </Button>
          </Space>
        </div>
      )}
      {/* 列表数据 end */}
      {/* 批量新增 */}
      <ExportModal
        visible={visibleExport}
        onOK={() => setVisibleExport(false)}
        onCancel={() => setVisibleExport(false)}
      />

      {/* 话术预览 */}
      <PreviewSpeech
        visible={visiblePreview}
        onClose={() => {
          console.log('aaaa111');
          setVisiblePreview(false);
        }}
      ></PreviewSpeech>
    </div>
  );
};
export default SpeechManage;
