import { PlusOutlined } from '@ant-design/icons';
import { Button, message, PaginationProps } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { getVideoList, getVideoTypeList, operateVideoItem, setVideoScope, topVideoItem } from 'src/apis/marketing';
import { AuthBtn, NgFormSearch, NgTable } from 'src/components';
import { OperateType } from 'src/utils/interface';
import { SetUserRight } from '../../Components/ModalSetUserRight/SetUserRight';
import { searchColsFun, tableColumnsFun, VideoColumn } from './Config';

const VideoList: React.FC<RouteComponentProps> = ({ history }) => {
  const [visible, setVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState<VideoColumn>();
  const [typeList, setTypeList] = useState<any[]>([]);
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0,
    showTotal: (total) => {
      return `共 ${total} 条记录`;
    }
  });
  const [dataSource, setDataSource] = useState<VideoColumn[]>([]);

  const getCategoryList = async () => {
    const res = await getVideoTypeList({});
    if (res) {
      const { typeList } = res;
      setTypeList(typeList.map((item: any) => ({ id: item.typeId, name: item.typeName })));
    }
  };
  const getList = async (params?: any) => {
    const pageNum = params?.pageNum || pagination.current;
    const pageSize = params?.pageSize || pagination.pageSize;
    const res = await getVideoList({
      ...params,
      pageNum,
      pageSize
    });
    if (res) {
      const { total, list } = res;
      setDataSource(list);
      setPagination((pagination) => ({ ...pagination, total, current: pageNum, pageSize }));
    }
  };
  const onSearch = (values: any) => {
    getList(values);
  };
  useEffect(() => {
    getList();
  }, []);

  const addVideo = () => {
    history.push('/marketingVideo/edit');
  };

  const onPaginationChange = (pageNum: number, pageSize?: number) => {
    getList({ pageNum, pageSize });
  };

  const onOperate = async (type: OperateType, record: VideoColumn, index?: number) => {
    // 上架/下架/删除
    if (type === 'putAway' || type === 'outline' || type === 'delete') {
      const res = await operateVideoItem({
        videoId: record.videoId,
        type: type === 'putAway' ? 1 : type === 'outline' ? 2 : 3
      });
      if (res) {
        // TODO 更新当前列表的数据
        message.success(type === 'putAway' ? '上架成功！' : type === 'outline' ? '下架成功！' : '删除成功');
        const copyData = [...dataSource];
        if (type === 'putAway' || type === 'outline') {
          copyData[index as number].status = type === 'putAway' ? 2 : 3;
        } else {
          copyData.splice(index as number, 1);
          const total = pagination.total! - 1;
          if (copyData.length > 0) {
            setPagination((pagination) => ({ ...pagination, total }));
          } else {
            getList({ pageNum: pagination.current! - 1 || 1 });
          }
        }
        if (type === 'putAway') {
          copyData[index as number].onlineTime = moment().format('YYYY-MM-DD HH:mm');
        }

        setDataSource(() => [...copyData]);
      }
    } else if (type === 'top' || type === 'unTop') {
      // 置顶、取消置顶
      const res = await topVideoItem({
        videoId: record.videoId,
        type: type === 'top' ? 1 : 2
      });
      if (res) {
        message.success(type === 'top' ? '置顶成功！' : '取消置顶成功！');
        getList({ pageNum: 1 });
      }
    } else if (type === 'edit') {
      history.push('/marketingVideo/edit?videoId=' + record.videoId);
    } else {
      setCurrentItem(record);
      setVisible(true);
    }
  };

  // 确认设置权限
  const confirmSetRight = async (values: any) => {
    setVisible(false);
    const { isSet, groupId } = values;
    // [adminId];
    // groupId: 93201136316088326

    const res = await setVideoScope({
      videoId: currentItem?.videoId,
      groupId: isSet ? groupId : null
    });
    if (res) {
      message.success('设置成功');
      getList({ pageNum: 1 });
    }
  };

  useEffect(() => {
    getCategoryList();
  }, []);

  return (
    <div className="container">
      <AuthBtn path="add">
        <Button className="mt10 mb20" type="primary" icon={<PlusOutlined />} shape="round" onClick={addVideo}>
          上传视频
        </Button>
      </AuthBtn>
      <AuthBtn path="/query">
        <NgFormSearch firstRowChildCount={3} searchCols={searchColsFun(typeList)} onSearch={onSearch} />
      </AuthBtn>
      <NgTable
        columns={tableColumnsFun(onOperate)}
        rowKey={'videoId'}
        dataSource={dataSource}
        pagination={pagination}
        paginationChange={onPaginationChange}
      />

      <SetUserRight
        isBatch={false}
        groupId={currentItem?.groupId}
        visible={visible}
        onOk={confirmSetRight}
        onCancel={() => setVisible(false)}
      />
    </div>
  );
};

export default VideoList;
