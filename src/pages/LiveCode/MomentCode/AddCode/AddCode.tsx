import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useHistory, useLocation } from 'react-router-dom';
import { BreadCrumbs, Icon, ImageUpload, NgTable } from 'src/components';
import classNames from 'classnames';
import Preview from '../Preview/Preview';
import style from './style.module.less';

const AddCode: React.FC = () => {
  const [readOnly, setReadOnly] = useState(false);
  const [form] = Form.useForm();
  const { Item } = Form;
  const { TextArea } = Input;
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    setReadOnly(false);
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
        onFinish={() => history.push('/staffCode')}
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
            <Button className={style.addMoment} icon={<PlusOutlined />}>
              接入群聊
            </Button>
            <div className={style.tips}>入群人数超过200人将自动切换到下一个群</div>
            <NgTable
              className={style.table}
              scroll={{ x: 550 }}
              dataSource={[
                {
                  momentName: '群号码1',
                  timeEnd: '2022-05-01'
                }
              ]}
              columns={[
                {
                  title: '群二维码',
                  render () {
                    // return <img width={48} height={48} src={require('src/assets/images/SaleClue/momentId.jpg')} />;
                    return <img width={48} height={48} src={''} />;
                  }
                },
                { title: '群活码名称', dataIndex: 'momentName' },
                { title: '群二维码有效期', dataIndex: 'timeEnd' },
                {
                  title: '操作',
                  render () {
                    return <span style={{ color: '#318cf5' }}>编辑</span>;
                  }
                }
              ]}
            />
            <Item label="投放渠道" required>
              <Item noStyle>
                <Select className={style.select} placeholder="默认渠道" />
              </Item>
              <span className={style.chooseStaff}>
                <Icon className={style.addIcon} name="tianjiabiaoqian1" />
                添加渠道
              </span>
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
