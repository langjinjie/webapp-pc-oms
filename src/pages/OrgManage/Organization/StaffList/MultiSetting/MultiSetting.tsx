import React, { useState, useRef, MutableRefObject, useEffect } from 'react';
import { message, Modal, Popover, Tag } from 'antd';
import { Icon } from 'src/components';
import { requestMultiSave, requestStaffBatchSetSaveValidate } from 'src/apis/orgManage';
import ChooseTreeModal from 'src/pages/OrgManage/Organization/StaffList/ChooseTreeModal/ChooseTreeModal';
import style from './style.module.less';
import classNames from 'classnames';

interface IMultiSettingProps {
  visible: boolean;
  setMultiVisible: (param: boolean) => void;
}

interface IStaffInfo {
  staffList: any[];
  department: any;
  cardPosition: string;
  desc: string;
  tags: string;
}

const MultiSetting: React.FC<IMultiSettingProps> = ({ visible, setMultiVisible }) => {
  const [chooseTreeParam, setChooseTreeParam] = useState<{ title: string; visible: boolean; isShowStaff: boolean }>({
    title: '',
    visible: false,
    isShowStaff: true
  });
  const [staffInfo, setStaffInfo] = useState<IStaffInfo>({
    staffList: [],
    department: null,
    cardPosition: '',
    desc: '',
    tags: ''
  });
  const [tagList, setTagList] = useState<{ tagId: string; tagName: string }[]>([]);
  const [isShowInput, setIsShowInput] = useState(false);
  const [isShowAllDesc, setIsShowAllDesc] = useState(false);
  const [isHiddenAllDesc, setIsHiddenAllDesc] = useState(true);
  const inputRef: MutableRefObject<any> = useRef(null);
  const descRef: MutableRefObject<any> = useRef(null);
  const allDesc: MutableRefObject<any> = useRef(null);
  const allDescInputRef: MutableRefObject<any> = useRef(null);
  const [loading, setLoading] = useState(false);

  let timerId: NodeJS.Timeout;
  // 重置
  const onResetHandle = () => {
    setStaffInfo({ staffList: [], department: null, cardPosition: '', desc: '', tags: '' });
    setIsShowAllDesc(false);
    setTagList([]);
  };
  // modal取消
  const onCancelHandle = () => {
    setMultiVisible(false);
    onResetHandle();
  };
  // modal确认
  const onOkHandle = async () => {
    setLoading(true);
    const { staffList, department, cardPosition, desc } = staffInfo;
    const staffIds = staffList.map((item) => item.id);
    const tags = tagList.reduce((prev: string, now: { tagId: string; tagName: string }, index: number) => {
      if (index === tagList.length - 1) {
        return prev + now.tagName;
      } else {
        return prev + now.tagName + '，';
      }
    }, '');
    if (department) {
      await requestStaffBatchSetSaveValidate({ staffIds, deptId: department?.id, cardPosition, desc, tags });
    }
    const res = await requestMultiSave({ staffIds, deptId: department?.id, cardPosition, desc, tags });
    if (res) {
      setMultiVisible(false);
      onResetHandle();
      message.success('批量修改成功');
    }
    setLoading(false);
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
  // 取消部门
  const clearDeptHandle = (event: any) => {
    event.stopPropagation();
    setStaffInfo({ ...staffInfo, department: null });
  };
  // 点击添加标签
  const clickAddTagHandle = async () => {
    await setIsShowInput(true);
    inputRef?.current?.focus();
  };
  // onChange
  const onChangeHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStaffInfo({ ...staffInfo, tags: e.target.value });
  };
  // 失去焦点
  const onBlurHandle = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsShowInput(false);
    if (e.target.value) {
      const tagId = new Date().getTime().toString();
      // 判断标签数量
      if (tagList.length >= 3) message.warning('最多能添加4个标签');
      setTagList([...tagList, { tagId, tagName: e.target.value }]);
      setStaffInfo({ ...staffInfo, tags: '' });
    }
  };
  // 删除标签
  const closeTagHandle = (tag: string) => {
    const filterTagList = tagList.filter((item) => item.tagId !== tag);
    setTagList(filterTagList);
  };
  // 输入框按下回车键
  const inputOnKeyDownHandle = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const tagId = new Date().getTime().toString();
      // 判断标签数量
      if (tagList.length >= 3) message.warning('最多能添加4个标签');
      setTagList([...tagList, { tagId, tagName: (e.target as HTMLInputElement).value }]);
      setStaffInfo({ ...staffInfo, tags: '' });
      setIsShowInput(false);
    }
  };
  // 输入职务、描述
  const InputHandle = (e: React.ChangeEvent<HTMLInputElement>, value: string) => {
    clearTimeout(timerId);
    setIsShowAllDesc(false);
    setStaffInfo((staffInfo) => ({ ...staffInfo, [value]: e.target.value.trim() }));
  };
  // 鼠标悬停在描述上展示全部文本
  const showAllDescHandle = () => {
    timerId = setTimeout(() => {
      setIsShowAllDesc(true);
    }, 1000);
    // 定义鼠标移动事件
    const onMouseMoveHandle = () => {
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        setIsShowAllDesc(true);
      }, 1000);
    };
    // 定义鼠标移出事件
    const onMouseLeaveHandle = () => {
      setIsShowAllDesc(false);
      clearTimeout(timerId);
      descRef.current.removeEventListener('mouseleave', onMouseLeaveHandle);
      descRef.current.removeEventListener('mousemove', onMouseMoveHandle);
    };
    descRef.current.addEventListener('mousemove', onMouseMoveHandle);
    descRef.current.addEventListener('mouseleave', onMouseLeaveHandle);
  };
  useEffect(() => {
    if (visible) {
      descRef.current?.addEventListener('mouseenter', showAllDescHandle);
    }
    return () => {
      descRef.current?.removeEventListener('mouseenter', showAllDescHandle);
    };
  }, [visible]);
  useEffect(() => {
    if (visible) {
      if (allDesc.current.clientWidth > allDescInputRef.current.clientWidth) {
        setIsHiddenAllDesc(false);
      } else {
        setIsHiddenAllDesc(true);
      }
    }
  }, [staffInfo]);
  return (
    <>
      <Modal
        className={style.modalWrap}
        title={'批量设置信息'}
        visible={visible}
        centered
        maskClosable={false}
        closeIcon={<Icon className={style.closeIcon} name={'biaoqian_quxiao'} />}
        width={620}
        onCancel={onCancelHandle}
        onOk={onOkHandle}
        okButtonProps={{
          disabled:
            !staffInfo.staffList.length || ![...Object.values(staffInfo).slice(1), tagList.length].some((item) => item),
          loading: loading
        }}
      >
        {/* 选择员工 */}
        <div className={style.chooseStaff}>
          {!!staffInfo.staffList?.length && (
            <div className={style.choosedInfo}>
              <span className={style.choosedCount}>已选择{staffInfo.staffList?.length}人</span>
              <span className={style.cancel} onClick={() => setStaffInfo({ ...staffInfo, staffList: [] })}>
                全部取消
              </span>
            </div>
          )}
          <div className={style.title}>选择员工</div>
          <div className={style.staffList}>
            {!staffInfo.staffList?.length
              ? (
              <div className={style.add} onClick={addStaffHandle}>
                <Icon className={style.addIcon} name="tianjiafenzu" />
                选择员工
              </div>
                )
              : (
              <span onClick={addStaffHandle}>
                {staffInfo.staffList?.map((item: any) => (
                  <>
                    <span className={classNames(style.staffItem, { [style.isLeader]: !!item.isLeader })} key={item.id}>
                      {item.name}
                      <span className={!!item.isLeader && style.isLeader}>{!!item.isLeader && '（上级）'}</span>
                    </span>
                    ；
                  </>
                ))}
              </span>
                )}
          </div>
        </div>
        {/* 设置员工的其他信息 */}
        <div className={style.otherInfo}>
          {/* <Form form={form}> */}
          <div className={style.infoTitle}>设置项目</div>
          <div className={style.infoItem}>
            <div className={style.title}>
              部门信息
              <Popover placement="right" className={style.iconWrap} content={'部门批量修改不可含有上级身份员工'}>
                <span>
                  <Icon name="i" />
                </span>
              </Popover>
            </div>
            <div className={style.value}>
              {staffInfo.department
                ? (
                <div className={style.department} onClick={addDepartmentHandle}>
                  {staffInfo.department.name}
                  <span className={style.clearDept} onClick={clearDeptHandle}>
                    取消
                  </span>
                </div>
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
            <div className={style.title}>职位</div>
            <div className={style.value}>
              <input
                value={staffInfo.cardPosition}
                className={style.input}
                type="text"
                placeholder="请输入职位"
                maxLength={16}
                onChange={(e) => InputHandle(e, 'cardPosition')}
              />
            </div>
          </div>
          <div className={style.infoItem}>
            <div className={style.title}>描述</div>
            <div className={style.value} ref={descRef}>
              <input
                ref={allDescInputRef}
                value={staffInfo.desc}
                className={style.input}
                type="text"
                placeholder="请输入描述"
                maxLength={60}
                onChange={(e) => InputHandle(e, 'desc')}
              />
              {
                <div
                  ref={allDesc}
                  className={classNames(
                    style.allDesc,
                    { [style.active]: isShowAllDesc },
                    { [style.isHiddenAllDesc]: isHiddenAllDesc }
                  )}
                >
                  {staffInfo.desc}
                </div>
              }
            </div>
          </div>
          <div className={style.infoItem}>
            <div className={style.title}>标签</div>
            <div className={style.value}>
              {/* <div className={style.tagWrap}> */}
              {tagList?.map((tag) => (
                <Tag key={tag.tagId} className={style.tagItem} closable onClose={() => closeTagHandle(tag.tagId)}>
                  {tag.tagName}
                </Tag>
              ))}
              {/* </div> */}
              {tagList.length !== 4 &&
                (isShowInput
                  ? (
                  <input
                    ref={inputRef}
                    className={style.input}
                    value={staffInfo.tags}
                    type="text"
                    maxLength={12}
                    placeholder={'请输入标签名字'}
                    onChange={(e) => onChangeHandle(e)}
                    onBlur={(e) => onBlurHandle(e)}
                    onKeyDown={(e) => inputOnKeyDownHandle(e)}
                  />
                    )
                  : (
                  <Tag className={style.addTag} onClick={clickAddTagHandle}>
                    <Icon name="xinjian" />
                  </Tag>
                    ))}
            </div>
          </div>
          {/* </Form> */}
        </div>
      </Modal>
      <ChooseTreeModal
        chooseTreeParam={chooseTreeParam}
        staffInfo={staffInfo}
        setStaffInfo={setStaffInfo}
        setMultiVisible={setMultiVisible}
        setChooseTreeParam={setChooseTreeParam}
      />
    </>
  );
};
export default MultiSetting;
