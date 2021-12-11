import { Breadcrumb, Button, Col, Row } from 'antd';
import classNames from 'classnames';
import React from 'react';
import styles from './style.module.less';

const StaffDetail: React.FC = () => {
  const navigatorToList = () => {
    console.log('aa');
  };
  return (
    <div className={styles.staff_container}>
      <header className={styles.header}>
        <div className={styles.breadcrumbWrap}>
          <span>当前位置：</span>
          <Breadcrumb>
            <a
              href="javascript:void(0);"
              onClick={() => {
                navigatorToList();
              }}
            >
              <Breadcrumb.Item>标签配置</Breadcrumb.Item>
            </a>
            <Breadcrumb.Item>保存与推送记录</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </header>
      <div className={styles.staff_content}>
        <Button className={styles.editBtn} shape="round">
          修改信息
        </Button>
        <Row gutter={20}>
          <Col span={7} xxl={6}>
            <div className={styles.colBox}>
              <dl className={classNames(styles.staffMainInfo, 'flex vertical align-center')}>
                <dt className={styles.avatar}></dt>
                <dd>
                  <span className={classNames(styles.staffName, 'font16 bold')}>李思思思</span>
                  <span className={classNames(styles.staffGender, 'font12 color-text-regular')}> / 女士</span>
                </dd>
                <dd className={styles.staffTag}>
                  <span className={styles.staffTag_primary}>在职</span>
                  <span className={styles.staffTag_warning}>上级</span>
                </dd>
              </dl>
              <ul className={styles.infoList}>
                <li className={styles.infoItem}>
                  <span>企微账号：</span>
                  123454
                </li>
                <li className={styles.infoItem}>
                  <span>工号：</span>
                  123454
                </li>
                <li className={styles.infoItem}>
                  <span>手机号：</span>
                  123454
                </li>
              </ul>
            </div>
          </Col>
          <Col span={8} xxl={9}>
            <div>
              <div className={styles.colBox}>
                <div className={styles.cardTitle}>
                  <span>部门信息</span>
                  <span className={classNames(styles.cardTitle_extra, 'color-text-regular')}>战报/排行榜/任务系统</span>
                </div>
                <ul className={styles.infoList}>
                  <li className={styles.infoItem}>
                    <span>部门：</span>
                    电销中心/续保团队/广东地区
                  </li>
                  <li className={styles.infoItem}>
                    <span>业务模式：</span>
                    123454
                  </li>
                  <li className={styles.infoItem}>
                    <span>业务地区：</span>
                    123454
                  </li>
                  <li className={styles.infoItem}>
                    <span>办公职场：</span>
                    123454
                  </li>
                </ul>
              </div>
              <div className={classNames(styles.colBox, 'mt20')}>
                <div className={styles.cardTitle}>
                  <span>对外信息</span>
                </div>
                <ul className={styles.infoList}>
                  <li className={styles.infoItem}>
                    <span>姓名：</span>
                    电销中心/续保团队/广东地区
                  </li>
                  <li className={styles.infoItem}>
                    <span>部门：</span>
                    123454
                  </li>
                  <li className={styles.infoItem}>
                    <span>业务地区：</span>
                    123454
                  </li>
                  <li className={styles.infoItem}>
                    <span>办公职场：</span>
                    123454
                  </li>
                </ul>
              </div>
            </div>
          </Col>
          <Col span={9}>
            <div className={styles.colBox}>
              <div className={styles.cardTitle}>
                <span>对外信息</span>
              </div>
              <ul className={styles.infoList}>
                <li className={styles.infoItem}>
                  <span>姓名：</span>
                  电销中心/续保团队/广东地区
                </li>
                <li className={styles.infoItem}>
                  <span>部门：</span>
                  123454
                </li>
                <li className={styles.infoItem}>
                  <span>业务地区：</span>
                  123454
                </li>
                <li className={styles.infoItem}>
                  <span>办公职场：</span>
                  123454
                </li>
                <li className={styles.infoItem}>
                  <span>业务地区：</span>
                  123454
                </li>
                <li className={styles.infoItem}>
                  <span>办公职场：</span>
                  123454
                </li>
                <li className={styles.infoItem}>
                  <span>业务地区：</span>
                  123454
                </li>
                <li className={styles.infoItem}>
                  <span>办公职场：</span>
                  123454
                </li>
                <li className={styles.infoItem}>
                  <span>业务地区：</span>
                  123454
                </li>
                <li className={styles.infoItem}>
                  <span>办公职场：</span>
                  123454
                </li>
              </ul>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default StaffDetail;
