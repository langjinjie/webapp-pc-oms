import React, { useEffect, useState } from 'react';
import { IGroupTag } from 'src/utils/interface';
import { Button, Modal, Table, Form, Input } from 'antd';
import { Icon } from 'src/components';
import { ColumnsType } from 'antd/es/table';
// import { Key } from 'rc-table/lib/interface';
import { requestGetGroupTagList } from 'src/apis/orgManage';
import { AddTagModal } from '../index';
import style from './style.module.less';
import classNames from 'classnames';

interface IChooseTags {
  value?: { groupTagId: string; name: string }[];
  onChange?: (value: { groupTagId: string }[]) => void;
  readOnly?: boolean;
}

interface IGroupTagList {
  total: number;
  list: IGroupTag[];
}

const ChooseTags: React.FC<IChooseTags> = ({ value, onChange, readOnly }) => {
  const [modalParam, setModalParam] = useState<{ visible: boolean }>({ visible: false });
  const [groupTagList, setGroupTagList] = useState<IGroupTagList>({ total: 0, list: [] });
  const [selectedKeys, setSelectedKeys] = useState<{ groupTagId: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParam, setSearchParam] = useState<{ [key: string]: any }>({ name: '' });
  const [addTagParam, setAddTagParam] = useState<{ visible: boolean }>({ visible: false });
  const [form] = Form.useForm();
  const { Item } = Form;
  const columns: ColumnsType<any> = [
    { title: '标签名称', dataIndex: 'name' },
    {
      title: '标签逻辑',
      dataIndex: 'filterName',
      render (filterName: string) {
        return (
          <div title={filterName} className={style.filterName}>
            {filterName}
          </div>
        );
      }
    },
    { title: '标签生成时间', dataIndex: 'createTime' }
  ];
  // 选择标签
  const chooseTagHandle = () => {
    setModalParam({ visible: true });
  };
  // 查询用户组标签列表
  const getGroupTagList = async () => {
    setLoading(true);
    const res = await requestGetGroupTagList({ pageNum: 1, pageSize: 999, ...searchParam });
    if (res) {
      setGroupTagList(res);
    }
    setLoading(false);
  };
  // 多选框配置对象
  const rowSelection = {
    selectedRowKeys: selectedKeys.map((mapItem) => mapItem.groupTagId),
    onSelect (record: IGroupTag, selected: boolean) {
      if (selected) {
        setSelectedKeys((keys) => [...keys, { ...record }]);
      } else {
        setSelectedKeys((keys) => [...keys.filter((filterItem) => filterItem.groupTagId !== record.groupTagId)]);
      }
    },
    onSelectAll (selected: boolean, selectedRows: IGroupTag[]) {
      if (selected) {
        // 当搜索的时候按下全选会出现数组元素为undefined的情况
        // 过滤掉undefined
        const filterSelectedRows = selectedRows.filter((filterItem) => filterItem);
        const selectedRowsKeys = filterSelectedRows.map((mapItem) => mapItem?.groupTagId);
        setSelectedKeys((keys) => [
          ...keys.filter((filterItem) => !selectedRowsKeys.includes(filterItem.groupTagId)),
          ...filterSelectedRows
        ]);
      } else {
        const unSelectedRowsKeys = groupTagList.list.map((mapItem) => mapItem.groupTagId);
        setSelectedKeys((keys) => keys.filter((filterItem) => !unSelectedRowsKeys.includes(filterItem.groupTagId)));
      }
    }
  };
  // 搜索
  const onFinish = (values: any) => {
    setSearchParam(values);
  };
  // 重置表单
  const onReset = () => {
    form.resetFields();
    setSearchParam({});
  };
  // 清除单个标签选择
  const delSingleTag = (event: React.MouseEvent<Element, MouseEvent>, groupTagId: string) => {
    event.stopPropagation();
    onChange?.(value?.filter((item) => item.groupTagId !== groupTagId) || []);
  };
  // 清除标签选择
  const clearTags = () => {
    onChange?.([]);
  };
  // 取消选中
  const delSelected = (groupTagId: string) => {
    setSelectedKeys((param) => [...param.filter((item) => item.groupTagId !== groupTagId)]);
  };
  const onOk = () => {
    setModalParam({ visible: false });
    onChange?.(selectedKeys);
  };
  const onCancel = () => {
    setModalParam({ visible: false });
    onReset();
  };
  useEffect(() => {
    getGroupTagList();
  }, [searchParam]);
  useEffect(() => {
    if (modalParam.visible) {
      setSelectedKeys(value || []);
    }
  }, [modalParam.visible]);
  return (
    <div className={style.wrap}>
      <div className={style.choosedList}>
        {!value?.length && <span className={style.placeholder}>请选择</span>}
        {value?.map((item) => (
          <div key={item.groupTagId} className={classNames(style.chooseItem, { [style.readOnly]: readOnly })}>
            {item.name}
            {readOnly || (
              <Icon
                className={style.delItem}
                name="icon_common_Line_Close"
                onClick={(event) => delSingleTag(event, item.groupTagId)}
              />
            )}
          </div>
        ))}
        {!value?.length || readOnly || <Icon name="guanbi" className={style.clear} onClick={clearTags} />}
      </div>
      <Button className={style.chooseTagBtn} onClick={chooseTagHandle} disabled={readOnly}>
        选择标签
      </Button>
      <Modal
        title="选择标签"
        visible={modalParam.visible}
        centered
        className={style.chooseTagModal}
        maskClosable={false}
        closable={false}
        onOk={onOk}
        onCancel={onCancel}
      >
        <div className={style.contentWrap}>
          <Button className={style.addTagBtn} type="primary" onClick={() => setAddTagParam({ visible: true })}>
            添加新标签
          </Button>
          <div className={style.title}>已选可见标签：</div>
          <div className={style.chooseTagList}>
            {selectedKeys.map((item) => (
              <div key={item.groupTagId} className={style.chooseTagItem}>
                {item.name}
                <Icon
                  className={style.del}
                  name="icon_common_Line_Close"
                  onClick={() => delSelected(item.groupTagId)}
                />
              </div>
            ))}
          </div>
          <div className={style.title}>已有可见标签：</div>
          <Form className={style.form} form={form} layout={'inline'} onFinish={onFinish}>
            <Item label="标签名称：" name={'name'}>
              <Input className={style.input} placeholder="请输入" />
            </Item>
            <Item>
              <Button className={style.submitBtn} htmlType="submit" type="primary">
                查询
              </Button>
              <Button className={style.resetBtn} onClick={onReset}>
                重置
              </Button>
            </Item>
          </Form>
          <Table
            className={style.tableWrap}
            rowKey={'groupTagId'}
            scroll={{ x: 'max-content', y: 244 }}
            dataSource={groupTagList.list}
            columns={columns}
            rowSelection={rowSelection}
            pagination={false}
            loading={loading}
          />
        </div>
      </Modal>
      <AddTagModal addTagParam={addTagParam} setAddTagParam={setAddTagParam} updateList={() => setSearchParam({})} />
    </div>
  );
};
export default ChooseTags;
