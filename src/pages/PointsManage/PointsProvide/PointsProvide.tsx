import React, { Key, useContext, useEffect, useState } from 'react';
import { useDocumentTitle } from 'src/utils/base';
import { Form, Space, Input, Select, Button, DatePicker, message, TreeSelect } from 'antd';
import { NgTable } from 'src/components';
import { TableColumns, TablePagination } from './Config';
import { requestGetPonitsSendList, requestSendAllPonits, requestSendPonits } from 'src/apis/pointsMall';
import { IPointsProvideList, IConfirmModalParam, ITreeDate } from 'src/utils/interface';
import { Context } from 'src/store';
import { queryDepartmentList } from 'src/apis/organization';
import { LegacyDataNode } from 'rc-tree-select/lib/TreeSelect';

import moment from 'moment';
import PonitsDetail from './PonitsDetail/PonitsDetail';
import style from './style.module.less';

interface IPonitsList {
  total: number;
  list: IPointsProvideList[];
}

interface IPonitsParam {
  visible: boolean;
  ponitsRow?: IPointsProvideList;
  sendStatus: boolean;
}

const PointsProvide: React.FC = () => {
  const { setConfirmModalParam } = useContext(Context);
  const [ponitsList, setPonitsList] = useState<IPonitsList>({ total: 0, list: [] });
  const [paginationParam, setPaginationParam] = useState({ pageNum: 1, pageSize: 10 });
  const [searchParam, setSearchParam] = useState<{ [key: string]: any }>({});
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [disabledColumnType, setDisabledColumnType] = useState(-1);
  const [isLoading, setIsloading] = useState(true);
  const [ponitsParam, setPonitsParam] = useState<IPonitsParam>({ visible: false, sendStatus: false });
  const [allSendStatus, setAllSendStatus] = useState(false); // 当前列表是否点击一键发放成功
  const [treeData, setTreeData] = useState<any[]>([]);
  const [form] = Form.useForm();
  const { RangePicker } = DatePicker;
  const { SHOW_ALL } = TreeSelect;
  // 处理查询参数
  const searchParamHandle = () => {
    const { staffName, date, isBlackClient, sendStatus, deptIds } = form.getFieldsValue();
    let beginTime = '';
    let endTime = '';
    if (date) {
      beginTime = date[0].startOf('day').format('YYYY-MM-DD HH:mm:ss');
      endTime = date[1].endOf('day').format('YYYY-MM-DD HH:mm:ss');
    }
    return { staffName, beginTime, endTime, isBlackClient, sendStatus, deptIds };
  };
  const getPointsList = async () => {
    setIsloading(true);
    const res = await requestGetPonitsSendList({ ...searchParam, ...paginationParam });
    if (res) {
      setPonitsList({ total: res.total, list: res.list });
      setDisabledColumnType(-1);
      setIsloading(false);
      ponitsParam.sendStatus || setSelectedRowKeys([]);
      setAllSendStatus(false);
    }
  };
  // 查询/重置
  const onSearchHandle = () => {
    setPaginationParam({ ...paginationParam, pageNum: 1 });
    setSearchParam(searchParamHandle());
  };
  // 积分发放状态
  const sendStatusList = [
    { value: 0, label: '未发放' },
    { value: 1, label: '已发放' }
  ];
  // 是否有黑名单客户
  const isBlackClientList = [
    { value: 0, label: '没有' },
    { value: 1, label: '有' }
  ];
  // 一键发放积分
  const sendAllPonitsHandle = async () => {
    const res = await requestSendAllPonits(searchParamHandle());
    if (res) {
      message.success('一键发放成功');
      // 发放完成重新获取列表最新数据
      setSearchParam((param) => ({ ...param }));
      setConfirmModalParam((param: IConfirmModalParam) => ({ ...param, visible: false }));
      setAllSendStatus(true);
    }
  };
  // 取消ConfirmModal
  const onCancel = () => {
    setConfirmModalParam((param: IConfirmModalParam) => ({ ...param, visible: false }));
  };
  // 点击一键发放
  const clickSendAllPonitsHandle = () => {
    setConfirmModalParam({
      visible: true,
      title: '积分发放提醒',
      tips: '是否确定群发积分？',
      onOk: sendAllPonitsHandle,
      onCancel
    });
  };
  // 发放积分
  const sendPoints = async () => {
    const list = selectedRowKeys.map((item) => ({ summaryId: item }));
    const res = await requestSendPonits({ list });
    if (res) {
      message.success('积分发放成功');
      const list = ponitsList.list;
      list.forEach((item) => {
        if (selectedRowKeys.includes(item.summaryId)) {
          item.sendStatus = 1;
          item.sendedPoints = item.mustSendPoints;
        }
      });
      setPonitsList(({ total, list }) => ({ total, list }));
      setSelectedRowKeys([]);
      setConfirmModalParam((param: IConfirmModalParam) => ({ ...param, visible: false }));
    }
  };
  // 点击发放积分
  const clickSendPonitsHandle = () => {
    setConfirmModalParam({
      visible: true,
      title: '积分发放提醒',
      tips: `是否确定${selectedRowKeys.length === 1 ? '发放' : '群发'}选中的积分？`,
      onOk: sendPoints,
      onCancel
    });
  };
  // 禁止选择今天之后的日期
  const disabledDate = (current: moment.Moment) => {
    return current > moment().endOf('day');
  };
  // 获取组织架构部门
  const getCorpOrg = async (deptId?: Key) => {
    // 获取部门
    let res1: ITreeDate[] = (await queryDepartmentList({ parentId: deptId })).map((item: ITreeDate) => ({
      ...item,
      parentId: deptId
    }));
    // ,并且过滤掉未完善员工
    res1 = res1.filter((item: any) => item.deptId !== -1);
    return [...res1];
  };
  // 向树结构添加子节点
  const updateTreeData = (list: any[], key: React.Key, children: any[]): any[] => {
    return list.map((node) => {
      if (node.deptId === key) {
        return {
          ...node,
          children
        };
      }
      if (node.children) {
        return {
          ...node,
          children: updateTreeData(node.children, key, children)
        };
      }
      return node;
    });
  };
  // 异步获取组织架构及当前目录下的员工
  const onLoadData = async ({ key }: LegacyDataNode) => {
    // 获取对应的子节点
    const res: any = await getCorpOrg(key);
    if (res) {
      setTreeData((treeData) => updateTreeData(treeData, key as Key, res));
    }
  };
  useDocumentTitle('积分商城-积分发放');
  useEffect(() => {
    ponitsParam.visible || getPointsList();
  }, [paginationParam, searchParam]);
  useEffect(() => {
    // 从详情返回,如果详情发生了发放操作,需要重新请求一次列表
    ponitsParam.sendStatus && getPointsList();
  }, [ponitsParam]);
  useEffect(() => {
    (async () => {
      setTreeData(await getCorpOrg());
    })();
  }, []);
  return (
    <div className={style.wrap}>
      <Form name="base" className={style.form} layout="inline" form={form} onReset={onSearchHandle}>
        <Space className={style.antSpace}>
          <Form.Item className={style.label} name="staffName" label="客户经理姓名：">
            <Input placeholder="待输入" className={style.inputBox} allowClear style={{ width: 290 }} />
          </Form.Item>
          <Form.Item name="deptIds" label="请选择部门">
            <TreeSelect
              virtual={false}
              fieldNames={{ label: 'deptName', value: 'deptId', children: 'children' }}
              className={style.treeSelect}
              dropdownClassName={style.treeSelectDropdown}
              multiple
              showCheckedStrategy={SHOW_ALL}
              allowClear
              placeholder="请选择可见范围"
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              loadData={onLoadData}
              treeData={treeData}
            />
          </Form.Item>
        </Space>
        <Space className={style.antBtnSpace}>
          <Space size="small">
            <Form.Item
              className={style.label}
              name="date"
              label="日期："
              initialValue={[moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')]}
            >
              <RangePicker style={{ width: 280 }} disabledDate={disabledDate} />
            </Form.Item>
            <Form.Item className={style.label} name="isBlackClient" label="是否有黑名单客户：">
              <Select placeholder="待选择" className={style.selectBox} allowClear style={{ width: 180 }}>
                {isBlackClientList.map((item) => (
                  <Select.Option key={item.value} value={item.value}>
                    {item.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item className={style.label} name="sendStatus" label="积分发放状态：">
              <Select placeholder="待选择" className={style.selectBox} allowClear style={{ width: 180 }}>
                {sendStatusList.map((item) => (
                  <Select.Option key={item.value} value={item.value}>
                    {item.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item style={{ width: 186 }}>
              <Button className={style.searchBtn} type="primary" onClick={onSearchHandle} disabled={isLoading}>
                查询
              </Button>
              <Button className={style.resetBtn} htmlType="reset" disabled={isLoading}>
                重置
              </Button>
            </Form.Item>
          </Space>
          <Space>
            <Button
              className={style.provideAllBtn}
              type="primary"
              onClick={clickSendAllPonitsHandle}
              disabled={!!selectedRowKeys.length || allSendStatus || searchParam.sendStatus}
            >
              一键群发积分
            </Button>
          </Space>
        </Space>
      </Form>
      <NgTable
        className={style.tableWrap}
        setRowKey={(record: any) => record.summaryId}
        dataSource={ponitsList.list}
        columns={TableColumns({ setPonitsParam })}
        loading={isLoading}
        scroll={{ x: 'max-content' }}
        {...TablePagination({
          dataSource: ponitsList,
          paginationParam,
          setPaginationParam,
          selectedRowKeys,
          setSelectedRowKeys,
          disabledColumnType,
          setDisabledColumnType
        })}
      />
      {!!ponitsList.total && (
        <div className={style.sendPonits}>
          <Button
            disabled={!selectedRowKeys.length}
            type="primary"
            className={style.sendPonitsBtn}
            onClick={clickSendPonitsHandle}
          >
            发放积分
          </Button>
        </div>
      )}
      {/* 积分详情 */}
      <PonitsDetail ponitsParam={ponitsParam} setPonitsParam={setPonitsParam} />
    </div>
  );
};
export default PointsProvide;
