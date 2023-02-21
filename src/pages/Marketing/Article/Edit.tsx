import React, { useEffect, useState } from 'react';
import { PageHeader, Divider, Form, Radio, RadioChangeEvent } from 'antd';
import { RouteComponentProps } from 'react-router-dom';
import { urlSearchParams, useDocumentTitle } from 'src/utils/base';

import TabView1 from './Components/TabView1';
import TabView2 from './Components/TabView2';
import TabView3 from './Components/TabView3';
import style from './style.module.less';

interface tabsPorps {
  isEdit: boolean;
  newsId: string;
}
const MyTabs: React.FC<tabsPorps> = ({ isEdit, newsId }) => {
  useDocumentTitle('文章编辑');
  const [editType, setEditType] = React.useState(1);

  useEffect(() => {
    if (isEdit) {
      setEditType(3);
    } else {
      setEditType(1);
    }
  }, [isEdit]);
  // 切换编辑方式
  const onEditTypeChange = (e: RadioChangeEvent) => {
    setEditType(e.target.value);
  };
  return (
    <div className={['newsAddInternal', style['padding-bottom-20']].join(' ')}>
      <Form.Item label="添加方式" labelCol={{ span: 3 }}>
        <Radio.Group onChange={onEditTypeChange} value={editType}>
          <Radio value={1}>绑定行内公众号</Radio>
          <Radio value={2}>添加文章链接</Radio>
          <Radio value={3}>手动添加</Radio>
        </Radio.Group>
      </Form.Item>
      {editType === 1 ? <TabView1 /> : editType === 2 ? <TabView2 /> : <TabView3 newsId={newsId} isEdit={isEdit} />}
    </div>
  );
};

const AddInternal: React.FC<RouteComponentProps> = ({ location }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [newsId, setNewsId] = useState('');
  useEffect(() => {
    const params = urlSearchParams(location.search);
    const newsId = params && params.id;
    if (typeof newsId === 'string') {
      setIsEdit(true);
      setNewsId(newsId);
    }
  }, []);
  return (
    <>
      <PageHeader title="新增文章"></PageHeader>
      <Divider style={{ margin: 0 }} />
      <div className={[style.space, style['space-top-20']].join(' ')}>
        <MyTabs isEdit={isEdit} newsId={newsId} />
      </div>
    </>
  );
};

export default AddInternal;
