import React, { useEffect, useState } from 'react';
import { NgFormSearch, NgTable } from 'src/components';
import { searchCols, tableColumns } from './Config';
import { useAsync } from 'src/utils/use-async';
import moment from 'moment';
import { getExclusiveTypeList } from 'src/apis/pointsMall';
import { NgModal } from 'src/components/NgModal/NgModal';

import styles from './style.module.less';
import { Form, Input, InputNumber, message, Modal } from 'antd';

const ExclusiveList: React.FC = () => {
  const { isLoading } = useAsync();
  const [visibleViewContent, setVisibleViewContent] = useState(false);
  const [visibleSendModal, setVisibleSendModal] = useState(true);
  const [content, setContent] = useState('');
  const [sendForm] = Form.useForm();
  const [formValues, setFormValues] = useState({
    spconfId: '',
    pointsCount: 0,
    responseBy: '年高老师',
    taskResponse: undefined
  });
  const [dataSource] = useState([
    {
      trecordId: '1',
      spconfId: '1',
      corpId: '1',
      staffId: '1',
      staffName: '李斯',
      taskContent:
        '    Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia perferendis, quidem accusantium perspiciatis quae eligendi soluta similique, natus in quasi consequuntur molestiae repellendus earum, ratione nesciunt. Dolores perferendis cumque facere!',

      sendStatus: 0,
      sendDate: moment().format('YYYY-MM-DD HH:MM:ss'),
      sender: '马保国',
      taskResponse: 'as',
      pointsCount: '1000',
      taskUrls: [
        'https://gw.alipayobjects.com/zos/antfincdn/cV16ZqzMjW/photo-1473091540282-9b846e7965e3.webp',
        'https://ie.bjd.com.cn/images/202005/27/5ece0207e4b0be621be3fb79.jpeg'
      ],
      leaderName: '你是',
      dateCreated: moment().format('YYYY-MM-DD HH:MM:ss'),
      bossName: '李松超'
    },
    {
      trecordId: '12',
      spconfId: '1',
      corpId: '1',
      staffId: '1',
      staffName: '李斯',
      taskContent:
        '    Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia perferendis, quidem accusantium perspiciatis quae eligendi soluta similique, natus in quasi consequuntur molestiae repellendus earum, ratione nesciunt. Dolores perferendis cumque facere!',

      sendStatus: 0,
      sendDate: moment().format('YYYY-MM-DD HH:MM:ss'),
      sender: '马保国',
      taskResponse: 'as',
      pointsCount: '1000',
      dateCreated: moment().format('YYYY-MM-DD HH:MM:ss'),
      taskUrls: [
        'https://ie.bjd.com.cn/images/202005/27/5ece0207e4b0be621be3fb79.jpeg',
        'https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp'
      ],
      leaderName: '你是',
      bossName: '李松超'
    }
  ]);
  const onSearch = (values: any) => {
    console.log(values);
  };

  const getTaskTypeList = async () => {
    const res = await getExclusiveTypeList();
    console.log(res);
  };
  useEffect(() => {
    getTaskTypeList();
  }, []);
  const viewContent = (text: string) => {
    setContent(text);
    setVisibleViewContent(true);
  };
  const checkedItem = (record: any) => {
    console.log(record);
    setVisibleSendModal(true);
    setFormValues({
      spconfId: '',
      pointsCount: 0,
      responseBy: '年高老师',
      taskResponse: undefined
    });
  };

  const onSubmit = () => {
    sendForm
      .validateFields()
      .then((values) => {
        console.log(values);
        Modal.confirm({
          title: '积分发放提醒',
          content: '是否确定发放积分？',
          onOk: () => {
            console.log('ok');
          }
        });
      })
      .catch((err) => {
        message.error('表单信息错误');
        console.error(err);
      });
  };
  return (
    <div className="container">
      <NgFormSearch isInline={false} searchCols={searchCols} onSearch={onSearch} />
      <NgTable
        loading={isLoading}
        columns={tableColumns(viewContent, checkedItem)}
        dataSource={dataSource}
        rowKey="trecordId"
      ></NgTable>
      <NgModal
        title="查看案例内容"
        visible={visibleViewContent}
        footer={null}
        onCancel={() => setVisibleViewContent(false)}
      >
        <div className={styles.modelContent}>{content}</div>
      </NgModal>

      {/* 发放积分模块 */}
      <NgModal
        title="发送积分与评价"
        visible={visibleSendModal}
        okText="确定发放"
        onCancel={() => setVisibleSendModal(false)}
        onOk={onSubmit}
      >
        <Form form={sendForm} labelCol={{ span: 5 }} wrapperCol={{ span: 16 }} initialValues={formValues}>
          <Form.Item label="案例类型" name={'spconfId'}>
            <Input></Input>
          </Form.Item>
          <Form.Item
            label="奖励积分"
            name={'pointsCount'}
            rules={[
              {
                required: true,
                type: 'number',
                validator: (_, value) => {
                  console.log(value);
                  if (Object.prototype.toString.call(value) === '[object Null]') {
                    return Promise.reject(Error('奖励积分不可以为空'));
                  }
                  if (value > 1000) {
                    return Promise.reject(new Error('最大1000'));
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <InputNumber min={0} max={10000} precision={0} controls={false} />
          </Form.Item>
          <Form.Item label="昵称" name={'responseBy'}>
            <Input></Input>
          </Form.Item>
          <Form.Item label="案例评价" name={'taskResponse'} rules={[{ required: true }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </NgModal>
    </div>
  );
};

export default ExclusiveList;
