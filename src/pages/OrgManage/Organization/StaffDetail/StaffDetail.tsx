import React, { useEffect, useState } from 'react';

import { Breadcrumb, Button, Col, Form, Row } from 'antd';
import classNames from 'classnames';
import { getStaffDetail } from 'src/apis/orgManage';

import { EditText } from './Components/EditTextProps';
import styles from './style.module.less';

interface StaffDetailProps {
  staffId: string;
  navigation?: () => void;
}

const StaffDetail: React.FC<StaffDetailProps> = ({ staffId, navigation }) => {
  const [listForm] = Form.useForm();
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [staffInfo, setStaffInfo] = useState<{ [propKey: string]: any }>({
    staffName: '',
    avatar: '',
    isLeader: 0,
    jobNumber: '',
    resource: ''
  });

  const navigatorToList: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault();
    console.log('aa');
    navigation?.();
  };

  const getDetail = async () => {
    console.log(staffInfo);
    const res = await getStaffDetail({ staffId });
    if (res) {
      setStaffInfo(res);
    }
  };

  const [formParams] = useState({
    phone: 18575544959,
    date: '2021-12-15'
  });
  useEffect(() => {
    getDetail();
    listForm.setFieldsValue(formParams);
  }, []);

  const onFinish = (values: any) => {
    console.log('onFinish', values);
    setIsReadOnly(true);
  };
  // const onSubmit = () => {
  //   listForm.submit();
  // };
  return (
    <div className={styles.staff_container}>
      <header className={styles.header}>
        <div className={styles.breadcrumbWrap}>
          <span>当前位置：</span>
          <Breadcrumb>
            <a onClick={navigatorToList}>
              <Breadcrumb.Item>标签配置</Breadcrumb.Item>
            </a>
            <Breadcrumb.Item>保存与推送记录</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </header>
      <div className={styles.staff_content}>
        {isReadOnly
          ? (
          <Button className={styles.editBtn} shape="round" htmlType="button" onClick={() => setIsReadOnly(false)}>
            修改信息
          </Button>
            )
          : null}
        <Form form={listForm} onFinish={onFinish}>
          {!isReadOnly && (
            <Button className={styles.editBtn} shape="round" htmlType="submit">
              确定修改
            </Button>
          )}
          <Row gutter={20}>
            <Col span={7} xxl={6}>
              <div className={styles.colBox}>
                <dl className={classNames(styles.staffMainInfo, 'flex vertical align-center')}>
                  <dt className={styles.avatar}>
                    <img src={staffInfo.avatar} alt="" />
                  </dt>
                  <dd>
                    <span className={classNames(styles.staffName, 'font16 bold')}>{staffInfo.staffName}</span>
                    <span className={classNames(styles.staffGender, 'font12 color-text-regular')}>
                      / {staffInfo.gender ? '女士' : '男士'}
                    </span>
                  </dd>
                  <dd className={styles.staffTag}>
                    <span className={styles.staffTag_primary}>{staffInfo.isDeleted ? '离职' : '在职'}</span>\
                    {staffInfo.isLeader ? <span className={styles.staffTag_warning}>上级</span> : null}
                  </dd>
                </dl>
                <ul className={styles.infoList}>
                  <li className={styles.infoItem}>
                    <span>企微账号：</span>
                    {staffInfo.userId}
                  </li>
                  <li className={styles.infoItem}>
                    <Form.Item label="工号" rules={[{ required: true }]} name="jobNumber">
                      <EditText type="text" readOnly={isReadOnly} />
                    </Form.Item>
                  </li>
                  <li className={styles.infoItem}>
                    <Form.Item label="手机号" name="mobile">
                      <EditText readOnly={isReadOnly} />
                    </Form.Item>
                  </li>
                  <li className={styles.infoItem}>
                    <Form.Item label="年龄段" name="ageLevel">
                      <EditText readOnly={isReadOnly} />
                    </Form.Item>
                  </li>
                  <li className={styles.infoItem}>
                    <Form.Item label="司龄段" name="corpAgeLevel">
                      <EditText readOnly={isReadOnly} />
                    </Form.Item>
                  </li>
                  <li className={styles.infoItem}>
                    <Form.Item label="级别简称" name="classLevel">
                      <EditText readOnly={isReadOnly} />
                    </Form.Item>
                  </li>
                </ul>
              </div>
            </Col>
            <Col span={8} xxl={9}>
              <div>
                <div className={styles.colBox}>
                  <div className={styles.cardTitle}>
                    <span>部门信息</span>
                    <span className={classNames(styles.cardTitle_extra, 'color-text-regular')}>
                      战报/排行榜/任务系统
                    </span>
                  </div>
                  <ul className={styles.infoList}>
                    <li className={styles.infoItem}>
                      <span>部门：</span>
                      {staffInfo.fullDeptName}
                    </li>
                    <li className={styles.infoItem}>
                      <Form.Item label="业务模式" required name="businessModel">
                        <EditText readOnly={isReadOnly} />
                      </Form.Item>
                    </li>
                    <li className={styles.infoItem}>
                      <Form.Item label="业务地区" required name="businessArea">
                        <EditText readOnly={isReadOnly} />
                      </Form.Item>
                    </li>
                    <li className={styles.infoItem}>
                      <Form.Item label="办公职场" required name="officePlace">
                        <EditText readOnly={isReadOnly} />
                      </Form.Item>
                    </li>
                  </ul>
                </div>
                <div className={classNames(styles.colBox, 'mt20')}>
                  <div className={styles.cardTitle}>
                    <span>对外信息</span>
                  </div>
                  <ul className={styles.infoList}>
                    <li className={styles.infoItem}>
                      <Form.Item label="姓名" required name="name">
                        <EditText readOnly={isReadOnly} />
                      </Form.Item>
                    </li>
                    <li className={styles.infoItem}>
                      <Form.Item label="部门" required name="depart">
                        <EditText readOnly={isReadOnly} />
                      </Form.Item>
                    </li>
                    <li className={styles.infoItem}>
                      <Form.Item label="岗位" required name="cardPosition">
                        <EditText readOnly={isReadOnly} />
                      </Form.Item>
                    </li>
                    <li className={styles.infoItem}>
                      <Form.Item label="标签" required name="tags">
                        <EditText readOnly={isReadOnly} />
                      </Form.Item>
                    </li>
                    <li className={styles.infoItem}>
                      <Form.Item label="描述" required name="desc">
                        <EditText readOnly={isReadOnly} />
                      </Form.Item>
                    </li>
                    <li className={styles.infoItem}>
                      <Form.Item label="证书编号" required name="certNo">
                        <EditText readOnly={isReadOnly} />
                      </Form.Item>
                    </li>
                  </ul>
                </div>
              </div>
            </Col>
            <Col span={9}>
              <div className={styles.colBox}>
                <div className={styles.cardTitle}>
                  <span>个人信息</span>
                </div>
                <ul className={styles.infoList}>
                  <li className={styles.infoItem}>
                    <Form.Item label="职位" required name="position">
                      <EditText readOnly={isReadOnly} />
                    </Form.Item>
                  </li>
                  <li className={styles.infoItem}>
                    <Form.Item label="级别" name="agentLevel">
                      <EditText readOnly={isReadOnly} />
                    </Form.Item>
                  </li>
                  <li className={styles.infoItem}>
                    <Form.Item label="入职时间" name="employDate">
                      <EditText type="date" readOnly={isReadOnly} />
                    </Form.Item>
                  </li>
                  <li className={styles.infoItem}>
                    <Form.Item label="出生时间" name="birthdayDate">
                      <EditText type="date" readOnly={isReadOnly} />
                    </Form.Item>
                  </li>
                  <li className={styles.infoItem}>
                    <Form.Item label="出生城市" name="bornCity">
                      <EditText type="text" readOnly={isReadOnly} />
                    </Form.Item>
                  </li>
                  <li className={styles.infoItem}>
                    <Form.Item label="居住城市" name="liveCity">
                      <EditText type="text" readOnly={isReadOnly} />
                    </Form.Item>
                  </li>
                  <li className={styles.infoItem}>
                    <Form.Item label="籍贯" name="origCity">
                      <EditText readOnly={isReadOnly} />
                    </Form.Item>
                  </li>
                  <li className={styles.infoItem}>
                    <Form.Item label="户籍" name="houseType">
                      <EditText readOnly={isReadOnly} />
                    </Form.Item>
                  </li>
                  <li className={styles.infoItem}>
                    <Form.Item label="婚姻状况" name="mariStatus">
                      <EditText readOnly={isReadOnly} />
                    </Form.Item>
                  </li>
                  <li className={styles.infoItem}>
                    <Form.Item label="参加工作时间" name="startWorktime">
                      <EditText readOnly={isReadOnly} type="date" />
                    </Form.Item>
                  </li>
                  <li className={styles.infoItem}>
                    <Form.Item label="全日制最高学历" name="education">
                      <EditText readOnly={isReadOnly} />
                    </Form.Item>
                  </li>
                  <li className={styles.infoItem}>
                    <Form.Item label="全日制毕业时间" name="gradDate">
                      <EditText readOnly={isReadOnly} type="date" />
                    </Form.Item>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
};

export default StaffDetail;
