import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { NgFormSearch, NgTable } from 'src/components';
import { downloadSearchCols, downloadTableColumnFun } from './Config';

const FetchDataDownLoad: React.FC<RouteComponentProps> = () => {
  const onSearch = (values: any) => {
    console.log(values);
  };

  return (
    <div className="container">
      <NgFormSearch className="mt30" onSearch={onSearch} searchCols={downloadSearchCols} />
      <NgTable className="mt20" columns={downloadTableColumnFun()}></NgTable>
    </div>
  );
};

export default FetchDataDownLoad;
