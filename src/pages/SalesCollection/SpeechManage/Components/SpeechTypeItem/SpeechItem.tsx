import React from 'react';
import { Form } from 'antd';
import NgUpload from 'src/pages/Marketing/Components/Upload/Upload';

import styles from './styles.module.less';

interface SpeechItemProps {
  type?: number;
}
const SpeechItem: React.FC<SpeechItemProps> = ({ type }) => {
  return (
    <>
      {/* type = 2 长图 */}
      {type === 2 && (
        <Form.Item
          label={'上传图片'}
          name="pic"
          rules={[{ required: true }]}
          extra="图片宽度750px，高度不限，仅支持.jpg格式"
        >
          <NgUpload></NgUpload>
        </Form.Item>
      )}

      {/* type = 3 名片 */}
      {type === 3 && (
        <Form.Item label="名片样式" name="pic">
          <div className={styles.posterWrap}>
            <img src={require('src/assets/images/sales/business_demo.jpg')} alt="" />
          </div>
        </Form.Item>
      )}
      {/* type = 4 小站 */}
      {type === 4 && (
        <Form.Item label="小站样式" name="pic">
          <div className={styles.userHomeWrap}>
            <img src={require('src/assets/images/sales/userHome_demo.jpg')} alt="" />
          </div>
        </Form.Item>
      )}
    </>
  );
};

export default SpeechItem;
