import React, { useEffect, useState } from 'react';
import { Button, PaginationProps, Pagination, Image } from 'antd';
import style from './style.module.less';
import classNames from 'classnames';
import { AuthBtn, Empty, NgFormSearch } from 'src/components';
import { searchCols, TplType } from './config';
import { RouteComponentProps } from 'react-router-dom';
import { getTplListOfCorp } from 'src/apis/task';

const Manage: React.FC<RouteComponentProps> = ({ history }) => {
  const [tplList, setTplList] = useState<TplType[]>([]);
  const [formValues, setFormValues] = useState({ tplName: '' });
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0,
    showTotal: (total) => {
      return `共 ${total} 条记录`;
    }
  });
  const getList = async (params?: any) => {
    const pageNum = params?.pageNum || pagination.current;
    const res = await getTplListOfCorp({
      ...formValues,
      ...params,
      pageNum,
      pageSize: pagination.pageSize
    });
    if (res) {
      const { total, list } = res;
      setTplList(list || []);
      setPagination((pagination) => ({ ...pagination, total, current: pageNum }));
    }
  };
  const onSearch = (values: any) => {
    getList({ ...values, pageNum: 1 });
    setFormValues(values);
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

  const onFormValuesChange = (values: any) => {
    setFormValues(values);
  };
  return (
    <div>
      <div className={classNames(style.banner, 'flex align-center justify-end')}>
        <h3>自动化运营体系,助力机构效率提升</h3>
      </div>
      <div className="ph20">
        <AuthBtn path="/add/query">
          <NgFormSearch
            searchCols={searchCols}
            onValuesChange={(changeValue, values) => onFormValuesChange(values)}
            onSearch={onSearch}
            hideReset
          />
        </AuthBtn>
        <div className={style.taskWrap}>
          {tplList.map((item) => (
            <div className={style.taskItem} key={item.tplId}>
              <div className={style.taskImgWrap}>
                <Image
                  height={'100%'}
                  width={'100%'}
                  className={style.taskImg}
                  preview={false}
                  src={item.displayCoverImg}
                />
              </div>
              <div className={classNames(style.taskName, 'ellipsis')}>{item.tplName}</div>
              <div style={{ height: '64px' }}>
                {item.resultDesc && (
                  <div className={classNames(style.taskTarget, 'ellipsis')}>效果：{item.resultDesc}</div>
                )}
                {item.taskDesc && (
                  <div className={classNames(style.taskTips, 'ellipsis mt8')}>任务说明：{item.taskDesc}</div>
                )}
                {item.sceneDesc && (
                  <div className={classNames(style.taskTips, 'ellipsis')}>任务场景：{item.sceneDesc}</div>
                )}
              </div>
              <AuthBtn path="/add/apply">
                <Button className={style.useBtn} type="primary" onClick={() => selectedTemplate(item.tplId)}>
                  立即使用
                </Button>
              </AuthBtn>
            </div>
          ))}
        </div>
        {tplList.length === 0 && <Empty />}
        <div className={style.paginationWrap}>
          <Pagination {...pagination} onChange={onPaginationChange}></Pagination>
        </div>
      </div>
    </div>
  );
};
export default Manage;
