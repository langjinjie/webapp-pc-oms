/**
 * @description 选择群主
 */
import React, { useState } from 'react';
import { Button, Table } from 'antd';
import { NgModal, OrgTreeSelect } from 'src/components';
import { requestGetDepStaffList } from 'src/apis/orgManage';
import style from './style.module.less';
import classNames from 'classnames';

interface StaffType {
  staffId: string;
  staffName: string;
}

interface SetGroupOwnerProps {
  readonly?: boolean;
  value?: any;
  onChange?: (value: any) => void;
  title?: string;
}
const SetGroupOwner: React.FC<SetGroupOwnerProps> = ({ value, onChange, readonly, title }) => {
  const [visible, setVisible] = useState(false);
  const [queryValues, setQueryValues] = useState({
    isGroupOwner: 1,
    deptType: 0,
    queryType: 1,
    isDeleted: 0,
    name: '',
    deptId: ''
  });
  const [staffList, setStaffList] = useState<StaffType[]>([]);
  const [selectedStaffList, setSelectedStaffList] = useState<StaffType[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [pagination, setPagination] = useState({
    pageNum: 1,
    pageSize: 10,
    total: 0
  });

  const getStaffGroupOwner = async (params?: any) => {
    const pageNum = params?.pageNum || pagination.pageNum;
    const res = await requestGetDepStaffList({
      ...queryValues,
      ...params,
      pageNum
    });
    if (res) {
      const { list, total } = res;
      setPagination((pagination) => ({ ...pagination, total, pageNum }));
      setStaffList(list);
    }
  };

  const onRemove = (staffId: string) => {
    const filteredStaffList = selectedStaffList.filter((item) => item.staffId !== staffId);
    const filteredKeys = selectedRowKeys.filter((item) => item !== staffId);
    setSelectedStaffList(filteredStaffList);
    setSelectedRowKeys(filteredKeys);
  };

  const handleOk = () => {
    onChange?.(selectedStaffList);
    setVisible(false);
  };

  return (
    <div>
      <NgModal
        className={style.modalWrap}
        visible={visible}
        title={title || '选择群'}
        width={960}
        onCancel={() => setVisible(false)}
        onOk={() => handleOk()}
      >
        <div className={style.colWrap}>
          <h4 className={style.panelHeader}>部门列表</h4>
          <OrgTreeSelect
            className="ml20"
            onChange={({ deptId }) => {
              setQueryValues((queryValues) => ({ ...queryValues, deptId, name: '' }));
              getStaffGroupOwner({ deptId, name: '', pageNum: 1 });
            }}
          />
        </div>
        <div className={style.colWrap}>
          <h4 className={style.panelHeader}>
            <span>群聊列表</span>
            <span className="f12 float-right">共{pagination.total}个</span>
          </h4>
          <div className={style.staffList}>
            <div className={classNames('mt22')}>
              <Table
                columns={[{ key: 'staffName', dataIndex: 'staffName', title: '群主姓名' }]}
                rowKey={'staffId'}
                pagination={{
                  current: pagination.pageNum,
                  pageSize: pagination.pageSize,
                  total: pagination.total,
                  position: ['bottomRight'],
                  simple: true,
                  onChange: (pageNum) => {
                    getStaffGroupOwner({ pageNum });
                  }
                }}
                dataSource={staffList}
                rowSelection={{
                  type: 'checkbox',
                  preserveSelectedRowKeys: true,
                  selectedRowKeys: selectedRowKeys,
                  onChange (selectedRowKeys, selectedRows) {
                    setSelectedStaffList(selectedRows);
                    setSelectedRowKeys(selectedRowKeys);
                  }
                }}
              ></Table>
            </div>
          </div>
        </div>
        <div className={classNames(style.colWrap)}>
          <h4 className={classNames(style.panelHeader, 'color-text-regular')}>
            已选群聊
            <span className="f12 float-right">共{selectedRowKeys.length}个</span>
          </h4>
          <div className="ph20">
            <div className={classNames(style.colTitle, 'flex justify-between color-text-regular')}>
              <span>群名称</span>
              <span>操作</span>
            </div>
            <div className={classNames(style.staffWrap)}>
              {selectedStaffList.map((item) => (
                <div key={item.staffId} className={classNames(style.checkItem, 'flex justify-between align-center')}>
                  <span>{item.staffName}</span>
                  <Button type="link" onClick={() => onRemove(item.staffId)}>
                    删除
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </NgModal>
      <div>
        {value?.map(
          (item: any, index: number) =>
            index < 5 && (
              <span key={item.staffId} style={{ display: 'inline-block' }}>
                {item.staffName}
                {index < value?.length - 1 && index < 4 ? '，' : ''}
              </span>
            )
        )}
        {value?.length > 5 && ' ...... '}
        {!!value?.length && <span className="mr20">共{value?.length || 0}位群主</span>}
        <Button type="primary" ghost shape="round" disabled={readonly} onClick={() => setVisible(true)}>
          请选择群主
        </Button>
      </div>
    </div>
  );
};

export default SetGroupOwner;
