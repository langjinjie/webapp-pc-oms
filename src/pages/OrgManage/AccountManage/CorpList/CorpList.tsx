import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Table } from 'antd';
import { requestGetCorpList } from 'src/apis/OrgManage';
import { ICorpList } from 'src/utils/interface';
import { Context } from 'src/store';
import classNames from 'classnames';
import style from './style.module.less';

const CorpList: React.FC = () => {
  const { isMainCorp, currentCorpId } = useContext(Context);
  const [corpList, setCorpList] = useState<ICorpList[]>();
  const [isLoading, setIsloading] = useState<boolean>(false);

  const history = useHistory();

  // 获取企业列表
  const getCorpList = async () => {
    const res = await requestGetCorpList();
    res && setCorpList(res);
    res && setIsloading(false);
  };

  // 表格标题
  const columns = [
    { title: '企业名称', dataIndex: 'corpName' },
    { title: '企业ID', dataIndex: 'corpId' },
    {
      title: '编辑',
      render: (row: ICorpList) => (
        <span
          onClick={() => {
            if (isMainCorp ? '' : row.corpId !== currentCorpId) return;
            history.push('/orgManage/detail', { corpId: row.corpId });
          }}
          className={classNames(style.detail, {
            [style.detailDisabled]: isMainCorp ? '' : row.corpId !== currentCorpId
          })}
        >
          详情
        </span>
      )
    }
  ];

  const rowClassName = (record: ICorpList) => {
    console.log(record);
    return isMainCorp ? '' : record.corpId !== currentCorpId ? style.rowDisabled : '';
  };

  useEffect(() => {
    setIsloading(true);
    getCorpList();
  }, []);
  return (
    <div>
      <Table
        // bordered
        loading={isLoading}
        columns={columns}
        className={style.tableWrap}
        dataSource={corpList}
        pagination={false}
        rowKey={'corpId'}
        rowClassName={rowClassName}
      />
    </div>
  );
};
export default CorpList;
