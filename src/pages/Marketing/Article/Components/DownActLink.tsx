import React, { useEffect, useState } from 'react';
import { Modal } from 'src/components';
import { Form, Pagination, Radio, Space } from 'antd';
import { IColumn } from 'src/pages/Marketing/ArticleChannel/config';
import style from './style.module.less';
import { requestChannelList } from 'src/apis/marketing';

interface IDownArticleLinkProps {
  visible: boolean;
  onOk?: (value: string) => void;
  onCancel: () => void;
  title?: string;
}

const { Item } = Form;

const DownActLink: React.FC<IDownArticleLinkProps> = ({ title, visible, onCancel, onOk }) => {
  const [list, setList] = useState<IColumn[]>([]);
  const [pagination, setPagination] = useState<{ current: number; total: number }>({ current: 1, total: 0 });
  const [okBtnLoading, setOkBtnLoading] = useState(false);

  const [form] = Form.useForm();

  // 获取列表
  const getList = async (pageNum: number) => {
    const res = await requestChannelList({ pageNum });
    console.log('res', res);
    if (res) {
      const { list, total } = res;
      setList(list || []);
      setPagination((pagination) => ({ ...pagination, total }));
    } else {
      setList([
        {
          channelId: '1',
          channelName: '公有云文章'
        },
        {
          channelId: '2',
          channelName: '江西人保'
        },
        {
          channelId: '3',
          channelName: '河北人保'
        }
      ]);
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleOk = async () => {
    const { channelId } = await form.validateFields();
    setOkBtnLoading(true);
    await onOk?.(channelId);
    setOkBtnLoading(false);
  };

  const paginationChange = (pageNum: number) => {
    setPagination((pagination) => ({ ...pagination, pageNum }));
    getList(pageNum);
  };

  useEffect(() => {
    if (visible) {
      form.resetFields();
      setPagination({ current: 1, total: 0 });
      getList(1);
    }
  }, [visible]);

  return (
    <Modal
      className={style.wrap}
      title={title || '下载文章链接'}
      visible={visible}
      centered
      onClose={handleCancel}
      onOk={handleOk}
      okButtonProps={{ loading: okBtnLoading }}
    >
      <Form form={form}>
        <Item name="channelId">
          <Radio.Group>
            <Space direction="vertical">
              {list.map(({ channelId, channelName }) => (
                <Radio key={channelId} value={channelId}>
                  {channelName}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        </Item>
      </Form>
      <Pagination onChange={paginationChange} {...pagination} />
    </Modal>
  );
};
export default DownActLink;
