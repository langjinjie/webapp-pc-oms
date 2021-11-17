import { PlusOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { Icon, NgFormSearch, NgTable } from 'src/components';
import { PaginationProps } from 'src/components/TableComponent/TableComponent';
import ExportModal from './Components/ExportModal/ExportModal';
import PreviewSpeech from './Components/PreviewSpeech/PreviewSpeech';
import { columns, searchCols, SpeechProps } from './Config';

import style from './style.module.less';

const SpeechManage: React.FC<RouteComponentProps> = ({ history }) => {
  const [pagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0,
    showTotal: (total) => {
      return `共 ${total} 条记录`;
    }
  });
  const [operationType, setOperationType] = useState<number | null>(null);
  const [visibleExport, setVisibleExport] = useState(false);
  const [checking, setChecking] = useState(false);
  const [selectedRowKeys, setSelectRowKeys] = useState<React.Key[]>([]);
  const [visiblePreview, setVisiblePreview] = useState(false);
  const [dataSource, setDataSource] = useState<SpeechProps[]>([]);
  const [loading] = useState(false);
  const onValuesChange = () => {
    console.log('a');
  };
  const onSearch = () => {
    console.log('onSearch');
  };
  const paginationChange = () => {
    console.log('');
  };

  const isDisabled = (operationType: number | null, status: number) => {
    let _isDisabled = false;
    if (operationType) {
      if (operationType === 1 && status === 2) {
        _isDisabled = true;
      } else if (operationType === 2 && (status === 1 || status === 3)) {
        _isDisabled = true;
      }
    }
    return _isDisabled;
  };

  const onSelectChange = (selectedRowKeys: React.Key[], selectedRows: SpeechProps[]) => {
    setSelectRowKeys(selectedRowKeys);
    const current = selectedRows[0];
    if (current) {
      if (current.status === 1 || current.status === 3) {
        setOperationType(1);
      } else {
        setOperationType(2);
      }
    } else {
      setOperationType(null);
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
        disabled: isDisabled(operationType, record.status),
        name: record.content
      };
    }
  };

  const handleEdit: (id: string) => void = (id) => {
    console.log(id);
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
      setDataSource([]);
    }
  };
  const operateStatus = (operateType: number) => {
    console.log('sa', operateType);
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
              disabled={operationType !== 1}
              onClick={() => operateStatus(1)}
            >
              上架
            </Button>
            <Button
              type="primary"
              shape={'round'}
              ghost
              disabled={operationType !== 1}
              onClick={() => operateStatus(1)}
            >
              待上架
            </Button>
            <Button
              type="primary"
              shape={'round'}
              ghost
              disabled={operationType !== 1}
              onClick={() => operateStatus(1)}
            >
              下架
            </Button>
            <Button
              type="primary"
              shape={'round'}
              ghost
              disabled={operationType !== 2}
              onClick={() => operateStatus(2)}
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
