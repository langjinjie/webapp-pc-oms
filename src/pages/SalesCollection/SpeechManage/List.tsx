import React, { useState, useEffect, useContext, useMemo, useRef, MutableRefObject } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Modal, Space } from 'antd';
import { useDidRecover } from 'react-router-cache-route';
import { RouteComponentProps } from 'react-router';
import {
  getSpeechList,
  operateSpeechStatus,
  getCategoryList,
  exportSpeech,
  batchExportSpeech,
  sortSpeech,
  getSensitiveStatus,
  checkSensitive,
  addBatchSpeech,
  setUserRightWithSpeech
} from 'src/apis/salesCollection';
import { AuthBtn, Icon, NgFormSearch, NgTable } from 'src/components';
import { PaginationProps } from 'src/components/TableComponent/TableComponent';
import ExportModal from '../../../components/ExportModal/ExportModal';
import PreviewSpeech from './Components/PreviewSpeech/PreviewSpeech';
import { columns, excelDemoUrl, setSearchCols, SpeechProps } from './Config';

import style from './style.module.less';
import { Context } from 'src/store';
import ConfirmModal from './Components/ConfirmModal/ConfirmModal';
import { urlSearchParams, useDocumentTitle } from 'src/utils/base';
import { SetUserRight } from 'src/pages/Marketing/Components/ModalSetUserRight/SetUserRight';
import { getQueryParam } from 'tenacity-tools';

