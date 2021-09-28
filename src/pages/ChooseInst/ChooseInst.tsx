/**
 * @name ChooseInst
 * @author Lester
 * @date 2021-09-28 14:48
 */
import React, { useContext, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Context } from 'src/store';
import { InstItem } from 'src/utils/interface';
import style from './style.module.less';

const colors: string[] = ['#76A2FA', '#7AC2FE', '#889BF0', '#91A9FF', '#7AD9FF', '#6BDAED'];

const ChooseInst: React.FC<RouteComponentProps> = ({ history }) => {
  const { instList, setInstList } = useContext(Context);

  useEffect(() => {
    setInstList([
      {
        id: '123',
        name: '年高科技',
        logo: require('src/assets/images/bg.jpg')
      },
      {
        id: '456',
        name: '中国平安寿险上海分公司',
        logo: require('src/assets/images/bg.jpg')
      },
      {
        id: '789',
        name: '中国人寿保险乌鲁木齐第二分公司',
        logo: require('src/assets/images/bg.jpg')
      },
      {
        id: '025',
        name: '年高科技',
        logo: require('src/assets/images/bg.jpg')
      },
      {
        id: '753',
        name: '中国银行',
        logo: require('src/assets/images/bg.jpg')
      },
      {
        id: '952',
        name: '中国人寿保险乌鲁木齐第二分公司',
        logo: require('src/assets/images/bg.jpg')
      }
    ]);
  }, []);

  return (
    <div className={style.wrap}>
      <section className={style.content}>
        <h3 className={style.title}>选择机构进入</h3>
        <ul className={style.instList}>
          {instList.map((item: InstItem, index: number) => (
            <li
              key={item.id}
              className={style.instItem}
              style={{ backgroundColor: colors[index % 6] }}
              onClick={() => history.push('/index')}
            >
              <img className={style.instImg} src={item.logo} alt="" />
              <div className={style.instName}>{item.name}</div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default ChooseInst;
