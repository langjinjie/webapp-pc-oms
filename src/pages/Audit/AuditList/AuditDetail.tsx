import React, { useEffect, useRef, useState } from 'react';
import { Breadcrumb, Input, message, PaginationProps, Steps } from 'antd';
import { RouteComponentProps } from 'react-router-dom';
import { NgTable } from 'src/components';
import { AuditCustomerColumn, auditTypeOptions, statusOptions, TableColsOfCustomer } from './AuditListConfig';

import styles from './style.module.less';
import { Icon } from 'tenacity-ui';
import { auditOperate, getAuditApplyDetail, getAuditDetailByApplyId } from 'src/apis/audit';
import { UNKNOWN, urlSearchParams } from 'src/utils/base';

interface NoteProps {
  handlerUserid?: string;
  handlerStaffName?: string;
  auditStatus?: number;
  auditTime?: string;
  auditRemark?: string;
  isMyselfHandler?: number;
  isHidden?: boolean;
}
// interface AuditProps {
//   applyId: string;
//   approvalNo: string;
//   applyType: number;
//   applyUserid: string;
//   applyStaffName: string;
//   applyTime: string;
//   status: number;
//   applyClientNum: string;
//   remark: string;
//   nodeList: NoteProps[];
// }

enum AuditStatus {
  '审核中',
  '审批通过',
  '自动审批通过',
  '审批不通过'
}
const AuditDetail: React.FC<RouteComponentProps> = ({ history, location }) => {
  const ref = useRef<string>();
  const [detail, setDetail] = useState<any>({});
  const [titleType, setTitleType] = useState(-1);
  const [customers, setCustomers] = useState<AuditCustomerColumn[]>([]);
  const navigatorToList = () => {
    history.goBack();
  };
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0,
    showTotal: (total) => {
      return `共 ${total} 条记录`;
    }
  });

  const getList = async (params?: { pageNum: number; pageSize?: number }) => {
    const { applyId } = urlSearchParams(location.search) as { applyId: string; isApply: string };
    const pageNum = params?.pageNum || pagination.current;
    const pageSize = params?.pageSize || pagination.pageSize;
    const res = await getAuditApplyDetail({ applyId, pageNum, pageSize });
    if (res) {
      const { list, total } = res;
      setCustomers(list);
      setPagination((pagination) => ({ ...pagination, pageSize, current: pageNum, total }));
    }
  };

  const getDetail = async () => {
    ref.current = '';
    const { applyId, isApply } = urlSearchParams(location.search) as { applyId: string; isApply: string };
    const res = await getAuditDetailByApplyId({ applyId });
    setTitleType(+isApply);
    console.log(res);
    if (res) {
      setDetail(res);
    }
  };

  useEffect(() => {
    getDetail();
    getList();
  }, []);

  const onPaginationChange = (pageNum: number, pageSize?: number) => {
    getList({
      pageNum,
      pageSize
    });
  };

  const onApply = async (applyType: 1 | 2) => {
    console.log(ref.current);
    if (!ref.current) {
      return message.warning('请输入审批备注');
    }
    const res = await auditOperate({
      applyId: detail?.applyId as string,
      status: applyType,
      auditRemark: ref.current
    });
    if (res) {
      message.success('审批成功');
      getDetail();
    }
  };

  const DescriptionNode = ({ data, status }: { data: NoteProps; index: number; status?: number }) => {
    return (
      <div>
        <p>
          <span>时间：{data.auditTime} </span>
        </p>
        {!data.auditStatus
          ? (
          <>
            {!data.isHidden && ((data.isMyselfHandler === 1 && status === 0) || data.auditRemark) && (
              <div className={styles.remark}>
                <Input.TextArea
                  defaultValue={data.auditRemark}
                  disabled={data.auditStatus !== 0 || data.isMyselfHandler !== 1}
                  maxLength={30}
                  placeholder="请输入备注"
                  onChange={(e) => {
                    ref.current = e.target.value;
                  }}
                  autoSize={{ minRows: 2, maxRows: 3 }}
                />
              </div>
            )}

            {data.isMyselfHandler === 1 && data.auditStatus === 0 && status === 0 && (
              <div className="mt10">
                <a
                  href=""
                  onClick={(e) => {
                    e.preventDefault();
                    onApply(1);
                  }}
                  className={styles.auditPass}
                >
                  审核通过
                </a>
                <a
                  href=""
                  onClick={(e) => {
                    e.preventDefault();
                    onApply(2);
                  }}
                  className={styles.auditNoPass}
                >
                  审核不通过
                </a>
              </div>
            )}
          </>
            )
          : (
          <div className={styles.remark}>{data.auditRemark}</div>
            )}
      </div>
    );
  };

  const StepIcon = ({ sortIndex, status }: { sortIndex: number; status: number }) => {
    if (sortIndex === 0) {
      return <Icon name="icon_shenpi_20_proposer" />;
    } else {
      if (status === 1 || status === 2) {
        <Icon className="color-success" name="icon_shenpi_20_succeed" />;
      } else if (status === 3) {
        <Icon className="color-danger" name="icon_shenpi_20_fail" />;
      }
      return <Icon name="a-icon_shenpi_20_inreview" />;
    }
  };
  return (
    <div>
      <div className={'breadcrumbWrap ml25'}>
        <span>当前位置：</span>
        <Breadcrumb>
          <Breadcrumb.Item onClick={() => navigatorToList()}>
            {titleType === 2 ? '审核列表' : titleType === 1 ? '申请中心' : ''}
          </Breadcrumb.Item>
          <Breadcrumb.Item>审核详情</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="ml25 mr25">
        <div className={styles.panelTitle}>审核详情</div>
        <div className={styles.panelContent}>
          <div className={styles.auditInfo}>
            <ul className={styles.auditFormMsg}>
              <li className={styles.infoItem}>申请编号：{detail?.approvalNo}</li>
              <li className={styles.infoItem}>
                申请类型：{auditTypeOptions.filter((item) => item.id === (detail?.applyType as number))[0]?.name}
              </li>
              <li className={styles.infoItem}>申请人：{detail?.applyStaffName}</li>
              <li className={styles.infoItem}>申请时间：{detail?.applyTime}</li>
              <li className={styles.infoItem}>状态：{statusOptions[detail?.status || 0]?.name || UNKNOWN}</li>
              <li className={styles.infoItem}>数量共计：{detail?.applyClientNum}</li>
            </ul>
            <div className={'pa20'}>
              <p>此次申请数量共计：{detail?.applyClientNum || 0}条</p>
              <NgTable
                dataSource={customers}
                columns={TableColsOfCustomer}
                rowKey={'externalUserid'}
                pagination={pagination}
                paginationChange={onPaginationChange}
              />
            </div>
          </div>
        </div>

        <div className={styles.panelTitle}>审批状态</div>
        <div className="ml25 mt20">
          <Steps direction="vertical" current={1}>
            <Steps.Step
              key={'first'}
              icon={<StepIcon sortIndex={0} status={0} />}
              title={
                <div>
                  <span className="text-primary">{detail?.applyStaffName} </span>
                  发起申请
                </div>
              }
              description={
                <DescriptionNode index={-1} data={{ auditTime: detail?.applyTime as string, isHidden: true }} />
              }
            ></Steps.Step>
            {detail?.nodeList?.map((item: any, index: number) => (
              <Steps.Step
                disabled={detail.status !== 0}
                key={item.handlerUserid}
                icon={<StepIcon sortIndex={index + 1} status={item.auditStatus as number} />}
                title={
                  <div>
                    <span className="text-primary">{item.handlerStaffName} </span>
                    {AuditStatus[item.auditStatus as number]}
                  </div>
                }
                description={<DescriptionNode data={item} status={detail.status} index={index} />}
              ></Steps.Step>
            ))}
          </Steps>
        </div>
      </div>
    </div>
  );
};

export default AuditDetail;
