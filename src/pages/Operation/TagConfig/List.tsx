import React, { useState, useEffect, useContext } from 'react';
import { Button, message } from 'antd';
import { AuthBtn, NgFormSearch, NgTable } from 'src/components';
import { columns, searchCols, UserTagProps } from './Config';
import {
  changeClientTag,
  changeClientTagOfCar,
  getClientList,
  getTagGroupList,
  searchTagGroupOptions,
  saveToBuffer
} from 'src/apis/tagConfig';
import style from './style.module.less';
import { Context } from 'src/store';
import classNames from 'classnames';
import { RouteComponentProps } from 'react-router';
import { useDocumentTitle } from 'src/utils/base';

const TagConfig: React.FC<RouteComponentProps> = ({ history }) => {
  const [dataSource, setDataSource] = useState<UserTagProps[]>([]);
  const [tableCols, setTableCols] = useState<any[]>([]);
  const { currentCorpId } = useContext(Context);
  const [params, setParams] = useState<any>({});
  const [carTags, setCarTags] = useState<any[]>([]);
  const [manTags, setManTags] = useState<any[]>([]);

  // 获取
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

  useEffect(() => {
    getTagList();
  }, []);
  useDocumentTitle('运营配置-标签配置');

  // 对请求的数据进行表格话处理
  const dataMap = (list: any[]) => {
    const res: any[] = [];
    list.forEach((item) => {
      const { nickName, staffId, staffName, avatar, externalUserid } = item;
      if (item.carList && item.carList.length > 0) {
        item.carList.forEach((car: any, index: number) => {
          res.push({
            avatar,
            nickName,
            staffId,
            staffName,
            externalUserid,
            ...car,
            isMoreCar: index > 0,
            tagLists: index === 0 ? [...item?.tagList, ...car?.carTagList] : [...car?.carTagList]
          });
        });
      } else {
        item.tagList = item.tagList || [];
        res.push({
          avatar,
          nickName,
          staffId,
          staffName,
          externalUserid,
          tagLists: [...item?.tagList]
        });
      }
    });
    return res;
  };

  const getList = async ({
    staffName,
    externalUserid,
    nickName
  }: {
    staffName?: string;
    externalUserid?: string;
    nickName?: string;
  }) => {
    const res = await getClientList({ ...params, staffName, externalUserid, nickName });
    if (res) {
      const { list } = res;
      const data = dataMap(list);
      setDataSource(data);
    } else {
      message.warning('查询为空');
    }
  };
  const handleSearch = async (values: any) => {
    const { nickName = '', externalUserid = '', staffName = '' } = values;
    setParams({ nickName, externalUserid, staffName });
    if (!staffName) {
      message.warning('请输入员工姓名');
      return false;
    }
    if (!externalUserid && !nickName) {
      message.warning('客户昵称&客户Id必须填写一个');
      return false;
    }
    await getList({ nickName, externalUserid, staffName });
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
              list: changeCar.map((item) => ({ tagId: item.preTagId, oldTagId: item.tagId, groupId: item.groupId }))
            }),
            changeClientTag({
              staffId: scored.staffId,
              externalUserid: scored.externalUserid,
              carNumber: scored.carNumber,
              list: changeMan.map((item) => ({ tagId: item.preTagId, oldTagId: item.tagId, groupId: item.groupId }))
            })
          ]);
        } else if (changeCar.length > 0 && changeMan.length === 0) {
          res = await changeClientTagOfCar({
            staffId: scored.staffId,
            externalUserid: scored.externalUserid,
            carNumber: scored.carNumber,
            list: changeCar.map((item) => ({ tagId: item.preTagId, oldTagId: item.tagId, groupId: item.groupId }))
          });
        } else if (changeCar.length === 0 && changeMan.length > 0) {
          res = await changeClientTag({
            staffId: scored.staffId,
            externalUserid: scored.externalUserid,
            carNumber: scored.carNumber,
            list: changeMan.map((item) => ({ tagId: item.preTagId, oldTagId: item.tagId, groupId: item.groupId }))
          });
        }
        if (res) {
          message.success('修改成功');
          await getList(params);
        }
      }
    }
  };
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

  const onReset = () => {
    setDataSource([]);
  };

  const navigatorToHistory = () => {
    history.push('/tagConfig/history');
  };

  const saveBuffer = async (scored: UserTagProps) => {
    const res = await saveToBuffer({ staffId: scored.staffId, externalUserid: scored.externalUserid });
    if (res) {
      message.success('保存成功！');
    }
  };

  return (
    <div className={style.tagConfig}>
      <header className={classNames(style.header, 'flex justify-between align-center')}>
        <div className={classNames('flex', style.headerLeft)}>
          <span className="font16 bold margin-right20">标签配置</span>
          <span className="font12 color-text-placeholder">标签修改成功后，直接应用于促成任务生成及消息推送</span>
        </div>
        <AuthBtn path="/view">
          <Button type="primary" className={style.headerRightBtn} ghost shape="round" onClick={navigatorToHistory}>
            保存与推送记录
          </Button>
        </AuthBtn>
      </header>
      <AuthBtn path="/query">
        <NgFormSearch searchCols={searchCols} onSearch={handleSearch} onReset={onReset} />
      </AuthBtn>
      <div className="pt20">
        <NgTable
          loading={false}
          setRowKey={(record: UserTagProps) => {
            return record?.carNumber + record?.externalUserid;
          }}
          dataSource={dataSource}
          columns={columns({ onConfirm, onChange, tableCols, dataSource, tableType: 1, saveBuffer })}
        />
      </div>
    </div>
  );
};

export default TagConfig;
