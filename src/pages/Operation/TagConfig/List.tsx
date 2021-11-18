import React, { useState, useEffect } from 'react';
import { Card, message } from 'antd';
import { NgFormSearch, NgTable } from 'src/components';
import { columns, searchCols, UserTagProps } from './Config';
import { changeClientTagOfCar, getClientList, searchTagGroupOptions } from 'src/apis/tagConfig';

const TagConfig: React.FC = () => {
  const [dataSource, setDataSource] = useState<UserTagProps[]>([]);
  const [tableCols, setTableCols] = useState<any[]>([]);
  const [carTags, setCarTags] = useState<any[]>([]);
  const [manTags, setManTags] = useState<any[]>([]);
  const sortsFun = (key: string) => {
    return (a: any, b: any) => {
      const v1 = a[key];
      const v2 = b[key];
      return v1 === v2 ? 0 : v1 > v2 ? 1 : -1;
    };
  };
  // 获取
  const getOptions = async (list: any[]) => {
    const promiseArr = list.map((item) => searchTagGroupOptions({ groupId: item.groupId }));
    const resList = await Promise.all(promiseArr);
    if (resList) {
      resList.forEach((res, index) => {
        list[index].options = res.tagList;
      });
      setTableCols(list);
    }
  };
  const dataMap = (list: any[]) => {
    const res: any[] = [];
    list.forEach((item) => {
      const { nickName, staffId, staffName, avatar, externalUserid } = item;
      item.carList.forEach((car: any, index: number) => {
        res.push({
          avatar,
          nickName,
          staffId,
          staffName,
          externalUserid,
          ...car,
          tagLists: index === 0 ? [...item.tagList, ...car.carTagList] : [...car.carTagList]
        });
      });
      const cols1 = res[0].carTagList.sort(sortsFun('groupName')) || [];
      setCarTags(cols1);
      const cols2 = item.tagList.sort(sortsFun('groupName')) || [];
      setManTags(cols2);
      const cols = [...cols1, ...cols2];
      getOptions(cols);
    });
    return res;
  };

  const handleSearch = async (values: any) => {
    const { nickName = '情', externalUserid = '', staffName = '余亚东' } = values;
    if (!staffName) {
      message.warning('请输入员工姓名');
      return false;
    }
    if (!externalUserid && !nickName) {
      message.warning('客户昵称&客户Id必须填写一个');
      return false;
    }
    const res = await getClientList({ staffName, externalUserid, nickName });
    if (res) {
      const { list } = res;
      const data = dataMap(list);
      setDataSource(data);
    } else {
      message.warning('查询为空');
    }

    console.log(values);
  };
  const onConfirm = async (scored: UserTagProps, index: number) => {
    console.log('s', index);
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
      console.log({ changeCar, changeMan });
      if (changeCar.length > 0) {
        await changeClientTagOfCar({
          staffId: scored.staffId,
          externalUserid: scored.externalUserid,
          carNumber: scored.carNumber,
          list: [changeCar.map((item) => ({ tagId: item.preTagId, oldTagId: item.tagId, groupId: item.groupId }))]
        });
      }
    }
  };
  const onChange = ({
    col,
    value,
    scored,
    index
  }: {
    col: any;
    value: string;
    scored: UserTagProps;
    index: number;
  }) => {
    scored.tagLists.forEach((item: any) => {
      if (item.groupId === col.groupId) {
        item.preTagId = value;
      }
    });

    const data = [...dataSource];
    data[index] = scored;
    setDataSource(data);
  };
  useEffect(() => {
    handleSearch({});
  }, []);
  return (
    <Card title={'标签配置'} extra="标签修改成功后，直接应用于促成任务生成及消息推送" bordered={false}>
      <NgFormSearch searchCols={searchCols} onSearch={handleSearch}></NgFormSearch>
      <div className="pt20">
        <NgTable
          loading={false}
          setRowKey={(record: UserTagProps) => {
            return record.carNumber;
          }}
          dataSource={dataSource}
          columns={columns({ onConfirm, onChange, tableCols })}
        ></NgTable>
      </div>
    </Card>
  );
};

export default TagConfig;
