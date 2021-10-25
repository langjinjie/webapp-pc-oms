import React, { useEffect, useState, useMemo } from 'react';
import { Button, Cascader, Form, Input, message, Select } from 'antd';

import styles from './style.module.less';
import { RouteComponentProps } from 'react-router';
import { URLSearchParams } from 'src/utils/base';
import { getPosterCategoryList, getPosterDetail, getPosterTagList, savePoster } from 'src/apis/marketing';
import { Poster } from './Config';
import { useForm } from 'antd/es/form/Form';
import NgUpload from '../Components/Upload/Upload';
const getParentIds = (id: string, data: any[]) => {
  // 深度遍历查找
  const dfs = (data: any[], id: string, parents: any[]) => {
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      // 找到id则返回父级id
      if (item.id === id) return parents;
      // children不存在或为空则不递归
      if (!item.children || !item.children.length) continue;
      // 往下查找时将当前id入栈
      parents.push(item.id);

      if (dfs(item.children, id, parents).length) return parents;
      // 深度遍历查找未找到时当前id 出栈
      parents.pop();
    }
    // 未找到时返回空数组
    return [];
  };

  return dfs(data, id, []);
};
const PosterEdit: React.FC<RouteComponentProps> = ({ location }) => {
  const [isView, setIsView] = useState(false);
  const [poster, setPoster] = useState<Poster | null>(null);
  const [categoryList, setCategoryList] = useState<any[]>([]);
  const [tagList, setTagList] = useState<any[]>([]);
  const [myForm] = useForm();
  const getDetail = async (id: string) => {
    const res = await getPosterDetail({
      posterId: id
    });
    if (res) {
      setPoster(res);
      myForm.setFieldsValue({
        ...res,
        typeIds: res.fatherTypeId !== '0' ? [res.fatherTypeId, res.typeId] : [res.typeId],
        tags: res.tags?.split(',')
      });
    }
  };
  useMemo(() => {
    if (poster && categoryList.length > 0) {
      const res = getParentIds(poster?.typeId || '', categoryList);
      console.log(res);
    }
  }, [poster, categoryList]);
  const getTagList = async () => {
    const res = (await getPosterTagList({})) || [];
    if (res) {
      setTagList(res);
    }
  };
  const getCategoryList = async () => {
    const res = (await getPosterCategoryList({})) || [];
    setCategoryList(res);
  };

  useEffect(() => {
    getCategoryList();
    getTagList();
    const { id, viewport } = URLSearchParams(location.search);
    if (id && viewport) {
      setIsView(true);
    }
    if (id && typeof id === 'string') {
      getDetail(id);
    }
  }, []);
  const onSubmit = async (values: any) => {
    console.log(values);
    const { typeIds = [], tags = [] } = values;
    let postData: any = {};
    if (poster) {
      postData = {
        ...values,
        typeId: typeIds.pop(),
        corpId: poster?.corpId,
        posterId: poster.posterId,
        tags: tags.join(',')
      };
    } else {
      postData = {
        ...values,
        typeId: typeIds.pop(),
        posterId: '',
        tags: tags.join(',')
      };
    }
    const res = await savePoster(postData);
    if (res) {
      message.success('保存成功');
    }
    console.log(res);
  };
  return (
    <div className={styles.pa20}>
      <Form labelCol={{ span: 3 }} wrapperCol={{ span: 8 }} form={myForm} onFinish={onSubmit}>
        <Form.Item label="海报名称" name="name" rules={[{ required: true }]}>
          <Input type="text" />
        </Form.Item>
        <Form.Item label="文章ID">
          <Input type="text" />
        </Form.Item>
        <Form.Item label="海报样式" name="imgUrl" rules={[{ required: true }]}>
          <NgUpload />
        </Form.Item>
        <Form.Item label="分类" name={'typeIds'} rules={[{ required: true }]}>
          <Cascader options={categoryList} fieldNames={{ label: 'name', value: 'typeId', children: 'childs' }} />
        </Form.Item>
        <Form.Item label="标签" name={'tags'} rules={[{ required: true }]}>
          <Select mode="multiple">
            {tagList.map((tag) => (
              <Select.Option key={tag.name} value={tag.name}>
                {tag.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="营销话术" name={'speechcraft'} rules={[{ required: true }]}>
          <Input.TextArea placeholder="待输入" maxLength={300} showCount />
        </Form.Item>

        {!isView && (
          <Form.Item wrapperCol={{ offset: 3 }}>
            <Button type="primary" shape="round" htmlType="submit">
              添加
            </Button>
          </Form.Item>
        )}
      </Form>
    </div>
  );
};
export default PosterEdit;
