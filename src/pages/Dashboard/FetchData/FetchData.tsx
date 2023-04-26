import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { getSqlConfigList, execSqlConfig, delSqlConfig } from 'src/apis/dashboard';
import { AuthBtn, NgFormSearch, NgModal } from 'src/components';
import NewTableComponent, { MyPaginationProps } from 'src/components/TableComponent/TableComponent';
import { OperateType } from 'src/utils/interface';
import { FetchDataRecordType, searchCols, TableColumnFun } from './Config';

const FetchData: React.FC<RouteComponentProps> = ({ history }) => {
  const [dataSource, setDataSource] = useState([]);
  const [currentSql, setCurrentSql] = useState<FetchDataRecordType>();
  const [sqlFrom] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [pagination, setPagination] = useState<MyPaginationProps>({
    pageNum: 1,
    total: 0
  });

  const getList = async (params?: any) => {
    const res = await getSqlConfigList({
      pageNum: 1,
      pageSize: 10,
      ...params
    });
    if (res) {
      setDataSource(res.list);
      setPagination((pagination) => ({ ...pagination, pageNum: params?.pageNum || 1, total: res.total }));
    }
  };
  const onSearch = (values: any) => {
    getList({ ...values, pageNum: 1 });
  };

  useEffect(() => {
    getList();
  }, []);
  const onAdd = () => {
    history.push('/fetchData/add');
  };

  const onOperate = async (type: OperateType, record: FetchDataRecordType, index?: number) => {
    switch (type) {
      case 'edit':
        history.push('/fetchData/add?id=' + record.sqlId);
        break;
      // 执行脚本
      case 'other':
        setVisible(true);
        setCurrentSql(record);
        sqlFrom.setFieldsValue(record);
        break;
      // 查看脚本执行结果
      case 'view':
        history.push('/fetchData/download?tmp=' + record.name);
        break;
      case 'delete':
        // eslint-disable-next-line no-case-declarations
        const res = await delSqlConfig({
          sqlId: record.sqlId
        });
        if (res) {
          const copyData = [...dataSource];
          copyData.splice(index!, 1);
          setDataSource(copyData);
          setPagination({ ...pagination, total: pagination.total! - 1 });
        }
        break;
    }
  };

  const confirmExecute = () => {
    //
    sqlFrom.validateFields().then((values) => {
      Modal.confirm({
        title: '是否确定执行该取数模版',
        onOk: async () => {
          setVisible(false);
          const res = await execSqlConfig({
            sqlId: currentSql?.sqlId as string,
            params: values.params?.map((item: any) => ({
              paramValue: item.paramValue,
              paramId: item.paramId
            }))
          });
          if (res) {
            message.success('模版已执行，可前往下载');
          }
        }
      });
    });
  };
  return (
    <div className="container">
      <AuthBtn path="/add">
        <Button
          type="primary"
          shape="round"
          icon={<PlusOutlined />}
          onClick={() => {
            onAdd();
          }}
          size="large"
        >
          创建模板
        </Button>
      </AuthBtn>
      <AuthBtn path="/query">
        <NgFormSearch className="mt30" onSearch={onSearch} searchCols={searchCols} />
      </AuthBtn>
      <NewTableComponent<FetchDataRecordType>
        className="mt20"
        loadData={getList}
        dataSource={dataSource}
        pagination={pagination}
        rowKey={'sqlId'}
        columns={TableColumnFun(onOperate)}
      />
      <NgModal width={600} visible={visible} onCancel={() => setVisible(false)} title="执行" onOk={confirmExecute}>
        <Form form={sqlFrom} labelCol={{ span: 4 }}>
          <Form.List name={'params'}>
            {(fields) => (
              <>
                {fields.map(({ name, key }, index) => {
                  return (
                    <div key={key}>
                      <Form.Item
                        label={'参数' + (index + 1)}
                        rules={[{ required: true }]}
                        name={[name, 'paramValue']}
                        extra={'参数描述：' + currentSql?.params[index]?.paramDesc}
                      >
                        <Input />
                      </Form.Item>
                    </div>
                  );
                })}
              </>
            )}
          </Form.List>
          <Form.Item name="name" label="模板名称">
            <Input disabled></Input>
          </Form.Item>
          <Form.Item name="des" label="模板描述">
            <Input type="text" disabled />
          </Form.Item>
          <Form.Item name="content" label="模板内容">
            <Input.TextArea rows={5} disabled></Input.TextArea>
          </Form.Item>
        </Form>
      </NgModal>
    </div>
  );
};

export default FetchData;
