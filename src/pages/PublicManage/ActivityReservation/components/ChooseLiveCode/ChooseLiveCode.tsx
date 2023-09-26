import React, { useEffect, useState } from 'react';
import { Button, Form, Input } from 'antd';
import { Icon, Modal, NgTable } from 'src/components';
import style from './style.module.less';
import classNames from 'classnames';
import { DownOutlined } from '@ant-design/icons';
import { IPagination } from 'src/utils/interface';
import { requestGetActivityLeadActivityLiveCodeList } from 'src/apis/publicManage';

interface ILiveCodeItem {
  liveId: string;
  liveName: string;
  liveQrCode: string;
}

interface ChooseLiveCodeProps {
  liveCodeType?: 1 | 2;
  value?: ILiveCodeItem[];
  onChange?: (value?: ILiveCodeItem[]) => void;
  className?: string;
  disabled?: boolean;
}

const { Item } = Form;

/**
 * @description 选择活码组件
 * @param liveCodeType 1 | 2 活码类型 1-员工活码 2-群活码
 */
const ChooseLiveCode: React.FC<ChooseLiveCodeProps> = ({ liveCodeType, value, onChange, className, disabled }) => {
  const [visible, setVisible] = useState(false);
  const [list, setList] = useState<ILiveCodeItem[]>([]);
  const [pagination, setPagination] = useState<IPagination>({ current: 1, total: 0 });
  const [formVal, setFormVal] = useState<{ liveId?: string; name?: string }>({});
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<ILiveCodeItem[]>([]);
  const [tableLoading, setTableLoading] = useState(false);

  const [form] = Form.useForm();

  // 关闭
  const onClose = () => {
    setVisible(false);
  };

  // 提交
  const onOk = () => {
    console.log('value', value);
    setVisible(false);
    onChange?.(selectedRows);
  };

  // 清除所有
  const delAll = () => {
    onChange?.([]);
  };

  // 删除单个选项
  const removeItem = (liveId: string) => {
    setSelectedRows(selectedRows.filter(({ liveId: rowLiveId }) => liveId !== rowLiveId));
    setSelectedRowKeys(selectedRowKeys.filter((key) => key !== liveId));
  };

  // 获取列表
  const getList = async (values?: any) => {
    if (!liveCodeType) return;
    setTableLoading(true);
    const res = await requestGetActivityLeadActivityLiveCodeList({ ...values, liveCodeType });
    if (res) {
      setList(res.list);
      setPagination((pagination) => ({ ...pagination, total: res.total, current: values.pageNum || 1 }));
      setFormVal(values);
    }
    setTableLoading(false);
  };

  // 搜索
  const onFinishHandle = (values?: any) => {
    getList(values).then(() => setSelectedRowKeys([]));
  };

  // 重置
  const onResetHandle = () => {
    getList().then(() => setSelectedRowKeys([]));
  };

  // 切换分页
  const paginationChange = (current: number) => {
    getList({ ...formVal, pageNum: current });
  };

  const rowSelection: any = {
    hideSelectAll: false,
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: string[], selectedRows: ILiveCodeItem[]) => {
      // 处理非本页选中的key的问题
      const curListKeys = list.map(({ liveId }) => liveId);
      const noCurPageSelectKeys = selectedRowKeys.filter((key) => !curListKeys.includes(key));
      const noCurPageSelectRows = selectedRows.filter(({ liveId }) => !curListKeys.includes(liveId));
      setSelectedRowKeys([...noCurPageSelectKeys, ...selectedRowKeys]);
      setSelectedRows([...noCurPageSelectRows, ...selectedRows]);
    }
  };

  useEffect(() => {
    getList();
  }, [liveCodeType]);

  return (
    <>
      <Input
        readOnly
        className={classNames(style.input, className)}
        placeholder="请选择活码"
        value={value?.map(({ liveName }) => liveName).toString()}
        suffix={
          !disabled && value ? <Icon name="guanbi" onClick={delAll} /> : <DownOutlined className={style.downOutlined} />
        }
        onClick={() => setVisible(true)}
      />
      <Modal title={'请选择活码'} width={800} visible={visible} onClose={onClose} onOk={onOk}>
        <Form className={style.form} layout="inline" form={form} onFinish={onFinishHandle} onReset={onResetHandle}>
          <Item label="活码ID" name="liveId">
            <Input placeholder="请输入" allowClear />
          </Item>
          <Item label="活码名称" name="name">
            <Input placeholder="请输入" allowClear />
          </Item>
          <Button className={style.submitBtn} type="primary" htmlType="submit">
            查询
          </Button>
          <Button className={style.resetBtn} htmlType="reset">
            重置
          </Button>
        </Form>
        <NgTable
          className="mt20"
          scroll={{ x: 752 }}
          columns={[
            { title: '活码ID', dataIndex: 'liveId' },
            { title: '活码名称', dataIndex: 'liveName' }
          ]}
          loading={tableLoading}
          dataSource={list}
          rowSelection={rowSelection}
          pagination={{ ...pagination, simple: true }}
          paginationChange={paginationChange}
        />
        {/* 已经选择的 */}
        <div>
          <div className="color-text-primary mt22">已选择</div>
          <div className={classNames(style.selectWrap, 'mt12')}>
            {selectedRows.map(({ liveId, liveName }) => (
              <div className={classNames(style.customTag)} key={liveId}>
                <span>{liveName}</span>
                <Icon className={style.closeIcon} name="biaoqian_quxiao" onClick={() => removeItem(liveId)}></Icon>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
};
export default ChooseLiveCode;
