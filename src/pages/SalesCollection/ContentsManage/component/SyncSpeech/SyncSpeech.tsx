import React, { useEffect, useMemo, useState, Key } from 'react';
import { Modal, /* Icon,  */ NgFormSearch, NgTable } from 'src/components';
import { Tag, Tree } from 'antd';
import { SpeechModal } from '../index';
import {
  requestGetSmartCatalogTree,
  getCategoryList,
  getSpeechList,
  requestSmartSyncCatalog
} from 'src/apis/salesCollection';
import { ICatalogItem } from 'src/utils/interface';
import { columns, /* excelDemoUrl, */ setSearchCols, SpeechProps, filterChildren } from './Config';
import { tree2Arry, arry2Tree } from 'src/utils/base';
import style from './style.module.less';
import classNames from 'classnames';

export interface ISyncSpeechProps {
  visible: boolean;
  value?: ICatalogItem;
  onClose?: () => void;
  onChange?: (value: any) => void;
  onOk?: () => void;
  title?: string;
  catalog?: ICatalogItem; // 当前要同步的目录
}

const SyncSpeech: React.FC<ISyncSpeechProps> = ({ visible, value, onClose, onOk, title, catalog }) => {
  const [treeData, setTreeData] = useState<ICatalogItem[]>([]);
  const [checkedNodes, setCheckedNodes] = useState<ICatalogItem[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  // const [formDefaultValue, setFormDefaultValue] = useState<{ catalogIds: string[] }>({
  //   catalogIds: []
  // });
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectRowKeys] = useState<React.Key[]>([]);
  const [lastCategory, setLastCategory] = useState<any>();
  const [pagination, setPagination] = useState<any>({
    current: 1,
    pageSize: 5
  });
  const [dataSource, setDataSource] = useState<SpeechProps[]>([]);
  const [selectedRows, setSelectedRows] = useState<SpeechProps[]>([]);
  const [speechVisible, setSpeechVisible] = useState(false);
  const [catalogId, setCatalogId] = useState('');
  const [checkedKeys, setCheckedKeys] = useState<Key[]>([]);

  // 重置
  const onResetHandle = () => {
    setCatalogId('');
    setCheckedKeys([]);
    setSelectRowKeys([]);
    setCheckedNodes([]);
  };

  // 取消同步
  const onCloseHandle = () => {
    onClose?.();
    onResetHandle();
  };
  // 同步话术
  const onOkHandle = async () => {
    const res = await requestSmartSyncCatalog({
      sceneId: value?.sceneId,
      catalogId: value?.catalogId,
      list: checkedNodes
    });
    if (res) {
      onOk?.();
      onClose?.();
      onResetHandle();
    }
  };

  // 获取树列表
  const getSmartCatalogTree = async () => {
    const res = await requestGetSmartCatalogTree({ sceneId: value?.sceneId, queryMain: 1 });
    if (res) {
      const flatList = tree2Arry([res]);
      const levelNode = [...flatList].find((findItem) => findItem.level === value?.level);
      const filterFlatList = tree2Arry([res])
        .filter((filterItem) => {
          if (filterItem.level < levelNode.level) {
            return levelNode?.fullCatalogId.split('-').includes(filterItem.catalogId);
            // return
          }
          return true;
        })
        .map((flatItem) => ({
          ...flatItem,
          disabled: flatItem.level <= (value?.level || 0)
        }));
      const flatListTree: any = arry2Tree(filterFlatList, res.catalogId, 'catalogId');
      setTreeData([flatListTree]);
    }
  };

  // 点击Tree的复选框
  const onCheckHandle = (checkedKeys: any, e: any) => {
    setCheckedKeys(checkedKeys);
    setCheckedNodes(filterChildren(e.checkedNodes));
  };

  const loadData = async (selectedOptions: any) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;

    // 异步加载子类目
    const res = await getCategoryList({ sceneId: targetOption.sceneId, catalogId: targetOption.catalogId });

    targetOption.loading = false;
    if (res) {
      res.forEach((item: any) => {
        if (item.lastLevel === 0) {
          item.isLeaf = false;
        }
      });
      targetOption.children = res;
    }
    setCategories([...categories]);
  };

  // 查询话术列表
  const getList = async (params?: any) => {
    setLoading(true);
    // 清空选中的列表
    setSelectRowKeys([]);
    // 重置当前操作状态
    // setCurrentType(null);
    const { pageSize, current: pageNum } = pagination;
    const { list, total } = await getSpeechList({
      pageNum,
      pageSize,
      sceneId: lastCategory?.sceneId || '',
      ...params
    });
    setDataSource(list || []);
    setPagination((pagination: any) => ({ ...pagination, total: total || 0 }));
    setLoading(false);
  };

  // 点击查询按钮
  const onSearch = async (values: any) => {
    console.log('重新请求');
    // 将页面重置为第一页
    // setPagination((pagination) => ({ ...pagination, current: 1 }));
    const {
      catalogIds,
      content = '',
      contentType = '',
      sensitive = '',
      status = '',
      times = undefined,
      tip = '',
      contentId = ''
    } = values;
    let updateBeginTime = '';
    let updateEndTime = '';
    if (times) {
      updateBeginTime = times[0].startOf('day').valueOf();
      updateEndTime = times[1].endOf('day')?.valueOf();
    }
    let catalogId = '';
    let sceneId = '';
    if (catalogIds && catalogIds.length > 0) {
      catalogId = catalogIds[catalogIds.length - 1];
      sceneId = lastCategory.sceneId;
    } else {
      // setLastCategory(null);
    }
    await getList({
      pageNum: 1,
      catalogId,
      content,
      contentType,
      sensitive,
      status,
      tip,
      updateBeginTime,
      updateEndTime,
      sceneId,
      contentId
    });
  };

  const onCascaderChange = (value: any, selectedOptions: any) => {
    const lastSelectedOptions = selectedOptions[selectedOptions.length - 1] || {};
    setLastCategory(lastSelectedOptions);
    setPagination((pagination: any) => ({ ...pagination, current: 1 }));
    let params = {};
    if (lastSelectedOptions.lastLevel === 1) {
      params = {
        content: '',
        contentType: '',
        sensitive: '',
        status: '',
        tip: '',
        updateBeginTime: '',
        updateEndTime: ''
      };
    }
    console.log('params', params);
  };

  const onValuesChange = (_: any, values: any) => {
    const {
      catalogIds
      // content = '',
      // contentType = '',
      // sensitive = '',
      // status = '',
      // tip = ''
    } = values;
    let catalogId = '';
    if (catalogIds) {
      catalogId = catalogIds[catalogIds.length - 1];
    }
    console.log('catalogIds', catalogIds);
    console.log('catalogId', catalogId);
  };

  const onSelectChange = (selectedRowKeys: React.Key[], selectedRows: SpeechProps[]) => {
    setSelectRowKeys(selectedRowKeys);
    console.log('selectedRows', selectedRows);
    setSelectedRows(selectedRows);
    const current = selectedRows[0];
    console.log('current', current);
    // if (current) {
    //   setCurrentType(current.status);
    // } else {
    //   setCurrentType(null);
    // }
  };

  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: SpeechProps[]) => {
      onSelectChange(selectedRowKeys, selectedRows);
    }
    // getCheckboxProps: (record: SpeechProps) => {
    //   return {
    //     disabled: isDisabled(currentType, record.status),
    //     name: record.content
    //   };
    // }
  };

  // 分页改变
  const paginationChange = (pageNum: number, pageSize?: number) => {
    setPagination((pagination: any) => ({
      ...pagination,
      current: pageNum,
      pageSize: pageSize || pagination.pageSize
    }));
    getList({ pageNum, pageSize });
  };
  // 查看目录下的话术
  const viewSpeechHandle = (catalogId: string) => {
    setSpeechVisible(true);
    setCatalogId(catalogId);
  };

  const speechNum = useMemo(() => {
    return checkedNodes.reduce((prev: number, now: ICatalogItem) => {
      prev += now.contentNum;
      return prev;
    }, 0);
  }, [checkedNodes]);

  useEffect(() => {
    visible && console.log('onOk', onOk);
    visible && getSmartCatalogTree();
  }, [visible]);
  return (
    <Modal
      centered
      title={title || '同步目录'}
      visible={visible}
      className={style.modalWrap}
      onClose={onCloseHandle}
      onOk={onOkHandle}
      destroyOnClose
    >
      {/* 同步目录 */}
      {catalog?.lastLevel === 1 || (
        <div className={style.wrap}>
          <div className={style.treeWrap}>
            <div className={style.title}>主机构目录</div>
            <div className={classNames(style.treeContent, 'scroll-strip')}>
              {true && (
                <Tree
                  // @ts-ignore
                  treeData={treeData}
                  blockNode
                  checkedKeys={checkedKeys}
                  onCheck={onCheckHandle}
                  checkable
                  fieldNames={{ title: 'name', key: 'catalogId' }}
                  // @ts-ignore
                  titleRender={(node: ICatalogItem) => (
                    <div className={style.nodeItem}>
                      {node.name}
                      <span className={style.contentNum}>
                        （{`上架${node.onlineContentNum}/全部${node.contentNum}`}）
                      </span>
                    </div>
                  )}
                />
              )}
            </div>
          </div>
          <div className={style.seleectWrap}>
            <div className={style.seleectTitle}>
              已选择{<span className={style.boldText}> {speechNum} </span>}条话术到
              {<span className={style.boldText}> [{value?.name}] </span>}目录下
            </div>
            <div className={classNames(style.treeContent, 'scroll-strip')}>
              <Tree
                // @ts-ignore
                treeData={checkedNodes}
                blockNode
                fieldNames={{ title: 'name', key: 'sid' }}
                // @ts-ignore
                titleRender={(node: ICatalogItem) => (
                  <div className={style.nodeItem}>
                    {node.name}
                    <span className={style.contentNum}>
                      （{`上架${node.onlineContentNum}/全部${node.contentNum}`}）
                    </span>
                    {!node.lastLevel || (
                      <span className={style.viewSpeech} onClick={() => viewSpeechHandle(node.catalogId)}>
                        查看话术
                      </span>
                    )}
                  </div>
                )}
              />
            </div>
          </div>
        </div>
      )}
      {/* 同步话术 */}
      {catalog?.lastLevel === 1 && (
        <>
          <div className={style.title}>主机构话术</div>
          <div className={classNames(style.speechWrap, 'form-inline pt20')}>
            <NgFormSearch
              // defaultValues={formDefaultValue}
              searchCols={setSearchCols(categories)}
              loadData={loadData}
              onSearch={onSearch}
              onChangeOfCascader={onCascaderChange}
              onValuesChange={onValuesChange}
            />
            <NgTable
              dataSource={dataSource}
              columns={columns()}
              setRowKey={(record: SpeechProps) => {
                return record.contentId;
              }}
              scroll={{ x: 'max-content' }}
              loading={loading}
              // @ts-ignore
              rowSelection={{ ...rowSelection }}
              pagination={{ ...pagination, simple: true }}
              paginationChange={paginationChange}
            ></NgTable>
          </div>
          <div className={style.title}>已选择</div>
          {!selectedRows.length || (
            <div className={style.list}>
              {selectedRows.map((mapItem) => (
                <Tag key={mapItem.contentId} className={style.tag} closable>
                  {mapItem.content}
                </Tag>
              ))}
            </div>
          )}
        </>
      )}
      <div className={style.tips}>温馨提醒：主机构已选择的话术目录向下的内容都会同步到机构选择目录下，请您知悉</div>
      <SpeechModal visible={speechVisible} catalogId={catalogId} onClose={() => setSpeechVisible(false)} />
    </Modal>
  );
};
export default SyncSpeech;
