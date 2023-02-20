import React, { useEffect, useState } from 'react';

import { Button, Card, Cascader, Form, Input, message, Select, Space, Switch } from 'antd';
import styles from './style.module.less';
import CustomTextArea from './Components/CustomTextArea';
import { useForm } from 'antd/lib/form/Form';
import { speechContentTypes, SpeechProps } from './Config';
import SpeechItem from './Components/SpeechTypeItem/SpeechItem';
import SpeechItemChild from './Components/SpeechTypeItemChild/SpeechItem';
import { RouteComponentProps } from 'react-router';
import { URLSearchParams, useDocumentTitle } from 'src/utils/base';
import { getSpeechDetail, editSpeech, getCategoryList, requestGetCatalogDetail } from 'src/apis/salesCollection';
import InputShowLength from '../../../components/InputShowLength/InputShowLength';
import { SetUserRightFormItem } from 'src/pages/Marketing/Components/SetUserRight/SetUserRight';

const scenesStates = [
  { sceneId: 1, name: '车险流程', needGenderType: 1, needAgeType: 0 },
  { sceneId: 2, name: '非车流程', needGenderType: 1, needAgeType: 0 },
  { sceneId: 3, name: '异议处理', needGenderType: 0, needAgeType: 0 },
  { sceneId: 4, name: '场景话术', needGenderType: 1, needAgeType: 1 },
  { sceneId: 5, name: '问答知识', needGenderType: 0, needAgeType: 0 }
];
const SpeechEdit: React.FC<RouteComponentProps> = ({ location, history }) => {
  useDocumentTitle('话术编辑');
  const [speechForm] = useForm();
  const [isCustomType, setIsCustomType] = useState(false);
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
      return res;
    }
  };
  const getObjectData = (data: any, obj: any, keyName = '') => {
    for (const key in data) {
      let str = '';
      if (keyName) {
        str = keyName + '.' + key;
      } else {
        str = key;
      }
      if (typeof data[key] === 'object' && isNaN(data[key]?.length)) {
        getObjectData(data[key], obj, str);
      } else {
        obj[str] = data[key];
      }
    }
    return obj;
  };
  const getDetail = async (contentId: string, sceneId: string) => {
    const res = await getSpeechDetail({
      sceneId,
      contentId
    });
    if (res) {
      const res1 = getObjectData(res, {}, '');
      if (res1['contentObj.contentType']) {
        setIsCustomType(true);
      }
      setSpeech(res1);
      setOriginSpeech(res1);
      const { sceneId, contentObj } = res;
      const currentScenes = scenesStates.filter((scenes) => scenes.sceneId === sceneId)[0];
      setCurrentScenesState(currentScenes);

      if (res?.contentType === 9 || contentObj?.contentType === 9) {
        const { appId, appPath } = res?.contentType === 9 && JSON.parse(res.contentUrl || '{}');
        const { appId: contentObjAppId, appPath: appPathAppPath } =
          contentObj?.contentType === 9 && JSON.parse(contentObj?.contentUrl || '{}');
        speechForm.setFieldsValue({
          ...res1,
          appId,
          appPath,
          'contentObj.appId': contentObjAppId,
          'contentObj.appPath': appPathAppPath
        });
        setOriginSpeech({
          ...res1
        });
      } else {
        speechForm.setFieldsValue({ ...res1 });
      }
    }
  };

  const getCatalogDetail = async (sceneId: string, catalogId: string) => {
    const res = await requestGetCatalogDetail({ sceneId, catalogId });
    if (res) {
      if (res.contentType === 9) {
        const { appId, appPath } = JSON.parse(res.contentUrl || '{}');
        speechForm.setFieldsValue({
          ...res,
          appId,
          appPath
        });
        setOriginSpeech(() => ({ ...res, appId, appPath }));
      } else {
        setOriginSpeech(res);
        speechForm.setFieldsValue({
          ...res
        });
      }
    }
  };

  const initSetFormQuery = async () => {
    const { catalog, contentId, sceneId } = URLSearchParams(location.search) as { [key: string]: string };
    if (catalog) {
      const catalogs = catalog.split(',');
      const tree = JSON.parse(localStorage.getItem('catalogTree') || '[]') as any[];
      const res = await getCategory();
      const copyData = [...res];
      res?.forEach((item: any, index: number) => {
        if (item.catalogId === tree[0].catalogId) {
          copyData[index] = tree[0];
        }
      });
      setCategories(copyData);
      const catalogId = catalogs[catalogs.length - 1];

      await getCatalogDetail(tree[0].sceneId, catalogId);
      const currentScenes = scenesStates.filter((scenes) => scenes.sceneId === tree[0].sceneId)[0];
      setCurrentScenesState(currentScenes);
      setTimeout(() => {
        speechForm.setFieldsValue({
          categoryId: catalogs
        });
      }, 300);
    } else if (contentId && sceneId) {
      getDetail(contentId, sceneId);
    } else {
      const res = await getCategory();
      setCategories(res);
    }
  };

  useEffect(() => {
    initSetFormQuery();
  }, []);

  const handleBack = (refresh?: boolean) => {
    const backRoutePath = sessionStorage.getItem('backRoute');
    if (backRoutePath) {
      sessionStorage.removeItem('backRoute');
      history.replace(`${backRoutePath}?isCatch=1${refresh ? '&refresh=true' : ''}`);
    } else {
      // history.goBack(); 会触发缓存组件更新
      console.log('返回/确认');
      history.push(`/speechManage?${refresh ? 'refresh=true' : ''}`);
    }
  };

  const onSubmit = async (params: any, refresh?: boolean) => {
    const res = await editSpeech({
      ...params
    });
    if (res) {
      const { code, sensitiveWord } = res;
      if (code === 0) {
        message.success('保存成功');
        handleBack(refresh);
      } else if (code === 1) {
        message.error('触发了敏感词,请修改后再提交');
        setSpeech((speech) => ({ ...speech!, sensitiveWord, sensitive: 1 }));
      }
    }
  };

  const onFinish = async (values: any) => {
    const {
      'contentObj.content': content,
      'contentObj.contentType': contentType,
      'contentObj.tip': tip,
      'contentObj.ageType': ageType,
      'contentObj.genderType': genderType,
      'contentObj.contentUrl': contentUrl,
      'contentObj.title': title,
      'contentObj.summary': summary,
      'contentObj.thumbnail': thumbnail,
      'contentObj.appId': appId,
      'contentObj.appPath': appPath,
      groupId
    } = values;

    const submitData = {
      sceneId: originSpeech?.sceneId,
      catalogId: originSpeech?.catalogId,
      contentId: originSpeech?.['contentObj.contentId'] || '',
      content,
      contentType: contentType,
      ageType,
      tip,
      genderType,
      contentUrl: contentType === 9 ? JSON.stringify({ appId, appPath }) : contentUrl,
      thumbnail,
      title,
      groupId: groupId || '',
      summary: summary || originSpeech?.summary
    };

    await onSubmit(submitData, true);
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

  // useMemo(() => {
  //   if (originSpeech) {
  //     const { contentType, contentUrl, title, summary, thumbnail, appId, appPath } = originSpeech;
  //     speechForm.setFieldsValue({ contentType, contentUrl, title, summary, thumbnail, appId, appPath });
  //   }
  // }, [originSpeech]);

  // 类目改变
  const onCascaderChange = async (value: any, selectedOptions: any) => {
    const lastSelectedOptions = selectedOptions[selectedOptions.length - 1] || {};
    const sceneId = lastSelectedOptions.sceneId;
    const currentScenes = scenesStates.filter((scenes) => scenes.sceneId === sceneId)[0];
    setCurrentScenesState(currentScenes);
    if (lastSelectedOptions) {
      const { sceneId, catalogId } = lastSelectedOptions;
      if (sceneId && catalogId) {
        // 获取分类详情
        await getCatalogDetail(sceneId, catalogId);
      } else {
        setOriginSpeech(undefined);
      }
    }
  };

  const handleCustomTypeChange = (value: any) => {
    setOriginSpeech((originSpeech) => ({ ...originSpeech!, 'contentObj.contentType': value }));
    // 切换话术内容清空话术内容
    if (value === speech?.['contentObj.contentType']) {
      speechForm.setFieldsValue({ ...originSpeech, 'contentObj.contentType': value });
    } else {
      speechForm.setFieldsValue({
        ...originSpeech,
        'contentObj.contentType': value,
        'contentObj.contentUrl': '',
        'contentObj.title': '',
        'contentObj.summary': '',
        'contentObj.thumbnail': '',
        'contentObj.appId': '',
        'contentObj.appPath': ''
      });
    }
  };

  return (
    <Card
      title={`${(URLSearchParams(location.search) as { [key: string]: string }).contentId ? '编辑' : '新增'}话术`}
      bordered={false}
      className="edit"
    >
      <Form
        form={speechForm}
        onFinish={onFinish}
        onValuesChange={(changedValues: any, values: any) => {
          onValuesChange(values);
        }}
        initialValues={{ isSet: 0 }}
      >
        {originSpeech?.['contentObj.contentId']
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
          <Form.Item label="目录话术格式" name="contentType" rules={[{ required: true }]}>
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
        <Form.Item label="设置话术格式">
          <Switch
            onChange={(value) => setIsCustomType(value)}
            checkedChildren="开启"
            size="default"
            unCheckedChildren="关闭"
            checked={isCustomType}
          />
        </Form.Item>
        {isCustomType && (
          <>
            <Form.Item label="话术格式" name="contentObj.contentType" rules={[{ required: true }]}>
              <Select placeholder="请选择" className="width240" onChange={handleCustomTypeChange}>
                {speechContentTypes.map((contentType) => (
                  <Select.Option key={contentType.id} value={contentType.id}>
                    {contentType.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            {originSpeech?.['contentObj.contentType'] && (
              <SpeechItemChild type={originSpeech?.['contentObj.contentType']}></SpeechItemChild>
            )}
          </>
        )}

        <Form.Item label="话术内容" name="contentObj.content" rules={[{ required: true }]}>
          <CustomTextArea sensitiveWord={speech?.sensitiveWord} sensitive={speech?.sensitive} maxLength={1200} />
        </Form.Item>
        {currentScenesState?.sceneId !== 3 && currentScenesState?.sceneId !== 5 && currentScenesState?.sceneId !== 0 && (
          <Form.Item label="客户分类" required={true} className={styles.formItem__selectGroup}>
            {currentScenesState?.needGenderType === 1 && (
              <Form.Item name="contentObj.genderType" rules={[{ required: true, message: '请选择性别' }]}>
                <Select placeholder="请选择" allowClear>
                  <Select.Option value={0}>全部性别</Select.Option>
                  <Select.Option value={1}>男性</Select.Option>
                  <Select.Option value={2}>女性</Select.Option>
                </Select>
              </Form.Item>
            )}
            {currentScenesState?.needAgeType === 1 && (
              <Form.Item name={'contentObj.ageType'} rules={[{ required: true, message: '请选择年龄' }]}>
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
        <Form.Item label="话术小贴士" name={'contentObj.tip'}>
          <InputShowLength className="width360" maxLength={20} placeholder={'请输入'} />
        </Form.Item>
        <Form.Item label="可见范围设置" name={'groupId'}>
          <SetUserRightFormItem form={speechForm} />
        </Form.Item>

        <Form.Item className={styles.formItem__footerBtnWrap}>
          <Space size={20}>
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
