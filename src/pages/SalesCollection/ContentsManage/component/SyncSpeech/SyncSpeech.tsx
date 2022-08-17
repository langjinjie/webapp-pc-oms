import React, { useEffect, useMemo, useState, Key } from 'react';
import { Modal, /* Icon,  */ NgFormSearch, NgTable } from 'src/components';
import { message, Tag, Tree } from 'antd';
import { SpeechModal } from '../index';
import {
  requestGetSmartCatalogTree,
  getSpeechList,
  requestSmartSyncCatalog,
  requestSmartSyncContent
} from 'src/apis/salesCollection';
import { ICatalogItem } from 'src/utils/interface';
import { columns, /* excelDemoUrl, */ setSearchCols, SpeechProps } from './Config';
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
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<SpeechProps[]>([]);
  const [selectedRows, setSelectedRows] = useState<SpeechProps[]>([]);
  const [speechVisible, setSpeechVisible] = useState(false);
  const [checkedKeys, setCheckedKeys] = useState<Key[]>([]);
  const [catalogId, setCatalogId] = useState('');
  const [flatList, setFlatList] = useState<ICatalogItem[]>([]);
  const [allCheckedNodes, setAllCheckedNodes] = useState<ICatalogItem[]>([]);
  const [formDefaultValue, setFormDefaultValue] = useState<{ catalogIds: string[] }>({
    catalogIds: []
  });
  const [pagination, setPagination] = useState<any>({
    current: 1,
    pageSize: 5,
    total: 0
  });
  const [formParams, setFormParams] = useState({
    catalogId: '',
    content: '',
    contentType: '',
    sensitive: '',
    status: '',
    tip: '',
    updateBeginTime: '',
    updateEndTime: '',
    contentId: '',
    sceneId: ''
  });

  // 重置
  const onResetHandle = () => {
    setCheckedKeys([]);
    setSelectedRows([]);
    setCheckedNodes([]);
    setTreeData([]);
    setFormDefaultValue({ catalogIds: [] });
    setPagination({ current: 1, pageSize: 5, total: 0 });
    setDataSource([]);
    setAllCheckedNodes([]);
    setFormParams({
      catalogId: '',
      content: '',
      contentType: '',
      sensitive: '',
      status: '',
      tip: '',
      updateBeginTime: '',
      updateEndTime: '',
      contentId: '',
      sceneId: ''
    });
  };

  // 取消同步
  const onCloseHandle = () => {
    onClose?.();
    onResetHandle();
  };
  // 同步话术
  const onOkHandle = async () => {
    let res: any;
    if (value?.lastLevel) {
      res = await requestSmartSyncContent({
        sceneId: value?.sceneId,
        catalogId: value?.catalogId,
        list: selectedRows
      });
    } else {
      res = await requestSmartSyncCatalog({
        sceneId: value?.sceneId,
        catalogId: value?.catalogId,
        list: checkedNodes
      });
    }
    if (res) {
      onOk?.();
      onClose?.();
      onResetHandle();
      message.success((value?.lastLevel ? '话术' : '目录') + '同步成功');
    }
  };

  // 点击Tree的复选框
  const onCheckHandle = (checkedKeys: any, e: any) => {
    const allCheckedNodes = flatList.filter((filterItem) =>
      [...checkedKeys, ...e.halfCheckedKeys].includes(filterItem.catalogId)
    );
    const curLevelNode = allCheckedNodes.filter((filterItem) => filterItem.level === (value?.level || 0) + 1);
    setAllCheckedNodes(allCheckedNodes);
    setCheckedKeys(checkedKeys);
    setCheckedNodes(
      curLevelNode.map((mapItem) => {
        return arry2Tree(allCheckedNodes, mapItem.catalogId, 'catalogId');
      })
    );
  };

  // 查询话术列表
  const getList = async (params?: any) => {
    setLoading(true);
    // 清空选中的列表
    // setSelectRowKeys([]);
    // 重置当前操作状态
    // setCurrentType(null);
    const { pageSize, current: pageNum } = pagination;
    const { list, total } = await getSpeechList({
      ...formParams,
      queryMain: 1,
      pageNum,
      pageSize,
      ...params
    });
    setDataSource(list || []);
    setPagination((pagination: any) => ({ ...pagination, total: total || 0 }));
    setLoading(false);
  };

  // 获取树列表
  const getSmartCatalogTree = async () => {
    // 判断是同步目录还是同步话术
    if (value?.lastLevel) {
      // 同步话术
      const promiseList = [1, 2, 3, 4, 5].map((sceneId) => requestGetSmartCatalogTree({ sceneId, queryMain: 1 }));
      const res = (await Promise.allSettled(promiseList)).filter((filterItem: any) => filterItem.value);
      if (res) {
        const categories = res.map((mapItem: any, index) => ({ ...mapItem.value, sceneId: index + 1 }));
        // 匹配主机构是否有相同名称的目录
        const flatList = tree2Arry([categories[value.sceneId - 1]]);
        const content = flatList.find((findItem) => findItem.fullName === value.fullName);
        let catalogIds = [];
        let catalogId = '';
        let sceneId: any;
        if (content) {
          catalogId = content.catalogId;
          catalogIds = content.fullCatalogId.split('-');
          sceneId = value?.sceneId;
        }
        // 首选
        setCategories(categories);
        // // 获取话术列表
        getList({ catalogId: catalogId, sceneId });
        setFormDefaultValue({ catalogIds: catalogIds });
        setFormParams((formParams) => ({ ...formParams, catalogId, sceneId }));
      }
    } else {
      // 同步目录
      const res = await requestGetSmartCatalogTree({ sceneId: value?.sceneId, queryMain: 1 });
      if (res) {
        const filterFlatList = tree2Arry([res]).map((flatItem) => ({
          ...flatItem,
          disabled: value?.lastLevel ? false : flatItem.level <= (value?.level || 0)
        }));
        setFlatList(
          filterFlatList
            .filter((filterItem) => filterItem.level > (value?.level || 0))
            .map((mapItem) => ({ ...mapItem, children: [] }))
        );
        const flatListTree: any = arry2Tree(filterFlatList, res.catalogId, 'catalogId');
        setTreeData([flatListTree]);
      }
    }
  };

  // 点击查询按钮
  const onSearch = async (values: any) => {
    const {
      catalogIds,
      content = '',
      contentType = '',
      sensitive = '',
      status = '',
      contentId = '',
      times = undefined,
      tip = ''
    } = values;
    let catalogId = '';
    let sceneId = '';
    if (catalogIds && catalogIds.length) {
      catalogId = catalogIds[catalogIds.length - 1];
      sceneId = categories.find((findItem) => findItem.catalogId === catalogIds[0]).sceneId;
    }
    let updateBeginTime = '';
    let updateEndTime = '';
    if (times) {
      updateBeginTime = times[0].startOf('day').valueOf();
      updateEndTime = times[1].endOf('day')?.valueOf();
    }
    setFormParams((formParams) => ({
      ...formParams,
      catalogId,
      content,
      contentType,
      sensitive,
      status,
      tip,
      contentId,
      updateBeginTime,
      updateEndTime,
      sceneId
    }));
    // 将页面重置为第一页
    setPagination((pagination: any) => ({ ...pagination, current: 1 }));
    await getList({
      pageNum: 1,
      catalogId,
      content,
      contentType,
      sensitive,
      status,
      tip,
      contentId,
      updateBeginTime,
      updateEndTime,
      sceneId
    });
  };

  // const onCascaderChange = (/* _: any, selectedOptions: any */) => {
  //   setPagination((pagination: any) => ({ ...pagination, current: 1 }));
  // };

  // const onValuesChange = (_: any, values: any) => {
  //   const {
  //     catalogIds,
  //     content = '',
  //     contentType = '',
  //     sensitive = '',
  //     status = '',
  //     times = undefined,
  //     tip = ''
  //   } = values;
  //   let catalogId = '';
  //   if (catalogIds) {
  //     catalogId = catalogIds[catalogIds.length - 1];
  //   }
  //   let updateBeginTime = '';
  //   let updateEndTime = '';
  //   if (times) {
  //     updateBeginTime = times[0].startOf('day').valueOf();
  //     updateEndTime = times[1].endOf('day')?.valueOf();
  //   }
  //   setFormParams((formParams) => ({
  //     ...formParams,
  //     catalogId,
  //     content,
  //     contentType,
  //     sensitive,
  //     status,
  //     tip,
  //     updateBeginTime,
  //     updateEndTime
  //   }));
  // };

  const onSelectChange = (_: React.Key[], newSelectedRows: SpeechProps[]) => {
    // 把不在本页的数据找出来
    const otherPageRows = selectedRows.filter(
      (row) => !dataSource.map((mapItem) => mapItem.contentId).includes(row.contentId)
    );
    setSelectedRows([...otherPageRows, ...newSelectedRows]);
  };

  const rowSelection = {
    selectedRowKeys: selectedRows.map((rowItem) => rowItem.contentId),
    onChange: (selectedRowKeys: React.Key[], selectedRows: SpeechProps[]) => {
      onSelectChange(selectedRowKeys, selectedRows);
    }
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
    return allCheckedNodes.reduce((prev: number, now: ICatalogItem) => {
      if (now.lastLevel) {
        prev += now.contentNum;
      }
      return prev;
    }, 0);
  }, [allCheckedNodes]);

  // 删除已选择
  const onTagClose = (item: SpeechProps) => {
    setSelectedRows((selectedRows) => selectedRows.filter((rowItem) => rowItem.contentId !== item.contentId));
  };

  useEffect(() => {
    if (visible) {
      getSmartCatalogTree();
    }
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
              {!treeData.length || (
                <Tree
                  // @ts-ignore
                  treeData={treeData}
                  defaultExpandAll
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
              {!checkedNodes.length || (
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
              )}
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
              defaultValues={formDefaultValue}
              searchCols={setSearchCols(categories)}
              onSearch={onSearch}
              // onChangeOfCascader={onCascaderChange}
              // onValuesChange={onValuesChange}
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
            />
          </div>
          <div className={style.title}>已选择</div>
          {!selectedRows.length || (
            <div className={style.list}>
              {selectedRows.map((mapItem) => (
                <Tag
                  title={mapItem.content}
                  key={mapItem.contentId}
                  onClose={() => onTagClose(mapItem)}
                  className={style.tag}
                  closable
                >
                  {mapItem.content.length > 25 ? mapItem.content.slice(0, 26) + '...' : mapItem.content}
                </Tag>
              ))}
            </div>
          )}
        </>
      )}
      {true && (
        <div className={style.tips}>温馨提醒：主机构已选择的话术目录向下的内容都会同步到机构选择目录下，请您知悉</div>
      )}
      <SpeechModal visible={speechVisible} catalogId={catalogId} onClose={() => setSpeechVisible(false)} />
    </Modal>
  );
};
export default SyncSpeech;
