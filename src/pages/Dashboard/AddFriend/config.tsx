import React from 'react';
import { ColumnsType } from 'antd/lib/table';
import { UNKNOWN } from 'src/utils/base';
import moment from 'moment';
import { SmallLineChart } from '../components/SamllLineChart/SmallLineChat';

interface ItemProps {
  id: string;
}
interface tableOperations {
  toDetailPage: (record: ItemProps) => void;
}
export const tableColumns = ({ toDetailPage }: tableOperations): ColumnsType<ItemProps> => {
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
        return index > 0 ? index + 1 : <span className="text-primary">总计</span>;
      }
    },
    {
      title: '业务模式',
      fixed: 'left',
      dataIndex: 'taskName1',
      key: 'taskName1',
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
      dataIndex: 'taskName2',
      key: 'taskName2',
      align: 'center',
      width: 80,
      onCell: (_, index) => {
        if (index === 0) {
          return { colSpan: 0 };
        }

        return { colSpan: 1 };
      }
    },
    {
      title: '12月人均',
      key: 'createTime1',
      dataIndex: 'createTime',
      className: 'borderLeft',
      render: (text: string) => {
        return <span>{text ? moment(text).format('YYYY-MM-DD HH:mm') : UNKNOWN}</span>;
      }
    },
    {
      title: '12月人均',
      key: 'createTime2',
      dataIndex: 'createTime',
      render: (text: string) => {
        return <span>{text ? moment(text).format('YYYY-MM-DD HH:mm') : UNKNOWN}</span>;
      }
    },
    {
      title: '12月人均',
      key: 'createTime3',
      dataIndex: 'createTime',
      render: (text: string) => {
        return <span>{text ? moment(text).format('YYYY-MM-DD HH:mm') : UNKNOWN}</span>;
      }
    },
    {
      title: '12月人均',
      key: 'createTime4',
      dataIndex: 'createTime',
      render: (text: string) => {
        return <span>{text ? moment(text).format('YYYY-MM-DD HH:mm') : UNKNOWN}</span>;
      }
    },
    {
      title: '12月人均',
      key: 'createTime5',
      dataIndex: 'createTime',
      render: (text: string) => {
        return <span>{text ? moment(text).format('YYYY-MM-DD HH:mm') : UNKNOWN}</span>;
      }
    },
    {
      title: '12月人均',
      key: 'createTime6',
      dataIndex: 'createTime',
      render: (text: string) => {
        return <span>{text ? moment(text).format('YYYY-MM-DD HH:mm') : UNKNOWN}</span>;
      }
    },

    {
      title: '趋势',
      width: 130,
      fixed: 'right',
      align: 'center',
      render: (text: string, record) => {
        return (
          <div className="cursor" onClick={() => toDetailPage(record)}>
            <SmallLineChart data={[1, 4, 8, 20, 14, 18, 40]} key={record.id} />
          </div>
        );
      }
    }
  ];
};
