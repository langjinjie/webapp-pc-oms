import React, { useEffect, useState } from 'react';

import { Button, Card, Form, Input, message, Select, Space } from 'antd';
import styles from './style.module.less';
import CustomTextArea from './Components/CustomTextArea';
import { useForm } from 'antd/lib/form/Form';
import { speechContentTypes, SpeechProps } from './Config';
import SpeechItem from './Components/SpeechTypeItem/SpeechItem';
import { RouteComponentProps } from 'react-router';
import { URLSearchParams } from 'src/utils/base';
import { getSpeechDetail, editSpeech } from 'src/apis/salesCollection';

const SpeechEdit: React.FC<RouteComponentProps> = ({ location }) => {
  const [speechForm] = useForm();
  const [speech, setSpeech] = useState<SpeechProps>();
  const [originSpeech, setOriginSpeech] = useState<SpeechProps>();
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

  useEffect(() => {
    getDetail();
  }, []);
  const onFinish = async (values: any) => {
    console.log(values, originSpeech);
    const { content, contentType, tip, ageType, genderType } = values;
    const res = await editSpeech({
      sceneId: speech?.sceneId,
      catalogId: speech?.catalogId,
      contentId: speech?.contentId,
      content,
      contentType,
      ageType,
      tip,
      genderType
    });
    if (res) {
      const { code, sensitiveWord } = res;
      console.log(code, sensitiveWord);
      if (code === 0) {
        message.success('保存成功');
        history.back();
      }
    }
  };

  const onValuesChange = (values: any) => {
    const { contentType = 1 } = values;

    setSpeech((speech) => ({ ...speech!, contentType }));
    console.log(values);
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
        <Form.Item label="选择目录" name="key1" rules={[{ required: true }]}>
          <Select placeholder="请选择" className="width420">
            <Select.Option value="1">名片</Select.Option>
          </Select>
        </Form.Item>
        {true && (
          <Form.Item label="话术格式" name="contentType" rules={[{ required: true }]}>
            <Select placeholder="请选择" className="width240">
              {speechContentTypes.map((contentType) => (
                <Select.Option key={contentType.id} value={contentType.id}>
                  {contentType.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
        {true && <SpeechItem type={speech?.contentType}></SpeechItem>}

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
