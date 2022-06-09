/**
 * @name LotteryConfig
 * @author Lester
 * @date 2022-05-26 14:20
 */
import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Button, Form, Image, InputNumber, message, TableColumnType } from 'antd';
import { BreadCrumbs, NgTable } from 'src/components';
import { editActivityConfig, queryActivityConfig } from 'src/apis/pointsMall';
import style from './style.module.less';
import classNames from 'classnames';
import { UNKNOWN } from 'src/utils/base';

export enum GoodsTypes {
  '大奖' = 1,
  '红包类',
  '空气',
  '物流类'
}
export interface PrizeItem {
  goodsId: string;
  name: string;
  imgUrl: string;
  goodsType: number;
  totalStock: number;
  consumeStock: number;
  winWeight: number;
  exchangeDesc: string;
  status: number;
}
const PanelTitle = ({ title, className }: { title: string; className?: string }) => {
  return <div className={classNames(style.panelTitle, [className])}>{title}</div>;
};
const LotteryConfig: React.FC<RouteComponentProps> = ({ history, location }) => {
  const [prizeList, setPrizeList] = useState<PrizeItem[]>([]);
  const [formValues, setFormValues] = useState<any>({});
  const [lotteryConfigForm] = Form.useForm();
  const [activityId, setActivityId] = useState('');
  const columns: TableColumnType<PrizeItem>[] = [
    {
      title: '奖品序号',
      width: 100,
      render: (_, r, index) => index + 1
    },
    {
      title: '奖品名称',
      dataIndex: 'name',
      width: 200,
      render: (name, record) => {
        return (
          <div>
            <span className={classNames('ellipsis', style.goodsName)}>{name || UNKNOWN}</span>
            {record.goodsType === 1 && <span className={style.prizeType}>大奖</span>}
          </div>
        );
      }
    },
    {
      width: 100,
      title: '奖品图片',
      align: 'center',
      dataIndex: 'imgUrl',
      render: (text: string) => (text ? <Image style={{ width: 44 }} src={text} alt="" /> : UNKNOWN)
    },
    {
      width: 100,
      title: '奖品类型',
      dataIndex: 'goodsType',
      render: (text: number) => <span>{GoodsTypes[text]}</span>
    },
    {
      title: '奖品库存',
      width: 100,
      dataIndex: 'totalStock',
      render: (text) => <span>{text || UNKNOWN}</span>
    },
    {
      title: '消耗库存',
      width: 100,
      dataIndex: 'consumeStock',
      render: (text) => <span>{text || UNKNOWN}</span>
    },
    {
      title: '中奖权重',
      dataIndex: 'winWeight',
      width: 100,
      render: (text) => <span>{text || UNKNOWN}</span>
    },
    {
      title: '中奖概率',
      dataIndex: 'winProbability',
      width: 100,
      render: (text) => <span>{text ? text + '%' : UNKNOWN}</span>
    },
    {
      title: '兑换流程说明',
      dataIndex: 'exchangeDesc',
      width: 200,
      ellipsis: {
        showTitle: true
      }
    },

    {
      title: '操作',
      dataIndex: 'activityId',
      width: 80,
      fixed: 'right',
      render: (text: string, record) =>
        formValues.status < 3
          ? (
          <Button
            type="link"
            onClick={() =>
              history.push('/lotteryConfig/prizeAdd', { goodsId: record.goodsId, goodsType: record.goodsType })
            }
          >
            编辑
          </Button>
            )
          : (
              '/'
            )
    }
  ];

  const getActivityConfig = async () => {
    const { activityId }: any = location.state || {};
    setActivityId(activityId);
    const res: any = await queryActivityConfig({ activityId });
    if (res) {
      console.log(res);
      const { list, ...formParams } = res;

      setPrizeList(list || []);
      lotteryConfigForm.setFieldsValue(formParams);
      setFormValues(formParams);
    }
  };

  useEffect(() => {
    getActivityConfig();
  }, []);

  // const onPressEnter: React.KeyboardEventHandler<HTMLInputElement> = () => {
  //   lotteryConfigForm
  //     .validateFields()
  //     .then(async () => {
  //       const values = lotteryConfigForm.getFieldsValue();
  //       const res = await editActivityConfig({ ...values, activityId });
  //       if (res) {
  //         message.success('配置成功');
  //       }
  //     })
  //     .catch(() => {
  //       message.error('请配置正确后再提交');
  //     });
  // };

  const onFinish = async (values: any) => {
    const res = await editActivityConfig({ ...values, activityId });
    if (res) {
      message.success('配置成功');
    }
  };

  return (
    <div className={style.lotteryConfig}>
      <BreadCrumbs navList={[{ name: '抽奖配置' }, { name: '奖品配置' }]} />
      <PanelTitle title="奖品配置" />
      <NgTable style={{ marginTop: 20 }} rowKey="goodsId" columns={columns} dataSource={prizeList} />

      <Form
        className={classNames('edit', style.configEdit)}
        onFinish={onFinish}
        form={lotteryConfigForm}
        initialValues={formValues}
      >
        <PanelTitle title="抽奖消耗积分配置" className="margin-bottom20" />
        <div className="flex">
          <Form.Item
            label="抽奖积分"
            extra="积分/次"
            rules={[{ required: true }]}
            name="costPoints"
            className="customExtra"
          >
            <InputNumber
              style={{ width: '120px' }}
              controls={false}
              disabled={formValues.status >= 3}
              // onPressEnter={onPressEnter}
            />
          </Form.Item>

          <Form.Item>
            <Button
              htmlType="submit"
              style={{ width: '90px' }}
              shape="round"
              disabled={formValues.status >= 3}
              type="primary"
            >
              确定
            </Button>
          </Form.Item>
        </div>
        <PanelTitle title="中奖限制配置" className="margin-bottom20" />
        <div className="flex">
          <Form.Item label="限制每月" extra="次" name="monthLimit" className="customExtra">
            <InputNumber
              // onPressEnter={onPressEnter}
              controls={false}
              style={{ width: '70px' }}
              disabled={formValues.status >= 3}
            />
          </Form.Item>
          <Form.Item label="限制每周" extra="次" name="weekLimit" className="customExtra">
            <InputNumber
              // onPressEnter={onPressEnter}
              controls={false}
              style={{ width: '70px' }}
              disabled={formValues.status >= 3}
            />
          </Form.Item>
          <Form.Item label="限制每日" extra="次" name="dayLimit" className="customExtra">
            <InputNumber
              // onPressEnter={onPressEnter}
              controls={false}
              style={{ width: '70px' }}
              disabled={formValues.status >= 3}
            />
          </Form.Item>
          <Form.Item>
            <Button
              style={{ width: '90px' }}
              htmlType="submit"
              shape="round"
              disabled={formValues.status >= 3}
              type="primary"
            >
              确定
            </Button>
          </Form.Item>
        </div>
      </Form>
      <ul className={style.ruleInfo}>
        <li>限制说明：</li>
        <li>1、若为空则表示不限制。</li>
        <li>2、若每日/周/月限制1次，则表示该坐席每日/周/月只能中奖1次。</li>
      </ul>
    </div>
  );
};

export default LotteryConfig;
