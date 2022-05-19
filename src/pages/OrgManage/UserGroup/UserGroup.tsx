import React, { useEffect, useState } from 'react';
import { Button, Form, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { NgTable } from 'src/components';
import { TableColumns, TablePagination } from './Config';
import { IGroupItem } from 'src/utils/interface';
import { requestGetGroupList } from 'src/apis/orgManage';
import { useHistory } from 'react-router-dom';
import style from './style.module.less';
interface IGroupList {
  total: number;
  list: IGroupItem[];
}

const UserGroup: React.FC = () => {
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
    console.log('res', res);
    if (res) {
      setGroupList(res);
    }
    setLoading(false);
  };
  // 查询/重置
  const onSearchHandle = (values: any) => {
    console.log('values', values);
    setPaginationParam((param) => ({ ...param, pageNum: 1 }));
    if (values.type === 'reset') {
      setSearchParam({ groupName: '', groupCode: '' });
    } else {
      setSearchParam(values);
    }
  };
  useEffect(() => {
    getGroupList();
  }, [paginationParam]);
  return (
    <div className={style.wrap}>
      <Button className={style.addBtn} icon={<PlusOutlined />} type="primary" onClick={addGroup}>
        新增用户组
      </Button>
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
      <NgTable
        className={style.table}
        setRowKey={(row) => row.groupId}
        dataSource={groupList.list}
        loading={loading}
        columns={TableColumns()}
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
