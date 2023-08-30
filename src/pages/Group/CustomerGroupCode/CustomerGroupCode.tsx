import React, { useEffect, useState } from 'react';
import { AuthBtn, NgFormSearch, NgModal, NgTable } from 'src/components';
import { ChatGroupLiveCodeType, searchCols, tableColsFun } from './Config';
import { MyPaginationProps } from 'src/components/TableComponent/TableComponent';
import { delChatGroupCode, getChatGroupLiveCodeList, getLiveCodeOfStaffList, shareCodeShortUrl } from 'src/apis/group';
import { Button, Table, message } from 'antd';
import { RouteComponentProps } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import { OperateType } from 'src/utils/interface';
import copy from 'copy-to-clipboard';
import QRCode from 'qrcode';
import { downloadImage, throttle } from 'src/utils/base';

interface IStaff {
  staffId: string;
  staffName: string;
}
const CustomerGroupCode: React.FC<RouteComponentProps> = ({ history }) => {
  // 群活码列表数据
  const [dataSource, setDataSource] = useState<ChatGroupLiveCodeType[]>([]);
  // 表单查询条件
  const [queryValues, setQueryValues] = useState<any>();
  // 当前选中的群活码
  const [current, setCurrent] = useState<ChatGroupLiveCodeType>();
  // 群活码相关的坐席列表
  const [staffList, setStaffList] = useState<IStaff[]>([]);

  const [pagination, setPagination] = useState<MyPaginationProps>({
    total: 0,
    pageNum: 1,
    pageSize: 10
  });
  const [staffPagination, setStaffPagination] = useState<MyPaginationProps>({
    total: 0,
    pageNum: 1,
    pageSize: 10
  });

  const [visible, setVisible] = useState(false);

  // 查询群活码列表
  const getList = async (params?: any) => {
    const pageNum = params?.pageNum || pagination.pageNum;
    const pageSize = params?.pageSize || pagination.pageSize;
    const res = await getChatGroupLiveCodeList({
      pageNum,
      pageSize,
      ...queryValues,
      ...params
    });
    if (res) {
      const { list, total } = res;
      setDataSource(list);
      setPagination((pagination) => ({ ...pagination, total, pageNum, pageSize }));
    }
  };

  // 列表表单查询
  const onSearch = (values: any) => {
    setQueryValues(values);
    getList({ ...values, pageNum: 1 });
  };

  useEffect(() => {
    getList();
  }, []);

  // 获取群活码使用员工列表
  const getStaffListByLiveCode = async (params: any) => {
    const pageNum = params?.pageNum || staffPagination.pageNum;
    const res = await getLiveCodeOfStaffList({
      liveId: current?.liveId,
      ...params,
      pageSize: pagination.pageSize,
      pageNum
    });
    if (res) {
      const { list, total } = res;
      setStaffList(list || []);
      setStaffPagination((staffPagination) => ({ ...staffPagination, total, pageNum }));
    }
  };

  // 复制短链按钮点击
  const handleClickCopyBtn = async (record: ChatGroupLiveCodeType) => {
    setVisible(true);
    setCurrent(record);
    getStaffListByLiveCode({ liveId: record.liveId, pageNum: 1 });
  };
  const onOperate = async (type: OperateType, record: ChatGroupLiveCodeType, index?: number) => {
    if (type === 'edit') {
      history.push('/clientgroupcode/add?liveId=' + record.liveId);
    } else if (type === 'view') {
      history.push('/clientgroupcode/add?liveId=' + record.liveId + '&isView=1');
    } else if (type === 'other') {
      handleClickCopyBtn(record);
    } else if (type === 'delete') {
      const res = await delChatGroupCode({ liveId: record.liveId });
      if (res) {
        // 在列表中删除当前选项
        const copyDataSource = [...dataSource];
        copyDataSource.splice(index!, 1);
        setDataSource(copyDataSource);
        message.success('删除成功');
      }
    }
  };
  // 创建短链
  const createShortUrl = throttle(async (staffId: string) => {
    const res = await shareCodeShortUrl({
      staffId,
      liveId: current?.liveId
    });
    if (res && res.shortUrl) {
      message.success('复制短链成功');
      copy(res.shortUrl);
    }
  }, 1000);

  const onPaginationChangeStaff = (pageNum: number) => {
    getStaffListByLiveCode({ pageNum });
  };

  const downloadQRCode = throttle(async (record: IStaff) => {
    const res = await shareCodeShortUrl({
      staffId: record.staffId,
      liveId: current?.liveId
    });

    if (res && res.shortUrl) {
      QRCode.toDataURL(
        res.shortUrl,
        {
          type: 'image/jpeg',
          margin: 1,
          color: {
            dark: '#000',
            light: '#fff'
          }
        },
        (err, url) => {
          if (err) throw err;
          message.success('下载成功！');
          downloadImage(url, record.staffName + '.jpg');
        }
      );
    }
  }, 500);
  return (
    <div className="container">
      <AuthBtn path="/add">
        <Button
          type="primary"
          shape="round"
          icon={<PlusOutlined />}
          onClick={() => {
            history.push('/clientgroupcode/add');
          }}
        >
          新增群活码
        </Button>
      </AuthBtn>
      <AuthBtn path="/query">
        <NgFormSearch className="mt20" searchCols={searchCols} onSearch={onSearch}></NgFormSearch>
      </AuthBtn>

      <NgTable
        rowKey="liveId"
        pagination={pagination}
        dataSource={dataSource}
        loadData={getList}
        className="mt10"
        columns={tableColsFun(onOperate)}
      ></NgTable>

      <NgModal visible={visible} title="复制短链" footer={null} onCancel={() => setVisible(false)}>
        <h3>当前群内的员工列表：</h3>
        <Table
          className="mt20"
          size="small"
          rowKey={'staffId'}
          columns={[
            {
              title: '员工姓名',
              dataIndex: 'staffName'
            },
            {
              title: '操作',
              render: (text, record: any) => (
                <>
                  <Button type="link" onClick={() => downloadQRCode(record)}>
                    下载二维码
                  </Button>
                  <Button
                    type="link"
                    onClick={() => {
                      console.log(record);
                      createShortUrl(record.staffId);
                    }}
                  >
                    复制
                  </Button>
                </>
              )
            }
          ]}
          dataSource={staffList}
          pagination={{
            pageSize: 10,
            current: staffPagination.pageNum,
            total: staffPagination.total,
            onChange: onPaginationChangeStaff
          }}
        ></Table>
      </NgModal>
    </div>
  );
};

export default CustomerGroupCode;
