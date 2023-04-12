import React from 'react';
import { DatePicker, Form, Input, TimePicker, Button, message } from 'antd';
import { BreadCrumbs } from 'src/components';
import { SetMomentContent } from 'src/pages/Marketing/TodayMoment/components';
import { requestEditTodayMoment } from 'src/apis/marketing';
import moment from 'moment';
import style from './style.module.less';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';

const AddMoment: React.FC = () => {
  const { Item, List } = Form;
  const [form] = Form.useForm();
  const history = useHistory();

  // 提交
  const onFinishHandle = async (values?: any) => {
    console.log('values', values);
    const res = await requestEditTodayMoment({ ...values });
    if (res) {
      console.log('res', res);
      message.success('今日朋友圈新增成功');
      history.push('/todayMoment');
    }
  };
  return (
    <div className={style.wrap}>
      <BreadCrumbs className="mb30" />
      <Form form={form} onFinish={onFinishHandle}>
        <div className={style.panel}>名称配置</div>
        <div className={style.content}>
          <Item name="momentName" label="今日朋友圈名称" rules={[{ required: true, message: '请填写今日朋友圈名称' }]}>
            <Input placeholder="请输入" className="width400" />
          </Item>
        </div>
        <div className={style.panel}>内容配置</div>
        <div className={style.content}>
          <List name="dayItems" initialValue={[{}]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ name, key }, index) => (
                  <div className={style.marketItem} key={key}>
                    <div className={style.marketDate}>
                      <Item name="upDay" label="选择日期" rules={[{ required: true, message: '请选择日期' }]}>
                        <DatePicker />
                      </Item>
                      {fields.length === 1 || (
                        <Button className="ml10" shape="round" onClick={() => remove(index)}>
                          删除
                        </Button>
                      )}
                    </div>
                    <div className={style.momentContent}>
                      <ul className={classNames(style.headerTitle, 'flex justify-between')}>
                        <li className={style.select}>配置内容</li>
                        <li className={style.input}>自定义话术</li>
                        <li className={style.time}>建议发送时间</li>
                        <li className={style.operateCol}>操作</li>
                      </ul>
                      <div className={style.nodeBody}>
                        <List
                          name={[name, 'momentItems']}
                          initialValue={[
                            { pushTime: moment('08:00', 'HH:mm') },
                            { pushTime: moment('12:00', 'HH:mm') },
                            { pushTime: moment('18:00', 'HH:mm') }
                          ]}
                        >
                          {(childFields, { add: childAdd, remove: childRemove }) => (
                            <>
                              {childFields.map(({ name: childName, key: childKey }, childIndex) => (
                                <Form.Item key={childKey}>
                                  <div className={classNames(style.momentItem, 'flex justify-between')}>
                                    <Form.Item name="itemId" className={style.itemId}>
                                      <Input />
                                    </Form.Item>
                                    <Form.Item
                                      className={style.nodeCol}
                                      name={[childName, 'feeds']}
                                      rules={[{ required: true, message: '请选择朋友圈内容库内容' }]}
                                    >
                                      <SetMomentContent />
                                    </Form.Item>
                                    <Form.Item className={style.nodeCol} name={[childName, 'contentType']}>
                                      <Input className={style.input} placeholder="若不配置默认取朋友圈内容库的话术" />
                                    </Form.Item>
                                    <Form.Item
                                      name={[childName, 'pushTime']}
                                      rules={[{ required: true, message: '请选择推送时间' }]}
                                      className={classNames(style.timeCol)}
                                    >
                                      <TimePicker
                                        //  disabled={isReadonly}
                                        bordered={false}
                                        format={'HH:mm'}
                                        className={style.time}
                                      />
                                    </Form.Item>
                                    <div className={style.operateCol}>
                                      <Button
                                        type="link"
                                        // disabled={isReadonly}
                                        onClick={() => childRemove(childIndex)}
                                      >
                                        删除
                                      </Button>
                                    </div>
                                  </div>
                                </Form.Item>
                              ))}
                              <div className={style.momentItem}>
                                <Button
                                  shape="round"
                                  ghost
                                  // disabled={isReadonly}
                                  type="primary"
                                  onClick={() => childAdd({ pushTime: moment('09:00', 'HH:mm') })}
                                >
                                  新增
                                </Button>
                              </div>
                            </>
                          )}
                        </List>
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  shape="round"
                  className="mt10"
                  ghost
                  // disabled={isReadonly}
                  type="primary"
                  onClick={() => add({})}
                >
                  新增
                </Button>
              </>
            )}
          </List>
        </div>
        <div className="flex justify-center">
          <Button className={style.submitBtn} htmlType="submit" shape="round" type="primary">
            提交
          </Button>
        </div>
      </Form>
    </div>
  );
};
export default AddMoment;
