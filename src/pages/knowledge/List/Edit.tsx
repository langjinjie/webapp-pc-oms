import { Button, Card, Cascader, Form, Input, message, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import InputShowLength from 'src/components/InputShowLength/InputShowLength';
import { SetUserRightFormItem } from 'src/pages/Marketing/Components/SetUserRight/SetUserRight';
import { NgEditor } from 'src/components';
import { addWiki, editWiki, getCategoryList, getWikiDetail } from 'src/apis/knowledge';
import { urlSearchParams } from 'src/utils/base';

const KnowledgeEdit: React.FC<RouteComponentProps> = ({ history, location }) => {
  const [editForm] = Form.useForm();
  const [isSubmitting] = useState(false);
  const [isView, setIsView] = useState(0);
  const [formData, setFormData] = useState<any>({ content: '', contentChanged: '' });
  const [categories, setCategories] = useState<any[]>([]);

  const getCategory = async () => {
    const res = await getCategoryList();
    if (res) {
      const { list } = res;
      setCategories(list.map((item: any) => ({ isLeaf: !!item.lastLevel, ...item })));
      return list.map((item: any) => ({ isLeaf: !!item.lastLevel, ...item }));
    }
  };

  const getDetail = async (wikiId?: string) => {
    if (wikiId) {
      const res = await getWikiDetail({ wikiId: wikiId });
      const { descrition, title, content, level1CategroyId, level2CategroyId, groupId } = res;
      setFormData((formData: any) => ({ ...formData, ...res }));
      editForm.setFieldsValue({
        categroyId: level2CategroyId ? [level1CategroyId, level2CategroyId] : [level1CategroyId],
        desc: descrition,
        title,
        groupId,
        content
      });
    } else {
      const { id, isView } = urlSearchParams(location.search);
      setIsView(Number(isView) || 0);
      if (id) {
        const res = await getWikiDetail({ wikiId: id });
        const { descrition, title, content, level1CategroyId, level2CategroyId, level2Name, groupId } = res;
        setFormData((formData: any) => ({ ...formData, ...res, contentChanged: content }));
        editForm.setFieldsValue({
          categroyId: level2CategroyId ? [level1CategroyId, level2CategroyId] : [level1CategroyId],
          desc: descrition,
          title,
          groupId,
          content
        });
        const categoryList = await getCategory();

        categoryList.map((item: any) => {
          if (item.categroyId === level1CategroyId) {
            item.children = [
              {
                categroyId: level2CategroyId,
                name: level2Name
              }
            ];
          }
          return item;
        });
        setCategories(categoryList);
      } else {
        getCategory();
      }
    }
  };
  const loadData = async (selectedOptions: any) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;

    // 异步加载子类目
    const res = await getCategoryList({ parentId: targetOption.categroyId });

    targetOption.loading = false;
    if (res) {
      const { list } = res;
      list.map((item: any) => {
        item.isLeaf = !!item.lastLevel;

        return item;
      });
      targetOption.children = list;
    }
    setCategories([...categories]);
  };

  useEffect(() => {
    getDetail();
  }, []);

  const onFinish = async (values: any) => {
    delete values.group1;
    delete values.isSet;
    delete values.group2;
    delete values.groupType;
    const { categroyId, groupId, ...otherValues } = values;
    const wikiId = formData.wikiId;
    // 内容必填检验
    if (!formData.contentChanged) return false;
    if (wikiId) {
      const res = await editWiki({
        categroyId: categroyId[categroyId.length - 1],
        ...otherValues,
        wikiId,
        content: formData.contentChanged || formData.content,
        groupId: groupId || ''
      });
      if (res) {
        message.success('编辑成功');
        getDetail();
      }
    } else {
      const res = await addWiki({
        categroyId: categroyId[categroyId.length - 1],
        ...otherValues,
        content: formData.contentChanged || formData.content,
        groupId: groupId || ''
      });
      if (res) {
        message.success('创建成功');
        // history.goBack();
        history.replace('/knowledge/edit?id=' + res.wikiId);
        getDetail(res.wikiId);
      }
    }
  };

  const editorChange = (content: string) => {
    setFormData((formData: any) => ({ ...formData, contentChanged: content }));
  };
  return (
    <div className="container edit">
      <Card bordered={false} title={`${isView ? '查看' : '编辑'}知识库内容`}>
        <Form form={editForm} onFinish={onFinish}>
          <Form.Item label="目录信息" name={'categroyId'} rules={[{ required: true, message: '请选择目录信息' }]}>
            <Cascader
              placeholder="请选择"
              className="width420"
              fieldNames={{ label: 'name', value: 'categroyId', children: 'children' }}
              options={categories}
              loadData={loadData}
            ></Cascader>
          </Form.Item>
          <Form.Item label="知识库标题" name="title" rules={[{ required: true, message: '请输入知识库标题' }]}>
            <InputShowLength maxLength={50} className="width320" />
          </Form.Item>
          <Form.Item label="知识库描述" name="desc">
            <Input.TextArea className="width400" maxLength={100} showCount></Input.TextArea>
          </Form.Item>
          <Form.Item
            label="知识库正文"
            required
            validateStatus="error"
            help={!formData.contentChanged ? '请输入文章内容' : ''}
          >
            <NgEditor value={formData.content} onChange={editorChange} />
          </Form.Item>
          <Form.Item label="配置可见范围" name={'groupId'}>
            <SetUserRightFormItem form={editForm} />
          </Form.Item>
          <Form.Item label="知识库分词结果">
            {formData?.segWords?.split(',').map((item: string) => (
              <span className="tag" key={item}>
                {item}
              </span>
            ))}
          </Form.Item>
          <Form.Item label="有用点击数">{formData.openCount}</Form.Item>
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
                {isView ? '返回' : '取消'}
              </Button>
              {!isView && (
                <Button shape="round" type="primary" htmlType="submit" loading={isSubmitting}>
                  确定
                </Button>
              )}
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default KnowledgeEdit;
