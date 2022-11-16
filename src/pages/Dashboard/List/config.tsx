import React, { useMemo } from 'react';
import { ColumnsType } from 'antd/lib/table';
import { SmallLineChart } from '../components/SamllLineChart/SmallLineChat';

export interface ItemProps {
  id: string;
  [propKey: string]: any;
}
interface tableOperations {
  toDetailPage?: (record: ItemProps) => void;
  titleList: any[];
  visibleLineChart?: boolean;
}
export const tableColumns1 = ({ toDetailPage, titleList }: tableOperations): ColumnsType<ItemProps> => {
  const titleCols = useMemo(() => {
    return titleList.map((item: any) => ({
      title: item.label,
      width: 100,
      className: 'space-left',
      ellipsis: true,
      dataIndex: item.key
    }));
  }, [titleList]);

  return [
    {
      title: '排序',
      width: 80,

      align: 'center',
      fixed: 'left',
      onCell: (_, index) => ({
        colSpan: (index as number) === 0 ? 3 : 1
      }),
      render: (_, __, index) => {
        return index > 0 ? index : <span className="text-primary">总计</span>;
      }
    },
    {
      title: '业务模式',
      fixed: 'left',
      dataIndex: 'businessModel',
      key: 'businessModel',
      align: 'center',
      width: 120,
      onCell: (_, index) => {
        if (index === 0) {
          return { colSpan: 0 };
        }

        return { colSpan: 1 };
      }
    },
    {
      title: '团队长',
      fixed: 'left',
      dataIndex: 'leaderName',
      key: 'leaderName',
      align: 'center',
      className: 'border-right',
      width: 100,
      onCell: (_, index) => {
        if (index === 0) {
          return { colSpan: 0 };
        }

        return { colSpan: 1 };
      }
    },
    ...titleCols,

    {
      title: '趋势',
      width: 130,
      fixed: 'right',
      align: 'center',
      render: (text: string, record) => {
        const { data1 = 0, data2 = 0, data3 = 0, data4 = 0, data5 = 0, data6 = 0 } = record;
        return (
          <div className="cursor" onClick={() => toDetailPage(record)} style={{ width: '100px', margin: '0 auto' }}>
            <SmallLineChart
              width="96px"
              height="22px"
              data={[data6, data5, data4, data3, data2, data1]}
              key={record.id}
            />
          </div>
        );
      }
    }
  ];
};
export const tableColumns2 = ({ titleList }: tableOperations): ColumnsType<ItemProps> => {
  const titleCols = useMemo(() => {
    return titleList.map((item: any) => ({
      title: item.label,
      width: 200,
      className: 'space-left',
      ellipsis: true,
      dataIndex: item.key
    }));
  }, [titleList]);

  return [
    {
      title: '排序',
      width: 80,

      align: 'center',
      fixed: 'left',
      render: (_, __, index) => {
        return index + 1;
      }
    },
    {
      title: '业务模式',
      fixed: 'left',
      dataIndex: 'businessModel',
      key: 'businessModel',
      align: 'center',
      width: 120
    },
    {
      title: '团队长',
      fixed: 'left',
      dataIndex: 'leaderName',
      key: 'leaderName',
      align: 'center',
      className: 'border-right',
      width: 100
    },
    ...titleCols
  ];
};

// 指标代码:
// avg_add_friend_count日人均加好友数
// avg_chat_friend_count日人均聊天客户数
// avg_circle_send_count日人均朋友圈发送数
// avg_market日人均营销平台调用数
// avg_smart日人均销售宝典调用数
// avg_cust_count日人均客户信息调用数
// avg_radar_count日人均客户雷达调用数
// avg_tag_count 日人均客户标签调用数
// avg_speech_count日人均我的收藏调用数
// avg_orc_count日人均文字识别调用数
// avg_rank_count日人均排行榜调用数

