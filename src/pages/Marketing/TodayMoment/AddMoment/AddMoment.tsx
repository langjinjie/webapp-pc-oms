import React from 'react';
import { DatePicker, Form, Input, Select, TimePicker, Button } from 'antd';
import { BreadCrumbs } from 'src/components';
import moment from 'moment';
import style from './style.module.less';
import classNames from 'classnames';

const AddMoment: React.FC = () => {
  const { Item, List } = Form;
  const [form] = Form.useForm();
  return (
    <div className={style.wrap}>
      <BreadCrumbs className="mb30" />
      <Form form={form}>
        <div className={style.panel}>名称配置</div>
        <div className={style.content}>
          <Item name="name" label="今日朋友圈名称" rules={[{ required: true, message: '请填写今日朋友圈名称' }]}>
            <Input placeholder="请输入" className="width400" />
          </Item>
        </div>
        <div></div>
        <div className={style.panel}>内容配置</div>
        <div className={style.content}>
          <Item name="" label="选择日期" rules={[{ required: true, message: '请选择日期' }]}>
            <DatePicker />
          </Item>
          <div className={style.momentContent}>
            <ul className={classNames(style.headerTitle, 'flex justify-between')}>
              <li className={style.select}>配置内容</li>
              <li className={style.input}>自定义话术</li>
              <li className={style.time}>建议发送时间</li>
              <li className={style.operateCol}>操作</li>
            </ul>
            <div className={style.nodeBody}>
              <List
                name="nodeRuleList"
                initialValue={[
                  { pushTime: moment('08:00', 'HH:mm') },
                  { pushTime: moment('12:00', 'HH:mm') },
                  { pushTime: moment('18:00', 'HH:mm') }
                ]}
              >
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ name, key }, nodeIndex) => (
                      <Form.Item key={key + nodeIndex}>
                        <div className={classNames(style.nodeItem, 'flex justify-between')}>
                          <Form.Item
                            className={style.nodeCol}
                            name={[name, 'nodeRuleId']}
                            rules={[{ required: true, message: '请选择节点规则' }]}
                          >
                            <Select
                              // disabled={isReadonly}
                              onFocus={() => {
                                console.log('聚焦了~');
                              }}
                              className={style.select}
                              dropdownClassName={style.dropDownStyle}
                              placeholder="点击选择朋友圈内容库内容"
                            />
                          </Form.Item>
                          <Form.Item
                            className={style.nodeCol}
                            name={[name, 'wayCode']}
                            rules={[{ required: true, message: '请选择触达方式' }]}
                          >
                            <Input className={style.input} placeholder="若不配置默认取朋友圈内容库的话术" />
                          </Form.Item>
                          <Form.Item
                            name={[name, 'pushTime']}
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
                              onClick={() => remove(nodeIndex)}
                            >
                              删除
                            </Button>
                          </div>
                        </div>
                      </Form.Item>
                    ))}
                    <li className={style.nodeItem}>
                      <Button
                        shape="round"
                        ghost
                        // disabled={isReadonly}
                        type="primary"
                        onClick={() => add({ pushTime: moment('09:00', 'HH:mm') })}
                      >
                        新增
                      </Button>
                    </li>
                  </>
                )}
              </List>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};
export default AddMoment;
