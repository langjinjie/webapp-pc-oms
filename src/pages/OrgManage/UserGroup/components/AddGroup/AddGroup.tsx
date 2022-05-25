import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { ChooseTags, StaffList, ViewStaffModal } from '../index';
import { requestGetFilterGroup, requestAddGroup, requestGetGroupDetail } from 'src/apis/orgManage';
import { URLSearchParams } from 'src/utils/base';
import style from './style.module.less';

const AddGroup: React.FC = () => {
  const [filterCount, setFilterCount] = useState(0);
  const [readOnly, setReadOnly] = useState(false);
  const [modalParam, setModalParam] = useState<{ visible: boolean; filterId: string; add?: boolean }>({
    visible: false,
    filterId: '',
    add: true
  });
  const history = useHistory();
  const location = useLocation();
  const clickBreadCrumbs = () => {
    history.replace('/userGroup');
  };
  const [form] = Form.useForm();
  // 点击筛选
  const filterHandle = async () => {
    const { groupTagList, staffList } = form.getFieldsValue();
    const res = await requestGetFilterGroup({ groupTagList, staffList });
    if (res) {
      setFilterCount(res.totalCount);
      setModalParam((param) => ({ ...param, filterId: res.filterId, add: true }));
    }
  };
  // 取消新增
  const cancelAddGruop = () => {
    history.replace('/userGroup');
  };
  // 提交新增
  const onFinish = async (values: any) => {
    const groupId = URLSearchParams(location.search).groupId;
    const param = { ...values, filterId: modalParam.add ? modalParam.filterId : undefined, groupId };
    const res = await requestAddGroup(param);
    if (res) {
      message.success(groupId ? '用户组编辑成功' : '用户组添加成功');
      history.replace('/userGroup');
    }
  };
  // 查看人员
  const viewStaff = () => {
    if (!modalParam.filterId) return message.info('筛选id不能为空');
    setModalParam((param) => ({ ...param, visible: true }));
  };
  // 获取用户组详情
  const getGroupDetail = async () => {
    const urlSearch = URLSearchParams(location.search);
    if (urlSearch.groupId) {
      const res = await requestGetGroupDetail({ groupId: urlSearch.groupId });
      if (res) {
        form.setFieldsValue(res);
        setFilterCount(res.staffNum);
      }
      if (urlSearch.type === 'view') {
        setReadOnly(true);
      }
      setModalParam((param) => ({ ...param, filterId: urlSearch.groupId as string, add: false }));
    }
  };
  useEffect(() => {
    getGroupDetail();
  }, []);
  return (
    <div className={style.wrap}>
      <div className={style.breadcrumbs}>
        当前位置：
        <span className={style.goBack} onClick={clickBreadCrumbs}>
          用户组管理
        </span>
        <span className={style.line}>/</span>
        <span className={style.current}>
          {URLSearchParams(location.search).type
            ? URLSearchParams(location.search).type === 'view'
              ? '查看'
              : '修改'
            : '新增'}
          用户组
        </span>
      </div>
      <div className={style.title}>
        {URLSearchParams(location.search).type
          ? URLSearchParams(location.search).type === 'view'
            ? '查看'
            : '修改'
          : '新增'}
        用户组
      </div>
      <Form form={form} className={style.form} onFinish={onFinish}>
        <div className={style.title}>用户组基本信息</div>
        <Form.Item name="groupName" label="用户组名称：" required>
          <Input placeholder="待输入" allowClear style={{ width: 300 }} showCount maxLength={30} readOnly={readOnly} />
        </Form.Item>
        <Form.Item name="desc" label="用户组说明：" required>
          <Input.TextArea
            className={style.textArea}
            placeholder="待输入"
            allowClear
            showCount
            maxLength={100}
            style={{ width: 600 }}
            readOnly={readOnly}
          />
        </Form.Item>
        <div className={style.title}>用户组人员配置</div>
        <Form.Item name="groupTagList" label="标签选择：">
          <ChooseTags readOnly={readOnly} />
        </Form.Item>
        <Form.Item name="staffList" label="单独配置人员：">
          <StaffList readOnly={readOnly} />
        </Form.Item>
        <Button className={style.filterBtn} type="primary" onClick={filterHandle} disabled={readOnly}>
          点击筛选
        </Button>
        <div className={style.filterResult}>
          截至目前时间：共筛除：{filterCount}人。人员名单点击此处
          <span className={style.checkDetail} onClick={viewStaff}>
            查看详情
          </span>
        </div>
        {readOnly || (
          <div className={style.btnWrap}>
            <Button className={style.cancel} onClick={cancelAddGruop}>
              取消
            </Button>
            <Button className={style.submit} htmlType="submit" type="primary">
              确定
            </Button>
          </div>
        )}
      </Form>
      <ViewStaffModal modalParam={modalParam} setModalParam={setModalParam} />
    </div>
  );
};
export default AddGroup;
