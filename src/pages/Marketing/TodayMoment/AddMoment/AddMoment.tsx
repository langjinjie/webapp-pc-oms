import React, { useEffect, useMemo } from 'react';
import { DatePicker, Form, Input, TimePicker, Button, message } from 'antd';
import { BreadCrumbs } from 'src/components';
import { SetMomentContent } from 'src/pages/Marketing/TodayMoment/components';
import { requestEditTodayMoment, requestGetTodayMomentDetail } from 'src/apis/todayMoment';
import { useHistory } from 'react-router-dom';
import qs from 'qs';
import moment from 'moment';
import style from './style.module.less';
import classNames from 'classnames';

interface IAddMoment {
  momentId: string; // 否 朋友圈ID
  momentName: string; // 是 朋友圈名称
  dayItems: IDayItems[]; // 是 按天配置
}

interface IDayItems {
  momentDayId: String; // 否 按天配置规则ID
  upDay: String; // 是 按天配置日期
  momentItems: IMomentItems[]; // 是 按天配置的内容
}

interface IMomentItems {
  itemId: string; // 否 内容ID
  speechcraft: String; // 否 营销话术
  pushTime: String; // 是 推送时间（HH:mm）
  contentType: number; // 是 内容类型，1-文章，2-产品，3-活动，4-单张海报，5-9宫格海报
  feeds: IFeeds[]; //  配置的feeds
}

export interface IFeeds {
  itemId: string; // 否 内容itemID
  feedId: string; // 是 内容feedsId
  feedName?: string; // feed名称
}

const AddMoment: React.FC = () => {
  const { Item, List } = Form;
  const [form] = Form.useForm();
  const history = useHistory();

  const momentId = useMemo(() => {
    return qs.parse(location.search, { ignoreQueryPrefix: true })?.momentId;
  }, []);

  // 提交
  const onFinishHandle = async (values?: IAddMoment) => {
    // 不能直接操作values
    const { momentName, dayItems = [] } = { ...values };
    // 对upDay、pushTime和feed数据进行格式化
    const params = {
      momentName,
      dayItems: dayItems.map((dayItem: any) => {
        const upDay = moment(dayItem.upDay).format('YYYY-MM-DD');
        return {
          momentItems: dayItem.momentItems.map((momentItem: any) => {
            let { pushTime, speechcraft } = momentItem;
            pushTime = moment(pushTime).format('HH:mm');
            let { feeds, contentType } = momentItem.feed;
            feeds = feeds.map(({ feedId, itemId }: { feedId: string; itemId: string }) => ({
              feedId,
              itemId
            }));
            return { pushTime, feeds, contentType, speechcraft };
          }),
          upDay
        };
      })
    };
    const res = await requestEditTodayMoment({ ...params, momentId });
    if (res) {
      message.success(`今日朋友圈${momentId ? '编辑' : '新增'}成功`);
      history.push('/todayMoment');
    }
  };

  // 获取朋友圈详情
  const getDetail = async () => {
    const res = await requestGetTodayMomentDetail({ momentId });
    if (res) {
      // 对upDay、pushTime和feed数据进行格式化
      res.dayItems.forEach((dayItem: any) => {
        dayItem.upDay = moment(dayItem.upDay, 'yyyy-MM-DD');
        dayItem.momentItems.forEach((momentItem: any) => {
          momentItem.pushTime = moment(momentItem.pushTime, 'HH:mm');
          const { feeds, contentType } = momentItem;
          momentItem.feed = { feeds, contentType };
        });
      });
      // 设置表单得值
      form.setFieldsValue(res);
    }
  };

  useEffect(() => {
    momentId && getDetail();
  }, []);
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
                      <Item name={[name, 'upDay']} label="选择日期" rules={[{ required: true, message: '请选择日期' }]}>
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
                                    <Form.Item
                                      className={style.nodeCol}
                                      name={[childName, 'feed']}
                                      rules={[{ required: true, message: '请选择朋友圈内容库内容' }]}
                                    >
                                      <SetMomentContent />
                                    </Form.Item>
                                    <Form.Item className={style.nodeCol} name={[childName, 'speechcraft']}>
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
