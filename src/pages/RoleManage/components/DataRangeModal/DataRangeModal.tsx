import { Button, Form, Radio, Tag } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { getUserGroup } from 'src/apis/marketing';
import { NgModal } from 'src/components';
import UserGroupModal from 'src/pages/Marketing/Components/ModalSetUserRight/UserGroupModal';
import UserOrgModal from 'src/pages/Marketing/Components/ModalSetUserRight/UserOrgModal';

// import styles from './style.module.less';
import { ViewStaffModal } from 'src/pages/OrgManage/UserGroup/components';
// import classNames from 'classnames';

interface IDataRangeModalProps extends Omit<React.ComponentProps<typeof NgModal>, 'onOk'> {
  title?: string;
  onOk: (values: { groupId: string; isSet: boolean; defaultDataScope: 0 | 1 }) => void;
  groupId?: string | string[];
  defaultDataScope: 0 | 1;
}

const DataRangeModal: React.FC<IDataRangeModalProps> = ({
  title,
  groupId,
  visible,
  onOk,
  onCancel,
  defaultDataScope,
  ...props
}) => {
  const [rightForm] = Form.useForm();
  const [originValues, setOriginValues] = useState<any>();
  const [visibleStaffList, setVisibleStaffList] = useState({
    visible: false,
    add: false
  });
  const [formValues, setFormValues] = useState<{
    isSet: number;
    groupType: number;
    group1: any;
    group2: any;
    defaultDataScope: 0 | 1;
  }>({
    isSet: 0,
    groupType: 1,
    group1: undefined,
    group2: undefined,
    defaultDataScope: 1
  });
  // 是否设置过
  const [isSeted, setIsSeted] = useState(false);
  // 是否开启强制修改
  const [isForceSet, setIsForceSet] = useState(false);
  // const [,setIsDiff] = useState(false);
  const handleSubmit = () => {
    setOriginValues(null);
    rightForm.validateFields().then((values) => {
      const { group1, group2, isSet, groupType, defaultDataScope } = values;
      onOk?.({ groupId: groupType === 1 ? group1?.groupId : group2?.groupId, isSet, defaultDataScope });
    });
  };

  const getGroupDetail = async (groupId: string) => {
    const res = await getUserGroup({ groupId });
    const { groupType } = res;
    rightForm.setFieldsValue({
      groupType,
      isSet: 1,
      group1: groupType === 1 ? { ...res.groupInfo, groupId } : undefined,
      group2: groupType === 2 ? { ...res.orgInfo, groupId } : undefined,
      defaultDataScope
    });
    setFormValues((formValues) => ({
      ...formValues,
      isSet: 1,
      groupType,
      group1: groupType === 1 ? { ...res.groupInfo, groupId } : undefined,
      group2: groupType === 2 ? { ...res.orgInfo, groupId } : undefined,
      defaultDataScope
    }));
    !originValues && setOriginValues({ ...res.groupInfo, groupId, ...res.orgInfo, groupType });
  };
  const getGroup = async () => {
    setIsForceSet(false);
    setIsSeted(false);
    if (groupId) {
      await getGroupDetail(groupId as string);
    } else {
      setFormValues({
        isSet: 0,
        groupType: 1,
        group1: undefined,
        group2: undefined,
        defaultDataScope
      });
      rightForm.setFieldsValue({
        isSet: 0,
        groupType: 1,
        group1: undefined,
        group2: undefined,
        defaultDataScope
      });
    }
  };
  useEffect(() => {
    if (visible) {
      getGroup();
    }
  }, [visible]);
  const onValuesChange = (changeValues: any, values: any) => {
    const { groupType = 1, isSet, group1, group2, defaultDataScope } = values;
    // if (changeValues.groupType) {
    //   rightForm.setFieldsValue({
    //     group1: undefined,
    //     group12: undefined
    //   });
    // }
    setFormValues((formValues) => ({
      ...formValues,
      isSet,
      group1,
      group2,
      groupType,
      defaultDataScope
    }));
  };

  const handleCancel = (e: any) => {
    setOriginValues(null);
    setFormValues({
      isSet: 0,
      groupType: 1,
      group1: undefined,
      group2: undefined,
      defaultDataScope: 1
    });
    onCancel?.(e);
  };

  const staffCount = useMemo(() => {
    return formValues?.groupType === 1 ? formValues.group1?.staffNum || 0 : formValues.group2?.staffNum || 0;
  }, [formValues]);

  return (
    <>
      <NgModal
        forceRender
        visible={visible}
        title={title || '修改管辖范围'}
        width="570px"
        onOk={handleSubmit}
        onCancel={handleCancel}
        {...props}
      >
        <Form
          form={rightForm}
          initialValues={formValues}
          onValuesChange={(changeValues, values) => {
            onValuesChange(changeValues, values);
          }}
        >
          <Form.Item label="默认管辖范围：" required name={'defaultDataScope'}>
            <Radio.Group>
              <Radio value={0}>关闭</Radio>
              <Radio value={1}>开启</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="配置管辖范围：" required>
            <Form.Item name={'isSet'}>
              <Radio.Group disabled={isSeted && !isForceSet}>
                <Radio value={0}>关闭</Radio>
                <Radio value={1}>开启</Radio>
              </Radio.Group>
            </Form.Item>
            {formValues.isSet && !(isSeted && !isForceSet)
              ? (
              <>
                <Form.Item name={'groupType'}>
                  <Radio.Group>
                    <Radio value={1}>按照用户组选择</Radio>
                    <Radio value={2}>按照组织架构选择</Radio>
                  </Radio.Group>
                </Form.Item>
                {formValues.groupType === 1
                  ? (
                  <Form.Item name={'group1'} key="groupModal">
                    <UserGroupModal />
                  </Form.Item>
                    )
                  : (
                  <Form.Item name={'group2'} key="orgModal">
                    <UserOrgModal />
                  </Form.Item>
                    )}
                <Form.Item>
                  上次选择的可见范围为：
                  {originValues?.groupType === 1
                    ? (
                        originValues?.groupName || '全部人员'
                      )
                    : (
                    <>
                      {originValues?.deptList?.map((item: any) => (
                        <Tag key={item.deptId}>{item.deptName}</Tag>
                      ))}
                      {originValues?.staffList?.map((item: any) => (
                        <Tag key={item.staffId}>{item.staffName}</Tag>
                      ))}
                      {!originValues?.deptList && !originValues?.staffList && '全部人员'}
                    </>
                      )}
                </Form.Item>
                <Form.Item>
                  <span>
                    截止目前时间：共计人数
                    {staffCount}人
                  </span>
                  {staffCount > 0 && (
                    <Button
                      type="link"
                      onClick={() =>
                        setVisibleStaffList((visibleStaffList) => ({ ...visibleStaffList, visible: true }))
                      }
                    >
                      查看人员
                    </Button>
                  )}
                </Form.Item>
              </>
                )
              : null}
          </Form.Item>
        </Form>
        <ViewStaffModal
          modalParam={{
            visible: visibleStaffList.visible,
            add: false,
            filterId: formValues?.groupType === 1 ? formValues.group1?.groupId : formValues.group2?.groupId
          }}
          setModalParam={setVisibleStaffList}
        ></ViewStaffModal>
      </NgModal>
    </>
  );
};

export default DataRangeModal;
