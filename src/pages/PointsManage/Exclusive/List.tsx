import React, { useEffect, useState } from 'react';
import { AuthBtn, NgFormSearch, NgTable } from 'src/components';
import { setSearchCols, tableColumns } from './Config';
import { useAsync } from 'src/utils/use-async';
// import moment from 'moment';
import { getExclusiveList, getExclusiveTypeList, setPointsOfExclusive } from 'src/apis/pointsMall';
import { NgModal } from 'src/components/NgModal/NgModal';

import styles from './style.module.less';
import { Form, Image, Input, InputNumber, message, Modal, PaginationProps } from 'antd';
import { OptionProps } from 'src/components/SearchComponent/SearchComponent';

const ExclusiveList: React.FC = () => {
  const { isLoading, run } = useAsync();
  const [visibleViewContent, setVisibleViewContent] = useState(false);
  const [visibleSendModal, setVisibleSendModal] = useState(false);
  const [content, setContent] = useState('');
  const [sendForm] = Form.useForm();
  const [formValues, setFormValues] = useState({
    pointsCount: null,
    responseBy: '年高老师',
    taskResponse: '真是非常棒的案例！希望再接再厉哦~',
    spconfName: ''
  });
  const [queryParams, setQueryParams] = useState({
    likeStaffName: '',
    spconfId: '',
    sendStatus: '',
    startTime: '',
    endTime: ''
  });
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    total: 0,
    pageSize: 10,
    showTotal: (total: number) => {
      return `共 ${total} 条记录`;
    }
  });
  const [exclusiveList, setExclusiveList] = useState<OptionProps[]>([]);
  const [dataSource, setDataSource] = useState([]);
  const [currentItem, setCurrentItem] = useState<any>({});
  const [picList, setPicList] = useState<string[]>([]);
  const [visible, setVisible] = useState(false);

  const getList = async (params?: any) => {
    const { current: pageNum, pageSize } = pagination;
    const res = await run(
      getExclusiveList({
        ...queryParams,
        pageNum,
        pageSize,
        ...params
      })
    );
    if (res) {
      const { total, list } = res;
      setPagination((pagination) => ({
        ...pagination,
        total,
        current: params?.pageNum || pageNum,
        pageSize: params?.pageSize || pageSize
      }));
      setDataSource(list || []);
    }
  };
  const onSearch = (values: any) => {
    const { likeStaffName, spconfId, sendStatus, beginTime: startTime = '', endTime = '' } = values;
    getList({ likeStaffName, pageNum: 1, spconfId, sendStatus, startTime, endTime });
    setQueryParams({ likeStaffName, spconfId, sendStatus, startTime, endTime });
  };

  const getTaskTypeList = async () => {
    const res = await getExclusiveTypeList();
    if (res) {
      const typeList = res.map((item: any) => ({
        id: item.spconfId,
        name: item.groupType + '-' + item.confName,
        ...item
      }));
      setExclusiveList(typeList || []);
    }
  };
  useEffect(() => {
    getTaskTypeList();
    getList();
  }, []);
  const viewContent = (text: string) => {
    setContent(text);
    setVisibleViewContent(true);
  };
  const checkedItem = (record: any) => {
    setVisibleSendModal(true);
    const exclusiveType = exclusiveList.filter((item) => item.id === record.spconfId)[0];
    setFormValues((formValues) => ({
      ...formValues,
      spconfName: exclusiveType.name
    }));
    setCurrentItem({ ...record, ...exclusiveType });
  };

  const onSubmit = () => {
    sendForm
      .validateFields()
      .then((values) => {
        const { spconfName, ...postData } = values;
        console.log(spconfName);
        Modal.confirm({
          title: '积分发放提醒',
          content: '是否确定发放积分？',
          onOk: async () => {
            const res = await setPointsOfExclusive({
              trecordId: currentItem.trecordId,
              ...postData
            });
            if (res) {
              setVisibleSendModal(false);
              sendForm.resetFields();
              message.success('积分发放成功');
              // 更新列表
              getList({ pageNum: 1 });
            }
          }
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const paginationChange = (pageNum: number, pageSize?: number) => {
    getList({ pageNum, pageSize });
  };

  const previewPic = (picList: string[]) => {
    setPicList(picList);
    setVisible(true);
  };

  const cancelSendModal = () => {
    setVisibleSendModal(false);
    sendForm.resetFields();
  };
  return (
    <div className="container">
      <AuthBtn path="/query">
        <NgFormSearch isInline={false} searchCols={setSearchCols(exclusiveList)} onSearch={onSearch} />
      </AuthBtn>
      <NgTable
        loading={isLoading}
        columns={tableColumns(viewContent, checkedItem, exclusiveList, previewPic)}
        paginationChange={paginationChange}
        dataSource={dataSource}
        pagination={pagination}
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
        onCancel={cancelSendModal}
        onOk={onSubmit}
      >
        <Form form={sendForm} labelCol={{ span: 5 }} wrapperCol={{ span: 16 }} initialValues={formValues}>
          <Form.Item label="案例类型">
            <Input readOnly value={currentItem?.name} />
          </Form.Item>
          <Form.Item
            label="奖励积分"
            name={'pointsCount'}
            rules={[
              {
                required: true,
                type: 'number',
                validator: (_, value) => {
                  if (Object.prototype.toString.call(value) === '[object Null]') {
                    return Promise.reject(Error('奖励积分不可以为空'));
                  }
                  if (value > Number(currentItem?.maxPoints)) {
                    return Promise.reject(new Error('该案例类型最多奖励' + currentItem.maxPoints));
                  }
                  return Promise.resolve();
                }
              }
            ]}
            extra={currentItem.confTitle}
          >
            <InputNumber min={1} precision={0} controls={false} placeholder="请输入" />
          </Form.Item>
          <Form.Item label="昵称" name={'responseBy'}>
            <Input></Input>
          </Form.Item>
          <Form.Item label="案例评价" name={'taskResponse'} rules={[{ required: true }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </NgModal>

      <div style={{ display: 'none' }}>
        <Image.PreviewGroup preview={{ visible, onVisibleChange: (vis) => setVisible(vis) }}>
          {picList.map((taskUrl, index) => (
            <Image key={index} src={taskUrl} />
          ))}
        </Image.PreviewGroup>
      </div>
    </div>
  );
};

export default ExclusiveList;
