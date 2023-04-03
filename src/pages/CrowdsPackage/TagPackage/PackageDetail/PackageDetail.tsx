import React, { useEffect, useState } from 'react';
import { Button, Space, Empty, message, Modal, Spin } from 'antd';
import BarChart from './components/BarChart';
import { BreadCrumbs, NgTable } from 'src/components';
import { useHistory } from 'react-router-dom';
import { updateOptions, computedOptions } from 'src/pages/CrowdsPackage/TagPackage/Config';
import { requestExportPackage, requestGetPackageCompute, requestGetPackageDetail } from 'src/apis/CrowdsPackage';
import qs from 'qs';
import classNames from 'classnames';
import styles from './style.module.less';

interface ICrowdsDetail {
  packageId: string; // 是 分群ID
  packageName: string; // 是 分群名称
  computeStatus: number; // 是 计算状态（1-计算中、2-计算成功、3-计算失败）
  refreshType: number; // 是 更新方式（1-每日更新、2-手工更新）
  createTime: string; // 是 创建时间
  opName: string; // 是 创建人
  runStatus?: number; // 是 运行状态（1-正常、2-已暂停）
  clientNum?: number; // 否 客户数量
  staffNum?: number; // 否 对应坐席数量
  updateTime?: string; // 否 更新时间
  list: ICrowdsLastTenItem[]; // 分群明细列表（近10次人群包明细）
}
interface ICrowdsLastTenItem {
  updateTime?: string; // 否 更新时间
  refreshType: number; // 是 更新方式（1-每日更新、2-手工更新）
  clientNum?: number; // 否 客户数量
  staffNum?: number; // 否 对应坐席数量
  computeStatus: number; // 是 计算状态（1-计算中、2-计算成功、3-计算失败）
  computeRecordId: string; // 是 人群包计算记录ID
}

const GroupDetail: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [computeLoading, setComputeLoading] = useState(false);
  const [crowdsDetail, setCrowdsDetail] = useState<ICrowdsDetail>();
  const [downloadLoading, setDownLoading] = useState('');
  const history = useHistory();

  // 获取人群包详情
  const getDetail = async () => {
    setLoading(true);
    const { packageId } = qs.parse(location.search, { ignoreQueryPrefix: true });
    const res = await requestGetPackageDetail({ packageId });
    if (res) {
      setCrowdsDetail(res);
    }
    setLoading(false);
  };

  // 查看详情
  const viewPackageDetail = () => {
    history.push('/tagPackage/create?packageId=' + crowdsDetail?.packageId, {
      navList: [
        { name: '标签分群', path: '/tagPackage' },
        { name: '分群详情', path: '/tagPackage/detail?packageId=' + crowdsDetail?.packageId },
        { name: '分群规则' }
      ]
    });
  };

  // 计算人群包
  const computeHandle = async () => {
    setComputeLoading(true);
    const { packageId } = qs.parse(location.search, { ignoreQueryPrefix: true });
    const res = await requestGetPackageCompute({ packageId });
    if (res) {
      message.success('计算成功，可以稍后手动刷新获取最新数据');
      getDetail();
    } else {
      message.warning('计算异常');
    }
    setComputeLoading(false);
  };

  // 导出人群包
  const exportGroup = async (row: ICrowdsLastTenItem) => {
    const { computeRecordId } = row;
    setDownLoading(computeRecordId);
    const res = await requestExportPackage({
      packageId: crowdsDetail?.packageId,
      computeRecordId
    });
    if (res) {
      Modal.confirm({
        title: '操作提示',
        centered: true,
        content: '人群包导出成功，是否跳转到人群包下载列表？',
        onOk () {
          history.push('/tagPackage/download', {
            navList: [
              { name: '标签分群', path: '/tagPackage' },
              { name: '分群详情', path: '/tagPackage/detail?packageId=' + crowdsDetail?.packageId },
              { name: '查看人群包下载列表' }
            ]
          });
        }
      });
    }
    setDownLoading('');
  };
  useEffect(() => {
    getDetail();
  }, []);
  return (
    <Spin tip={'加载中...'} spinning={loading}>
      <div className="container">
        <BreadCrumbs navList={[{ name: '标签分群', path: '/tagPackage' }, { name: '分群详情' }]} />
        <div className={classNames(styles.banner, 'mt20  color-text-white')}>
          <div className={classNames('flex align-center justify-between', styles.bannerMain)}>
            <div className="color-text-white">
              <Space size={36}>
                <span className="f18">
                  客户 <span className={classNames('f30 bold')}>{crowdsDetail?.clientNum || 0}</span>人
                </span>
                <span className="f18">
                  对应坐席 <span className="f30 bold">{crowdsDetail?.staffNum || 0}</span>人
                  <span className="f12 ml35">更新时间 {crowdsDetail?.updateTime || '--'}</span>
                </span>
              </Space>
            </div>
            <div>
              <Button className={styles.btn} shape="round" onClick={viewPackageDetail}>
                查看规则
              </Button>
              {crowdsDetail?.refreshType === 2 && (
                <Button
                  className={classNames(styles.btn, ' ml20')}
                  loading={computeLoading}
                  shape="round"
                  onClick={computeHandle}
                >
                  点击计算
                </Button>
              )}
            </div>
          </div>
          <div className={classNames(styles.bannerFooter, 'color-white f12')}>
            <span>
              更新方式：{updateOptions.find((findItem) => findItem.id === crowdsDetail?.refreshType)?.name || '--'}
            </span>
            <span className="ml20">创建人：{crowdsDetail?.opName || '--'}</span>
            <span className="ml20">创建时间：{crowdsDetail?.createTime || '--'}</span>
          </div>
        </div>

        <div className={styles.chartWrap}>
          <div className={classNames(styles.chartTitle, 'flex justify-between align-center')}>
            <span className="f18">分群历史详情</span>
          </div>
          {(crowdsDetail?.list || []).length !== 0
            ? (
            <BarChart data={crowdsDetail?.list || []} />
              )
            : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
        </div>
        <NgTable
          className="mt20"
          rowKey="computeRecordId"
          scroll={{ x: 'max-content' }}
          columns={[
            {
              title: '更新时间',
              dataIndex: 'updateTime'
            },
            {
              title: '客户数量',
              dataIndex: 'clientNum'
            },
            {
              title: '对应坐席数量',
              dataIndex: 'staffNum'
            },
            {
              title: '更新方式',
              dataIndex: 'refreshType',
              render (refreshType: number) {
                return updateOptions.find((findItem) => findItem.id === +refreshType)?.name;
              }
            },
            {
              title: '计算状态',
              dataIndex: 'computeStatus',
              render: (computeStatus: number) => (
                <span>
                  <i
                    className={classNames('status-point', {
                      'status-point-green': computeStatus === 1,
                      // 'status-point-gray': text === 2,
                      'status-point-red': computeStatus === 3
                    })}
                  />
                  {computedOptions.find((item) => item.id === computeStatus)?.name}
                </span>
              )
            },
            {
              title: '操作',
              fixed: 'right',
              render: (row: ICrowdsLastTenItem) => (
                <Button type="link" onClick={() => exportGroup(row)} loading={downloadLoading === row.computeRecordId}>
                  导出人群包
                </Button>
              )
            }
          ]}
          dataSource={crowdsDetail?.list}
        />
      </div>
    </Spin>
  );
};

export default GroupDetail;
