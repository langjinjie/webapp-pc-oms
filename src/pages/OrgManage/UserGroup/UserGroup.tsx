import React, { useEffect, useState } from 'react';
import { Button, Form, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { AuthBtn, NgTable } from 'src/components';
import { TableColumns, TablePagination } from './Config';
import { IGroupItem } from 'src/utils/interface';
import { requestGetGroupList } from 'src/apis/orgManage';
import { useHistory } from 'react-router-dom';
import { useDocumentTitle } from 'src/utils/base';
import style from './style.module.less';
interface IGroupList {
  total: number;
  list: IGroupItem[];
}

interface UserGroupProps {
  change?: (item: any) => void;
  readonly?: boolean;
  selectedKey?: string;
}
const UserGroup: React.FC<UserGroupProps> = ({ change, readonly, selectedKey }) => {
  const [loading, setLoading] = useState(false);
  const [groupList, setGroupList] = useState<IGroupList>({ total: 0, list: [] });
  const [searchParam, setSearchParam] = useState<{ groupName: string; groupCode: string }>({
    groupName: '',
    groupCode: ''
  });
  const [paginationParam, setPaginationParam] = useState<{ pageNum: number; pageSize: number }>({
    pageNum: 1,
    pageSize: 10
  });
  const [form] = Form.useForm();
  const history = useHistory();
  // 新增用户组
  const addGroup = () => {
    history.push('/userGroup/add');
  };
  // 获取用户组列表
  const getGroupList = async () => {
    setLoading(true);
    const res = await requestGetGroupList({ ...searchParam, ...paginationParam });
    if (res) {
      setGroupList(res);
    }
    setLoading(false);
  };
  // 查询/重置
  const onSearchHandle = (values: any) => {
    if (values.type === 'reset') {
      setSearchParam({ groupName: '', groupCode: '' });
      setPaginationParam((param) => ({ ...param, pageNum: 1, pageSize: 10 }));
    } else {
      setSearchParam(values);
      setPaginationParam((param) => ({ ...param, pageNum: 1 }));
    }
  };

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      change?.(selectedRows[0]);
    },
    getCheckboxProps: (record: any) => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name
    })
  };
  useDocumentTitle('机构管理-用户组管理');
  useEffect(() => {
    getGroupList();
  }, [paginationParam]);
  return (
    <div className={style.wrap}>
      {readonly || (
        <>
          <AuthBtn path="/add">
            <Button className={style.addBtn} icon={<PlusOutlined />} type="primary" onClick={addGroup}>
              新增用户组
            </Button>
          </AuthBtn>
          <AuthBtn path="/query">
            <Form className={style.form} form={form} layout="inline" onFinish={onSearchHandle} onReset={onSearchHandle}>
              <Form.Item name="groupName" label="用户组名称：">
                <Input placeholder="待输入" allowClear style={{ width: 180 }} />
              </Form.Item>
              <Form.Item name="groupCode" label="用户组编号：">
                <Input placeholder="待输入" allowClear style={{ width: 180 }} />
              </Form.Item>
              <Form.Item style={{ width: 186 }}>
                <Button className={style.searchBtn} type="primary" htmlType="submit" disabled={loading}>
                  查询
                </Button>
                <Button className={style.resetBtn} htmlType="reset" disabled={loading}>
                  重置
                </Button>
              </Form.Item>
            </Form>
          </AuthBtn>
        </>
      )}
      <NgTable
        rowSelection={
          change
            ? {
                defaultSelectedRowKeys: [selectedKey!],
                type: 'radio',
                ...rowSelection
              }
            : undefined
        }
        className={style.table}
        setRowKey={(row) => row.groupId}
        dataSource={groupList.list}
        loading={loading}
        columns={TableColumns(readonly)}
        scroll={{ x: 'max-content' }}
        {...TablePagination({
          total: groupList.total,
          paginationParam,
          setPaginationParam
        })}
      />
    </div>
  );
};
export default UserGroup;
