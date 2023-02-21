import { Button, Card, Cascader, Form, Input, message, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import InputShowLength from 'src/components/InputShowLength/InputShowLength';
import { SetUserRightFormItem } from 'src/pages/Marketing/Components/SetUserRight/SetUserRight';
import { NgEditor } from 'src/components';
import { addWiki, getCategoryList } from 'src/apis/knowledge';

const KnowledgeEdit: React.FC<RouteComponentProps> = ({ history }) => {
  const [editForm] = Form.useForm();
  const [isSubmitting] = useState(false);
  const [formData, setFormData] = useState<any>({ content: '', contentChanged: '' });
  const [categories, setCategories] = useState<any[]>([]);

  const getCategory = async () => {
    const res = await getCategoryList();
    if (res) {
      const { list } = res;
      setCategories(list.map((item: any) => ({ isLeaf: !!item.lastLevel, ...item })));
    }
  };
  const loadData = async (selectedOptions: any) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;

    console.log(targetOption);

    // 异步加载子类目
    const res = await getCategoryList({ parentId: targetOption.categroyId });

    targetOption.loading = false;
    if (res) {
      const { list } = res;
      list.map((item: any) => {
        item.isLeaf = !!item.lastLevel;
        console.log(item);

        return item;
      });
      targetOption.children = list;
    }
    console.log(categories);

    setCategories([...categories]);
  };

  useEffect(() => {
    getCategory();
  }, []);

  const onFinish = async (values: any) => {
    console.log(values);
    const { categroyId, ...otherValues } = values;
    const res = await addWiki({
      categroyId: categroyId[categroyId.length - 1],
      ...otherValues,
      content: formData.contentChanged,
      groupId: ''
    });
    if (res) {
      message.success('创建成功');
      history.goBack();
    }
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
              fieldNames={{ label: 'name', value: 'categroyId', children: 'children' }}
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
