import React, { useEffect, useState } from 'react';
import { Button, Form, message } from 'antd';
import { requestGetWelcomeStaffList, requestGetWelcomeStaffDetail, requestDelWelcomeStaff } from 'src/apis/migration';
import { AuthBtn, NgModal, NgTable } from 'src/components';
import { tableColumnsFun, IWelcomeStaffList } from 'src/pages/Migration/Welcome/Config';
import { useHistory } from 'react-router';
import { IPagination } from 'src/utils/interface';
import { Preview } from 'src/pages/LiveCode/StaffCode/components';
import { IValue } from 'src/pages/LiveCode/StaffCode/components/Preview/Preview';
import { SetUserGroup } from 'src/pages/Migration/Welcome/components';
import style from './style.module.less';

const Welcome: React.FC = () => {
  const [list, setList] = useState<IWelcomeStaffList[]>([]);
  const [pagination, setPagination] = useState<IPagination>({ current: 1, pageSize: 10, total: 0 });
  const [previewValue, setPreviewValue] = useState<IValue>({});
  const [previewVisible, setPreviewVisible] = useState(false);
  const [userGroupVisible, setUserGroupVisible] = useState(false);

  const history = useHistory();
  const { Item } = Form;
  const [form] = Form.useForm();

  // 新建欢迎语
  const addWelcomeHandle = () => {
    history.push('/welcome/add');
  };

  // 获取欢迎语详情
  const getWelcomeStaffList = async (values?: any) => {
    const res = await requestGetWelcomeStaffList({ ...values });
    if (res) {
      const { total, list } = res;
      setPagination((pagination) => ({ ...pagination, total }));
      setList(list);
    }
  };

  // 查看预览
  const viewPreviewHandle = async (welcomeCode: string) => {
    const res = await requestGetWelcomeStaffDetail({ welcomeCode });
    if (res) {
      setPreviewValue(res);
      setPreviewVisible(true);
    } else {
      message.warning('预览失败，请重试');
    }
  };

  // 查看使用成员
  const viewUserGroupHandle = (groupId: string) => {
    form.setFieldsValue({ groupId });
    setUserGroupVisible(true);
  };

  // 关闭预览弹框
  const previewCancel = () => {
    setPreviewVisible(false);
    setPreviewValue({});
  };

  // 关闭使用成员弹框
  const userGroupCancel = () => {
    setUserGroupVisible(false);
  };

  // 删除欢迎语
  const delWelcomeHandle = async (welcomeCode: string) => {
    const res = await requestDelWelcomeStaff({ welcomeCode });
    if (res) {
      message.success('欢迎语删除成功');
      const { current, pageSize } = pagination;
      let pageNum = current;
      if (list.length === 1 && current !== 1) {
        pageNum -= 1;
      }
      getWelcomeStaffList({ pageNum, pageSize });
    }
  };

  // 切换分页
  const paginationChange = (current: number, pageSize?: number) => {
    const pageNum = pageSize !== pagination.pageSize ? 1 : current;
    setPagination((pagination) => ({ ...pagination, current: pageNum, pageSize: pageSize as number }));
    getWelcomeStaffList({ pageNum, pageSize: pageSize as number });
  };
  useEffect(() => {
    getWelcomeStaffList();
  }, []);
  return (
    <div className={style.wrap}>
      <AuthBtn path="/add">
        <Button type="primary" className={style.addBtn} onClick={addWelcomeHandle}>
          新建欢迎语
        </Button>
      </AuthBtn>
      <NgTable
        rowKey={'welcomeCode'}
        dataSource={list}
        columns={tableColumnsFun(viewPreviewHandle, viewUserGroupHandle, delWelcomeHandle)}
        pagination={pagination}
        paginationChange={paginationChange}
      />
      {/* 欢迎语预览 */}
      <NgModal
        title="欢迎语预览"
        visible={previewVisible}
        centered
        maskClosable={false}
        onCancel={previewCancel}
        footer={null}
      >
        <Preview value={previewValue} />
      </NgModal>
      {/* 查看使用人员 */}
      <NgModal
        title="查看使用成员"
        visible={userGroupVisible}
        centered
        maskClosable={false}
        onCancel={userGroupCancel}
        footer={null}
        destroyOnClose
      >
        <Form form={form}>
          <Item name="groupId">
            <SetUserGroup form={form} disabled />
          </Item>
        </Form>
      </NgModal>
    </div>
  );
};
export default Welcome;
