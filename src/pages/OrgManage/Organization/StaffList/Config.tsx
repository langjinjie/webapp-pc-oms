import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { ColumnsType } from 'antd/es/table';
import { UNKNOWN, replaceEnter } from 'src/utils/base';
import { Popconfirm } from 'antd';
import { AuthBtn } from 'src/components';
import { requestSetStaffOpstatus } from 'src/apis/orgManage';
import { Context } from 'src/store';
import { accountStatusEdit2Name } from 'src/utils/commonData';
import style from './style.module.less';
import classNames from 'classnames';

const TableColumns = (arg: { [key: string]: any }): ColumnsType<any> => {
  const { currentCorpId: corpId } = useContext(Context);
  const { updateList } = arg;
  const history = useHistory();
  const [popconfirmVisible, setPopconfirmVisible] = useState('');
  const [opType, setOpType] = useState(0);
  // 激活/停用账号请求
  const updateStaffPpstatus = async (userIds: string[]) => {
    if (opType) {
      // 前端校验激活上限
      // if (staffListInfo.usedCount + userIds.length > staffListInfo.licenseCount) {
      //   return setModalParam({
      //     isModalVisible: true,
      //     modalType: '容量通知',
      //     modalContentTitle: '账号告罄',
      //     modalContent: '当前启用账号已超出系统设定账号，请联系管理员修改后台账号容量'
      //   });
      // }
    }
    const params = {
      opType,
      corpId,
      userIds: userIds
    };
    await requestSetStaffOpstatus(params);
    await updateList?.();
  };
  // 定义单个激活/停用onfirem
  const popOnconfirmHandle = async (row: any) => {
    setPopconfirmVisible('');
    const { staffId } = row;
    updateStaffPpstatus([staffId]);
  };
  // 点击单行操作
  const clickCurrentRowHandle = (row: any) => {
    // 停用操作不可逆
    if (row.status === 2) return;
    setOpType(row.status === '4' ? 1 : 0);
    setPopconfirmVisible(row.staffId);
  };
  // 查看
  const viewHandle = (row: any) => {
    history.push('/organization/staff-detail?staffId=' + row.staffId);
  };
  return [
    {
      title: '姓名',
      // width: 150,
      fixed: 'left',
      render (row) {
        return (
          <span>
            {row.staffName}
            {!!row.isLeader && <span className={style.isLeader}>{row.deptLeaderTag || '上级'}</span>}
          </span>
        );
      }
    },
    {
      title: '部门',
      // width: 100,
      render (row) {
        return <span>{row.deptName || UNKNOWN}</span>;
      }
    },
    {
      title: '职位',
      // width: 150,
      render (row) {
        return <span>{row.position || UNKNOWN}</span>;
      }
    },
    { title: '企微账号', dataIndex: 'userId', width: 150 },
    {
      title: '员工工号',
      // width: 100,
      render (row) {
        return <span>{row.jobNumber || UNKNOWN}</span>;
      }
    },
    {
      title: '支公司',
      // width: 100,
      render (row) {
        return <span>{row.resource || UNKNOWN}</span>;
      }
    },
    {
      title: '业务模式',
      // width: 100,
      render (row) {
        return <span>{row.businessModel || UNKNOWN}</span>;
      }
    },
    {
      title: '市公司',
      // width: 150,
      render (row) {
        return <span>{row.businessArea || UNKNOWN}</span>;
      }
    },
    {
      title: '省公司',
      render (row) {
        return <span>{row.provinceCompany || UNKNOWN}</span>;
      }
    },
    {
      title: '办公职场',
      // width: 90,
      render (row) {
        return <span>{row.officePlace || UNKNOWN}</span>;
      }
    },

    {
      title: '角色名称',
      render (row) {
        return (
          <span
            dangerouslySetInnerHTML={{
              __html:
                replaceEnter(
                  row.roles.reduce((prev: string, now: any) => {
                    prev +=
                      (now.roleType === '3' ? 'A端：' : 'B端：') + now.roleName + (now.roleType === '3' ? '\\n' : '');
                    return prev;
                  }, '')
                ) || UNKNOWN
            }}
          />
        );
      }
    },
    {
      title: '账号开通时间',
      // width: 180,
      render (row) {
        return <span>{row.accountStartTime || UNKNOWN}</span>;
      }
    },
    {
      title: '账号停止时间',
      // width: 180,
      render (row) {
        return <span>{row.accountEndTime || UNKNOWN}</span>;
      }
    },
    {
      title: '状态',
      // width: 60,
      render (row) {
        return <span>{row.isDeleted ? '离职' : '在职'}</span>;
      }
    },
    {
      title: '操作',
      // align: 'center',
      fixed: 'right',
      render (row: any) {
        return (
          <span className={style.viewAndEdit}>
            <AuthBtn path="/view">
              <span className={style.view} onClick={() => viewHandle(row)}>
                查看
              </span>
            </AuthBtn>
            <AuthBtn path="/operateStaff">
              <Popconfirm
                title={'确认' + (row.status === 1 ? '停用' : '激活') + '该账号吗'}
                visible={popconfirmVisible === row.staffId}
                onConfirm={async () => popOnconfirmHandle(row)}
                onCancel={() => setPopconfirmVisible('')}
              >
                <span
                  key={row.staffId}
                  className={classNames(style.edit, { [style.disabled]: row.status === 2 })}
                  onClick={() => clickCurrentRowHandle(row)}
                >
                  {accountStatusEdit2Name[row.status]}
                </span>
              </Popconfirm>
            </AuthBtn>
          </span>
        );
      }
    }
  ];
};

const TablePagination = (arg: { [key: string]: any }): any => {
  const {
    staffList,
    paginationParam,
    setPaginationParam,
    selectedRowKeys,
    setSelectedRowKeys,
    disabledColumnType,
    setDisabledColumnType
  } = arg;
  // 分页器参数
  const pagination = {
    total: staffList.total,
    current: paginationParam.pageNum,
    showTotal: (total: number) => `共 ${total} 条`
  };
  // 切换分页
  const paginationChange = (value: number, pageSize?: number) => {
    setPaginationParam({ pageNum: value, pageSize: pageSize as number });
    setDisabledColumnType(-1);
    setSelectedRowKeys([]);
  };
  // 点击选择框
  const onSelectChange = async (newSelectedRowKeys: any[]) => {
    // 判断是取消选择还是开始选择
    if (newSelectedRowKeys.length) {
      let filterRowKeys: string[] = newSelectedRowKeys;
      // 判断是否是首次选择
      if (disabledColumnType === -1) {
        // 获取第一个的状态作为全选筛选条件
        const disabledColumnType = staffList?.list.find((item: any) => item.staffId === newSelectedRowKeys[0])
          ?.isDeleted as number;
        setDisabledColumnType(disabledColumnType);
        // 判断是否是点击的全选
        if (newSelectedRowKeys.length > 1) {
          // 过滤得到需要被全选的
          filterRowKeys = staffList.list
            .filter((item: any) => item.isDeleted === disabledColumnType)
            .map((item: any) => item.staffId);
        }
      }
      setSelectedRowKeys(filterRowKeys as string[]);
    } else {
      // 取消全选
      setSelectedRowKeys([]);
      setDisabledColumnType(-1);
    }
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    hideSelectAll: false, // 是否隐藏全选
    getCheckboxProps: (record: any) => ({
      disabled: disabledColumnType === -1 ? false : record.isDeleted !== disabledColumnType,
      name: record.name
    })
  };
  return { pagination, rowSelection, paginationChange };
};
export { TableColumns, TablePagination };
