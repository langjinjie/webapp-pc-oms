import React, { Key, useEffect, useState } from 'react';
import { NgFormSearch, NgTable } from 'src/components';
import { searchCols, tableColumns, IChatTagItem } from './Config';
import { Button, Modal, PaginationProps, message } from 'antd';
import { useHistory } from 'react-router-dom';
import { requestGetTagChatAnalyseList, requestUpdateBatchChatTag, requestUpdateChatTag } from 'src/apis/tagConfig';
import UpdateTagModal from './UpdateTagModal/UpdateTagModal';
import style from './style.module.less';

const TagParsing: React.FC = () => {
  const [list, setList] = useState<IChatTagItem[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [rowItem, setRowItem] = useState<IChatTagItem>();
  const [pagination, setPagination] = useState<PaginationProps>({ current: 1, pageSize: 10, total: 0 });
  const [searchValue, setSearchValue] = useState<{ [key: string]: string }>({});
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  // 获取列表
  const getList = async (values?: any) => {
    setLoading(true);
    const res = await requestGetTagChatAnalyseList(values).finally(() => setLoading(false));
    if (res) {
      const { list, total } = res;
      setList(list || []);
      setPagination((pagination) => ({
        ...pagination,
        total,
        current: values?.pageNum || 1,
        pageSize: values?.pageSize || 10
      }));
      setSelectedRowKeys([]);
    }
  };

  const onSearch = (values?: any) => {
    getList({ ...values, pageSize: pagination.pageSize }).then(() => setSearchValue(values));
  };

  const rowSelection = {
    selectedRowKeys,
    onChange (selectedRowKeys: Key[]) {
      setSelectedRowKeys(selectedRowKeys);
    },
    getCheckboxProps: (record: IChatTagItem) => {
      return {
        disabled: record.updateAllTag === 1,
        name: ''
      };
    }
  };

  // 切换分页
  const paginationChange = (current: number, pageSize?: number) => {
    // 判断是否切换pageSize，如果是切换pageSize则从第一页开始请求
    const pageNum = pageSize === pagination.pageSize ? current : 1;
    getList({ ...searchValue, pageNum, pageSize });
  };

  // 提交更新标签
  const modalOnOk = async (param: any) => {
    const res = await requestUpdateChatTag(param);
    if (res) {
      getList({ ...searchValue, pageNum: pagination.current, pageSize: pagination.pageSize });
      setModalVisible(false);
      message.success('标签已更新');
    }
  };

  // 更新全部标签
  const updateAllTag = (analyseIds: Key[]) => {
    Modal.confirm({
      title: '温馨提示',
      content: '确定是否将标签全部更新',
      async onOk () {
        const res = await requestUpdateBatchChatTag({ analyseIds });
        if (res) {
          getList({ ...searchValue, pageNum: pagination.current, pageSize: pagination.pageSize });
          message.success('标签已更新');
        }
      }
    });
  };

  // 批量更新标签
  const batchUpdateTag = () => {
    updateAllTag(selectedRowKeys);
  };

  // 选择标签更新
  const selectivelyUpdate = (rowItem: IChatTagItem) => {
    setRowItem(rowItem);
    setModalVisible(true);
  };

  // 查看客户详情
  const viewClientDetail = (record: IChatTagItem) => {
    history.push(
      '/tagParsing/clientDetail?externalUserid=' + record.externalUserid + '&followStaffId=' + record.staffId,
      {
        navList: [
          {
            name: '标签解析',
            path: '/tagParsing'
          },
          {
            name: '客户详情'
          }
        ]
      }
    );
  };

  // 查看聊天记录
  const viewChatList = (row: IChatTagItem) => {
    history.push('/tagParsing/chatLog?partnerId=' + row.externalUserid + '&userId=' + row.userid, {
      clientInfo: row,
      navList: [
        {
          name: '标签解析',
          path: '/tagParsing'
        },
        {
          name: '客户详情'
        }
      ]
    });
  };

  useEffect(() => {
    getList();
  }, []);

  return (
    <div className="container">
      <NgFormSearch searchCols={searchCols} onSearch={onSearch} />
      <NgTable
        rowKey="analyseId"
        loading={loading}
        columns={tableColumns({ updateAllTag, selectivelyUpdate, viewClientDetail, viewChatList })}
        dataSource={list}
        rowSelection={rowSelection}
        pagination={pagination}
        paginationChange={paginationChange}
      />
      {list.length === 0 || (
        <div className="operationWrap">
          <Button
            className={style.batchBtn}
            shape="round"
            disabled={selectedRowKeys.length === 0}
            onClick={batchUpdateTag}
          >
            批量更新
          </Button>
        </div>
      )}
      <UpdateTagModal
        analyseId={rowItem?.analyseId}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onOk={modalOnOk}
      />
    </div>
  );
};
export default TagParsing;
