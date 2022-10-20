import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';

import styles from '../style.module.less';
import { dataCodeList } from './config';

import { RouteComponentProps } from 'react-router-dom';
import { getModelList } from 'src/apis/dashboard';
import ListTable from './components/ListTable';
import ListLineChart from './components/ListLineChart';
import ListBarChart from './components/ListBarChart';
interface ModalProps {
  businessModel: string;
  staffNum: number;
}
const DashBoardDetail: React.FC<RouteComponentProps<{ id: string }>> = ({ match }) => {
  const [tplType, setTplType] = useState<string>('table');
  const [id, setId] = useState<string>();
  const [modelList, setModelList] = useState<ModalProps[]>([]);
  const [currentCode, setCurrentCode] = useState<{
    key: string;
    title: string;
    children: {
      key: string;
      title: string;
      subTitle: string;
      tplType?: string;
    }[];
  }>();

  const [currentItem, setCurrentItem] = useState<{ key: string; title: string; subTitle: string }>();
  const getModels = async () => {
    const res = (await getModelList({})) || [];
    setModelList(res);
  };
  useEffect(() => {
    getModels();
  }, []);
  useEffect(() => {
    const { id } = match.params;
    setId(id);
    const current = dataCodeList.filter((code) => code.key === id)[0];
    const item = current.children.filter((item) => item.key === id)[0];
    setCurrentCode(current);
    setCurrentItem(item);
    setTplType(item?.tplType || 'table');
  }, [match.params.id]);

  // tab切换时
  const onTabsChange = (activeKey: string) => {
    const item = currentCode?.children.filter((item) => item.key === activeKey)[0];
    setCurrentItem(item);
    setTplType(item?.tplType || 'table');
  };

  return (
    <div className={classNames(styles.addFriend)}>
      <Tabs defaultActiveKey={currentCode?.key} onChange={onTabsChange}>
        {currentCode?.children.map((item) => {
          return <Tabs.TabPane tab={item.title} key={item.key}></Tabs.TabPane>;
        })}
      </Tabs>
      {tplType === 'table'
        ? (
        <ListTable id={id!} currentItem={currentItem} modelList={modelList} />
          )
        : tplType === 'line'
          ? (
        <ListLineChart currentItem={currentItem} modelList={modelList} />
            )
          : (
        <ListBarChart currentItem={currentItem}></ListBarChart>
            )}
    </div>
  );
};

export default DashBoardDetail;
