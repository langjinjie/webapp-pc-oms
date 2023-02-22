import React, { useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { useHistory } from 'react-router-dom';
import { Button, message, Popconfirm } from 'antd';
import { IChannelTagList } from 'src/pages/Operation/ChannelTag/Config';
import { exportFile } from 'src/utils/base';
import { requestDownloadStaffLiveCode, requestManageStaffLiveCode } from 'src/apis/liveCode';
import { statusList } from 'src/pages/LiveCode/MomentCode/Config';
import classNames from 'classnames';
import style from './style.module.less';

// 活码类型 1、单人活码 3、多人活码
export const liveTypeList = [
  { value: 1, label: '单人活码' },
  { value: 3, label: '多人活码' }
];

export interface IStaffLiveCode {
  liveId: string; // 是 活码ID
  name: string; // 是 活码名称
  liveType: number; // 是 活码类型
  status: number; // 是 活码状态
  assignType: number; // 是 分配类型
  expireDate?: string; // 否 活码有效期
  expireDay?: number; // 否 活码有效天数
  isExclusive: number; // 是 是否开启同一外部企业客户只能添加同一个员工  默认为否 0、关闭；1、开启
  isOpenVerify?: number; // 否 支持选择添加好友是否验证 默认为关闭状态 0、关闭 ；1、开启
  remark?: string; // 否 活码备注
  isWelcomeMsg?: number; // 否 是否发送欢迎语
  welcomeWord?: string; // 否 欢迎语
  qrLogo?: string; // 否 活码头像
  staffs: IStaffList[]; // 是 配置的坐席
  qrCode?: string; // 否 活码url
  mergeQrCode?: string; // 否
  // status: number; // 是
  channelTagList: IChannelTagList[]; // 否 渠道标签列表
  createBy: string; // 是 创建人
  dateCreated: string; // 是 创建时间
  lastUpdated: string; // 是 更新时间
}

export interface IStaffList {
  staffId: string; // 是
  staffName: string; // 是
}

export const tableColumnsFun: ({ updateHandle }: { updateHandle: () => void }) => ColumnsType<any> = ({
  updateHandle
}) => {
  const history = useHistory();
  const [downLoad, setDownLoad] = useState('');

  // const editHandle = (value: IStaffLiveCode) => {
  //   if (value.status === 2) return;
  //   history.push('/momentCode/addCode?liveId=' + value.liveId);
  // };

  // 下载
  const downLoadHandle = async (value: IStaffLiveCode) => {
    setDownLoad(value.liveId);
    const res = await requestDownloadStaffLiveCode({ liveIdList: [value.liveId] });
    if (res) {
      const fileName = decodeURI(res.headers['content-disposition'].split('=')[1]);
      exportFile(res.data, fileName.split('.')[0], fileName.split('.')[1]);
    }
    setDownLoad('');
  };
  // 作废/删除 1-删除 2-作废
  const manageGroupLive = async (option: number, value: IStaffLiveCode) => {
    const res = await requestManageStaffLiveCode({ option, liveIdList: [value.liveId] });
    if (res) {
      message.success(`群活码${option === 1 ? '删除' : '作废'}成功`);
      updateHandle?.();
    }
  };
  return [
    { title: '活码ID', dataIndex: 'liveId' },
    {
      title: '活码名称',
      dataIndex: 'name',
      render (name: string) {
        return (
          <span className={classNames(style.maxW300, 'ellipsis')} title={name}>
            {name}
          </span>
        );
      }
    },
    {
      title: '使用员工',
      dataIndex: 'staffs',
      render (staffs: IStaffList[]) {
        return (
          <span
            className={classNames(style.maxW300, 'ellipsis')}
            title={staffs?.map(({ staffName }) => staffName).toString()}
          >
            {staffs?.map(({ staffName }) => staffName).toString() || '多人'}
          </span>
        );
      }
    },
    {
      title: '活码类型',
      render ({ liveType, assignType }: IStaffLiveCode) {
        return <>{liveType === 1 ? '单人活码' : assignType === 1 ? '随机分配' : '依次分配'}</>;
      }
    },
    { title: '有效期', dataIndex: 'expireDate' },
    { title: '投放渠道', dataIndex: 'channel' },
    {
      title: '活码状态',
      dataIndex: 'status',
      render (status: number) {
        return (
          <span>
            <i
              className={classNames(
                'status-point',
                { 'status-point-red': status === 1 },
                { 'status-point-gray': status === 2 },
                { 'status-point-green': status === 3 }
              )}
            />
            {statusList.find((findItem) => findItem.value === status)?.label}
          </span>
        );
      }
    },
    { title: '创建人', dataIndex: 'createBy' },
    { title: '创建时间', dataIndex: 'dateCreated' },
    { title: '更新时间', dataIndex: 'lastUpdated' },
    {
      title: '操作',
      fixed: 'right',
      render (value: any) {
        return (
          <>
            <span
              className={style.check}
              onClick={() => history.push('/staffCode/addCode?liveId=' + value.liveId + '&readOnly=true')}
            >
              查看
            </span>
            {/* <span
              className={classNames(style.edit, { disabled: value.status === 2 })}
              onClick={() => editHandle(value)}
            >
              编辑
            </span> */}
            <Button
              className={style.downLoad}
              disabled={value.status === 2 || value.status === 1}
              loading={downLoad === value.liveId}
              onClick={() => downLoadHandle(value)}
            >
              下载
            </Button>

            <Popconfirm
              title="确认作废该活码吗?"
              disabled={value.status === 2}
              onConfirm={() => manageGroupLive(2, value)}
            >
              <span className={classNames(style.void, { disabled: value.status === 2 })}>作废</span>
            </Popconfirm>

            <Popconfirm
              title="确认删除该活码吗?"
              onConfirm={() => manageGroupLive(1, value)}
              disabled={value.status === 1 || value.status === 0}
            >
              <span className={classNames(style.del, { disabled: value.status === 0 || value.status === 1 })}>
                删除
              </span>
            </Popconfirm>
          </>
        );
      }
    }
  ];
};
