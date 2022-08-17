import React from 'react';
import { Button, Image, Space } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import classNames from 'classnames';

export const searchColsFun = (options: any[]): SearchCol[] => {
  return [
    {
      name: 'nodeCode',
      type: 'input',
      label: '专题名称',
      width: '180px',
      placeholder: '请输入'
    },
    {
      name: 'nodeTypeCode',
      type: 'select',
      label: '状态',
      placeholder: '请输入',
      width: 180,
      selectNameKey: 'typeName',
      selectValueKey: 'typeCode',
      options: options
    }
  ];
};

export interface NodeColumns {
  nodeId: string;
  nodeCode: string;
  typeName: string;
  nodeName: string;
  createBy: string;
  createTime: string;
}

interface OperateProps {
  onOperate: (nodeId: string, index: number) => void;
}
export const tableColumnsFun = (args: OperateProps): ColumnsType<NodeColumns> => {
  return [
    { title: '专题名称', dataIndex: 'nodeCode', key: 'nodeCode', width: 200 },
    {
      title: '展示模版',
      dataIndex: 'typeName',
      key: 'typeName',
      width: 200
    },
    {
      title: '专题图片',
      dataIndex: 'nodeName',
      width: 180,
      key: 'nodeName',
      ellipsis: true,
      render: (categoryName: string) => <Image src={categoryName} />
    },
    {
      title: '内容数量',
      dataIndex: 'nodeDesc',
      width: 180,
      key: 'nodeDesc',
      ellipsis: true
    },
    {
      title: '创建人',
      dataIndex: 'createBy',
      width: 100
    },

    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 260
    },
    {
      title: '状态',
      dataIndex: 'createTime',
      width: 260,
      render: (status) => {
        return (
          <span>
            <i
              className={classNames('status-point', [
                {
                  'status-point-gray': status === 0,
                  'status-point-green': status === 1
                }
              ])}
            ></i>
            {status === 1 ? '已上架' : '已下架'}
          </span>
        );
      }
    },
    {
      title: '操作',
      width: 260,
      align: 'center',
      fixed: 'right',
      render: (value, record, index) => {
        return (
          <Space>
            <Button type="link" onClick={() => args.onOperate(record.nodeId, index)}>
              上架
            </Button>
            <Button type="link">编辑</Button>
            <Button type="link">配置内容</Button>
            <Button type="link">置顶</Button>
          </Space>
        );
      }
    }
  ];
};
