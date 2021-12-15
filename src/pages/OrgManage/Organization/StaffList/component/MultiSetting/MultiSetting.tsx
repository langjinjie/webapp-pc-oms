import React, { useEffect, useState } from 'react';
import { message, Modal, /* Form, */ Tag } from 'antd';
import { Icon } from 'src/components';
import { ChooseTreeModal } from 'src/pages/OrgManage/Organization/StaffList/component';
import style from './style.module.less';

interface IMultiSettingProps {
  visible: boolean;
  setMultiVisible: (param: boolean) => void;
}

const MultiSetting: React.FC<IMultiSettingProps> = ({ visible, setMultiVisible }) => {
  const [staffList, setStaffList] = useState<any[]>([]);
  const [chooseTreeParam, setChooseTreeParam] = useState<{ title: string; visible: boolean; isShowStaff: boolean }>({
    title: '',
    visible: false,
    isShowStaff: true
  });
  const [staffInfo, setStaffInfo] = useState<{ [key: string]: any }>({});
  const [tagList, setTagList] = useState<string[]>([]);
  // const [form] = Form.useForm();
  // modal取消
  const onCancelHandle = () => {
    setMultiVisible(false);
  };
  // modal确认
  const onOkHandle = () => {
    console.log('tagList', tagList);
    setMultiVisible(false);
  };
  // 点击添加员工
  const addStaffHandle = () => {
    setMultiVisible(false);
    setChooseTreeParam({ title: '选择员工', visible: true, isShowStaff: true });
  };
  // 点击添加部门
  const addDepartmentHandle = () => {
    setMultiVisible(false);
    setChooseTreeParam({ title: '选择部门', visible: true, isShowStaff: false });
  };
  // onChange
  const onChangeHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStaffInfo({ ...staffInfo, tag: e.target.value });
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
  // 输入框按下回车键
  const inputOnKeyDownHandle = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // 判断标签数量
      if (tagList.length + (e.target as HTMLInputElement).value.split('；').length >= 4) {
        message.warning('最多能添加4个标签');
      }
      setTagList([...tagList, ...(e.target as HTMLInputElement).value.split('；')].splice(0, 4));
      setStaffInfo({ ...staffInfo, tag: '' });
    }
  };
  useEffect(() => {
    setStaffList([{ name: '李斯' }]);
  }, []);
  return (
    <>
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
              {/* <div className={style.tagWrap}> */}
              {tagList?.map((tag: string) => (
                <Tag key={tag} className={style.tagItem} closable onClose={() => closeTagHandle(tag)}>
                  {tag}
                </Tag>
              ))}
              {/* </div> */}
              {tagList.length !== 4 && (
                <input
                  className={style.input}
                  value={staffInfo.tag || ''}
                  type="text"
                  maxLength={12}
                  placeholder="请输入标签(最多12个字)"
                  onChange={(e) => onChangeHandle(e)}
                  onBlur={(e) => onBlurHandle(e)}
                  onKeyDown={(e) => inputOnKeyDownHandle(e)}
                />
              )}
            </div>
          </div>
          {/* </Form> */}
        </div>
      </Modal>
      <ChooseTreeModal
        chooseTreeParam={chooseTreeParam}
        setStaffList={setStaffList}
        setMultiVisible={setMultiVisible}
        setChooseTreeParam={setChooseTreeParam}
      />
    </>
  );
};
export default MultiSetting;
