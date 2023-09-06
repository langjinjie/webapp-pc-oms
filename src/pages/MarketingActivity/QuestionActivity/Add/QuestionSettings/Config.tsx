import React from 'react';
import { Button } from 'antd';
import { ColumnsType } from 'antd/lib/table';

export interface ITopicRow {
  activityId: string; // 是 活动id
  topicId: string; //  是 题目ID
  topicTitle: string; // 是 题目
  isRadio: number; // 是 是否单选
  topicType: number; // 是 题目类型：1、抽烟；2、体重比；3、家庭题目；4、普通单选多选；5、填空
  sort: number; //  题目排序
  score: number; //  分数
  lastUpdated: string; // yyyy-mm-dd hh:mm:ss
  updateBy: string; //
}

export const topicTypeList = [
  { id: 1, name: '抽烟' },
  { id: 2, name: '体重比' },
  { id: 3, name: '家庭题目' },
  { id: 4, name: '普通单选或者多选' },
  { id: 5, name: '填空' }
];

export const QuestionTableColumns: (arg: { edit: (row: any) => void }) => ColumnsType<any> = ({ edit }) => {
  return [
    {
      title: '顺序',
      render (_, __, index: number) {
        return <>{index + 1}</>;
      }
    },
    { title: '题目名称', dataIndex: 'topicTitle' },
    {
      title: '题型',
      render (value: ITopicRow) {
        return (
          <>
            {value.topicType === 4
              ? value.isRadio
                ? '单选'
                : '多选'
              : topicTypeList.find((findItem) => findItem.id === value.topicType)?.name}
          </>
        );
      }
    },
    { title: '分值', dataIndex: 'score' },
    { title: '操作人', dataIndex: 'updateBy' },
    { title: '更新时间', dataIndex: 'lastUpdated' },
    {
      title: '操作',
      render (row: any) {
        return (
          <>
            <Button type="link" onClick={() => edit(row)}>
              修改
            </Button>
          </>
        );
      }
    }
  ];
};
