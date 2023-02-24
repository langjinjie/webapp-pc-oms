import { Button, Form, Input, message, Space, Steps } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import InputShowLength from 'src/components/InputShowLength/InputShowLength';
import { SetUserRightFormItem } from 'src/pages/Marketing/Components/SetUserRight/SetUserRight';
import { BreadCrumbs, NgEditor } from 'src/components';
import { auditApply, getApplyDetail, getApprovalDetail } from 'src/apis/knowledge';

import styles from 'src/pages/Audit/AuditList/style.module.less';
import classNames from 'classnames';
import { Icon } from 'tenacity-ui';
import { urlSearchParams } from 'src/utils/base';
enum AuditStatus {
  '审批中',
  '审批通过',
  '自动审批通过',
  '审批不通过'
}

interface NoteProps {
  handlerUserid?: string;
  handlerStaffName?: string;
  auditStatus?: number;
  auditTime?: string;
  auditRemark?: string;
  isMyselfHandler?: number;
  isHidden?: boolean;
}
const KnowledgeEdit: React.FC<RouteComponentProps> = ({ history, location }) => {
  const [editForm] = Form.useForm();
  const [detail, setDetail] = useState<any>({});
  const ref = useRef<string>();
  const getDetail = async () => {
    const { id, isApproval } = urlSearchParams(location.search);
    let res: any;
    if (isApproval) {
      res = await getApprovalDetail({
        approvalNo: id
      });
    } else {
      res = await getApplyDetail({ approvalNo: id });
    }
    if (res) {
      const { groupId, desc, content, title, level1Name, level2Name } = res;
      setDetail(res);
      editForm.setFieldsValue({
        groupId,
        desc,
        title,
        categoryName: level1Name + (level2Name ? '-' + level2Name : ''),
        content
      });
    }
  };

  useEffect(() => {
    getDetail();
  }, []);

  const onApply = async (applyType: any) => {
    const res = await auditApply({
      status: applyType,
      auditRemark: ref.current,
      approvalNo: detail.approvalNo
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
                  审批通过
                </a>
                <a
                  href=""
                  onClick={(e) => {
                    e.preventDefault();
                    onApply(2);
                  }}
                  className={styles.auditNoPass}
                >
                  审批不通过
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
        return <Icon className="color-success" name="icon_shenpi_20_succeed" />;
      } else if (status === 3) {
        return <Icon className="color-danger" name="icon_shenpi_20_fail" />;
      }
      return <Icon name="a-icon_shenpi_20_inreview" />;
    }
  };
  return (
    <div className="container edit">
      <BreadCrumbs
        navList={[
          {
            name: '知识库审批'
          },
          { name: '审批详情' }
        ]}
      />
      <div className={classNames(styles.panelTitle, 'mt20 mb20')}>审批详情</div>
      <Form form={editForm}>
        <Form.Item label="目录信息" name={'categoryName'}>
          <Input disabled className="width320"></Input>
        </Form.Item>
        <Form.Item label="知识库标题" name="title">
          <InputShowLength maxLength={30} className="width320" disabled />
        </Form.Item>
        <Form.Item label="知识库描述" name="desc">
          <Input.TextArea className="width400" disabled maxLength={100} showCount></Input.TextArea>
        </Form.Item>
        <Form.Item label="知识库正文">
          <NgEditor value={detail.content} />
        </Form.Item>
        <Form.Item label="配置可见范围" name={'groupId'}>
          <SetUserRightFormItem form={editForm} />
        </Form.Item>
        <Form.Item label="知识库分词结果">
          {detail.segWords?.split(',').map((item: string) => (
            <span className="tag" key={item}>
              {item}
            </span>
          ))}
        </Form.Item>

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
        <Form.Item className="formFooter mt40">
          <Space size={36} style={{ marginLeft: '140px' }}>
            <Button
              shape="round"
              type="primary"
              ghost
              onClick={() => {
                history.goBack();
              }}
            >
              返回
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default KnowledgeEdit;
