import React, { useState, useEffect, useContext } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Space } from 'antd';
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
  const onValuesChange = () => {
    console.log('a');
  };
  const onSearch = () => {
    console.log('onSearch');
  };

  const getList = async () => {
    const { list, total } = await getSpeechList({});
    setDataSource(list || []);
    setPagination((pagination) => ({ ...pagination, total: total || 0 }));
  };

  useEffect(() => {
    getList();
  }, []);

  const paginationChange = () => {
    console.log('');
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

  const handleEdit: (scored: SpeechProps) => void = (scored) => {
    console.log(scored);
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
    console.log('sa', operateType, selectedRows);
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
        console.log(res);
      }
    });
    console.log({
      corpId: currentCorpId,
      type: operateType,
      list: selectedRows.map((row) => ({ sceneId: row.sceneId, contentId: row.contentId }))
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
        <NgFormSearch searchCols={searchCols} onSearch={onSearch} onValuesChange={onValuesChange}></NgFormSearch>
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
