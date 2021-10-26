import React, { useEffect, useState } from 'react';
import { Button, Cascader, Form, Input, message, Select } from 'antd';

import styles from './style.module.less';
import { RouteComponentProps } from 'react-router';
import { URLSearchParams } from 'src/utils/base';
import { getPosterCategoryList, getPosterDetail, getPosterTagList, savePoster } from 'src/apis/marketing';
import { Poster } from './Config';
import { useForm } from 'antd/es/form/Form';
import NgUpload from '../Components/Upload/Upload';
import { RcFile } from 'antd/lib/upload';

const PosterEdit: React.FC<RouteComponentProps> = ({ location, history }) => {
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
    const { typeIds = [], tags = [] } = values;
    let postData: any = {};
    if (poster) {
      postData = {
        ...poster,
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
      history.push('/marketingPoster');
    }
  };

  const beforeUpload = (file: RcFile): Promise<boolean> => {
    console.log(file);
    const isJpg = file.type === 'image/jpeg';
    if (!isJpg) {
      message.error('你只可以上传 JPG 文件!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过 2MB!');
    }
    let isW750 = false;
    // 读取图片数据

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        // @ts-ignore
        const data = e.target.result;
        // 加载图片获取图片真实宽度和高度
        const image = new Image();
        // @ts-ignore
        image.src = data;
        image.onload = function () {
          const width = image.width;
          // const height = image.height;
          isW750 = width === 750;
          if (!isW750) {
            message.error('海报宽度必须为 750px');
          }
          resolve(isJpg && isLt2M && isW750);
        };
      };
      reader.readAsDataURL(file);
    });
  };
  return (
    <div className={styles.pa20}>
      <Form labelCol={{ span: 3 }} wrapperCol={{ span: 8 }} form={myForm} onFinish={onSubmit}>
        <Form.Item label="海报名称" name="name" rules={[{ required: true }, { max: 60, message: '最多60个字符' }]}>
          <Input type="text" />
        </Form.Item>
        <Form.Item label="海报ID" name="exterPosterId" rules={[{ max: 60, message: '最多60个字符' }]}>
          <Input type="text" />
        </Form.Item>
        <Form.Item
          label="海报样式"
          name="imgUrl"
          rules={[{ required: true }]}
          extra={'为确保最佳展示效果，请上传宽度为750像素的高清图片，仅支持.jpg格式'}
        >
          <NgUpload beforeUpload={beforeUpload} />
        </Form.Item>
        <Form.Item label="分类" name={'typeIds'} rules={[{ required: true }]}>
          <Cascader options={categoryList} fieldNames={{ label: 'name', value: 'typeId', children: 'childs' }} />
        </Form.Item>
        <Form.Item label="标签" name={'tags'} rules={[{ required: true }]}>
          <Select mode="multiple" placeholder="待添加">
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
