import React from 'react';
import { NgFormSearch, NgTable } from 'src/components';
import { searchCols, tableColumns } from './Config';
// import style from './style.module.less';

const TagParsing: React.FC = () => {
  const onSearch = (values?: any) => {
    console.log('values', values);
  };

  return (
    <div className="container">
      <NgFormSearch searchCols={searchCols} onSearch={onSearch} />
      <NgTable columns={tableColumns()} />
    </div>
  );
};
export default TagParsing;
