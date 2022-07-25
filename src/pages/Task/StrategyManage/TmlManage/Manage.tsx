import React, { useEffect, useState } from 'react';
import { Button, PaginationProps, Pagination } from 'antd';
import style from './style.module.less';
import classNames from 'classnames';
import { NgFormSearch } from 'src/components';
import { searchCols, TplType } from './config';
import { RouteComponentProps } from 'react-router-dom';
import { getTplListOfCorp } from 'src/apis/task';

const Manage: React.FC<RouteComponentProps> = ({ history }) => {
  const [tplList, setTplList] = useState<TplType[]>([]);
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0,
    showTotal: (total) => {
      return `共 ${total} 条记录`;
    }
  });
  const onSearch = (values: any) => {
    console.log(values);
  };

  const getList = async (params?: any) => {
    const res = await getTplListOfCorp({
      ...params
    });
    if (res) {
      const { total, list } = res;
      setTplList(list || []);
      setPagination((pagination) => ({ ...pagination, total }));
    }
  };

  const onPaginationChange = (pageNum: number) => {
    setPagination((pagination) => ({ ...pagination, current: pageNum }));
    getList({ pageNum });
  };

  useEffect(() => {
    getList();
  }, []);

  const selectedTemplate = (tplId: string) => {
    history.push('/strategyManage/detail?tplId=' + tplId);
  };
  return (
    <div>
      <div className={classNames(style.banner, 'flex align-center justify-end')}>
        <h3>自动化运营体系,助力机构效率提升</h3>
      </div>
      <div className="ph20">
        <NgFormSearch searchCols={searchCols} onSearch={onSearch} hideReset />
        <div className={style.taskWrap}>
          {tplList.map((item) => (
            <div className={style.taskItem} key={item.tplId}>
              <div className={style.taskImgWrap}>
                <img className={style.taskImg} src={item.displayCoverImg} />
              </div>
              <div className={style.taskName}>{item.tplName}</div>
              <div className={style.taskTarget}>效果：{item.taskDesc}</div>
              <div className={style.taskTips}>任务说明：{item.sceneDesc}</div>
              <Button className={style.useBtn} type="primary" onClick={() => selectedTemplate(item.tplId)}>
                立即使用
              </Button>
            </div>
          ))}
        </div>
        <div className={style.paginationWrap}>
          <Pagination {...pagination} onChange={onPaginationChange}></Pagination>
        </div>
      </div>
    </div>
  );
};
export default Manage;
