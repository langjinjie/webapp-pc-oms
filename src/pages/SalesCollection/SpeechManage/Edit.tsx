import React, { useEffect, useState, useMemo } from 'react';

import { Button, Card, Cascader, Form, Input, message, Modal, Select, Space } from 'antd';
import styles from './style.module.less';
import CustomTextArea from './Components/CustomTextArea';
import { useForm } from 'antd/lib/form/Form';
import { speechContentTypes, SpeechProps } from './Config';
import SpeechItem from './Components/SpeechTypeItem/SpeechItem';
import { RouteComponentProps } from 'react-router';
import { URLSearchParams, useDocumentTitle } from 'src/utils/base';
import { getSpeechDetail, editSpeech, getCategoryList, requestGetCatalogDetail } from 'src/apis/salesCollection';
import InputShowLength from './Components/InputShowLength/InputShowLength';

const scenesStates = [
  { sceneId: 1, name: '车险流程', needGenderType: 1, needAgeType: 0 },
  { sceneId: 2, name: '非车流程', needGenderType: 1, needAgeType: 0 },
  { sceneId: 3, name: '异议处理', needGenderType: 0, needAgeType: 0 },
  { sceneId: 4, name: '场景话术', needGenderType: 1, needAgeType: 1 },
  { sceneId: 5, name: '问答知识', needGenderType: 0, needAgeType: 0 }
];
const SpeechEdit: React.FC<RouteComponentProps> = ({ location }) => {
  useDocumentTitle('话术编辑');
  const [speechForm] = useForm();
  const [speech, setSpeech] = useState<SpeechProps>();
  const [originSpeech, setOriginSpeech] = useState<SpeechProps>();
  const [categories, setCategories] = useState<any[]>([]);
  const [currentScenesState, setCurrentScenesState] = useState({
    sceneId: 0,
    name: '',
    needGenderType: 0,
    needAgeType: 0
  });

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
        const currentScenes = scenesStates.filter((scenes) => scenes.sceneId === sceneId)[0];
        setCurrentScenesState(currentScenes);
        const formData = {
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
        };
        if (contentType === 9) {
          const { appId, appPath } = JSON.parse(contentUrl || '{}');
          speechForm.setFieldsValue({
            ...formData,
            appId,
            appPath
          });
          setOriginSpeech((originSpeech) => ({ ...originSpeech!, appId, appPath }));
        } else {
          speechForm.setFieldsValue(formData);
        }
      }
    } else {
      await getCategory();
    }
  };

  useEffect(() => {
    getDetail();
  }, []);

  const onSubmit = async (params: any) => {
    const res = await editSpeech({
      ...params
    });
    if (res) {
      const { code, sensitiveWord } = res;
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
    const {
      content,
      contentType,
      tip,
      ageType,
      genderType,
      contentUrl,
      title,
      summary,
      thumbnail,
      appId,
      appPath = ''
    } = values;

    const submitData = {
      sceneId: originSpeech?.sceneId,
      catalogId: originSpeech?.catalogId,
      contentId: speech?.contentId || '',
      content,
      contentType,
      ageType,
      tip,
      genderType,
      contentUrl: contentType === 9 ? JSON.stringify({ appId, appPath }) : contentUrl,
      thumbnail,
      title,
      summary: summary || originSpeech?.summary
    };
    if (
      (originSpeech?.contentType === 2 && contentUrl !== originSpeech.contentUrl) ||
      ((originSpeech?.contentType === 7 || originSpeech?.contentType === 6) &&
        (title !== originSpeech?.title ||
          originSpeech.contentUrl !== contentUrl ||
          summary !== originSpeech.summary)) ||
      ((originSpeech?.contentType === 5 || originSpeech?.contentType === 8) &&
        (title !== originSpeech?.title ||
          thumbnail !== originSpeech.thumbnail ||
          summary !== originSpeech.summary ||
          contentUrl !== originSpeech.contentUrl)) ||
      (originSpeech?.contentType === 9 &&
        (title !== originSpeech?.title ||
          thumbnail !== originSpeech.thumbnail ||
          appId !== originSpeech.appId ||
          appPath !== originSpeech.appPath ||
          summary !== originSpeech.summary))
    ) {
      Modal.confirm({
        content: '修改目录会对已上架话术产生影响，企微前端能实时看到变化',
        cancelText: '取消',
        okText: '确定',
        onOk: async () => {
          await onSubmit(submitData);
        }
      });
    } else {
      await onSubmit(submitData);
    }
  };

  const onValuesChange = (values: any) => {
    const { contentType = 1 } = values;

    setSpeech((speech) => ({ ...speech!, contentType }));
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

  useMemo(() => {
    if (originSpeech) {
      const { contentType, contentUrl, title, summary, thumbnail, appId, appPath } = originSpeech;
      speechForm.setFieldsValue({ contentType, contentUrl, title, summary, thumbnail, appId, appPath });
    }
  }, [originSpeech]);

  const onCascaderChange = async (value: any, selectedOptions: any) => {
    const lastSelectedOptions = selectedOptions[selectedOptions.length - 1] || {};
    const sceneId = lastSelectedOptions.sceneId;
    const currentScenes = scenesStates.filter((scenes) => scenes.sceneId === sceneId)[0];
    setCurrentScenesState(currentScenes);
    if (lastSelectedOptions) {
      const { sceneId, catalogId } = lastSelectedOptions;
      const res = await requestGetCatalogDetail({ sceneId, catalogId });
      if (res) {
        if (res.contentType === 9) {
          const { appId, appPath } = JSON.parse(res.contentUrl || '{}');
          setOriginSpeech(() => ({ ...res, appId, appPath }));
        } else {
          setOriginSpeech(res);
        }
      }
    }
  };

  const handleBack = () => {
    history.back();
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
        {originSpeech?.contentId
          ? (
          <Form.Item label="选择目录" required>
            <Input type="text" value={originSpeech?.fullName || ''} className="width420" readOnly />
          </Form.Item>
            )
          : (
          <Form.Item label="选择目录" rules={[{ required: true }]} name="categoryId">
            <Cascader
              placeholder="请选择"
              className="width420"
              fieldNames={{ label: 'name', value: 'catalogId', children: 'children' }}
              options={categories}
              loadData={loadData}
              onChange={onCascaderChange}
            ></Cascader>
          </Form.Item>
            )}

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
        {originSpeech?.contentType && <SpeechItem type={originSpeech?.contentType}></SpeechItem>}

        <Form.Item label="话术内容" name="content" rules={[{ required: true }]}>
          <CustomTextArea sensitiveWord={speech?.sensitiveWord} sensitive={speech?.sensitive} maxLength={1200} />
        </Form.Item>
        {currentScenesState.sceneId !== 3 && currentScenesState.sceneId !== 5 && currentScenesState.sceneId !== 0 && (
          <Form.Item label="客户大类" required={true} className={styles.formItem__selectGroup}>
            {currentScenesState.needGenderType === 1 && (
              <Form.Item name="genderType" rules={[{ required: true, message: '请选择性别' }]}>
                <Select placeholder="请选择" allowClear>
                  <Select.Option value={0}>全部性别</Select.Option>
                  <Select.Option value={1}>男性</Select.Option>
                  <Select.Option value={2}>女性</Select.Option>
                </Select>
              </Form.Item>
            )}
            {currentScenesState.needAgeType === 1 && (
              <Form.Item name={'ageType'} rules={[{ required: true, message: '请选择年龄' }]}>
                <Select placeholder="请选择" allowClear>
                  <Select.Option value={0}>全部年龄</Select.Option>
                  <Select.Option value={1}>老</Select.Option>
                  <Select.Option value={2}>中</Select.Option>
                  <Select.Option value={3}>青</Select.Option>
                </Select>
              </Form.Item>
            )}
          </Form.Item>
        )}
        <Form.Item label="话术小贴士" name="tip">
          <InputShowLength className="width360" maxLength={20} placeholder={'请输入'} />
        </Form.Item>
        <Form.Item className={styles.formItem__footerBtnWrap}>
          <Space>
            <Button type="default" shape="round" onClick={() => handleBack()}>
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