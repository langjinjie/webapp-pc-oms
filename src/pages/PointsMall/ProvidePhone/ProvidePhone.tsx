import React, { useContext, useEffect, useState } from 'react';
import { useDocumentTitle } from 'src/utils/base';
import { Button, message } from 'antd';
import { TableColumns, TablePagination } from './Config';
import { requestProviderPhone, requestGetProviderPhoneList } from 'src/apis/pointsMall';
import { IPointsProvideList, IConfirmModalParam } from 'src/utils/interface';
import { Context } from 'src/store';
import { NgTable } from 'src/components';
import style from './style.module.less';

interface IPonitsList {
  total: number;
  list: IPointsProvideList[];
}

const ProvidePhone: React.FC = () => {
  const { setConfirmModalParam, currentCorpId: corpId } = useContext(Context);
  const [provideList, setProvideList] = useState<IPonitsList>({ total: 0, list: [] });
  const [paginationParam, setPaginationParam] = useState({ pageNum: 1, pageSize: 10 });
  const [isLoading, setIsloading] = useState(true);

  const getPointsList = async () => {
    setIsloading(true);
    const res = await requestGetProviderPhoneList({ corpId, ...paginationParam });
    if (res) {
      setProvideList({ total: res.total, list: res.list });
    }
    setIsloading(false);
  };
  // 取消ConfirmModal
  const onCancel = () => {
    setConfirmModalParam((param: IConfirmModalParam) => ({ ...param, visible: false }));
  };
  // 发放手机
  const sendPhone = async () => {
    const res = await requestProviderPhone();
    if (res) {
      message.success('手机发放成功');
      setPaginationParam((param) => ({ ...param }));
      onCancel();
    }
  };
  // 点击发放积分
  const clickSendPhoneHandle = () => {
    setConfirmModalParam({
      visible: true,
      title: '手机发放提醒',
      tips: '是否确定发放手机？',
      onOk: sendPhone,
      onCancel
    });
  };
  useDocumentTitle('积分商城-手机发放');
  useEffect(() => {
    getPointsList();
  }, [paginationParam]);
  return (
    <div className={style.wrap}>
      <Button className={style.provideAllBtn} type="primary" onClick={clickSendPhoneHandle}>
        一键发放手机
      </Button>
      <NgTable
        className={style.tableWrap}
        setRowKey={(record: any) => record.sendTime}
        dataSource={provideList.list}
        columns={TableColumns()}
        loading={isLoading}
        scroll={{ x: 'max-content' }}
        {...TablePagination({
          dataSource: provideList,
          paginationParam,
          setPaginationParam
        })}
      />
    </div>
  );
};
export default ProvidePhone;
