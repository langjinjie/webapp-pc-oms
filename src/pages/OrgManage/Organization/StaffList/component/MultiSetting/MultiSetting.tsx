import React, { useEffect, useState } from 'react';
import { message, Modal, /* Form, */ Tag } from 'antd';
import { Icon } from 'src/components';
import style from './style.module.less';

interface IMultiSettingProps {
  visible: boolean;
  setVisible: (param: boolean) => void;
}

const MultiSetting: React.FC<IMultiSettingProps> = ({ visible, setVisible }) => {
  const [staffList, setStaffList] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [staffInfo, setStaffInfo] = useState<{ [key: string]: any }>({});
  const [tagList, setTagList] = useState(['标签1']);
  // const [form] = Form.useForm();
  // modal取消
  const onCancelHandle = () => {
    if (visible) {
      setVisible(false);
    } else {
      setModalVisible(false);
      setVisible(true);
    }
  };
  // modal确认
  const onOkHandle = () => {
    if (visible) {
      console.log('tagList', tagList);
      setVisible(false);
    } else {
      setStaffInfo({ department: '研发部' });
      setModalVisible(false);
      setVisible(true);
    }
  };
  // 点击添加员工
  const addStaffHandle = () => {
    setVisible(false);
    setModalVisible(true);
  };
  // 点击添加部门
  const addDepartmentHandle = () => {
    setVisible(false);
    setModalVisible(true);
  };
  // onChange
  const onChangeHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    let addTags = e.target.value;
    // 判断是否一次性添加多个标签
    if (addTags.includes('；')) {
      if (addTags.split('；').some((item) => item.length > 12)) {
        return message.warning('单个标签最长不能超过12个字');
      }
      if (tagList.length + addTags.split('；').length >= 4) return message.warning('最多能添加4个标签');
    } else {
      if (addTags.length >= 12) message.warning('单个标签最多12个字符');
      addTags = addTags.slice(0, 12);
    }
    setStaffInfo({ ...staffInfo, tag: addTags });
  };
  // 失去焦点
  const onBlurHandle = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value) {
      // 判断标签数量
      if (tagList.length + e.target.value.split('；').length >= 4) message.warning('最多能添加4个标签');
      setTagList([...tagList, ...e.target.value.split('；')].splice(0, 4));
      setStaffInfo({ ...staffInfo, tag: '' });
    }
  };
  // 删除标签
  const closeTagHandle = (tag: string) => {
    console.log(tag);
    console.log(tagList);
    const filterTagList = tagList.filter((item) => item !== tag);
    setTagList(filterTagList);
  };
  useEffect(() => {
    setStaffList([{ name: '李斯' }]);
  }, []);
  return (
    <>
      {/* 批量设置员工信息 */}
      <Modal
        className={style.modalWrap}
        title={'批量设置信息'}
        visible={visible}
        centered={true}
        closeIcon={<Icon className={style.closeIcon} name={'biaoqian_quxiao'} />}
        width={620}
        onCancel={onCancelHandle}
        onOk={onOkHandle}
      >
        {/* 选择员工 */}
        <div className={style.chooseStaff}>
          <div className={style.title}>选择员工</div>
          <div className={style.staffList}>
            {staffList.length
              ? (
              <div className={style.add} onClick={addStaffHandle}>
                <Icon className={style.addIcon} name="tianjiafenzu" />
                选择员工
              </div>
                )
              : (
              <>
                <div>员工列表</div>
              </>
                )}
          </div>
        </div>
        {/* 设置员工的其他信息 */}
        <div className={style.otherInfo}>
          {/* <Form form={form}> */}
          <div className={style.infoTitle}>设置项目</div>
          <div className={style.infoItem}>
            <div className={style.title}>部门信息</div>
            <div className={style.value}>
              {staffInfo.department
                ? (
                <div>{staffInfo.department}</div>
                  )
                : (
                <div className={style.add} onClick={addDepartmentHandle}>
                  <Icon className={style.addIcon} name="tianjiafenzu" />
                  部门
                </div>
                  )}
            </div>
          </div>
          <div className={style.infoItem}>
            <div className={style.title}>职务</div>
            <div className={style.value}>
              <input className={style.input} type="text" placeholder="请输入职务" maxLength={16} />
            </div>
          </div>
          <div className={style.infoItem}>
            <div className={style.title}>描述</div>
            <div className={style.value}>
              <input className={style.input} type="text" placeholder="请输入描述" maxLength={60} />
            </div>
          </div>
          <div className={style.infoItem}>
            <div className={style.title}>标签</div>
            <div className={style.value}>
              {tagList?.map((tag: string) => (
                <Tag key={tag} closable onClose={() => closeTagHandle(tag)}>
                  {tag}
                </Tag>
              ))}
              {tagList.length !== 4 && (
                <input
                  className={style.input}
                  value={staffInfo.tag}
                  type="text"
                  placeholder="请输入标签(最多12个字)"
                  onChange={(e) => onChangeHandle(e)}
                  onBlur={(e) => onBlurHandle(e)}
                />
              )}
            </div>
          </div>
          {/* </Form> */}
        </div>
      </Modal>
      {/* 添加员工或者选择部门 */}
      <Modal
        title="选择员工"
        visible={modalVisible}
        centered={true}
        closeIcon={<Icon className={style.closeIcon} name={'biaoqian_quxiao'} />}
        onCancel={onCancelHandle}
        onOk={onOkHandle}
      >
        添加员工
      </Modal>
    </>
  );
};
export default MultiSetting;
