import React, { Key, useEffect, useState } from 'react';
import { NgFormSearch, NgTable } from 'src/components';
import { searchCols, tableColumns, IChatTagItem } from './Config';
import { Button } from 'antd';
import UpdateTagModal from './UpdateTagModal/UpdateTagModal';
import style from './style.module.less';
import { useHistory } from 'react-router-dom';

const TagParsing: React.FC = () => {
  const [list, setList] = useState<IChatTagItem[]>([]);
  const [modalVisible, setModalVisible] = useState(true);
  const [rowItem, setRowItem] = useState<IChatTagItem>();
  const history = useHistory();

  const onSearch = (values?: any) => {
    console.log('values', values);
  };

  // 获取列表
  const getList = () => {
    setList([]);
  };

  // 提交更新标签
  const modalOnOk = (list: Key[]) => {
    console.log('list', list);
  };

  // 更新全部标签
  const updateAllTag = () => {
    console.log('更新全部标签');
  };

  // 选择标签更新
  const selectivelyUpdate = (rowItem: IChatTagItem) => {
    console.log('选择性更新标签');
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
        columns={tableColumns({ updateAllTag, selectivelyUpdate, viewClientDetail, viewChatList })}
        id="analyseId"
        dataSource={list}
      />
      {list.length === 0 || (
        <Button className={style.batchBtn} shape="round">
          批量更新
        </Button>
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
