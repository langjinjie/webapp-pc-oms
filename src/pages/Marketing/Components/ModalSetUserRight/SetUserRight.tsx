import { Button, Form, Radio, Tag } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { getUserGroup } from 'src/apis/marketing';
import { NgModal } from 'src/components';
import UserGroupModal from './UserGroupModal';
import UserOrgModal from './UserOrgModal';

import styles from './style.module.less';
import { isArray } from 'src/utils/tools';
import { ViewStaffModal } from 'src/pages/OrgManage/UserGroup/components';
import classNames from 'classnames';

interface SetUserRightProps extends Omit<React.ComponentProps<typeof NgModal>, 'onOk'> {
  title?: string;
  onOk: (values: { isBatch?: boolean; groupId: string; isSet: boolean }) => void;
  groupId?: string | string[];
  isBatch?: boolean;
}

export const SetUserRight: React.FC<SetUserRightProps> = ({
  title,
  groupId,
  visible,
  onOk,
  onCancel,
  isBatch,
  ...props
}) => {
  const [rightForm] = Form.useForm();
  const [originValues, setOriginValues] = useState<any>();
  const [visibleStaffList, setVisibleStaffList] = useState({
    visible: false,
    add: false
  });
  const [formValues, setFormValues] = useState<{ isSet: number; groupType: number; group1: any; group2: any }>({
    isSet: 0,
    groupType: 1,
    group1: undefined,
    group2: undefined
  });
  // 是否设置过
  const [isSeted, setIsSeted] = useState(false);
  // 是否开启强制修改
  const [isForceSet, setIsForceSet] = useState(false);
  // const [,setIsDiff] = useState(false);
  const handleSubmit = () => {
    setOriginValues(null);
    rightForm.validateFields().then((values) => {
      const { group1, group2, isSet, groupType } = values;
      onOk?.({ groupId: groupType === 1 ? group1?.groupId : group2?.groupId, isSet, isBatch });
    });
  };

  const getGroupDetail = async (groupId: string) => {
    const res = await getUserGroup({ groupId });
    const { groupType } = res;
    rightForm.setFieldsValue({
      groupType,
      isSet: 1,
      group1: groupType === 1 ? { ...res.groupInfo, groupId } : undefined,
      group2: groupType === 2 ? { ...res.orgInfo, groupId } : undefined
    });
    setFormValues((formValues) => ({
      ...formValues,
      isSet: 1,
      groupType,
      group1: groupType === 1 ? { ...res.groupInfo, groupId } : undefined,
      group2: groupType === 2 ? { ...res.orgInfo, groupId } : undefined
    }));
    !originValues && setOriginValues({ ...res.groupInfo, groupId, ...res.orgInfo, groupType });
  };
  const getGroup = async () => {
    setIsForceSet(false);
    setIsSeted(false);
    if (isArray(groupId)) {
      if (groupId && groupId?.length === 1) {
        // setIsDiff(false);
        // todo, 判断是否设置过
        if (groupId[0]) {
          await getGroupDetail(groupId[0]);
          setIsSeted(true);
        } else {
          setIsSeted(false);
          setFormValues({
            isSet: 0,
            groupType: 1,
            group1: undefined,
            group2: undefined
          });
          rightForm.setFieldsValue({
            isSet: 0,
            groupType: 1,
            group1: undefined,
            group2: undefined
          });
        }
      } else if (groupId && groupId?.length > 1) {
        // 存在不同的分组，清空表单
        // setIsDiff(true);
        setIsSeted(true);
        setFormValues({
          isSet: 0,
          groupType: 1,
          group1: undefined,
          group2: undefined
        });
        rightForm.setFieldsValue({
          isSet: 0,
          groupType: 1,
          group1: undefined,
          group2: undefined
        });
      }
      return false;
    } else if (groupId) {
      await getGroupDetail(groupId as string);
    } else {
      setFormValues({
        isSet: 0,
        groupType: 1,
        group1: undefined,
        group2: undefined
      });
      rightForm.setFieldsValue({
        isSet: 0,
        groupType: 1,
        group1: undefined,
        group2: undefined
      });
    }
  };
  useEffect(() => {
    if (visible) {
      getGroup();
    }
  }, [visible]);
  const onValuesChange = (changeValues: any, values: any) => {
    const { groupType = 1, isSet } = values;
    setFormValues((formValues) => ({
      ...formValues,
      isSet,
      ...changeValues,
      groupType
    }));
  };

  const handleCancel = (e: any) => {
    setOriginValues(null);
    setFormValues({
      isSet: 0,
      groupType: 1,
      group1: undefined,
      group2: undefined
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
        title={title || (isBatch ? '批量修改可见范围' : '修改可见范围')}
        width="570px"
        onOk={handleSubmit}
        onCancel={handleCancel}
        {...props}
      >
        {isBatch && (
          <>
            {isSeted
              ? (
              <div className={classNames(styles.tips, 'flex mb10')}>
                <span className="flex cell fixed">提示：</span>
                <span className="cell">
                  <span>目前选择的内容已配置可见范围，如果修改，则会批量覆盖数据，请谨慎操作系统</span>
                  <Button
                    type="primary"
                    className={styles.openChangeBtn}
                    size="small"
                    ghost
                    onClick={() => setIsForceSet(true)}
                  >
                    开启修改
                  </Button>
                </span>
              </div>
                )
              : (
              <div className={classNames(styles.tips, 'mb10')}>
                提示：目前选择的内容未配置可见范围，如修改后则会批量配置可见数据
              </div>
                )}
          </>
        )}
        <Form
          form={rightForm}
          initialValues={formValues}
          onValuesChange={(changeValues, values) => {
            onValuesChange(changeValues, values);
          }}
        >
          <Form.Item label="可见范围设置：" required>
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
                    <Radio value={1}>按照员工组选择</Radio>
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
                        <Tag className={styles.tag} key={item.deptId}>
                          {item.deptName}
                        </Tag>
                      ))}
                      {originValues?.staffList?.map((item: any) => (
                        <Tag className={styles.tag} key={item.staffId}>
                          {item.staffName}
                        </Tag>
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
