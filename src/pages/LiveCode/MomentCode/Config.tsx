import React from 'react';
import { ColumnsType } from 'antd/es/table';
// import classNames from 'classnames';
import style from './style.module.less';
import { useHistory } from 'react-router-dom';
import { Popconfirm } from 'antd';

export const clueStatusList: any = {
  0: '待分配',
  1: '已分配',
  2: '自动分配'
};

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
}

export const tableColumnsFun: () => ColumnsType<any> = () => {
  const history = useHistory();
  return [
    { title: '群活码ID', dataIndex: 'codeId' },
    { title: '群活码名称', dataIndex: 'codeName' },
    { title: '群活码状态', dataIndex: 'codeStatus' },
    { title: '投放渠道', dataIndex: 'channel' },
    {
      title: '二维码情况',
      dataIndex: 'QRcodeState',
      render (QRcodeState: any) {
        return (
          <span
            dangerouslySetInnerHTML={{
              __html:
                '总量：' +
                QRcodeState.total +
                '<br />' +
                '即将过期：' +
                QRcodeState.soonLimit +
                '<br />' +
                '已过期：' +
                QRcodeState.timeLimit
            }}
          />
        );
      }
    },
    { title: '创建人', dataIndex: 'createrBy' },
    { title: '创建时间', dataIndex: 'createTime' },
    { title: '更新时间', dataIndex: 'updateTime' },
    {
      title: '操作',
      fixed: 'right',
      render (value: any) {
        return (
          <>
            <span className={style.check} onClick={() => history.push('/momentCode/addCode', { row: value })}>
              查看
            </span>
            {value.codeStatus !== '已作废' && (
              <span className={style.edit} onClick={() => history.push('/momentCode/addCode', { row: value })}>
                编辑
              </span>
            )}
            <span className={style.downLoad}>下载</span>
            {value.codeStatus !== '已作废' && (
              <Popconfirm title="确认发放该积分吗?" disabled={value.sendStatus === 1}>
                <span className={style.void}>作废</span>
              </Popconfirm>
            )}
            {value.codeStatus === '已作废' && (
              <Popconfirm title="确认发放该积分吗?" disabled={value.sendStatus === 1}>
                <span className={style.del}>删除</span>
              </Popconfirm>
            )}
          </>
        );
      }
    }
  ];
};
