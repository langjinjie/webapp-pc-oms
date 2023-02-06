import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { NgFormSearch, NgTable } from 'src/components';
import { SearchCols, TableColumns } from 'src/pages/Operation/ChannelTag/Config';
import { IChannelItem } from './Config';
import AddTagModal from './AddTagModal/AddTagModal';
import style from './style.module.less';

const ChannelTag: React.FC = () => {
  const [list, setList] = useState<any[]>([]);
  const [addTagVisible, setAddTagVisible] = useState(false);
  // 获取渠道标签列表
  const getList = () => {
    const item: IChannelItem = {
      groupId: '1',
      groupName: '投放渠道',
      status: 1,
      canDel: 2,
      tagList: [
        { tagId: '1', tagName: '默认渠道' },
        { tagId: '2', tagName: 'App' },
        { tagId: '3', tagName: '公众号' }
      ]
    };
    setList([item]);
  };
  // 搜索标签
  const onSearchHandle = (values: any) => {
    console.log('values', values);
  };
  // 添加渠道标签
  const addTagHandle = () => {
    setAddTagVisible(true);
  };
  useEffect(() => {
    getList();
  }, []);
  return (
    <>
      <h1>渠道标签</h1>
      <div className={style.content}>
        <NgFormSearch onSearch={onSearchHandle} searchCols={SearchCols} />
        <Button className={style.addBtn} type="primary" icon={<PlusOutlined />} onClick={addTagHandle}>
          新增渠道标签
        </Button>
        <NgTable className={style.table} dataSource={list} columns={TableColumns()} />
        <div className={style.batch}>
          <Button className={style.batchStop}>批量停用</Button>
          <Button className={style.batchDel}>批量删除</Button>
        </div>
      </div>
      <AddTagModal visible={addTagVisible} onCancel={() => setAddTagVisible(false)} />
    </>
  );
};
export default ChannelTag;
