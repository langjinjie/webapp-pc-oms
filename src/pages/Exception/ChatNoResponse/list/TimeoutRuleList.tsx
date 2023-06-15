import React, { useState } from 'react';
import { Button, Space } from 'antd';
import { NgFormSearch, NgTable, ExportModal } from 'src/components';
import { searchCols, tableColumns } from './Config';
import { useHistory } from 'react-router-dom';

const TimeoutRuleList: React.FC = () => {
  const [dateVisible, setDateVisible] = useState(false);
  const [formatVisible, setFormatVisible] = useState(false);
  const history = useHistory();
  const onSearch = (values: any) => {
    console.log(values);
  };

  const uploadFile = (file: File) => {
    console.log(file);
  };
  return (
    <div className="mt14">
      <Space size={20}>
        <Button
          type="primary"
          shape="round"
          onClick={() => {
            history.push('/chatNR/detail');
          }}
        >
          新建规则
        </Button>
        <Button
          type="primary"
          shape="round"
          onClick={() => {
            setDateVisible(true);
          }}
        >
          工作日维护
        </Button>
        <Button
          type="primary"
          shape="round"
          onClick={() => {
            setFormatVisible(true);
          }}
        >
          结束词过滤
        </Button>
      </Space>

      <NgFormSearch className="mt30" searchCols={searchCols} onSearch={onSearch} />
      <NgTable dataSource={[{}]} pagination={{ total: 100 }} className="mt16" columns={tableColumns}></NgTable>

      <ExportModal
        title="工作日维护"
        onDownLoad={() => {
          console.log('download');
        }}
        onOK={uploadFile}
        visible={dateVisible}
        onCancel={() => setDateVisible(false)}
      ></ExportModal>
      <ExportModal
        title="结束词过滤配置"
        onDownLoad={() => {
          console.log('download');
        }}
        onOK={uploadFile}
        visible={formatVisible}
        onCancel={() => setFormatVisible(false)}
      ></ExportModal>
    </div>
  );
};

export default TimeoutRuleList;
