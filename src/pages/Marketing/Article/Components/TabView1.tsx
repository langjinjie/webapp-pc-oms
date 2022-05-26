import React, { useEffect, useState, useContext } from 'react';
import { Form, Input, message, Button, Switch, Popconfirm } from 'antd';
import style from '../style.module.less';
import { Link } from 'react-router-dom';
// import { GlobalContent, changeListAction } from 'src/store';
import { getOfficialAccountsList, operateInformation, addOfficialAccounts } from 'src/apis/marketing';
import { useForm } from 'antd/lib/form/Form';

import { Context } from 'src/store';
import classNames from 'classnames';
import { useMountedRef } from 'src/utils/use-async';

// interface addressProps {
//   id: number;
//   name: string;
//   corpName?: string;
// }

interface GzhProps {
  corpId: string;
  corpName: string;
  id: string;
  name: string;
  status: number;
}
const TabView1: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<GzhProps[]>([]);
  const [form] = useForm();
  const mountedRef = useMountedRef();
  const { currentCorpId } = useContext(Context);

  // 获取公众号列表
  const getList = async () => {
    if (!mountedRef) return;
    const res = (await getOfficialAccountsList({})) || {};
    const { newsTaskList } = res;
    setList(newsTaskList || []);
  };

  useEffect(() => {
    if (list.length === 0) {
      getList();
    }
  }, []);

  // 删除某个公众号
  const deleteItem = async (id: string) => {
    const res = await operateInformation({ newsTaskId: id, opstatus: 4 });
    if (!res) return false;
    message.success('删除成功');
    const filterList = list.filter((item) => item.id !== id);
    setList(filterList);
  };

  const addItem = async (values: any) => {
    const { publicAddressNames } = values;
    try {
      setLoading(true);
      const res = await addOfficialAccounts({ publicAddressNames, corpId: currentCorpId });
      if (res) {
        form.resetFields();
        message.success('添加成功');
        await getList();
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const validatorPublic = (value: string) => {
    if (!value) {
      return Promise.resolve();
    } else {
      const lightsValues = value.replace(/，/gi, ',');
      let lightsArr: string[] = [];
      lightsArr = lightsValues.split(',');

      if (lightsArr.length > 0) {
        let isMaxLengthError = false;
        lightsArr.forEach((light) => {
          if (light.length > 40) {
            isMaxLengthError = true;
          }
        });
        if (isMaxLengthError) {
          return Promise.reject(new Error('公众号名称长度不要超过40'));
        }
      }
      if (lightsArr.length > 30) {
        return Promise.reject(new Error('已添加公众号为30个'));
      }
      return Promise.resolve();
    }
  };

  // 是否同步更新开关
  const handleSwitchChange = async (index: number, item: GzhProps) => {
    const copyList = [...list];
    copyList[index].status = item.status === 1 ? 0 : 1;
    setList(copyList);
    await operateInformation({ newsTaskId: item.id, opstatus: item.status === 1 ? 1 : 2 });
  };

  return (
    <div className="bindAccountView">
      <Form onFinish={addItem} form={form}>
        <Form.Item
          label="添加行内公众号"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 12 }}
          name="publicAddressNames"
          rules={[
            { required: true, message: '公众号不可以为空' },
            {
              validator: (_, value) => {
                return validatorPublic(value);
              }
            }
          ]}
          extra={
            <span style={{ color: '#aaa' }}>
              绑定公众号后，公众号的内容将自动同步到后台中方便转发。
              <Link to="/marketingArticle/editGuide" replace>
                如何添加
              </Link>
            </span>
          }
        >
          <Input.TextArea placeholder={'多个微信公众号以逗号隔开，已添加公众号最多30个'} rows={3} maxLength={300} />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 3 }}>
          <Button type="primary" shape="round" htmlType="submit" loading={loading}>
            添加
          </Button>
        </Form.Item>
      </Form>
      <Form.Item wrapperCol={{ offset: 3 }}>
        <div className={style.customList}>
          <ul className={classNames(style.listHeader, 'flex cell')}>
            <li className={style.firstCol}>序号</li>
            <li className={style.secondCol}>公众号名称</li>
            <li className={style.thirdCol}>是否同步更新</li>
            <li className={classNames(style.fourthCol, 'cell')}>操作</li>
          </ul>
          <div className={style.listContent}>
            {list.map((item, index) => {
              return (
                <ul key={item.id} className={classNames('flex', style.item)}>
                  <li className={style.firstCol}>{index + 1}</li>
                  <li className={style.secondCol}>{item.name}</li>
                  <li className={classNames(style.thirdCol, 'flex justify-center align-center')}>
                    <Popconfirm
                      title={'确定修改更新状态'}
                      placement="right"
                      onConfirm={() => handleSwitchChange(index, item)}
                    >
                      <Switch
                        checkedChildren="是"
                        unCheckedChildren="否"
                        checked={item.status === 1}
                        // onChange={(checked) => handleSwitchChange(index, checked)}
                      />
                    </Popconfirm>
                  </li>
                  <li className={classNames(style.fourthCol, 'cell')}>
                    <Popconfirm title="您确定要删除?" placement="right" onConfirm={() => deleteItem(item.id)}>
                      <Button type="link">删除</Button>
                    </Popconfirm>
                  </li>
                </ul>
              );
            })}
          </div>
        </div>
      </Form.Item>
    </div>
  );
};

export default TabView1;
