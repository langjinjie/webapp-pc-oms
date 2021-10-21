/**
 * @Descripttion: 产品库
 * @version: 1.0.0
 * @Author: Jser
 * @Date: 2021-05-27 14:16:59
 */

import React, { useState, Fragment, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useDidRecover } from 'react-router-cache-route';
import { PlusOutlined } from '@ant-design/icons';
import { Row, Col, Form, Select, Button, Space, Card, Input, message, Popconfirm } from 'antd';
import moment from 'moment';
import classNames from 'classnames';

import { NgTable } from 'src/components';

import style from './style.module.less';

import { FormInstance } from 'antd/lib/form';
import { activityList, activityManage } from 'src/apis/marketing';

// 状态
const statusHanlde = (status: number | undefined | null) => {
  switch (status) {
    case 1:
      return '未上架';
    case 2:
      return '已上架';
    case 3:
      return '已下架';
    default:
      return '---';
  }
};

enum OperateTypes {
  '上架' = 1,
  '下架' = 2,
  '删除' = 3,
}
const ActivityLibrary: React.FC<RouteComponentProps> = ({ history }) => {
  const [form] = Form.useForm();
  const { Option } = Select;

  const formRef = React.createRef<FormInstance>();

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
  };

  const [statusList] = useState<any[]>([
    { label: '全部', value: '' },
    { label: '未上架', value: 1 },
    { label: '已上架', value: 2 },
    { label: '已下架', value: 3 }
  ]);

  interface paramsType {
    activityName: String;
    status: String;
    pageNum: number;
    pageSize: number;
  }
  const [params, setParams] = useState<paramsType>({
    activityName: '',
    status: '',
    pageNum: 1,
    pageSize: 10
  });

  interface paginationType {
    current: number;
    pageSize: number;
    showPagination: boolean;
    showQuickJumper: boolean;
    showSizeChanger: boolean;
    total: number;
  }
  const [pagination, setPagination] = useState<paginationType>({
    current: 1,
    pageSize: 10,
    showPagination: false, // 是否要展示分页
    showQuickJumper: true,
    showSizeChanger: true,
    total: 0
  });
  const [dataSource, setDataSource] = useState<any[]>([]);
  // 查询活动列表
  const getExcelListByParams = async (queryParams: any) => {
    const res: any = await activityList({ ...params, ...queryParams });
    if (res) {
      setDataSource(res.list);

      setPagination((pagination) => ({ ...pagination, total: res.total }));
    }
  };

  // 监听页面是否需要刷新
  useDidRecover(() => {
    if (window.location.href.indexOf('pageNum') > 0) {
      setPagination((pagination) => ({ ...pagination, current: 1 }));
      getExcelListByParams({ pageNum: 1 });
      history.replace('/activityLibrary', {});
    }
  });

  // 查看
  const viewItem = (activityId: string) => {
    history.push('/activityLibrary/activityConfig?activityId=' + activityId + '&isView=' + true);
  };

  // 重置
  const onReset = () => {
    formRef.current!.resetFields();
    setParams({
      activityName: '',
      status: '',
      pageNum: 1,
      pageSize: 10
    });
    setPagination({
      current: 1,
      pageSize: 10,
      showPagination: false, // 是否要展示分页
      showQuickJumper: true,
      showSizeChanger: true,
      total: 0
    });
    getExcelListByParams({ pageNum: 1, status: '', activityName: '' });
  };

  const handleOperate = async (operateType: number, activityId: string, index: number) => {
    // 获取操作类型
    const opreateTitle = OperateTypes[operateType];
    if (operateType === 0) {
      // 编辑
      history.push('/activityLibrary/activityConfig?activityId=' + activityId);
    } else {
      const res = await activityManage({ activityId, type: operateType });
      if (res) {
        message.success(`${opreateTitle}成功！`);
        const copyData = [...dataSource];
        if (operateType === 1) {
          copyData[index].onlineTime = new Date();
          copyData[index].status = 2;
          setDataSource(copyData);
        } else if (operateType === 2) {
          copyData[index].offlineTime = new Date();
          copyData[index].status = 3;
          setDataSource(copyData);
        } else {
          onReset();
        }
      }
    }
  };
  // 分页处理
  const handleTableChange = ({ pageSize, current }: { pageSize?: number; current: number }) => {
    setParams((params) => ({ ...params, pageNum: current, pageSize: pageSize || 10 }));
    setPagination((pagination) => ({ ...pagination, current, pageSize: pageSize || 10 }));
    getExcelListByParams({ pageNum: current, pageSize: pageSize || 10 });
  };
  const addHandle = () => {
    history.push('/marketing/activity/edit');
  };

  // 点击查询按钮
  const onFinish = async (fieldsValue: any) => {
    console.log('fieldsValue', fieldsValue);
    const { activityName, status } = fieldsValue;
    setParams({
      ...params,
      status: status || null,
      activityName: activityName || null
    });
    setPagination({
      ...pagination,
      current: 1
    });
    getExcelListByParams({ pageNum: 1, activityName, status });
  };

  useEffect(() => {
    getExcelListByParams({});
  }, []);
  const columns = [
    {
      title: '活动名称',
      dataIndex: 'activityName',
      width: 300
    },
    {
      title: '创建人',
      dataIndex: 'createBy'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: (text: string) => {
        return <span>{(text && moment(text).format('YYYY-MM-DD HH:mm')) || '---'}</span>;
      }
    },
    {
      title: '上架时间',
      dataIndex: 'onlineTime',
      render: (text: string) => {
        return <span>{(text && moment(text).format('YYYY-MM-DD HH:mm')) || '---'}</span>;
      }
    },
    {
      title: '下架时间',
      dataIndex: 'offlineTime',
      render: (text: string) => {
        return <span>{(text && moment(text).format('YYYY-MM-DD HH:mm')) || '---'}</span>;
      }
    },
    {
      title: '活动状态',
      dataIndex: 'status',
      className: 'status-color',
      render: (status: number) => {
        return (
          <a className="status-color">
            <i
              className={classNames(
                'status-point',
                status === 1 ? 'status-point' : status === 2 ? 'status-point-green' : 'status-point-gray'
              )}
            ></i>
            {statusHanlde(status)}
          </a>
        );
      }
    },
    {
      title: '操作',
      dataIndex: 'status',
      width: 200,
      align: 'left',
      fixed: 'right',
      render: (status: number, record: any, index: number) => (
        <Space size={10} className="spaceWrap">
          <Button type="link" onClick={() => viewItem(record.activityId)}>
            查看
          </Button>
          {status === 1 && (
            <Button
              title={record.isOwner === '0' ? '非创建者不可编辑' : ''}
              type="link"
              onClick={() => handleOperate(0, record.activityId, index)}
              disabled={record.isOwner === '0'}
            >
              编辑
            </Button>
          )}

          {(status === 3 || status === 1) && (
            <Popconfirm
              title="确定要上架?"
              onConfirm={() => handleOperate(1, record.activityId, index)}
              disabled={record.isOwner === '0'}
            >
              <Button
                title={record.isOwner === '0' ? '非创建者不可操作' : ''}
                type="link"
                disabled={record.isOwner === '0'}
              >
                上架
              </Button>
            </Popconfirm>
          )}
          {status === 2 && (
            <Popconfirm
              title="确定要下架?"
              onConfirm={() => handleOperate(2, record.activityId, index)}
              disabled={record.isOwner === '0'}
            >
              <Button
                type="link"
                title={record.isOwner === '0' ? '非创建者不可操作' : ''}
                disabled={record.isOwner === '0'}
              >
                下架
              </Button>
            </Popconfirm>
          )}
          {status === 3 && (
            <Popconfirm
              title="确定要删除?"
              onConfirm={() => handleOperate(3, record.activityId, index)}
              disabled={record.isOwner === '0'}
            >
              <Button
                type="link"
                title={record.isOwner === '0' ? '非创建者不可操作' : ''}
                disabled={record.isOwner === '0'}
              >
                删除
              </Button>
            </Popconfirm>
          )}
        </Space>
      )
    }
  ];

  return (
    <Fragment>
      <div className={style.addFriendBox}>
        <Card title="活动库列表" bordered={false}>
          <div className={style.addFriendContent}>
            <div className={style.addFriendPanel}>
              <Button
                type="primary"
                onClick={addHandle}
                shape="round"
                icon={<PlusOutlined />}
                size="large"
                style={{ width: 128 }}
              >
                添加
              </Button>
            </div>
            <div className={style.addFriendSearchBox}>
              <Form {...layout} ref={formRef} labelAlign="left" form={form} name="control-hooks" onFinish={onFinish}>
                <Row gutter={24}>
                  <Col className="gutter-row" span={7}>
                    <Form.Item name="activityName" label="活动名称：">
                      <Input placeholder="请输入" allowClear />
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" span={5}>
                    <Form.Item name="status" label="状态：">
                      <Select placeholder="请选择" allowClear>
                        {statusList.map((item, index) => {
                          return (
                            <Option key={index} value={item.value}>
                              {item.label}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" span={5}>
                    <Form.Item {...layout}>
                      <Button type="primary" shape="round" htmlType="submit">
                        查询
                      </Button>
                      <Button htmlType="button" shape="round" onClick={onReset} style={{ marginLeft: 10 }}>
                        重置
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </div>
            <div className={style.tableBox}>
              <NgTable
                rowKey="activityId"
                configData={{ columns, dataSource, pagination }}
                handleTableChange={handleTableChange}
                scroll={{ x: 1200 }}
              />
            </div>
          </div>
        </Card>
      </div>
    </Fragment>
  );
};
export default ActivityLibrary;
