import React from 'react';
import { ColumnsType } from 'antd/es/table';
import { Button, Popconfirm } from 'antd';
import { useHistory } from 'react-router';
import { AuthBtn } from 'src/components';

export interface IWelcomeStaffList {
  welcomeCode: string; // 否 欢迎语ID
  welcomeWord?: string; // 否 欢迎语
  groupId: string; // 是 配置范围
  createBy: string; // 是 创建人
  dateCreated: string; // 是 创建时间
  lastUpdated: string; // 是 更新时间
}

export const tableColumnsFun: (
  viewPreviewHandle: (welcomeCode: string) => void,
  viewUserGroupHandle: (groupId: string) => void,
  delWelcomeHandle: (welcomeCode: string) => void
) => ColumnsType<any> = (viewPreviewHandle, viewUserGroupHandle, delWelcomeHandle) => {
  const history = useHistory();

  const editHandle = (welcomeCode: string) => {
    history.push('/welcome/add?welcomeCode=' + welcomeCode);
  };
  return [
    {
      title: '序号',
      render (_: any, __: any, index: number) {
        return <>{index + 1}</>;
      }
    },
    {
      title: '消息内容',
      render ({ welcomeCode }: IWelcomeStaffList) {
        return (
          <Button type="link" onClick={() => viewPreviewHandle(welcomeCode)}>
            预览
          </Button>
        );
      }
    },
    {
      title: '使用成员',
      render ({ groupId }: IWelcomeStaffList) {
        return (
          <Button type="link" onClick={() => viewUserGroupHandle(groupId)}>
            查看使用成员
          </Button>
        );
      }
    },
    {
      title: '修改时间',
      dataIndex: 'lastUpdated'
    },
    {
      title: '创建时间',
      dataIndex: 'dateCreated'
    },
    {
      title: '操作',
      render ({ welcomeCode }: IWelcomeStaffList) {
        return (
          <>
            <AuthBtn path="/delete">
              <Popconfirm title="确认删除该欢迎语吗？" onConfirm={() => delWelcomeHandle(welcomeCode)}>
                <Button type="link">删除</Button>
              </Popconfirm>
            </AuthBtn>
            <AuthBtn path="/edit">
              <Button type="link" onClick={() => editHandle(welcomeCode)}>
                编辑
              </Button>
            </AuthBtn>
          </>
        );
      }
    }
  ];
};
