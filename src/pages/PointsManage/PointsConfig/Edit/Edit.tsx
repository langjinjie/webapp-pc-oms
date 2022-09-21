import React, { useEffect, useMemo, useState } from 'react';
import { BreadCrumbs } from 'src/components';
import { Button, Form, InputNumber, DatePicker, Input, Select } from 'antd';
import {
  requestGetPointsConfigDetail,
  requestGetPointsConfigLogDetail,
  requestPointsConfigAddEdit,
  requestPointsConfigEdit
} from 'src/apis/pointsMall';
import qs from 'qs';
import style from './style.module.less';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';

// 时间限制
const periodTypeList = [
  { value: 1, name: '每日' },
  { value: 2, name: '每周' },
  { value: 3, name: '每月' }
];

const Edit: React.FC = () => {
  const [taskTip, setTaskTip] = useState('');
  const [loading, setLoading] = useState(false);

  const { Item } = Form;
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const { Option } = Select;

  const history = useHistory();

  const searchParam = useMemo(() => {
    return qs.parse(window.location.search, { ignoreQueryPrefix: true });
  }, []);

  // 确认提交
  const onFinishHandle = async () => {
    const { type, pointsTaskId, logId } = searchParam;
    await form.validateFields();
    const values = form.getFieldsValue();
    let res: any = null;
    setLoading(true);
    if (type === 'edit') {
      const { taskName, taskDesc, taskDetail, sort, periodType, businessModel } = values;
      res = await requestPointsConfigEdit({
        pointsTaskId,
        taskName,
        taskDesc,
        taskDetail,
        sort,
        periodType,
        businessModel
      });
    } else {
      res = await requestPointsConfigAddEdit({
        ...values,
        pointsTaskId,
        logId: logId === 'undefined' ? undefined : logId,
        effectiveTime: values.effectiveTime.format('YYYY-MM-DD')
      });
    }
    if (res) {
      history.push('/pointsConfig?refresh=true');
    }
    setLoading(false);
  };

  // 获取任务详情
  const getDetail = async () => {
    const { pointsTaskId, logId, type } = searchParam;
    let res: any = null;
    if (logId === 'undefined') {
      res = await requestGetPointsConfigDetail({ pointsTaskId });
    } else {
      res = await requestGetPointsConfigLogDetail({ logId });
    }
    // periodType后端可能返回null
    res.periodType = res.periodType || 1;
    // 时间格式转换
    let effectiveTime = moment(res.effectiveTime);
    if (type === 'add' && logId === 'undefined') {
      effectiveTime = moment().add(1, 'days');
    }
    if (res) {
      form.setFieldsValue({ ...res, effectiveTime });
      setTaskTip(res.taskTip);
    }
  };

  useEffect(() => {
    getDetail();
  }, []);

  return (
    <div className={style.wrap}>
      <BreadCrumbs
        navList={[
          { path: '/pointsConfig', name: '打卡与奖励任务' },
          { path: '', name: '编辑' }
        ]}
      />
      <div className={style.header}>
        <div className={style.title}>编辑打卡任务</div>
        <Button className={style.sumbit} type="primary" loading={loading} onClick={onFinishHandle}>
          确认
        </Button>
      </div>
      <div className={style.desc}>任务说明：{taskTip}</div>
      <Form className={style.form} form={form} layout="horizontal">
        <Item required name="sort" label="A端展示排序：">
          <InputNumber placeholder="请输入" className={style.inputNum} controls={false} />
        </Item>
        <Item required name="effectiveTime" label="生效时间">
          <DatePicker disabled={searchParam.type === 'edit'} />
        </Item>
        <Item required name="taskName" label="任务名称">
          <Input placeholder="请输入" className={style.input} showCount maxLength={18} />
        </Item>
        <Item required name="taskDesc" label="任务描述">
          <Input placeholder="请输入" className={style.input} showCount maxLength={22} />
        </Item>
        <Item required name="taskDetail" label="详细说明">
          <TextArea className={style.textArea} showCount maxLength={100} />
        </Item>
        <Item required label="奖励分值">
          <Item
            rules={[
              { required: true, max: 9999, message: '奖励分值不可超过9999', type: 'number' },
              () => ({
                validator () {
                  form.validateFields(['maxPoints']);
                  return Promise.resolve();
                }
              })
            ]}
            name="taskPoints"
            noStyle
          >
            <InputNumber
              disabled={searchParam.type === 'edit'}
              className={classNames(style.inputNum, { [style.disabled]: searchParam.type === 'edit' })}
              controls={false}
            />
          </Item>
          <span className={style.unit}>分</span>
        </Item>
        <Item required label="积分上限">
          <Item
            rules={[
              ({ getFieldValue }) => ({
                validator (_, value) {
                  if (+value < +getFieldValue('taskPoints')) {
                    return Promise.reject(new Error('积分上限小于奖励分值，请重新填写'));
                  }
                  return Promise.resolve();
                }
              })
            ]}
            name="maxPoints"
            noStyle
          >
            <InputNumber
              disabled={searchParam.type === 'edit'}
              className={classNames(style.inputNum, { [style.disabled]: searchParam.type === 'edit' })}
              controls={false}
            />
          </Item>
          <span className={style.unit}>分</span>
        </Item>
        <Item required name="periodType" label="时间限制">
          <Select className={style.select}>
            {periodTypeList.map((typeItem) => (
              <Option key={typeItem.value} value={typeItem.value}>
                {typeItem.name}
              </Option>
            ))}
          </Select>
        </Item>
        <Item name="businessModel" label="业务模式">
          <Input placeholder="请输入" className={style.input} showCount />
        </Item>
      </Form>
    </div>
  );
};
export default Edit;
