import { Button, Image } from 'antd';
import React, { useEffect, useState } from 'react';
import { Icon, NgFormSearch, NgModal, NgTable, Preview } from 'src/components';
import { GreetingColType, searchCols, tableColsFun } from './Config';
import { RouteComponentProps } from 'react-router-dom';
import { delGroupGreeting, getGroupGreetingDetail, queryGroupGreetingList } from 'src/apis/group';
import { MyPaginationProps } from 'src/components/TableComponent/TableComponent';
import { OperateType } from 'src/utils/interface';
import guidePic from 'src/assets/images/greeptingSetGuide.jpg';
const GroupSetGreeting: React.FC<RouteComponentProps> = ({ history }) => {
  const [pagination, setPagination] = useState<MyPaginationProps>({
    total: 0,
    pageNum: 1,
    pageSize: 10
  });
  const [current, setCurrent] = useState<GreetingColType>({});
  const [formValue, setFormValues] = useState({
    title: ''
  });
  const [visible, setVisible] = useState(false);
  const [visiblePreview, setVisiblePreview] = useState(false);
  const [dataSource, setDateSource] = useState<GreetingColType[]>([]);
  // 查询欢迎语列表
  const getList = async (params?: any) => {
    const res = await queryGroupGreetingList({
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      ...formValue,
      ...params
    });
    if (res) {
      const { total, list } = res;
      setPagination((pagination) => ({
        ...pagination,
        total,
        pageNum: params?.pageNum || 1,
        pageSize: params?.pageSize || pagination.pageSize
      }));
      setDateSource(list || []);
    }
  };
  const onSearch = (values: any) => {
    setFormValues(values);
    getList({ ...values, pageNum: 1 });
  };

  useEffect(() => {
    getList();
  }, []);

  const onOperate = async (type: OperateType, record: GreetingColType, index?: number) => {
    console.log(index);
    if (type === 'delete') {
      // 执行删除操作
      const copyData = [...dataSource];
      copyData.splice(index!, 1);
      const res = await delGroupGreeting({ wcId: record.wcId });
      if (res) {
        if (copyData.length === 0) {
          getList({ pageNum: 1 });
        } else {
          setDateSource(copyData);
          setPagination((pagination) => ({ ...pagination, total: pagination.total! - 1 }));
        }
      }
    } else if (type === 'edit') {
      history.push('/groupgreeting/edit?wcId=' + record.wcId);
    } else {
      // 预览
      const res = await getGroupGreetingDetail({ wcId: record.wcId });
      if (res) {
        setVisiblePreview(true);
        const values = { ...res, ...res?.mediaData, isSetMedia: res?.wcType > 1 ? 1 : 0 };
        setCurrent(values);
      }
    }
  };
  return (
    <div className="container">
      <div>
        <Button
          type="primary"
          shape="round"
          onClick={() => {
            history.push('/groupgreeting/edit');
          }}
        >
          新增欢迎语
        </Button>

        <Button type="link" className="ml20" onClick={() => setVisible(true)}>
          <Icon name="icon_common_16_question" className="f18 mr5  text-primary"></Icon>
          前端配置说明
        </Button>
      </div>

      <NgFormSearch className="mt20" searchCols={searchCols} onSearch={onSearch}></NgFormSearch>
      <NgTable
        rowKey="wcId"
        pagination={pagination}
        dataSource={dataSource}
        loadData={getList}
        className="mt10"
        columns={tableColsFun(onOperate)}
      ></NgTable>

      <NgModal visible={visible} title="前端配置说明" onCancel={() => setVisible(false)} onOk={() => setVisible(false)}>
        <Image src={guidePic} preview={false}></Image>
      </NgModal>
      <NgModal
        visible={visiblePreview}
        title="欢迎语预览"
        onCancel={() => setVisiblePreview(false)}
        onOk={() => setVisiblePreview(false)}
      >
        <Preview
          title="群欢迎语预览"
          value={{
            speechcraft: current.content,
            pushTime: '',
            actionRule: {
              contentType: current.wcType === 1 ? 0 : current.wcType,
              itemIds:
                current.wcType === 1
                  ? []
                  : [
                      {
                        itemId: '',
                        itemName: current.linkTitle,
                        speechcraft: '',
                        itemShareImgUrl: current.linkPicurl,
                        itemUrl: current.mediaOrgUrl
                      }
                    ]
            }
          }}
        />
      </NgModal>
    </div>
  );
};

export default GroupSetGreeting;
