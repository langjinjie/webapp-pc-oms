import classNames from 'classnames';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { NgTable } from 'src/components';
import { tableColumns } from './config';

import styles from './style.module.less';

const AddFriend: React.FC<RouteComponentProps> = ({ history }) => {
  const toDetailPage = (record: any) => {
    console.log(record);
    history.push('/dashboard/AddFriend/detail');
  };
  return (
    <div className={classNames(styles.addFriend, 'container')}>
      <NgTable
        rowClassName={(record, index) => {
          if (index === 0) {
            return 'trHighlight';
          }
          return '';
        }}
        columns={tableColumns({ toDetailPage })}
        dataSource={[
          {
            taskName1: '测试',
            id: 1,
            taskName2: '广东'
          },
          {
            taskName1: '开发',
            taskName2: '广东',
            id: 2
          },
          {
            taskName1: '产品',
            taskName2: '广东',
            id: 3
          }
        ]}
        rowKey="id"
        loading={false}
      ></NgTable>
    </div>
  );
};

export default AddFriend;
