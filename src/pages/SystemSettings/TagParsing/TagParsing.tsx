import React, { useEffect, useState } from 'react';
import { NgFormSearch, NgTable } from 'src/components';
import { searchCols, tableColumns, IChatTagItem } from './Config';
import { Button } from 'antd';
import UpdateTagModal, { IAnalyseIdList } from './UpdateTagModal/UpdateTagModal';
import style from './style.module.less';

const TagParsing: React.FC = () => {
  const [list, setList] = useState<IChatTagItem[]>([]);
  const [modalVisible, setModalVisible] = useState(true);
  const [rowItem, setRowItem] = useState<IChatTagItem>();
  const onSearch = (values?: any) => {
    console.log('values', values);
  };

  // 获取列表
  const getList = () => {
    setList([]);
  };

  // 提交更新标签
  const modalOnOk = (list: IAnalyseIdList[]) => {
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

  useEffect(() => {
    getList();
  }, []);

  return (
    <div className="container">
      <NgFormSearch searchCols={searchCols} onSearch={onSearch} />
      <NgTable columns={tableColumns({ updateAllTag, selectivelyUpdate })} id="analyseId" dataSource={list} />
      {list.length === 0 || (
        <Button className={style.batchBtn} shape="round">
          批量更新
        </Button>
      )}
      <UpdateTagModal value={rowItem} visible={modalVisible} onClose={() => setModalVisible(false)} onOk={modalOnOk} />
    </div>
  );
};
export default TagParsing;
