import React, { useEffect, useState } from 'react';
import { Modal, Icon, NgFormSearch, NgTable } from 'src/components';
import { Tag, Tree } from 'antd';
import { SpeechModal } from '../index';
import { requestGetSmartCatalogTree, getCategoryList, getSpeechList } from 'src/apis/salesCollection';
import { ICatalogItem } from 'src/utils/interface';
import { columns, /* excelDemoUrl, */ setSearchCols, SpeechProps } from './Config';
import style from './style.module.less';
import classNames from 'classnames';

export interface ISyncSpeechProps {
  syncSpeechParam: ISyncSpeechParam;
  onClose?: () => void;
}

export interface ISyncSpeechParam {
  visible: boolean;
  title?: string;
  islastLevel?: boolean;
}

const SyncSpeech: React.FC<ISyncSpeechProps> = ({ syncSpeechParam, onClose }) => {
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

  const onCloseHandle = () => {
    onClose?.();
  };
  // 获取树列表
  const getSmartCatalogTree = async () => {
    const promiseList = [1, 2, 3, 4, 5, 6].map((sceneId) => requestGetSmartCatalogTree({ sceneId, queryMain: 1 }));
    const res = (await Promise.allSettled(promiseList)).filter((filterItem: any) => filterItem.value);
    if (res) {
      const treeData = res.map((mapItem: any) => mapItem.value);
      console.log('treeData', [...treeData]);
      setTreeData([...treeData]);
    }
  };

  // 点击复选框
  const onCheckHandle = (_: any, e: any) => {
    setCheckedNodes(e.checkedNodes);
    console.log('e', e);
    console.log('checkedNodes', checkedNodes);
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

  const onValuesChange = (changeValues: any, values: any) => {
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

  // // 动态计算是否显示全选框
  // const hideSelectAll = useMemo(() => {
  //   if (formParams.status !== '' && isNew) {
  //     return false;
  //   }
  //   return true;
  // }, [formParams.status, isNew]);

  // 查看目录下的话术
  const viewSpeechHandle = (catalogId: string) => {
    setSpeechVisible(true);
    setCatalogId(catalogId);
  };

  useEffect(() => {
    getSmartCatalogTree();
  }, []);
  // useEffect(() => {
  //   if (syncSpeechParam.visible) {
  //     getSmartCatalogTree();
  //   }
  // }, [syncSpeechParam.visible]);
  return (
    <Modal
      centered
      title={syncSpeechParam.title || '同步目录'}
      visible={syncSpeechParam.visible}
      className={style.modalWrap}
      onClose={onCloseHandle}
      onOk={() => 1}
    >
      {/* 同步目录 */}
      {syncSpeechParam.islastLevel || (
        <div className={style.wrap}>
          <div className={style.treeWrap}>
            <div className={style.title}>主机构目录</div>
            <div className={classNames(style.treeContent, 'scroll-strip')}>
              <Tree
                // @ts-ignore
                treeData={treeData}
                blockNode
                onCheck={onCheckHandle}
                checkable
                fieldNames={{ title: 'name', key: 'fullCatalogId' }}
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
            </div>
          </div>
          <div className={style.seleectWrap}>
            <div className={style.seleectTitle}></div>
            <div className={classNames(style.selectList, 'scroll-strip')}>
              {checkedNodes
                .filter((filterItem) => filterItem.lastLevel)
                .map((nodeItem) => (
                  <div
                    key={nodeItem.catalogId}
                    onClick={() => viewSpeechHandle(nodeItem.catalogId)}
                    className={style.selectItem}
                  >
                    <div className={style.treeName}>
                      <span className={style.name}>{nodeItem.name}</span>
                      <span className={style.contentNum}>
                        （{`上架${nodeItem.onlineContentNum}/全部${nodeItem.contentNum}`}）
                      </span>
                    </div>
                    <div className={style.operation}>
                      {!nodeItem.lastLevel || <span className={style.viewSpeech}>查看话术</span>}
                      <Icon
                        className={style.delIcon}
                        name="icon_common_16_inputclean"
                        // onClick={() => clickDelStaffHandle(item)}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
      {/* 同步话术 */}
      {syncSpeechParam.islastLevel && (
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
