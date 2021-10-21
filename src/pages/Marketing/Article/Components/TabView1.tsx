import React, { useEffect, useState } from 'react';
import { Form, Input, Tag, Modal, message, Button, Select } from 'antd';
import style from '../style.module.less';
import { Link } from 'react-router-dom';
// import { GlobalContent, changeListAction } from 'src/store';
import { getOfficialAccountsList, deleteOfficialAccounts, addOfficialAccounts } from 'src/apis/marketing';
import { useGetCorps } from 'src/utils/corp';
import { useForm } from 'antd/lib/form/Form';

// interface addressProps {
//   id: number;
//   name: string;
//   corpName?: string;
// }

const TabView1: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  // const { data, dispatch } = useContext(GlobalContent);
  const list: any[] = [];
  const [form] = useForm();
  const { data: corpList } = useGetCorps();

  // 获取公众号列表
  const getList = async () => {
    const res = await getOfficialAccountsList({});
    console.log(res);
    // dispatch(changeListAction(res.newsTaskList));
  };

  useEffect(() => {
    if (list.length === 0) {
      getList();
    }
  }, []);

  // 删除某个公众号
  const deleteItem = (event: any, id: number) => {
    event.preventDefault();
    Modal.confirm({
      title: '确认删除',
      content: '你确认删除此公众号？',
      onOk: async function () {
        await deleteOfficialAccounts({ newsTaskId: id });
        message.success('删除成功');
        const filterList = list.filter((item) => item.id !== id);
        // dispatch(changeListAction(filterList));
        console.log(filterList);
      }
    });
  };

  const addItem = async (values: any) => {
    const { corpId = '', publicAddressNames } = values;
    try {
      setLoading(true);
      await addOfficialAccounts({ publicAddressNames, corpId });
      form.resetFields();
      message.success('添加成功');
      await getList();
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

  return (
    <div className="bindAccountView">
      <Form onFinish={addItem} form={form}>
        <Form.Item labelCol={{ span: 3 }} label="已添加公众号">
          <div>
            {list.map((item) => {
              return (
                <Tag
                  color="blue"
                  closable
                  className={style.myTag}
                  key={item.id}
                  onClose={(event) => deleteItem(event, item.id)}
                >
                  {item.name} {item.corpName ? `（${item.corpName}）` : null}
                </Tag>
              );
            })}
          </div>
        </Form.Item>
        <Form.Item label="可见机构" labelCol={{ span: 3 }} name={'corpId'}>
          <Select style={{ width: '400px' }} allowClear placeholder={'请选择可见机构'}>
            <Select.Option value={''}>全部机构</Select.Option>
            {corpList.map((corp) => (
              <Select.Option value={corp.id} key={corp.id}>
                {corp.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
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
              <Link to="/addPublicAddress" replace>
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
    </div>
  );
};

export default TabView1;
