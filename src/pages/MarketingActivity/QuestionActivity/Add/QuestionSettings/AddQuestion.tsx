import React, { useState } from 'react';
import { Icon, ImageUpload, Modal } from 'src/components';
import { Form, Input, Radio, Button, Checkbox } from 'antd';
import style from './style.module.less';
import { PlusOutlined } from '@ant-design/icons';
import classNames from 'classnames';

interface IAddQuestionProps {
  title?: string;
  visible: boolean;
  onClose?: () => void;
  onOk?: (row?: any) => void;
}

const { Item, List } = Form;

// 选项对照表
const optionList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'G', 'H', 'I'];

const AddQuestion: React.FC<IAddQuestionProps> = ({ title, visible, onClose, onOk }) => {
  const [correctOption, setCorrectOption] = useState<number>();
  const [form] = Form.useForm();

  const modalOnClose = () => {
    console.log(correctOption);
    console.log(setCorrectOption);
    onClose?.();
  };

  const onOkHandle = () => {
    onOk?.();
  };

  // formOnChange
  const onValuesChange = (changedValues: any, values: any) => {
    console.log('changedValues', changedValues);
    console.log('values', values);
  };

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
      <Form form={form} onValuesChange={onValuesChange}>
        <Item label="题目名称">
          <Item name="topicTitle">
            <Input placeholder="请输入活动名称，40字以内" />
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
            <Radio value={1}>抽烟</Radio>
            <Radio value={2}>体重比</Radio>
            <Radio value={3}>家庭题目</Radio>
            <Radio value={4}>普通单选多选</Radio>
            <Radio value={5}>填空</Radio>
          </Radio.Group>
        </Item>
        <Item name="isRadio" label="是否单选">
          <Radio.Group>
            <Radio value={1}>单选</Radio>
            <Radio value={2}>多选</Radio>
          </Radio.Group>
        </Item>
        <List name="tagList" initialValue={[{}]}>
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <div className="ml40 mb20" key={field.key}>
                  <div className={style.questionItem}>
                    <div className="mb14">选项{optionList[index]}</div>
                    <Item name={[field.name, '分数']}>
                      <Input placeholder="输入整数，不填默认10分" />
                    </Item>
                    <Item name={[field.name, '选项说明']}>
                      <ImageUpload />
                    </Item>
                    <Item name={[field.name, '正确答案']}>
                      <Checkbox
                        checked={correctOption === index}
                        onChange={(val) => {
                          console.log('val', val);
                          if (val.target.checked) {
                            setCorrectOption(index);
                          } else {
                            setCorrectOption(undefined);
                          }
                        }}
                      >
                        正确答案
                      </Checkbox>
                    </Item>
                    <Icon name="shanchu" onClick={() => remove(index)} />
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
      </Form>
    </Modal>
  );
};
export default AddQuestion;
