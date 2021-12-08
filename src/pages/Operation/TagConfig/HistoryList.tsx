import React, { useState, useEffect, useContext } from 'react';

import { Breadcrumb, message, Tabs } from 'antd';
import style from './style.module.less';
import { NgTable } from 'src/components';
import { columns, UserTagProps } from './Config';
import {
  changeClientTag,
  changeClientTagOfCar,
  getBufferList,
  getChangedList,
  getTagGroupList,
  searchTagGroupOptions
} from 'src/apis/tagConfig';
import { Context } from 'src/store';

const HistoryList: React.FC = () => {
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [logDataSource, setLogDataSource] = useState<any[]>([]);
  const [tableCols, setTableCols] = useState<any[]>([]);
  const [tabActiveKey, setTabActiveKey] = useState('1');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showTotal: (total: number) => {
      return `共 ${total} 条记录`;
    }
  });
  const [carTags, setCarTags] = useState<any[]>([]);
  const [manTags, setManTags] = useState<any[]>([]);
  const { currentCorpId } = useContext(Context);

  const getOptions = async (list: any[]) => {
    const tagOptions = JSON.parse(sessionStorage.getItem('tagOptions') || '{}')[currentCorpId] || [];
    if (Object.keys(tagOptions).length > 0) {
      setTableCols(tagOptions);
    } else {
      const promiseArr = list.map((item) => searchTagGroupOptions({ groupId: item.groupId }));
      const resList = await Promise.all(promiseArr);
      if (resList) {
        resList.forEach((res, index) => {
          list[index].label = res.groupName.replace('销售概率', '');
          list[index].options = res.tagList;
        });

        sessionStorage.setItem('tagOptions', JSON.stringify({ [currentCorpId]: list }));
        setTableCols(list);
      }
    }
  };

  const getTagList = async () => {
    const tagOptions = JSON.parse(sessionStorage.getItem('tagOptions') || '{}')[currentCorpId] || [];
    if (Object.keys(tagOptions).length > 0) {
      setTableCols(tagOptions);
      const cols1 = tagOptions.filter((tag: any) => tag.category === 1);
      setCarTags(cols1);
      const cols2 = tagOptions.filter((tag: any) => tag.category === 0);
      setManTags(cols2);
    } else {
      const res = await getTagGroupList({});
      if (res) {
        const list = res.list || [];
        await getOptions(list);
        const cols1 = list.filter((tag: any) => tag.category === 1);
        setCarTags(cols1);
        const cols2 = list.filter((tag: any) => tag.category === 0);
        setManTags(cols2);
      }
    }
  };
  // 对请求的数据进行表格话处理
  const dataMap = (list: any[]) => {
    const res: any[] = [];
    list.forEach((item) => {
      const { nickName, staffId, staffName, avatar, externalUserid, pushId, pushTime } = item;
      if (item.carList && item.carList.length > 0) {
        item.carList.forEach((car: any, index: number) => {
          res.push({
            avatar,
            nickName,
            staffId,
            staffName,
            pushId,
            pushTime,
            externalUserid,
            ...car,
            ...item.tagList,
            isMoreCar: index > 0,
            tagLists: index === 0 ? [...item?.tagList, ...car?.carTagList] : [...car?.carTagList]
          });
        });
      } else {
        item.tagList = item.tagList || [];
        res.push({
          avatar,
          pushTime,
          pushId,
          nickName,
          ...item.tagList[0],
          staffId,
          staffName,
          externalUserid,
          tagLists: [...item?.tagList]
        });
      }
    });
    return res;
  };
  const getList = async (params?: any) => {
    const { current: pageNum, pageSize } = pagination;
    const res = await getBufferList({
      pageNum,
      pageSize,
      ...params
    });
    if (res) {
      const { total, list } = res;
      const data = dataMap(list);
      setDataSource(data);
      setPagination((pagination) => ({ ...pagination, total }));
    }
  };

  const getChangeList = async (params?: any) => {
    const { current: pageNum, pageSize } = pagination;
    const res = await getChangedList({
      pageNum,
      pageSize,
      ...params
    });
    if (res) {
      const { total, list } = res;
      const data = dataMap(list);
      setLogDataSource(data);
      setPagination((pagination) => ({ ...pagination, total }));
    }
  };

  useEffect(() => {
    getList();
    getTagList();
  }, []);

  const onChange = ({
    col,
    value,
    scored,
    index,
    data
  }: {
    col: any;
    value: string;
    scored: UserTagProps;
    index: number;
    data: any[];
  }) => {
    scored?.tagLists?.forEach((item: any) => {
      if (item.groupId === col.groupId) {
        item.preTagId = value;
      }
    });
    const copyData = [...data];
    copyData[index] = scored;
    setDataSource(copyData);
  };

  const onConfirm = async (scored: UserTagProps) => {
    const changeTags = scored.tagLists.filter((tag: any) => tag.preTagId !== undefined && tag.preTagId !== tag.tagId);
    if (changeTags.length === 0) {
      message.warning('请修改后在点击进行推送');
    } else {
      const changeCar: any[] = [];
      const changeMan: any[] = [];
      changeTags.forEach((tag: any) => {
        carTags.forEach((car: any) => {
          if (car.groupId === tag.groupId) {
            changeCar.push(tag);
          }
        });
        manTags.forEach((man: any) => {
          if (man.groupId === tag.groupId) {
            changeMan.push(tag);
          }
        });
      });
      if (changeMan.length > 0 || changeCar.length > 0) {
        let res: any = null;
        if (changeCar.length > 0 && changeMan.length > 0) {
          res = await Promise.all([
            changeClientTagOfCar({
              staffId: scored.staffId,
              externalUserid: scored.externalUserid,
              carNumber: scored.carNumber,
              pushId: scored.pushId,
              list: changeCar.map((item) => ({
                tagId: item.preTagId,
                oldTagId: item.tagId,
                groupId: item.groupId
              }))
            }),
            changeClientTag({
              staffId: scored.staffId,
              externalUserid: scored.externalUserid,
              carNumber: scored.carNumber,
              pushId: scored.pushId,

              list: changeMan.map((item) => ({
                tagId: item.preTagId,
                oldTagId: item.tagId,
                groupId: item.groupId
              }))
            })
          ]);
        } else if (changeCar.length > 0 && changeMan.length === 0) {
          res = await changeClientTagOfCar({
            staffId: scored.staffId,
            externalUserid: scored.externalUserid,
            carNumber: scored.carNumber,
            pushId: scored.pushId,
            list: changeCar.map((item) => ({
              tagId: item.preTagId,
              oldTagId: item.tagId,
              groupId: item.groupId
            }))
          });
        } else if (changeCar.length === 0 && changeMan.length > 0) {
          res = await changeClientTag({
            staffId: scored.staffId,
            externalUserid: scored.externalUserid,
            carNumber: scored.carNumber,
            pushId: scored.pushId,
            list: changeMan.map((item) => ({
              tagId: item.preTagId,
              oldTagId: item.tagId,
              groupId: item.groupId
            }))
          });
        }
        if (res) {
          message.success('修改成功');
          await getList({ pageNum: 1 });
        }
      }
    }
  };
  const paginationChange = (pageNum: number, pageSize = 10) => {
    setPagination((pagination) => ({ ...pagination, pageSize, current: pageNum }));
    if (tabActiveKey === '1') {
      getList({ pageNum, pageSize });
    } else {
      getChangeList({ pageNum, pageSize });
    }
  };

  const onTabChange = (activeKey: string) => {
    setTabActiveKey(activeKey);
    setPagination((pagination) => ({ ...pagination, current: 1 }));
    if (activeKey === '1') {
      getList({ pageNum: 1 });
    } else {
      getChangeList({ pageNum: 1 });
    }
  };
  return (
    <div className="container">
      <div className={style.breadcrumbWrap}>
        <span>当前位置：</span>
        <Breadcrumb>
          <a href="/tagConfig">
            <Breadcrumb.Item>便签配置</Breadcrumb.Item>
          </a>
          <Breadcrumb.Item>保存与推送记录</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <Tabs className={style.tabs} onChange={onTabChange}>
        <Tabs.TabPane tab="待推送" key="1">
          <div className="pt20">
            <NgTable
              loading={false}
              setRowKey={(record: UserTagProps) => {
                return record?.carNumber + record?.externalUserid;
              }}
              pagination={pagination}
              paginationChange={paginationChange}
              dataSource={dataSource}
              columns={columns({ onConfirm, onChange, tableCols, dataSource, tableType: 2 })}
            />
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab="已推送" key="2">
          <NgTable
            loading={false}
            setRowKey={(record: UserTagProps) => {
              return record?.pushTime + record?.externalUserid;
            }}
            pagination={pagination}
            paginationChange={paginationChange}
            dataSource={logDataSource}
            columns={columns({ onConfirm, onChange, tableCols, dataSource: logDataSource, tableType: 3 })}
          />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default HistoryList;