export type CodeListType = {
  key: string;
  dataCode?: string;
  title: string;
  children: {
    key: string;
    title: string;
    subTitle: string;
    tplType?: string;
    percentage?: boolean;
    children?: { key: string; title: string; subTitle: string; tplType?: string }[];
  }[];
}[];
export const dataCodeList: CodeListType = [
  {
    key: 'avg_add_friend_count',
    title: '加好友',
    children: [
      {
        key: 'avg_add_friend_count',
        title: '加好友',
        subTitle: '日均加好友数',
        tplType: 'table'
      },
      {
        key: 'avg_chat_friend_count',
        title: '客户联系',
        subTitle: '日人均联系客户数',
        tplType: 'table'
      },
      {
        key: 'day_nadd_friend_count',
        title: '净新增好友数',
        subTitle: '净新增好友数',
        tplType: 'line'
      },
      {
        key: 'day_add_friend_count',
        title: '添加好友数',
        subTitle: '添加好友数',
        tplType: 'line'
      },
      {
        key: 'total_friend_count',
        title: '总计好友数',
        subTitle: '总计好友数',
        tplType: 'line'
      },
      {
        key: 'new_apply_cnt',
        title: '客户经理昨日发起申请数',
        subTitle: '客户经理昨日发起申请数',
        tplType: 'line'
      },
      {
        key: 'day_distr_friend_count',
        title: '新接替客户数',
        subTitle: '新接替客户数',
        tplType: 'line'
      },
      {
        key: 'day_sdel_friend_count',
        title: '客户经理主动删除客户数',
        subTitle: '客户经理主动删除客户数',
        tplType: 'line'
      }
    ]
  },
  {
    key: 'chat_cnt',
    title: '消息互动',
    children: [
      {
        key: 'chat_cnt',
        title: '昨日聊天客户数',
        subTitle: '昨日聊天客户数',
        tplType: 'line'
      },
      {
        key: 'day_client_chat_rate',
        title: '总客户联系率',
        subTitle: '总客户联系率',
        tplType: 'line',
        percentage: true
      },
      {
        key: 'message_cnt',
        title: '客户经理发送信息条数',
        subTitle: '客户经理发送信息条数',
        tplType: 'line'
      },
      {
        key: 'reply_percentage',
        title: '客户经理已回复聊天占比',
        subTitle: '客户经理已回复聊天占比',
        tplType: 'line',
        percentage: true
      },
      {
        key: 'avg_reply_time',
        title: '客户经理平均首次回复时长',
        subTitle: '客户经理平均首次回复时长',
        tplType: 'line'
      },
      {
        key: 'day_client_chat_cnt',
        title: '客户消息条数',
        subTitle: '客户消息条数',
        tplType: 'line'
      },
      {
        key: 'day_clientreply_chat_cnt',
        title: '客户回复人数',
        subTitle: '客户回复人数',
        tplType: 'line'
      },
      {
        key: 'day_clientper_chat_cnt',
        title: '客户人均消息条数',
        subTitle: '客户人均消息条数',
        tplType: 'line'
      },
      {
        key: 'reply_staff_percentage',
        title: '客户经理回复占比',
        subTitle: '客户经理回复占比',
        tplType: 'line',
        percentage: true
      },
      {
        key: 'avg_clientreply_time',
        title: '客户平均首次回复时长',
        subTitle: '客户平均首次回复时长',
        tplType: 'line'
      },
      {
        key: 'reply_client_percentage',
        title: '客户回复占比',
        subTitle: '客户回复占比',
        tplType: 'line',
        percentage: true
      },
      {
        key: 'day_client_actchat_cnt',
        title: '客户主动发起聊天的客户数',
        subTitle: '客户主动发起聊天的客户数',
        tplType: 'line'
      }
    ]
  },
  {
    key: 'avg_circle_send_count',
    title: '朋友圈',
    children: [
      {
        key: 'avg_circle_send_count',
        title: '朋友圈',
        subTitle: '日人均朋友圈发送数'
      }
    ]
  },

  {
    key: 'avg_market',
    title: '营销平台',
    children: [
      {
        key: 'avg_market',
        title: '营销平台',
        subTitle: '日人均营销平台调用数'
      },
      {
        key: 'day_market',
        title: '营销平台使用数',
        subTitle: '营销平台使用数',
        tplType: 'line'
      },
      {
        key: 'day_market_client_cnt',
        title: '客户访问总人数',
        subTitle: '客户访问总人数',
        tplType: 'line'
      },
      {
        key: 'day_product_send_cnt',
        title: '产品',
        subTitle: '产品发送次数',
        tplType: 'line',
        children: [
          {
            key: 'day_product_send_cnt',
            title: '产品发送次数',
            subTitle: '产品发送次数'
          },
          {
            key: 'day_product_visclient_cnt',
            title: '客户访问产品人数',
            subTitle: '客户访问产品人数'
          }
        ]
      },
      {
        key: 'day_news_send_cnt',
        title: '文章',
        subTitle: '文章发送次数',
        tplType: 'line',
        children: [
          {
            key: 'day_news_send_cnt',
            title: '文章发送次数',
            subTitle: '文章发送次数'
          },
          {
            key: 'day_news_visclient_cnt',
            title: '文章客户访问人数',
            subTitle: '文章客户访问人数'
          }
        ]
      },
      {
        key: 'day_activity_send_cnt',
        title: '活动',
        subTitle: '活动发送次数',
        tplType: 'line',
        children: [
          {
            key: 'day_activity_send_cnt',
            title: '活动发送次数',
            subTitle: '活动发送次数'
          },
          {
            key: 'day_activity_visclient_cnt',
            title: '活动客户访问人数',
            subTitle: '活动客户访问人数'
          }
        ]
      },
      {
        key: 'day_station_share_cnt',
        title: '小站',
        subTitle: '小站分享次数',
        tplType: 'line',
        children: [
          {
            key: 'day_station_share_cnt',
            title: '小站分享次数',
            subTitle: '小站分享次数'
          },
          {
            key: 'day_station_vis_cnt',
            title: '小站客户访问次数',
            subTitle: '小站客户访问次数'
          }
        ]
      },
      {
        key: 'day_paper_send_cnt',
        title: '周报',
        subTitle: '周报发送次数',
        tplType: 'line',
        children: [
          {
            key: 'day_paper_send_cnt',
            title: '周报发送次数',
            subTitle: '周报发送次数'
          },
          {
            key: 'day_paper_vis_cnt',
            title: '周报客户访问次数',
            subTitle: '周报客户访问次数'
          }
        ]
      }
    ]
  },
  {
    key: 'avg_smart',
    title: '销售宝典',
    children: [
      {
        key: 'avg_smart',
        title: '销售宝典',
        subTitle: '日人均销售宝典调用数'
      }
    ]
  },

  {
    key: 'avg_cust_count',
    title: '客户信息',
    children: [
      {
        key: 'avg_cust_count',
        title: '客户信息',
        subTitle: '日人均客户信息调用数'
      },
      {
        key: 'avg_radar_count',
        title: '客户雷达',
        subTitle: '日人均客户雷达调用数'
      },
      {
        key: 'avg_cust_list_count',
        title: '客户列表',
        subTitle: '日人均客户列表调用数'
      },
      {
        key: 'avg_tag_count',
        title: '客户标签',
        subTitle: '日人均客户标签调用数'
      },
      {
        key: 'clienttagrate',
        title: '客户标签覆盖率',
        subTitle: '客户标签覆盖率',
        tplType: 'bar'
      }
    ]
  },
  {
    key: 'day_radar_count',
    title: '客户雷达',
    children: [
      {
        key: 'day_radar_count',
        title: '客户雷达',
        subTitle: '客户雷达访问次数',
        tplType: 'line'
      }
    ]
  },
  {
    key: 'videofinrate',
    title: '在线培训',
    children: [
      {
        key: 'videofinrate',
        title: '课程完成率',
        subTitle: '课程完成率',
        tplType: 'table'
      }
    ]
  },
  {
    key: 'avg_speech_count',
    title: '我的收藏',
    children: [
      {
        key: 'avg_speech_count',
        title: '我的收藏',
        subTitle: '日人均我的收藏调用数'
      }
    ]
  },
  {
    key: 'avg_orc_count',
    title: '文字识别',
    children: [
      {
        key: 'avg_orc_count',
        title: '文字识别',
        subTitle: '日人均文字识别调用数'
      }
    ]
  },
  {
    key: 'avg_rank_count',
    title: '排行榜',
    children: [
      {
        key: 'avg_rank_count',
        title: '排行榜',
        subTitle: '日人均排行榜调用数'
      }
    ]
  }
];

export enum TimeTypes {
  '最近30天' = 1,
  '最近6周' = 2,
  '最近6月' = 3
}
