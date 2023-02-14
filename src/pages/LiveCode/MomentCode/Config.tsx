import React, { useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { useHistory } from 'react-router-dom';
import { Button, message, Popconfirm } from 'antd';
import { UNKNOWN, downloadImage } from 'src/utils/base';
import { requestDownloadGroupLiveCode, requestManageGroupLiveCode } from 'src/apis/liveCode';
import style from './style.module.less';
import classNames from 'classnames';

export const statusList = [
  { value: 0, label: '正常' },
  { value: 1, label: '异常' },
  { value: 2, label: '作废' }
];

export interface IGroupChatLiveCode {
  liveId: string; // 是 群活码ID
  name: string; // 是 群活码名称
  channel?: string; // 否 投放渠道
  codeNum: number; // 是 二维码总量
  expiringNum: number; // 是二维码即将过期数量
  expiredNum: number; // 是 二维码已过期数量
  createBy: string; // 是 创建人
  dateCreated: string; // 是 创建时间
  lastUpdated: string; // 是 更新时间
  status: number;
}

export const tableColumnsFun: ({ updateListHandle }: { updateListHandle?: () => any }) => ColumnsType<any> = ({
  updateListHandle
}) => {
  const [downLoad, setDownLoad] = useState('');
  const history = useHistory();

  const editHandle = (value: IGroupChatLiveCode) => {
    if (value.status === 2) return;
    history.push('/momentCode/addCode?liveId=' + value.liveId);
  };

  // 下载
  const downLoadHandle = async (value: IGroupChatLiveCode) => {
    setDownLoad(value.liveId);
    const res = await requestDownloadGroupLiveCode({ liveIdList: [value.liveId] });
    if (res) {
      const fileName = decodeURI(res.headers['content-disposition'].split('=')[1]);
      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);
      downloadImage(url, fileName);
      updateListHandle?.();
    }
    setDownLoad('');
  };
  // 作废/删除 1-作废 2-删除
  const manageGroupLive = async (type: number, value: IGroupChatLiveCode) => {
    const res = await requestManageGroupLiveCode({ type, liveIdList: [value.liveId] });
    if (res) {
      message.success(`群活码${type === 1 ? '作废' : '删除'}成功`);
      updateListHandle?.();
    }
  };
  return [
    { title: '群活码ID', dataIndex: 'liveId' },
    { title: '群活码名称', dataIndex: 'name' },
    {
      title: '群活码状态',
      dataIndex: 'status',
      render (status: number) {
        return (
          <span>
            <i
              className={classNames(
                'status-point',
                { 'status-point-gray': status === 2 },
                { 'status-point-red': status === 1 }
              )}
            />
            {statusList.find((findItem) => findItem.value === status)?.label}
          </span>
        );
      }
    },
    {
      title: '投放渠道',
      dataIndex: 'channel',
      render (channel: string) {
        return <>{channel || UNKNOWN}</>;
      }
    },
    {
      title: '二维码情况',
      render (QRcodeState: IGroupChatLiveCode) {
        return (
          <span
            dangerouslySetInnerHTML={{
              __html:
                '总量：' +
                (QRcodeState.codeNum || 0) +
                '<br />' +
                '即将过期：' +
                (QRcodeState.expiringNum || 0) +
                '<br />' +
                '已过期：' +
                (QRcodeState.expiredNum || 0)
            }}
          />
        );
      }
    },
    { title: '创建人', dataIndex: 'createBy' },
    { title: '创建时间', dataIndex: 'dateCreated' },
    { title: '更新时间', dataIndex: 'lastUpdated' },
    {
      title: '操作',
      fixed: 'right',
      render (value: IGroupChatLiveCode) {
        return (
          <>
            <span
              className={style.check}
              onClick={() => history.push('/momentCode/addCode?liveId=' + value.liveId + '&readOnly=true')}
            >
              查看
            </span>
            <span
              className={classNames(style.edit, { disabled: value.status === 2 })}
              onClick={() => editHandle(value)}
            >
              编辑
            </span>
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
              onConfirm={() => manageGroupLive(1, value)}
            >
              <span className={classNames(style.void, { disabled: value.status === 2 })}>作废</span>
            </Popconfirm>

            <Popconfirm
              title="确认删除该活码吗?"
              onConfirm={() => manageGroupLive(2, value)}
              disabled={value.status === 1}
            >
              <span className={style.del}>删除</span>
            </Popconfirm>
          </>
        );
      }
    }
  ];
};
