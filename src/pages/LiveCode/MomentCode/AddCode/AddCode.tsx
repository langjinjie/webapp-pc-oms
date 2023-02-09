import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Radio } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import { BreadCrumbs, ImageUpload } from 'src/components';
import { requestGetChannelGroupList } from 'src/apis/channelTag';
import { IChannelTagList } from 'src/pages/Operation/ChannelTag/Config';
import Preview from '../components/Preview/Preview';
import FilterChannelTag from 'src/pages/LiveCode/MomentCode/components/FilterChannelTag/FilterChannelTag';
import AccessChatModal from 'src/pages/LiveCode/MomentCode/components/AccessChatModal/AccessChatModal';
import classNames from 'classnames';
import style from './style.module.less';

const AddCode: React.FC = () => {
  const [readOnly, setReadOnly] = useState(false);
  const [channelTagList, setChannelTagList] = useState<IChannelTagList[]>([]);

  const [form] = Form.useForm();
  const { Item } = Form;
  const { TextArea } = Input;

  const history = useHistory();
  const location = useLocation();

  // 获取投放渠道标签
  const getChannelGroupList = async () => {
    const res = await requestGetChannelGroupList({ groupName: '投放渠道' });
    if (res) {
      console.log('res', res.list?.[0]?.tagList);
      setChannelTagList(res.list?.[0]?.tagList || []);
    }
  };

  // 提交表单
  const onFinishHandle = (values: any) => {
    console.log('values', values);
  };

  useEffect(() => {
    setReadOnly(false);
    getChannelGroupList();
  }, []);
  return (
    <div className={style.wrap}>
      <BreadCrumbs
        navList={[
          {
            path: '/momentCode',
            name: '群活码'
          },
          { name: '新增群活码' }
        ]}
      />
      <Form
        form={form}
        className={style.form}
        onFinish={onFinishHandle}
        // @ts-ignore
        initialValues={location.state?.row || {}}
      >
        <div className={style.panel}>
          <div className={style.title}>基本信息</div>
          <div className={style.content}>
            <Item
              label="活码名称"
              name="codeName"
              // rules={[{ required: true, max: 30, message: '请输入30个字以内的任务名称' }]}
            >
              <Input
                placeholder="待输入"
                disabled={readOnly}
                className={style.input}
                readOnly={readOnly}
                showCount
                maxLength={30}
              />
            </Item>
            <Item
              label="引导语"
              name=""
              // rules={[{ required: true, max: 30, message: '请输入30个字以内的任务名称' }]}
            >
              <Input
                placeholder="待输入"
                disabled={readOnly}
                className={style.input}
                readOnly={readOnly}
                showCount
                maxLength={30}
              />
            </Item>
          </div>
        </div>
        <div className={style.panel}>
          <div className={style.title}>客服设置</div>
          <div className={style.content}>
            <Item label="客服二维码" extra="为确保最佳展示效果，请上传670*200像素高清图片，仅支持.jpg格式">
              <ImageUpload />
            </Item>
            <Item label="客户引导话术">
              <TextArea className={style.textArea} placeholder="如无法进群，请及时联系我" showCount maxLength={120} />
            </Item>
          </div>
        </div>
        <div className={style.panel}>
          <div className={style.title}>群二维码管理</div>
          <div className={classNames(style.content, style.previewContent)}>
            <Item>
              <AccessChatModal />
            </Item>
            <Item label="投放渠道" required>
              <div className={style.channelTag}>
                <Item name="channelTagList" label="投放渠道标签">
                  <Radio.Group>
                    {channelTagList.map((tagItem) => (
                      <Radio key={tagItem.tagId} value={[{ tagId: tagItem.tagId, tagName: tagItem.tagName }]}>
                        {tagItem.tagName}
                      </Radio>
                    ))}
                  </Radio.Group>
                </Item>
                <Item label="其他渠道标签" name="otherTagList">
                  <FilterChannelTag />
                </Item>
              </div>
            </Item>
            <Item label="活码备注">
              <TextArea className={style.textArea} placeholder="选填，如不填则默认抓取选定任务推荐话术" />
            </Item>

            <div className={style.preview}>
              <Preview value={{ speechcraft: '送你一张专属4.8折【幸运有理】专享券' }} />
            </div>
            <div className={style.btnWrap}>
              <Button className={style.submitBtn} type="primary" htmlType="submit">
                确定
              </Button>
              <Button className={style.cancelBtn} onClick={() => history.goBack()}>
                取消
              </Button>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};
export default AddCode;
