import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Button, Modal, Table, Form, Input } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { requestGetGroupStaffList, requestGetViewGroupStaffList } from 'src/apis/orgManage';
import style from './style.module.less';

interface IViewStaffModal {
  modalParam: any;
  setModalParam: Dispatch<SetStateAction<any>>;
}

const ViewStaffModal: React.FC<IViewStaffModal> = ({ modalParam, setModalParam }) => {
  const [staffList, setStaffList] = useState<{ total: number; list: any[] }>({ total: 0, list: [] });
  const [searchParam, setSearchParam] = useState<{ [key: string]: any }>({});
  const [paginationPram, setPaginationPram] = useState<{ pageNum: number; pageSize: number }>({
    pageNum: 1,
    pageSize: 10
  });
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { Item } = Form;
  const columns: ColumnsType<any> = [
    { title: '人员姓名', dataIndex: 'staffName' },
    {
      title: '部门',
      dataIndex: 'deptName'
    }
  ];
  const onOk = () => {
    console.log('onOk');
  };
  const onCancel = () => {
    setModalParam((param: any) => ({ ...param, visible: false }));
  };
  const onReset = () => {
    form.resetFields();
    setSearchParam({ staffName: '' });
    setPaginationPram({ pageNum: 1, pageSize: 10 });
  };
  const onFinish = (values: any) => {
    setSearchParam(values);
    setPaginationPram({ pageNum: 1, pageSize: 10 });
  };
  // 获取人员列表
  const getStaffList = async () => {
    setLoading(true);
    const res = await (modalParam.add
      ? requestGetGroupStaffList({ ...searchParam, filterId: modalParam.filterId, ...paginationPram })
      : requestGetViewGroupStaffList({ ...searchParam, groupId: modalParam.filterId, ...paginationPram }));
    if (res) {
      setStaffList(res);
    }
    setLoading(false);
  };
  useEffect(() => {
    modalParam.visible && getStaffList();
  }, [paginationPram, modalParam.visible]);
  return (
    <Modal
      title="选择标签"
      visible={modalParam.visible}
      centered
      className={style.modalWrap}
      maskClosable={false}
      closable={!modalParam.add}
      onOk={onOk}
      onCancel={onCancel}
      destroyOnClose
      {...(modalParam.add || { footer: null })}
    >
      <div className={style.contentWrap}>
        <Form className={style.form} form={form} layout={'inline'} onFinish={onFinish}>
          <Item label="人员名称：" name="staffName">
            <Input className={style.input} placeholder="请输入" />
          </Item>
          <Item>
            <Button className={style.submitBtn} htmlType="submit" type="primary">
              查询
            </Button>
            <Button className={style.resetBtn} onClick={onReset}>
              重置
            </Button>
          </Item>
        </Form>
        <Table
          className={style.tableWrap}
          rowKey={'staffId'}
          scroll={{ x: 'max-content' }}
          dataSource={staffList.list}
          columns={columns}
          pagination={{
            total: staffList.total,
            onChange (size: number) {
              setPaginationPram((param) => ({ ...param, pageNum: size }));
            }
          }}
          loading={loading}
        />
      </div>
    </Modal>
  );
};
export default ViewStaffModal;
