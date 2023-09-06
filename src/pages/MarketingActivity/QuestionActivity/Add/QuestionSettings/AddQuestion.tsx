import React, { useEffect, useState } from 'react';
import { Icon, ImageUpload, Modal } from 'src/components';
import { Form, Input, Radio, Button, Checkbox } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {
  requestAddOrUpdateQuestionActivityTopic,
  requestQuestionActivityTopicDetail
} from 'src/apis/marketingActivity';
import style from './style.module.less';
import classNames from 'classnames';

interface IAddQuestionProps {
  value?: any;
  title?: string;
  visible: boolean;
  onClose?: () => void;
  onOk?: (row?: any) => void;
}

const { Item, List } = Form;

// 选项对照表
const optionList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'G', 'H', 'I'];

const AddQuestion: React.FC<IAddQuestionProps> = ({ title, value, visible, onClose, onOk }) => {
  const [topicType, setTopicType] = useState<number>(1);

  const [form] = Form.useForm();

  const modalOnClose = () => {
    onClose?.();
  };

  const getDetail = async () => {
    const topicId = value || {};
    if (!topicId) return;
    const res = await requestQuestionActivityTopicDetail({ topicId });
    if (res) {
      // 将 topicType 为4 与 isRadio 进行整合 后端单选多选分成两个属性 topicType-4: 单选或多选，isRadio：1-单选，0-多选 前端 topicType: 1-单选 0-多选
      if (res.topicType === 4) {
        res.topicType = res.isRadio;
      }
      form.setFieldsValue(res);
    }
  };

  const onOkHandle = async () => {
    // 处理单选多选入参问题
    const values = form.getFieldsValue();
    // 如果是单选或者多选，后端单选多选分成两个属性 topicType-4: 单选或多选，isRadio：1-单选，0-多选 前端 topicType: 1-单选 0-多选
    if ([0, 1].includes(values.topicType)) {
      values.isRadio = values.topicType;
      values.topicType = 4;
    }
    // 给选项添加sort字段
    values.choiceDTOS = values.choiceDTOS.forEach((item: any, index: number) => {
      item.sort = index + 1;
    });
    const res = await requestAddOrUpdateQuestionActivityTopic({ ...values, topicId: value?.topicId });
    if (res) {
      onOk?.();
    }
  };

  // formOnChange
  const onValuesChange = (changeValue: any, values: any) => {
    if (Object.keys(changeValue).includes('topicType')) {
      setTopicType(changeValue.topicType);
    }
    console.log('values', values);
  };

  const isRightKeyOnChange = (index: number) => {
    // 判断多选还是单选 1-单选 2-多选
    if (topicType === 1) {
      const choiceDTOSFormVal = form.getFieldValue('choiceDTOS').map((item: any, fieldIndex: number) => {
        if (fieldIndex === index) {
          return { ...item };
        } else {
          return {
            ...item,
            isRightKey: []
          };
        }
      });
      form.setFieldValue('choiceDTOS', choiceDTOSFormVal);
    }
  };
  useEffect(() => {
    if (visible) getDetail();
  }, [visible]);
  return (
    <Modal
      className={style.modalWrap}
      centered
      visible={visible}
      width={960}
      title={title || '新增题目'}
      onClose={modalOnClose}
      onOk={onOkHandle}
    >
      <Form form={form} onValuesChange={onValuesChange} initialValues={{ topicType: 1 }}>
        <Item label="题目名称">
          <Item name="topicTitle">
            <Input placeholder="请输入活动名称，40字以内" maxLength={40} />
          </Item>
          <Item className="mt20" name="imgUrl" extra="仅支持JPG/JPEG/PNG格式，大小小于2MB的图片">
            <ImageUpload />
          </Item>
        </Item>
        <Item name="score" label="分值">
          <Input className="width240" placeholder="请输入整数，不填默认10分" />
        </Item>
        <Item name="topicType" label="题型">
          <Radio.Group>
            <Radio value={1}>单选</Radio>
            <Radio value={0}>多选</Radio>
            <Radio value={5}>问答</Radio>
            {/* <Radio value={1}>抽烟</Radio>
            <Radio value={2}>体重比</Radio>
            <Radio value={3}>家庭题目</Radio>
            <Radio value={4}>普通单选多选</Radio>
            <Radio value={5}>填空</Radio> */}
          </Radio.Group>
        </Item>
        {/*  <Item name="isRadio" label="是否单选">
          <Radio.Group>
            <Radio value={1}>是</Radio>
            <Radio value={0}>否</Radio>
          </Radio.Group>
        </Item> */}
        {[0, 1].includes(topicType) && (
          <List name="choiceDTOS" initialValue={[{}]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <div className="ml40 mb20" key={field.key}>
                    <div className={style.questionItem}>
                      <div className="mb14">
                        选项{optionList[index]} <Icon name="shanchu" className="ml10" onClick={() => remove(index)} />
                      </div>
                      <Item name={[field.name, 'choiceOption']}>
                        <Input placeholder="请输入" />
                      </Item>
                      <Item name={[field.name, 'imgUrl']}>
                        <ImageUpload />
                      </Item>

                      <Item name={[field.name, 'isRightKey']}>
                        <Checkbox.Group onChange={() => isRightKeyOnChange(index)}>
                          <Checkbox value={1}>正确答案</Checkbox>
                        </Checkbox.Group>
                      </Item>
                    </div>
                  </div>
                ))}
                {fields.length <= 3 && (
                  <Button
                    className={classNames(style.addBtn, 'ml40')}
                    icon={<PlusOutlined />}
                    type="primary"
                    shape="round"
                    onClick={() => add({})}
                  >
                    增加选项
                  </Button>
                )}
              </>
            )}
          </List>
        )}
      </Form>
    </Modal>
  );
};
export default AddQuestion;
