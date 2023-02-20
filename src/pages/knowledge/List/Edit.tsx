import { Button, Card, Cascader, Form, Input, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import InputShowLength from 'src/components/InputShowLength/InputShowLength';
import { SetUserRightFormItem } from 'src/pages/Marketing/Components/SetUserRight/SetUserRight';
import { NgEditor } from 'src/components';
import { getCategoryList } from 'src/apis/knowledge';

const KnowledgeEdit: React.FC<RouteComponentProps> = ({ history }) => {
  const [editForm] = Form.useForm();
  const [isSubmitting] = useState(false);
  const [formData, setFormData] = useState<any>({ content: '', contentChanged: '' });
  const [categories, setCategories] = useState<any[]>([]);

  const getCategory = async () => {
    const res = await getCategoryList();
    if (res) {
      setCategories(res.list || []);
    }
    console.log(res);
  };
  const loadData = async (selectedOptions: any) => {
    console.log(selectedOptions);

    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;

    // 异步加载子类目
    const res = await getCategoryList({ sceneId: targetOption.sceneId, catalogId: targetOption.catalogId });

    targetOption.loading = false;
    if (res) {
      res.forEach((item: any) => {
        if (item.lastLevel === 0) {
          item.isLeaf = false;
        }
      });
      targetOption.children = res;
    }
    setCategories([...categories]);
  };

  useEffect(() => {
    getCategory();
  }, []);

  const onFinish = (values: any) => {
    console.log(values);
  };

  const editorChange = (content: string) => {
    setFormData((formData: any) => ({ ...formData, contentChanged: content }));
  };
  return (
    <div className="container edit">
      <Card bordered={false} title="新建知识库内容">
        <Form form={editForm} onFinish={onFinish}>
          <Form.Item label="目录信息" name={'categroyId'}>
            <Cascader
              placeholder="请选择"
              className="width420"
              fieldNames={{ label: 'name', value: 'catalogId', children: 'children' }}
              options={categories}
              loadData={loadData}
            ></Cascader>
          </Form.Item>
          <Form.Item label="知识库标题" name="title">
            <InputShowLength maxLength={30} className="width320" />
          </Form.Item>
          <Form.Item label="知识库描述" name="desc">
            <Input.TextArea className="width400" maxLength={100} showCount></Input.TextArea>
          </Form.Item>
          <Form.Item label="知识库正文">
            <NgEditor value={formData.content} onChange={editorChange} />
          </Form.Item>
          <Form.Item label="配置可见范围" name={'groupId'}>
            <SetUserRightFormItem form={editForm} />
          </Form.Item>
          <Form.Item label="知识库分词结果"></Form.Item>
          <Form.Item label="客户经理有用点击数"></Form.Item>
          <Form.Item className="formFooter mt40">
            <Space size={36} style={{ marginLeft: '140px' }}>
              <Button
                shape="round"
                type="primary"
                ghost
                onClick={() => {
                  history.goBack();
                }}
              >
                取消
              </Button>
              <Button shape="round" type="primary" htmlType="submit" loading={isSubmitting}>
                确定
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default KnowledgeEdit;
