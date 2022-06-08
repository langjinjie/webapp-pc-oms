import React, { useMemo } from 'react';
import { ColumnsType } from 'antd/lib/table';
import { SmallLineChart } from '../components/SamllLineChart/SmallLineChat';

export interface ItemProps {
  id: string;
  [propKey: string]: any;
}
interface tableOperations {
  toDetailPage: (record: ItemProps) => void;
  titleList: any[];
}
export const tableColumns = ({ toDetailPage, titleList }: tableOperations): ColumnsType<ItemProps> => {
  const titleCols = useMemo(() => {
    return titleList.map((item: any) => ({
      title: item.label,
      width: 120,
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
      width: 80,
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
          <div className="cursor" onClick={() => toDetailPage(record)}>
            <SmallLineChart width="96px" data={[data6, data5, data4, data3, data2, data1]} key={record.id} />
          </div>
        );
      }
    }
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
        subTitle: '日均加好友数'
      },
      {
        key: 'avg_chat_friend_count',
        title: '客户联系',
        subTitle: '日人均联系客户数'
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
    key: 'avg_circle_send_count',
    title: '朋友圈1',
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
      // {
      //   key: '',
      //   title: '客户列表',
      //   subTitle: '日人均客户列表调用数'
      // },
      {
        key: 'avg_tag_count',
        title: '客户标签',
        subTitle: '日人均客户标签调用数'
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
