/**
 * @name ChooseInst
 * @author Lester
 * @date 2021-09-28 14:48
 */
import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Context } from 'src/store';
import { queryInstList, chooseInst, requestGetMstatus } from 'src/apis';
import { InstItem } from 'src/utils/interface';
import style from './style.module.less';
import { TOKEN_KEY } from 'src/utils/config';
import Update from '../Update/Update';

const colors: string[] = ['#76A2FA', '#7AC2FE', '#889BF0', '#91A9FF', '#7AD9FF', '#6BDAED'];

const ChooseInst: React.FC<RouteComponentProps> = ({ history }) => {
  const { instList, setInstList } = useContext(Context);
  const [updating, setUpdating] = useState(false);

  const getInstList = async () => {
    // 判断是否处于系统更新中
    const updateRes = await requestGetMstatus();
    // 999 维护中
    if (updateRes === '999') {
      return setUpdating(true);
    }
    const res: any = await queryInstList();
    if (Array.isArray(res)) {
      setInstList(res);
    }
  };

  const handleChooseInst = async (corpId: string) => {
    const res: any = await chooseInst({ corpId });
    if (res) {
      localStorage.setItem(TOKEN_KEY, res);
      sessionStorage.removeItem('tagOptions');
      history.push('/index');
    }
  };

  useEffect(() => {
    getInstList();
  }, []);

  return (
    <>
      {updating || (
        <div className={style.wrap}>
          <section className={style.content}>
            <h3 className={style.title}>选择机构进入</h3>
            <ul className={style.instList}>
              {instList.map((item: InstItem, index: number) => (
                <li
                  key={item.corpId}
                  className={style.instItem}
                  style={{ backgroundColor: colors[index % 6] }}
                  onClick={() => handleChooseInst(item.corpId)}
                >
                  <img className={style.instImg} src={item.logo} alt="" />
                  <div className={style.instName}>{item.corpName}</div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
      {updating && <Update />}
    </>
  );
};

export default ChooseInst;
