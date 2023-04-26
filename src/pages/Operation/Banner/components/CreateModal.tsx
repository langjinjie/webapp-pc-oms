import React, { useEffect, useState } from 'react';
import { Button, Form, Input, message, Modal, Space, Select, DatePicker, Spin } from 'antd';
import NgUpload from 'src/pages/Marketing/Components/Upload/Upload';
import { getHotList, searchRecommendGoodsList } from 'src/apis/marketing';
import { bannerTypeOptions, IBanner } from '../ListConfig';
import styles from './style.module.less';
import { debounce } from 'src/utils/base';
import { editBanner } from 'src/apis/marquee';
import moment, { Moment } from 'moment';
import { useResetFormOnCloseModal } from 'src/utils/use-ResetFormOnCloseModal';
import { RcFile } from 'antd/lib/upload';
interface CreateModalProps {
  visible: boolean;
  onClose: () => void;
  value?: IBanner;
  onSuccess: () => void;
}
const CreateModal: React.FC<CreateModalProps> = ({ visible, onClose, value, onSuccess }) => {
  const [fetching, setFetching] = useState(false);

  const [bannerForm] = Form.useForm();
  const [formValues, setFormValues] = useState<Partial<IBanner>>({});
  const [tplType, setTplType] = useState<number>();
  const [bannerId, setBannerId] = useState('');
  const [recommendList, setRecommendList] = useState<any[]>([]);

  useResetFormOnCloseModal({ form: bannerForm, visible });

  // 获取数据发送请求
  const onConfirm = () => {
    bannerForm.validateFields().then(async (values) => {
      // 格式化时间
      const rangeTime: [Moment, Moment] = values.rangeTime;

      const res = await editBanner({
        content: tplType !== 2 ? values.content || formValues.content || '' : '',
        itemId: values.itemId || '',
        linkUrl: values.linkUrl,
        imgUrl: values.imgUrl,
        type: values.type,
        bannerId: formValues.bannerId || '',
        startTime: rangeTime[0].format('YYYY-MM-DD HH:mm:ss'),
        endTime: rangeTime[1].format('YYYY-MM-DD HH:mm:ss')
      });
      if (res) {
        setBannerId('');
        message.success(value ? '编辑成功' : '新增成功');
        bannerForm.resetFields();
        onSuccess();
        onClose();
      }
    });
  };

  /**
   * 模板类型切换
   */
  const tplTypeChange = (value: number) => {
    setTplType(+value);

    setRecommendList([]);
    bannerForm.setFieldsValue({
      itemId: undefined,
      content: undefined,
      imgUrl: undefined,
      linkUrl: undefined
    });
  };

  useEffect(() => {
    if (value) {
      bannerForm.setFieldsValue({
        ...value,
        rangeTime: [moment(value.startTime), moment(value.endTime)]
      });
      setFormValues(value);
      const type = +value.type;
      setTplType(type);
      if (type !== 5) {
        setRecommendList([
          {
            id: value.itemId,
            name: value.content
          }
        ]);
      }
    } else {
      setRecommendList([]);
      setFormValues({});
      setTplType(undefined);
    }
  }, [value]);
  const onCloseBtn = () => {
    onClose();
  };

  // 当选中select素材时处理的东西
  const onRecommendSelected = async (value: string) => {
    const currentTitle = recommendList.filter((item) => item.id === value)[0].name;
    setFormValues((formValues) => ({ ...formValues, content: currentTitle }));
  };
  const onRecommendSearch = async (value: string) => {
    setFetching(true);
    const type = +formValues.type!;
    let res = [];
    if (type === 1 || type === 4) {
      res = await searchRecommendGoodsList({
        title: value,
        specType: 0,
        type: 1,
        recommendType: bannerTypeOptions.filter((item) => item.id === type)[0].recommendType!
      });
      res = res.map((item: any) => ({
        id: item.marketId,
        name: item.title
      }));
    } else if (type === 3) {
      const { list } = await getHotList({ status: 1, name: value });
      res = list.map((item: any) => ({
        id: item.topicId,
        name: item.topicName
      }));
    }

    setRecommendList(res);
    setFetching(false);
  };

  const onFocusWithSelect = () => {
    if (recommendList.length <= 1) {
      onRecommendSearch('');
    }
  };

  // 防抖处理
  const debounceFetcher = debounce<string>(async (value: string) => {
    await onRecommendSearch(value);
  }, 800);

  const beforeUpload = (file: RcFile): Promise<boolean> => {
    const isJpg = file.type === 'image/jpeg';

    if (!isJpg) {
      message.error('你只可以上传 JPG 文件!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过 2MB!');
    }
    let isW750 = false;
    let isH180 = false;
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
          const height = image.height;
          isH180 = height === 180;
          isW750 = width === 710;
          if (!isW750 || !isH180) {
            message.error('上传失败，请上传规定尺寸的图片');
          }
          resolve(isJpg && isLt2M && isW750 && isH180);
        };
      };
      reader.readAsDataURL(file);
    });
  };
  return (
    <Modal
      title={bannerId ? '编辑' : '新增'}
      className={styles.modalBox}
      forceRender
      visible={visible}
      closable={false}
      footer={
        <div className="flex justify-end">
          <Space size={20}>
            <Button onClick={() => onCloseBtn()} shape="round">
              取消
            </Button>
            <Button type="primary" onClick={onConfirm} shape="round">
              确定
            </Button>
          </Space>
        </div>
      }
    >
      <Form
        form={bannerForm}
        onValuesChange={(_, values) => setFormValues((formValues) => ({ ...formValues, ...values }))}
      >
        <Form.Item name="type" label="选择类型：" rules={[{ required: true }]}>
          <Select placeholder="请选择" className={styles.typeSelect1} onChange={tplTypeChange}>
            {bannerTypeOptions.map((option) => (
              <Select.Option key={option.id} value={option.id + ''}>
                {option.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        {tplType === 2
          ? (
          <Form.Item label="选择内容：" rules={[{ required: true }]}>
            <Input defaultValue={'系统自动取每周最新的周报内容'} disabled className={styles.typeSelect2}></Input>
          </Form.Item>
            )
          : tplType === 5
            ? (
          <>
            <Form.Item
              label="内容标题"
              rules={[
                {
                  required: true
                }
              ]}
              name={'content'}
            >
              <Input type="text" placeholder="请输入" maxLength={100} className={styles.typeSelect2} />
            </Form.Item>
            <Form.Item
              label="链接地址"
              rules={[{ type: 'url', message: '请输入正确的链接地址', required: true }]}
              name={'linkUrl'}
            >
              <Input type="text" maxLength={200} placeholder="请输入链接地址" className={styles.typeSelect2} />
            </Form.Item>
          </>
              )
            : (
                !!tplType && (
            <Form.Item name="itemId" label="选择内容：" rules={[{ required: true }]}>
              <Select
                placeholder="搜索对应素材标题在下拉框进行选择"
                allowClear
                showSearch={true}
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                notFoundContent={fetching ? <Spin size="small" /> : <span>暂无相关素材，请试试其他内容</span>}
                onChange={(value) => onRecommendSelected(value)}
                onFocus={() => {
                  onFocusWithSelect();
                }}
                onSearch={(value) => debounceFetcher(value)}
                className={styles.typeSelect2}
              >
                {recommendList.map((item) => {
                  return (
                    <Select.Option value={item.id} key={item.id}>
                      {item.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
                )
              )}

        <Form.Item
          name="imgUrl"
          label="上传图片"
          rules={[{ required: true, message: '请上传图片' }]}
          extra="banner710*180像素高清图片,仅支持.jpg格式"
        >
          <NgUpload beforeUpload={beforeUpload} />
        </Form.Item>
        <Form.Item label="展示时间" rules={[{ required: true, message: '请设置展示时间' }]} name="rangeTime">
          <DatePicker.RangePicker className={styles.typeSelect2} showTime allowClear />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateModal;