const SpeechManage: React.FC<RouteComponentProps> = ({ history, location }) => {
  useDocumentTitle('销售宝典-话术管理');
  const { currentCorpId } = useContext(Context);
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
    contenSource: ''
  });
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0,
    showTotal: (total) => {
      return `共 ${total} 条记录`;
    }
  });
  const [currentType, setCurrentType] = useState<number | null>(null);
  const [visibleExport, setVisibleExport] = useState(false);
  const [selectedRowKeys, setSelectRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<SpeechProps[]>([]);
  const [visiblePreview, setVisiblePreview] = useState(false);
  const [dataSource, setDataSource] = useState<SpeechProps[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [formDefaultValue, setFormDefaultValue] = useState<{ catalogIds: string[] }>({
    catalogIds: []
  });
  const [lastCategory, setLastCategory] = useState<any>();
  const [visibleChecked, setVisibleChecked] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [checkedInfo, setCheckedInfo] = useState({
    change: 0,
    checking: 0,
    checkTime: ''
  });
  const [loading, setLoading] = useState(false);
  const [currentItem, setCurrentItem] = useState<SpeechProps>();
  const [visibleSetUserRight, setVisibleSetUserRight] = useState(false);
  const [isBatchSetRight, setIsBatchSetRight] = useState(false);
  const [currentGroupIds, setCurrentGroupIds] = useState<any[]>([]);
  const [delBtnDisabled, setDelBtnDisabled] = useState(false);

  const operationAddDiv: MutableRefObject<any> = useRef();
  const searchForm: MutableRefObject<any> = useRef();
  const operationDiv: MutableRefObject<any> = useRef();

  // 查询话术列表
  const getList = async (params?: any) => {
    setLoading(true);
    // 清空选中的列表
    setSelectRowKeys([]);
    // 重置当前操作状态
    setCurrentType(null);
    const { pageSize, current: pageNum } = pagination;
    const { list, total } = await getSpeechList({
      ...formParams,
      pageNum,
      pageSize,
      sceneId: lastCategory?.sceneId || '',
      ...params
    });
    setDataSource(list || []);
    setIsNew(true);
    setPagination((pagination) => ({ ...pagination, total: total || 0 }));
    setLoading(false);
  };

  const onValuesChange = (changeValues: any, values: any) => {
    setIsNew(false);
    const {
      catalogIds,

      ...otherValues
    } = values;

    let catalogId = '';
    if (catalogIds) {
      catalogId = catalogIds[catalogIds.length - 1];
    }
    setFormDefaultValue({ catalogIds });

    setFormParams((formParams) => ({
      ...formParams,
      catalogId,
      ...otherValues
    }));
  };
  // 点击查询按钮
  const onSearch = async (values: any) => {
    // 将页面重置为第一页
    console.log(values);

    setPagination((pagination) => ({ ...pagination, current: 1 }));
    const { catalogIds, ...otherValues } = values;

    let catalogId = '';
    let sceneId = '';
    if (catalogIds && catalogIds.length > 0) {
      catalogId = catalogIds[catalogIds.length - 1];
      sceneId = lastCategory.sceneId;
    } else {
      setLastCategory(null);
    }
    setFormParams((formParams) => ({
      ...formParams,
      catalogId,
      ...otherValues
    }));
    await getList({
      pageNum: 1,
      catalogId,
      sceneId,
      ...otherValues
    });
  };

  // 重置
  const onResetHandle = () => {
    setFormDefaultValue({ catalogIds: [] });
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
      contenSource: ''
    });
    getList({
      pageNum: 1,
      catalogId: '',
      content: '',
      contentType: '',
      sensitive: '',
      status: '',
      tip: '',
      updateBeginTime: '',
      updateEndTime: '',
      sceneId: '',
      contentId: '',
      contenSource: ''
    });
  };

  const getCategory = async (params?: any) => {
    const res = await getCategoryList({ ...params });
    if (res) {
      res.forEach((item: any) => {
        if (item.lastLevel === 0) {
          item.isLeaf = false;
        }
      });
      return res;
      // setCategories(res);
    }
  };

  const getSensitiveCheckedInfo = async () => {
    const res = await getSensitiveStatus({});
    if (res) {
      setCheckedInfo(res);
      if (res.change === 1) {
        setVisibleChecked(true);
      }
    }
  };
  const initSetFormQuery = async () => {
    const { catalog } = urlSearchParams(location.search) as { [key: string]: string };
    if (catalog) {
      const catalogs = catalog.split(',');
      setFormDefaultValue(() => ({ catalogIds: catalogs }));
      const tree = JSON.parse(localStorage.getItem('catalogTree') || '[]') as any[];
      const res = await getCategory();
      const copyData = [...res];
      res?.forEach((item: any, index: number) => {
        if (item.catalogId === tree[0].catalogId) {
          copyData[index] = tree[0];
        }
      });
      setCategories(copyData);
      const catalogId = catalogs[catalogs.length - 1];
      getList({
        sceneId: tree[0].sceneId,
        content: '',
        contentType: '',
        sensitive: '',
        status: '',
        tip: '',
        updateBeginTime: '',
        updateEndTime: '',
        contentId: '',
        catalogId
      });
      setLastCategory({
        sceneId: tree[0].sceneId,
        catalogId,
        lastLevel: 1
      });
      setFormParams({
        content: '',
        contentType: '',
        sensitive: '',
        status: '',
        tip: '',
        updateBeginTime: '',
        updateEndTime: '',
        contentId: '',
        contenSource: '',
        catalogId
      });
    } else {
      const res = await getCategory();
      setCategories(res);
      getList({
        catalogId: '',
        content: '',
        contentType: '',
        sensitive: '',
        status: '',
        tip: '',
        updateBeginTime: '',
        updateEndTime: '',
        contentId: ''
      });
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
        contenSource: ''
      });
    }
  };

  // 计算table高度
  const tableHeight: any = useMemo(() => {
    return (
      window.innerHeight -
      80 -
      48 -
      ((operationAddDiv.current?.offsetHeight || 0) +
        (searchForm.current?.offsetHeight || 0) +
        (operationDiv.current?.offsetHeight || 0) +
        88 +
        55)
    );
  }, [operationAddDiv.current, searchForm, operationDiv.current]);

  useEffect(() => {
    initSetFormQuery();
    getSensitiveCheckedInfo();
  }, []);
  useDidRecover(() => {
    // 回写form
    setFormDefaultValue(({ catalogIds }) => ({ catalogIds, ...formParams }));
    if (getQueryParam().refresh === 'true') {
      getList({ ...formParams });
    }
    // 从目录查看话术
    if (location.search.includes('catalog=')) {
      initSetFormQuery();
    }
    getSensitiveCheckedInfo();
  }, []);
  // 分页改变
  const paginationChange = (pageNum: number, pageSize?: number) => {
    setPagination((pagination) => ({ ...pagination, current: pageNum, pageSize: pageSize || pagination.pageSize }));
    getList({ pageNum, pageSize });
  };

  const isDisabled = (currentType: number | null, status: number) => {
    let _isDisabled = false;
    // return;
    if (currentType !== null && currentType !== status) {
      _isDisabled = true;
    }
    return _isDisabled;
  };

  const onSelectChange = (selectedRowKeys: React.Key[], selectedRows: SpeechProps[]) => {
    setSelectRowKeys(selectedRowKeys);
    setSelectedRows(selectedRows);
    const current = selectedRows[0];
    setDelBtnDisabled(current?.contenSource === 1);
    if (current) {
      setCurrentType(current.status);
    } else {
      setCurrentType(null);
    }
  };

  const rowSelection = {
    hideSelectAll: false,
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: SpeechProps[]) => {
      onSelectChange(selectedRowKeys, selectedRows);
    },
    getCheckboxProps: (record: SpeechProps) => {
      return {
        disabled: isDisabled(currentType, record.status),
        name: record.content
      };
    }
  };

  // 动态计算是否显示全选框
  const hideSelectAll = useMemo(() => {
    if (formParams.status !== '' && isNew) {
      return false;
    }
    return true;
  }, [formParams.status, isNew]);

  // 编辑话术
  const handleEdit: (scored: SpeechProps) => void = (scored) => {
    history.push(`/speechManage/edit?sceneId=${scored.sceneId}&contentId=${scored.contentId}`);
  };
  const handleSort: (record: SpeechProps, sortType: number) => void = async (record, sortType) => {
    const { sceneId, catalogId, contentId } = record;
    const res = await sortSpeech({ sort: sortType, sceneId, catalogId, contentId });
    if (res) {
      message.success('移动成功');
      getList();
    }
  };

  const handleAdd = () => {
    history.push('/speechManage/edit');
  };

  const handleChecked = async () => {
    setCheckedInfo((checkedInfo) => ({ ...checkedInfo!, checking: 1 }));
    const res = await checkSensitive({});
    if (res) {
      message.success('正在校验中......');
    }
  };
  const handleExport = async () => {
    if (dataSource.length > 0) {
      let res: any;
      // 单条导出
      if (selectedRowKeys.length > 0) {
        const list = selectedRows.map((row: SpeechProps) => ({ sceneId: row.sceneId, contentId: row.contentId }));
        res = await exportSpeech({ list });
      } else {
        // 批量导出
        const { status, sensitive, updateBeginTime, updateEndTime, content, tip, contentType, contentId } = formParams;
        const params = {
          sceneId: lastCategory?.sceneId || '',
          catalogId: lastCategory?.catalogId || '',
          content,
          tip,
          contentType,
          status,
          sensitive,
          updateBeginTime,
          updateEndTime,
          contentId
        };
        res = await batchExportSpeech(params);
      }
      if (res) {
        const blob = new Blob([res.data]);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        link.setAttribute('download', '话术列表' + '.xlsx');
        document.body.appendChild(link);
        link.click(); // 点击下载
        link.remove(); // 下载完成移除元素
        window.URL.revokeObjectURL(link.href); // 用完之后使用URL.revokeObjectURL()释放；
      }
    }
  };
  const operateStatus = (operateType: number) => {
    Modal.confirm({
      title:
        operateType === 0 ? '待上架提醒' : operateType === 1 ? '上架提醒' : operateType === 2 ? '下架提醒' : '删除提醒',
      content:
        operateType === 0
          ? '确认将选中的话术改为待上架？'
          : operateType === 1
            ? '确定上架选中的话术吗？'
            : operateType === 2
              ? '确定下架选中的话术？'
              : '确定删除选中的话术？',
      cancelText: '取消',
      okText: '确定',
      onOk: async () => {
        const res = await operateSpeechStatus({
          corpId: currentCorpId,
          type: operateType,
          list: selectedRows.map((row) => ({ sceneId: row.sceneId, contentId: row.contentId }))
        });
        if (res) {
          // 清空选中的列表
          setSelectRowKeys([]);
          // 重置当前操作状态
          setCurrentType(null);

          const { successNum, failNum } = res;
          message.success(
            failNum > 0
              ? `已完成！操作成功${successNum}条，操作失败${failNum}条，敏感词检测异常和未知会导致上架失败！`
              : '已完成！操作成功'
          );
          // 重新更新列表
          setPagination((pagination) => ({ ...pagination, current: 1 }));
          getList({ pageNum: 1 });
        }
      }
    });
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
  const onCascaderChange = (value: any, selectedOptions: any) => {
    const lastSelectedOptions = selectedOptions?.[selectedOptions.length - 1] || {};
    setLastCategory(lastSelectedOptions);
    setPagination((pagination) => ({ ...pagination, current: 1 }));
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
      setFormParams((formParams) => ({ ...formParams, ...params }));
    }
  };

  const doCheck = () => {
    setVisibleChecked(false);
    handleChecked();
  };

  const handleDownload = () => {
    window.location.href = excelDemoUrl;
  };

  // 导入表格
  const updata = async (file: any) => {
    setVisibleExport(false);
    const formData = new FormData();
    formData.append('file', file);
    const res = await addBatchSpeech(formData);
    if (res) {
      message.success(res);
    }
  };
  // 显示配置可见范围模块
  const setRight = (record?: SpeechProps) => {
    if (record) {
      setIsBatchSetRight(false);
      setCurrentItem(record);
    } else {
      const mySet = new Set();
      selectedRows?.forEach((item) => {
        mySet.add(item.groupId);
      });
      console.log(Array.from(mySet));
      setCurrentGroupIds(Array.from(mySet));
      setIsBatchSetRight(true);
    }
    setVisibleSetUserRight(true);
  };

  const confirmSetRight = async (values: any) => {
    setVisibleSetUserRight(false);
    const { isSet, groupId, isBatch } = values;
    // [adminId];
    // groupId: 93201136316088326
    const list: any[] = [];
    if (isBatch) {
      selectedRows?.forEach((item) => {
        list.push({ sceneId: item.sceneId, contentId: item.contentId, groupId: isSet ? groupId : null });
      });
    } else {
      list.push({ sceneId: currentItem?.sceneId, contentId: currentItem?.contentId, groupId: isSet ? groupId : null });
    }
    const res = await setUserRightWithSpeech({ list });
    if (res) {
      message.success('设置成功');
      getList({ pageNum: 1 });
      setPagination((pagination) => ({ ...pagination, current: 1 }));
    }
  };
  return (
    <div className="container">
      <div ref={operationAddDiv} className="flex justify-between">
        <Space size={20}>
          <AuthBtn path="/add">
            <Button
              className={style.btnAdd}
              type="primary"
              onClick={handleAdd}
              shape="round"
              icon={<PlusOutlined />}
              size="large"
              style={{ width: 128 }}
            >
              新增
            </Button>
          </AuthBtn>
          <AuthBtn path="/addBatch">
            <Button
              className={style.btnAdd}
              type="primary"
              onClick={() => setVisibleExport(true)}
              shape="round"
              icon={<PlusOutlined />}
              size="large"
              style={{ width: 128 }}
            >
              批量新增
            </Button>
          </AuthBtn>
          <AuthBtn path="/check">
            <Button
              className={style.btnAdd}
              type="primary"
              onClick={() => handleChecked()}
              shape="round"
              size="large"
              style={{ width: 128 }}
              loading={!!checkedInfo.checking}
            >
              {!checkedInfo.checking ? '敏感词校验' : '正在校验'}
            </Button>
            {checkedInfo.checkTime && (
              <span className="color-text-placeholder ml10">{checkedInfo.checkTime}检测过</span>
            )}
          </AuthBtn>
        </Space>
        <AuthBtn path="/view">
          <Button
            className={style.btnAdd}
            type="primary"
            onClick={() => setVisiblePreview(true)}
            shape="round"
            size="large"
          >
            <Icon className="font16" name="yulan" />
            <span className="ml10">预览</span>
          </Button>
        </AuthBtn>
      </div>
      <AuthBtn path={'/query'}>
        <div ref={searchForm} className="form-inline pt20">
          <NgFormSearch
            defaultValues={formDefaultValue}
            searchCols={setSearchCols(categories)}
            loadData={loadData}
            onSearch={onSearch}
            onChangeOfCascader={onCascaderChange}
            onValuesChange={onValuesChange}
            onReset={onResetHandle}
          />
        </div>
      </AuthBtn>
      {dataSource.length > 0 && (
        <div ref={operationDiv} className={'operationTopWrap'}>
          <Space size={20}>
            <AuthBtn path="/export">
              <Button type="primary" shape={'round'} ghost onClick={() => handleExport()}>
                导出
              </Button>
            </AuthBtn>
            <AuthBtn path="/operate">
              <Button
                type="primary"
                shape={'round'}
                ghost
                disabled={currentType === 1 || selectedRowKeys.length === 0}
                onClick={() => operateStatus(1)}
              >
                上架
              </Button>
              <Button
                type="primary"
                shape={'round'}
                className="ml20"
                ghost
                disabled={currentType === 0 || selectedRowKeys.length === 0}
                onClick={() => operateStatus(0)}
              >
                待上架
              </Button>
              <Button
                type="primary"
                shape={'round'}
                className="ml20"
                ghost
                disabled={currentType === 2 || selectedRowKeys.length === 0}
                onClick={() => operateStatus(2)}
              >
                下架
              </Button>
            </AuthBtn>
            <AuthBtn path="/delete">
              <Button
                type="primary"
                shape={'round'}
                ghost
                disabled={currentType === 1 || delBtnDisabled || selectedRowKeys.length === 0}
                onClick={() => operateStatus(3)}
              >
                删除
              </Button>
            </AuthBtn>
            <AuthBtn path="/setBatch">
              <Button
                type="primary"
                shape={'round'}
                ghost
                disabled={!(selectedRows && selectedRows.length > 0)}
                onClick={() => setRight()}
              >
                批量添加可见范围
              </Button>
            </AuthBtn>
          </Space>
        </div>
      )}
      <NgTable
        dataSource={dataSource}
        columns={columns({ handleEdit, handleSort, lastCategory, pagination, formParams, isNew, setRight, getList })}
        setRowKey={(record: SpeechProps) => {
          return record.contentId;
        }}
        loading={loading}
        rowSelection={{ ...rowSelection, hideSelectAll }}
        pagination={pagination}
        paginationChange={paginationChange}
        scroll={{ y: tableHeight }}
      />

      {/* 列表数据 end */}
      {/* 批量新增 */}
      <ExportModal
        visible={visibleExport}
        onOK={updata}
        onCancel={() => setVisibleExport(false)}
        onDownLoad={handleDownload}
      />

      {/* 话术预览 */}
      <PreviewSpeech
        visible={visiblePreview}
        onClose={() => {
          setVisiblePreview(false);
        }}
      ></PreviewSpeech>

      {/* modal */}
      <ConfirmModal visible={visibleChecked} title={'温馨提醒'} onOk={doCheck} />
      <SetUserRight
        isBatch={isBatchSetRight}
        groupId={isBatchSetRight ? currentGroupIds : currentItem?.groupId}
        visible={visibleSetUserRight}
        onOk={confirmSetRight}
        onCancel={() => setVisibleSetUserRight(false)}
      />
    </div>
  );
};
export default SpeechManage;
