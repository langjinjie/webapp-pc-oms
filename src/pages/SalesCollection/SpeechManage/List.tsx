import React, { useState, useEffect, useContext } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Modal, Space } from 'antd';
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
  addBatchSpeech
} from 'src/apis/salesCollection';
import { Icon, NgFormSearch, NgTable } from 'src/components';
import { PaginationProps } from 'src/components/TableComponent/TableComponent';
import ExportModal from './Components/ExportModal/ExportModal';
import PreviewSpeech from './Components/PreviewSpeech/PreviewSpeech';
import { columns, setSearchCols, SpeechProps } from './Config';

import style from './style.module.less';
import { Context } from 'src/store';
import ConfirmModal from './Components/ConfirmModal/ConfirmModal';

const SpeechManage: React.FC<RouteComponentProps> = ({ history }) => {
  const { currentCorpId } = useContext(Context);
  const [formParams, setFormParams] = useState({
    catalogId: '',
    content: '',
    contentType: '',
    sensitive: '',
    status: '',
    tip: '',
    updateBeginTime: '',
    updateEndTime: ''
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
  const [lastCategory, setLastCategory] = useState<any>();
  const [visibleChecked, setVisibleChecked] = useState(false);
  const [checkedInfo, setCheckedInfo] = useState({
    change: 0,
    checking: 0,
    checkTime: ''
  });
  const [loading] = useState(false);
  const onValuesChange = (values: any) => {
    const {
      catalogIds,
      content = '',
      contentType = '',
      sensitive = '',
      status = '',
      times = undefined,
      tip = ''
    } = values;
    let updateBeginTime = '';
    let updateEndTime = '';
    if (times) {
      updateBeginTime = times[0].startOf('day').valueOf();
      updateEndTime = times[1].endOf('day')?.valueOf();
    }
    let catalogId = '';
    if (catalogIds) {
      catalogId = catalogIds[catalogIds.length - 1];
    }
    setFormParams((formParams) => ({
      ...formParams,
      catalogId,
      content,
      contentType,
      sensitive,
      status,
      tip,
      updateBeginTime,
      updateEndTime
    }));
  };

  // 查询话术列表
  const getList = async (params?: any) => {
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
    setPagination((pagination) => ({ ...pagination, total: total || 0 }));
  };
  // 点击查询按钮
  const onSearch = async (values: any) => {
    // 将页面重置为第一页
    setPagination((pagination) => ({ ...pagination, current: 1 }));
    const {
      catalogIds,
      content = '',
      contentType = '',
      sensitive = '',
      status = '',
      times = undefined,
      tip = ''
    } = values;
    let updateBeginTime = '';
    let updateEndTime = '';
    if (times) {
      updateBeginTime = times[0].startOf('day').valueOf();
      updateEndTime = times[1].endOf('day')?.valueOf();
    }
    let catalogId = '';
    if (catalogIds) {
      catalogId = catalogIds[catalogIds.length - 1];
    }
    setFormParams((formParams) => ({
      ...formParams,
      catalogId,
      content,
      contentType,
      sensitive,
      status,
      tip,
      updateBeginTime,
      updateEndTime
    }));
    await getList({
      catalogId,
      content,
      contentType,
      sensitive,
      status,
      tip,
      updateBeginTime,
      updateEndTime
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
      setCategories(res);
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
  useEffect(() => {
    getList();
    getCategory();
    getSensitiveCheckedInfo();
  }, []);

  // 分页改变
  const paginationChange = (pageNum: number, pageSize?: number) => {
    setPagination((pagination) => ({ ...pagination, current: pageNum, pageSize: pageSize || pagination.pageSize }));
    getList({ pageNum, pageSize });
  };

  const isDisabled = (currentType: number | null, status: number) => {
    let _isDisabled = false;

    if (currentType !== null && currentType !== status) {
      _isDisabled = true;
    }
    return _isDisabled;
  };

  const onSelectChange = (selectedRowKeys: React.Key[], selectedRows: SpeechProps[]) => {
    setSelectRowKeys(selectedRowKeys);
    setSelectedRows(selectedRows);
    const current = selectedRows[0];
    if (current) {
      setCurrentType(current.status);
    } else {
      setCurrentType(null);
    }
  };

  const rowSelection = {
    hideSelectAll: true,
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
        const { status, sensitive, updateBeginTime, updateEndTime, content, tip, contentType } = formParams;
        const params = {
          sceneId: lastCategory.sceneId || '',
          catalogId: lastCategory.catalogId || '',
          content,
          tip,
          contentType,
          status,
          sensitive,
          updateBeginTime,
          updateEndTime
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
          message.success(`已完成！操作成功${successNum}条，操作失败${failNum}条`);
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
    const lastSelectedOptions = selectedOptions[selectedOptions.length - 1] || {};
    setLastCategory(lastSelectedOptions);
    setPagination((pagination) => ({ ...pagination, current: 1 }));
    getList({ pageNum: 1, sceneId: lastSelectedOptions?.sceneId, catalogId: lastSelectedOptions?.catalogId });
  };

  const doCheck = () => {
    setVisibleChecked(false);
    handleChecked();
  };

  const handleDownload = () => {
    window.location.href =
      'https://insure-prod-server-1305111576.cos.ap-guangzhou.myqcloud.com/file/smart/smart_content_export_template.xlsx';
  };

  // 导入表格
  const updata = async (file: any) => {
    setVisibleExport(false);
    const formData = new FormData();
    formData.append('file', file);
    const res = await addBatchSpeech(formData);
    console.log(res);
    if (res) {
      message.success(res);
    }
  };
  return (
    <div className="container">
      <div className="flex justify-between">
        <Space size={20}>
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
          {checkedInfo.checkTime && <span className="color-text-placeholder">{checkedInfo.checkTime}检测过</span>}
        </Space>
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
      </div>
      <div className="form-inline pt20">
        <NgFormSearch
          searchCols={setSearchCols(categories)}
          loadData={loadData}
          onSearch={onSearch}
          onChangeOfCascader={onCascaderChange}
          onValuesChange={onValuesChange}
          disabled={lastCategory?.lastLevel === 1}
        />
      </div>

      <NgTable
        dataSource={dataSource}
        columns={columns({ handleEdit, handleSort, lastCategory, pagination })}
        setRowKey={(record: SpeechProps) => {
          return record.contentId;
        }}
        loading={loading}
        rowSelection={rowSelection}
        pagination={pagination}
        paginationChange={paginationChange}
      ></NgTable>
      {dataSource.length > 0 && (
        <div className={'operationWrap'}>
          <Space size={20}>
            <Button type="primary" shape={'round'} ghost onClick={() => handleExport()}>
              导出
            </Button>
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
              ghost
              disabled={currentType === 0 || selectedRowKeys.length === 0}
              onClick={() => operateStatus(0)}
            >
              待上架
            </Button>
            <Button
              type="primary"
              shape={'round'}
              ghost
              disabled={currentType === 2 || selectedRowKeys.length === 0}
              onClick={() => operateStatus(2)}
            >
              下架
            </Button>
            <Button
              type="primary"
              shape={'round'}
              ghost
              disabled={currentType === 1 || selectedRowKeys.length === 0}
              onClick={() => operateStatus(3)}
            >
              删除
            </Button>
          </Space>
        </div>
      )}
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
    </div>
  );
};
export default SpeechManage;
