import React, { useEffect, useState } from 'react';

import { Button, Card, Cascader, Form, Input, message, Modal, Select, Space } from 'antd';
import styles from './style.module.less';
import CustomTextArea from './Components/CustomTextArea';
import { useForm } from 'antd/lib/form/Form';
import { speechContentTypes, SpeechProps } from './Config';
import SpeechItem from './Components/SpeechTypeItem/SpeechItem';
import { RouteComponentProps } from 'react-router';
import { URLSearchParams } from 'src/utils/base';
import { getSpeechDetail, editSpeech, getCategoryList, requestGetCatalogDetail } from 'src/apis/salesCollection';

const SpeechEdit: React.FC<RouteComponentProps> = ({ location }) => {
  const [speechForm] = useForm();
  const [speech, setSpeech] = useState<SpeechProps>();
  const [originSpeech, setOriginSpeech] = useState<SpeechProps>();
  const [categories, setCategories] = useState<any[]>([]);
  const getDetail = async () => {
    const params = URLSearchParams(location.search);
    if (params.contentId) {
      const res = await getSpeechDetail(params);
      if (res) {
        setSpeech(res);
        setOriginSpeech(res);
        const {
          ageType,
          catalogId,
          content,
          contentType,
          contentUrl,
          fullCatalogId,
          fullName,
          genderType,
          logoUrl,
          name,
          sceneId,
          sensitive,
          sensitiveWord,
          status,
          summary,
          thumbnail,
          tip,
          title,
          videoDuration,
          videoSize
        } = res;
        speechForm.setFieldsValue({
          ageType,
          catalogId,
          content,
          contentType,
          contentUrl,
          fullCatalogId,
          fullName,
          genderType,
          logoUrl,
          name,
          sceneId,
          sensitive,
          sensitiveWord,
          status,
          summary,
          thumbnail,
          tip,
          title,
          videoDuration,
          videoSize
        });
      }
      console.log(res, speech);
    } else {
      console.log('isADD');
    }
  };

  const getCategory = async (params?: any) => {
    const res = await getCategoryList({ ...params });
    if (res) {
      res.forEach((item: any) => {
        if (item.lastLevel === 0) {
          item.isLeaf = false;
        }
      });
      setCategories(res);
    }
  };

  useEffect(() => {
    getDetail();
    getCategory();
  }, []);

  const onSubmit = async (params: any) => {
    const res = await editSpeech({
      ...params
    });
    if (res) {
      const { code, sensitiveWord } = res;
      console.log(code, sensitiveWord);
      if (code === 0) {
        message.success('保存成功');
        history.back();
      } else if (code === 1) {
        message.error('触发了敏感词,请修改后再提交');
        setSpeech((speech) => ({ ...speech!, sensitiveWord, sensitive: 1 }));
      }
    }
  };

  const onFinish = async (values: any) => {
    const { content, contentType, tip, ageType, genderType, contentUrl, title, summary } = values;
    if (
      (originSpeech?.contentType === 2 && contentUrl !== originSpeech.contentUrl) ||
      (originSpeech?.contentType === 7 && (title !== originSpeech?.title || originSpeech.contentUrl !== contentUrl))
    ) {
      Modal.confirm({
        content: '修改目录会对已上架话术产生影响，企微前端能实时看到变化',
        cancelText: '取消',
        okText: '确定',
        onOk: async () => {
          await onSubmit({
            sceneId: originSpeech?.sceneId,
            catalogId: originSpeech?.catalogId,
            contentId: speech?.contentId || '',
            content,
            contentType,
            ageType,
            tip,
            genderType,
            contentUrl,
            title,
            summary: summary || originSpeech?.summary
          });
        }
      });
    } else {
      await onSubmit({
        sceneId: originSpeech?.sceneId,
        catalogId: originSpeech?.catalogId,
        contentId: speech?.contentId || '',
        content,
        contentType,
        ageType,
        tip,
        genderType,
        contentUrl,
        title,
        summary: summary || originSpeech?.summary
      });
    }
  };

  const onValuesChange = (values: any) => {
    const { contentType = 1 } = values;

    setSpeech((speech) => ({ ...speech!, contentType }));
    console.log(values);
  };

  const loadData = async (selectedOptions: any) => {
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

  const onCascaderChange = async (value: any, selectedOptions: any) => {
    const lastSelectedOptions = selectedOptions[selectedOptions.length - 1] || {};
    if (lastSelectedOptions) {
      const { sceneId, catalogId } = lastSelectedOptions;
      const res = await requestGetCatalogDetail({ sceneId, catalogId });
      if (res) {
        setOriginSpeech(res);
        const { contentType } = res;
        speechForm.setFieldsValue({ contentType });
      }
    }
  };

  return (
    <Card title="新增话术" bordered={false} className="edit">
      <Form
        form={speechForm}
        onFinish={onFinish}
        onValuesChange={(changedValues: any, values: any) => {
          onValuesChange(values);
        }}
      >
        <Form.Item label="选择目录" rules={[{ required: true }]}>
          {originSpeech?.contentId
            ? (
            <Input type="text" value={originSpeech.fullName} className="width420" readOnly />
              )
            : (
            <Cascader
              placeholder="请选择"
              className="width420"
              fieldNames={{ label: 'name', value: 'catalogId', children: 'children' }}
              options={categories}
              loadData={loadData}
              onChange={onCascaderChange}
            ></Cascader>
              )}
        </Form.Item>

        {originSpeech?.contentType && (
          <Form.Item label="话术格式" name="contentType" rules={[{ required: true }]}>
            <Select placeholder="请选择" className="width240" disabled>
              {speechContentTypes.map((contentType) => (
                <Select.Option key={contentType.id} value={contentType.id}>
                  {contentType.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
        {originSpeech?.contentType && <SpeechItem type={speech?.contentType}></SpeechItem>}

        <Form.Item label="话术内容" name="content" rules={[{ required: true }]}>
          <CustomTextArea sensitiveWord={speech?.sensitiveWord} sensitive={speech?.sensitive} />
        </Form.Item>
        <Form.Item label="客户大类" className={styles.formItem__selectGroup}>
          <Form.Item name="genderType">
            <Select placeholder="请选择" allowClear>
              <Select.Option value={0}>全部性别</Select.Option>
              <Select.Option value={1}>男性</Select.Option>
              <Select.Option value={2}>女性</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name={'ageType'}>
            <Select placeholder="请选择" allowClear>
              <Select.Option value={0}>全部年龄</Select.Option>
              <Select.Option value={1}>老</Select.Option>
              <Select.Option value={2}>中</Select.Option>
              <Select.Option value={3}>青</Select.Option>
            </Select>
          </Form.Item>
        </Form.Item>
        <Form.Item label="话术小贴士" name="tip">
          <Input placeholder={'请输入'} className="width360" />
        </Form.Item>
        <Form.Item className={styles.formItem__footerBtnWrap}>
          <Space>
            <Button type="default" shape="round">
              返回
            </Button>
            <Button type="primary" htmlType="submit" shape="round">
              保存
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default SpeechEdit;
