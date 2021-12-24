import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router';
import { Breadcrumb, Button, Col, Form, message, Row } from 'antd';
import classNames from 'classnames';
import { getStaffDetail, saveStaffDetail } from 'src/apis/orgManage';

import { EditText } from './Components/EditTextProps';
import styles from './style.module.less';
import { isPhoneNo } from 'src/utils/tools';
import { URLSearchParams } from 'src/utils/base';

interface StaffDetailProps {
  staffId: string;
}

const StaffDetail: React.FC<StaffDetailProps> = ({ staffId }) => {
  const [listForm] = Form.useForm();
  const [isReadOnly, setIsReadOnly] = useState(true);
  const routerLocation = useLocation();
  const routerHistory = useHistory();
  const [staffInfo, setStaffInfo] = useState<{ [propKey: string]: any }>({
    staffName: '',
    avatar: '',
    isLeader: 0,
    jobNumber: '',
    resource: ''
  });

  const navigatorToList: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault();
    routerHistory.push('/organization');
  };

  const getDetail = async () => {
    setIsReadOnly(true);
    if (!staffId) {
      const { staffId: currentStaffId } = URLSearchParams(routerLocation.search) as { [key: string]: string };
      staffId = currentStaffId;
    }
    const res = await getStaffDetail({ staffId });
    if (res) {
      listForm.setFieldsValue(res.staffExtInfo);
      setStaffInfo(res.staffExtInfo);
    }
  };

  useEffect(() => {
    getDetail();
  }, [staffId]);

  const onFinish = async (values: any) => {
    const res = await saveStaffDetail({
      ...staffInfo,
      ...values
    });
    if (res) {
      message.success('保存成功');
    }
    setIsReadOnly(true);
  };
  // const onSubmit = () => {
  //   listForm.submit();
  // };

  const validatorPhone = (_: any, value: string): any => {
    if (value && !isPhoneNo(value)) {
      return Promise.reject(new Error('请输入正确的手机号'));
    } else {
      return Promise.resolve();
    }
  };

  const validatorTags = (_: any, value: string) => {
    if (!value) {
      return Promise.resolve();
    } else {
      const lightsValues = value.replace(/，/gi, ',');
      let lightsArr: string[] = [];
      lightsArr = lightsValues.split(',');

      if (lightsArr.length > 0) {
        let isMaxLengthError = false;
        lightsArr.forEach((light) => {
          if (light.length > 16) {
            isMaxLengthError = true;
          }
        });
        if (isMaxLengthError) {
          return Promise.reject(new Error('单一标签最多12个字'));
        }
      }
      if (lightsArr.length > 4) {
        return Promise.reject(new Error('最多可以添加4个标签'));
      }
      return Promise.resolve();
    }
  };
  return (
    <div className={styles.staff_container}>
      <header className={styles.header}>
        {!staffId
          ? (
          <div className={styles.breadcrumbWrap}>
            <span>当前位置：</span>
            <Breadcrumb>
              <Breadcrumb.Item className={styles.pointer} onClick={navigatorToList}>
                标签配置
              </Breadcrumb.Item>
              <Breadcrumb.Item>保存与推送记录</Breadcrumb.Item>
            </Breadcrumb>
          </div>
            )
          : null}
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
                      / {staffInfo.gender === 2 ? '女士' : '男士'}
                    </span>
                  </dd>
                  <dd className={styles.staffTag}>
                    <span className={styles.staffTag_primary}>{staffInfo.isDeleted ? '离职' : '在职'}</span>
                    {staffInfo.isLeader
                      ? (
                      <span>
                        \<span className={styles.staffTag_warning}>上级</span>
                      </span>
                        )
                      : null}
                  </dd>
                </dl>
                <ul className={styles.infoList}>
                  <li className={styles.infoItem}>
                    <span>企微账号：</span>
                    {staffInfo.userId}
                  </li>
                  <li className={styles.infoItem}>
                    <Form.Item
                      label="工号"
                      name="jobNumber"
                      rules={[
                        {
                          type: 'string',
                          max: 30
                        },
                        {
                          required: true
                        }
                      ]}
                    >
                      <EditText type="text" readOnly={isReadOnly} />
                    </Form.Item>
                  </li>
                  <li className={styles.infoItem}>
                    <Form.Item
                      label="手机号"
                      name="mobile"
                      rules={[
                        {
                          validator: validatorPhone
                        }
                      ]}
                    >
                      <EditText readOnly={isReadOnly} />
                    </Form.Item>
                  </li>
                  <li className={styles.infoItem}>
                    <Form.Item
                      label="年龄段"
                      name="ageLevel"
                      rules={[
                        {
                          type: 'string',
                          max: 30
                        }
                      ]}
                    >
                      <EditText readOnly={isReadOnly} />
                    </Form.Item>
                  </li>
                  <li className={styles.infoItem}>
                    <Form.Item
                      label="司龄段"
                      name="corpAgeLevel"
                      rules={[
                        {
                          type: 'string',
                          max: 30
                        }
                      ]}
                    >
                      <EditText readOnly={isReadOnly} />
                    </Form.Item>
                  </li>
                  <li className={styles.infoItem}>
                    <Form.Item
                      label="级别简称"
                      name="classLevel"
                      rules={[
                        {
                          type: 'string',
                          max: 30
                        }
                      ]}
                    >
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
                      <Form.Item
                        label="资源"
                        name="resource"
                        rules={[
                          {
                            type: 'string',
                            max: 100,
                            required: true
                          }
                        ]}
                      >
                        <EditText readOnly={isReadOnly} />
                      </Form.Item>
                    </li>
                    <li className={styles.infoItem}>
                      <Form.Item
                        label="业务模式"
                        name="businessModel"
                        rules={[
                          {
                            type: 'string',
                            max: 100,
                            required: true
                          }
                        ]}
                      >
                        <EditText readOnly={isReadOnly} />
                      </Form.Item>
                    </li>
                    <li className={styles.infoItem}>
                      <Form.Item
                        label="业务地区"
                        name="businessArea"
                        rules={[
                          {
                            type: 'string',
                            max: 30,
                            required: true
                          }
                        ]}
                      >
                        <EditText readOnly={isReadOnly} />
                      </Form.Item>
                    </li>
                    <li className={styles.infoItem}>
                      <Form.Item
                        label="办公职场"
                        name="officePlace"
                        rules={[
                          {
                            type: 'string',
                            max: 30,
                            required: true
                          }
                        ]}
                      >
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
                      <Form.Item label="姓名" required name="staffName">
                        <EditText readOnly={true} />
                      </Form.Item>
                    </li>
                    <li className={styles.infoItem}>
                      <Form.Item
                        label="部门"
                        name="depart"
                        rules={[
                          {
                            required: true,
                            type: 'string',
                            max: 100
                          }
                        ]}
                      >
                        <EditText readOnly={isReadOnly} />
                      </Form.Item>
                    </li>
                    <li className={styles.infoItem}>
                      <Form.Item
                        label="岗位"
                        required
                        name="cardPosition"
                        rules={[
                          {
                            required: true,
                            type: 'string',
                            max: 100
                          }
                        ]}
                      >
                        <EditText readOnly={isReadOnly} />
                      </Form.Item>
                    </li>
                    <li className={styles.infoItem}>
                      <Form.Item
                        label="标签"
                        required
                        name="tags"
                        rules={[
                          {
                            required: true,
                            type: 'string',
                            max: 60
                          },
                          {
                            validator: validatorTags
                          }
                        ]}
                      >
                        <EditText
                          placeholder="最多可以添加4个标签,单一标签字数上限为12字,标签以英文逗号隔开"
                          type="textArea"
                          readOnly={isReadOnly}
                        />
                      </Form.Item>
                    </li>
                    <li className={styles.infoItem}>
                      <Form.Item
                        label="描述"
                        required
                        name="desc"
                        rules={[
                          {
                            required: true,
                            type: 'string',
                            max: 60
                          }
                        ]}
                      >
                        <EditText readOnly={isReadOnly} type="textArea" />
                      </Form.Item>
                    </li>
                    <li className={styles.infoItem}>
                      <Form.Item
                        label="证书编号"
                        name="certNo"
                        rules={[
                          {
                            type: 'string',
                            max: 60
                          }
                        ]}
                      >
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
                    <Form.Item
                      label="职位"
                      name="position"
                      rules={[
                        {
                          required: true,
                          type: 'string',
                          max: 30
                        }
                      ]}
                    >
                      <EditText readOnly={isReadOnly} />
                    </Form.Item>
                  </li>
                  <li className={styles.infoItem}>
                    <Form.Item
                      label="级别"
                      name="agentLevel"
                      rules={[
                        {
                          type: 'string',
                          max: 30
                        }
                      ]}
                    >
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
                    <Form.Item
                      label="出生城市"
                      name="bornCity"
                      rules={[
                        {
                          type: 'string',
                          max: 30
                        }
                      ]}
                    >
                      <EditText type="text" readOnly={isReadOnly} />
                    </Form.Item>
                  </li>
                  <li className={styles.infoItem}>
                    <Form.Item
                      label="居住城市"
                      name="liveCity"
                      rules={[
                        {
                          type: 'string',
                          max: 30
                        }
                      ]}
                    >
                      <EditText type="text" readOnly={isReadOnly} />
                    </Form.Item>
                  </li>
                  <li className={styles.infoItem}>
                    <Form.Item
                      label="籍贯"
                      name="origCity"
                      rules={[
                        {
                          type: 'string',
                          max: 30
                        }
                      ]}
                    >
                      <EditText readOnly={isReadOnly} />
                    </Form.Item>
                  </li>
                  <li className={styles.infoItem}>
                    <Form.Item
                      label="户籍"
                      name="houseType"
                      rules={[
                        {
                          type: 'string',
                          max: 30
                        }
                      ]}
                    >
                      <EditText readOnly={isReadOnly} />
                    </Form.Item>
                  </li>
                  <li className={styles.infoItem}>
                    <Form.Item
                      label="婚姻状况"
                      name="mariStatus"
                      rules={[
                        {
                          type: 'string',
                          max: 30
                        }
                      ]}
                    >
                      <EditText readOnly={isReadOnly} />
                    </Form.Item>
                  </li>
                  <li className={styles.infoItem}>
                    <Form.Item label="参加工作时间" name="startWorktime">
                      <EditText readOnly={isReadOnly} type="date" />
                    </Form.Item>
                  </li>
                  <li className={styles.infoItem}>
                    <Form.Item
                      label="全日制最高学历"
                      name="education"
                      rules={[
                        {
                          type: 'string',
                          max: 30
                        }
                      ]}
                    >
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
