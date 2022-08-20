import React, { useEffect, useMemo, useState, Key } from 'react';
import { NgModal, Empty, Icon } from 'src/components';
import { Radio, Input, Tree, message } from 'antd';
import { debounce, updateTreeData } from 'src/utils/base';
import { requestGetDeptList, requestGetDepStaffList, searchStaffList } from 'src/apis/orgManage';
// import { EventDataNode } from 'antd/lib/tree';
import classNames from 'classnames';
import style from './style.module.less';

interface IDistributionClientProos {
  visible: boolean;
  value?: any;
  onClose?: (value?: any) => void;
  onOk?: (value?: any) => void;
  reasonNameList?: { id: string; name: string }[];
  distributionList?: { externalUserid: string; staffId: string };
}

interface IdistributionParam {
  takeoverStaffId?: string;
  reason?: string;
  transferSuccessMsg?: string;
}

const titleNameList = ['客户分配原因', '分配客户', '转接提示'];
const submitVaKeys = ['reason', 'takeoverStaffId', 'transferSuccessMsg'];

/**
 *
 * @param distributionList 分配的列表
 * @returns
 */
const DistributionClient: React.FC<IDistributionClientProos> = ({ visible, onClose, reasonNameList }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [distributionParam, setDistributionParam] = useState<IdistributionParam>({});
  const [treeData, setTreeData] = useState<any[]>([]);
  const [treeSearchList, setTreeSearchList] = useState<any[]>();
  const [selectedList, setSelectedList] = useState<any[]>([]);
  const [textAreaReadOnly, setTextReadOnly] = useState(true);
  const [reasonText, setReasonText] = useState('');

  const { TextArea } = Input;

  // 重置
  const onResetHandle = () => {
    setDistributionParam({});
  };

  // 取消
  const onCancelHandle = () => {
    onClose?.();
    onResetHandle();
  };

  // 下一步/确认
  const onOkHandle = () => {
    // 判断是否满足提交
    if (stepIndex < titleNameList.length - 1) {
      setStepIndex((stepIndex) => stepIndex + 1);
    }
  };

  // 获取组织架构
  const getCorpOrg = async (parentId: string) => {
    let res1 = await requestGetDeptList({ parentId });
    let res2: any = [];
    if (parentId) {
      const res = await requestGetDepStaffList({ queryType: 0, deptType: 0, deptId: parentId });
      res2 = res.list.map((item: any) => ({
        ...item,
        name: item.staffName,
        id: item.staffId,
        isLeaf: true,
        parentId
      }));
    }
    if (res1) {
      // 过滤掉未完善员工
      res1 = res1.filter((item: any) => item.deptId !== -1);
      res1 = await Promise.all(
        res1.map(async (item: any) => {
          // 判断叶子部门节点下是否还有员工，有员工则不能作为叶子节点
          if (
            item.isLeaf &&
            (await requestGetDepStaffList({ queryType: 0, deptType: 0, deptId: item.deptId })).list.length
          ) {
            return { ...item, parentId, name: item.deptName, id: item.deptId, isLeaf: false };
          } else {
            return { ...item, parentId, name: item.deptName, id: item.deptId };
          }
        })
      );
    }
    return [...res2, ...res1];
  };

  // 异步获取组织架构及当前目录下的员工
  const onLoadDataHandle = async ({ key }: any) => {
    // 获取对应的子节点
    const res: any = await getCorpOrg(key);
    if (res) {
      console.log('res', res);
      setTreeData((treeData) => updateTreeData(treeData, key, res));
    }
  };

  // 点击左侧搜索结果的部门或者
  const searchList = async (treeSearchValue?: string) => {
    const res = await searchStaffList({
      keyWords: treeSearchValue as string,
      searchType: 2,
      isFull: true
    });
    if (res) {
      const list = [...res.staffList, ...(res.deptList || [])];
      list.forEach((item: any) => {
        item.id = item.staffId || item.deptId;
        item.name = item.staffName || item.deptName;
      });
      setTreeSearchList(list);
    }
  };

  // 树列表搜索
  const treeSearchOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      searchList(e.target.value);
    } else {
      setTreeSearchList(undefined);
    }
  };

  // 点击搜索出来的列表
  const clickSearchList = (item: any, checked: boolean) => {
    let selected: any[] = [];
    if (!checked) {
      selected = [item];
    } else {
      selected = [];
    }
    setSelectedList(selected);
  };

  // 选择成员
  const treeOnSelectHandle = (
    _: Key[],
    info: {
      event: 'select';
      selected: boolean;
      node: any;
      selectedNodes: any[];
      nativeEvent: MouseEvent;
    }
  ) => {
    if (!info.node.staffId) {
      return message.warning('请选择人员');
    }
    if (info.selected) {
      setSelectedList([info.node]);
      setDistributionParam((param) => ({ ...param, takeoverStaffId: info.node.staffId }));
    } else {
      setSelectedList([]);
      setDistributionParam((param) => ({ ...param, takeoverStaffId: '' }));
    }
  };

  const onOkBtnDisabled = useMemo(() => {
    if (distributionParam.reason === 'reason_other') {
      return !reasonText;
    } else {
      return !distributionParam[submitVaKeys[stepIndex] as keyof IdistributionParam];
    }
  }, [distributionParam, stepIndex, reasonText]);

  useEffect(() => {
    if (visible) {
      setStepIndex(0);
    }
  }, [visible]);

  useEffect(() => {
    if (stepIndex === 1) {
      (async () => {
        setTreeData(await getCorpOrg(''));
      })();
    }
  }, [stepIndex]);
  return (
    <NgModal
      className={style.modalWrap}
      title={titleNameList[stepIndex] || ''}
      okText={stepIndex < titleNameList.length - 1 ? '下一步' : '确认转接'}
      visible={visible}
      maskClosable={false}
      onCancel={onCancelHandle}
      onOk={onOkHandle}
      okButtonProps={{
        disabled: onOkBtnDisabled
      }}
    >
      {stepIndex === 0 && (
        <>
          <Radio.Group
            value={distributionParam.reason}
            className={style.distributionRule}
            onChange={(e) => setDistributionParam({ reason: e.target.value })}
          >
            {reasonNameList?.map((reasonItem) => (
              <Radio key={reasonItem.id} value={reasonItem.id} className={style.ruleRadioItem}>
                {reasonItem.name}
              </Radio>
            ))}
          </Radio.Group>
          {distributionParam.reason === 'reason_other' && (
            <TextArea
              value={reasonText}
              onChange={(e) => setReasonText(e.target.value)}
              showCount
              maxLength={300}
              className={style.reasonOther}
            />
          )}
        </>
      )}
      {stepIndex === 1 && (
        <>
          <div className={style.chooseStaffTips}>
            温馨提醒：
            <br />
            (1)可将选中的客户转接给其他员工，进行后续服务，注意：90天内客户只能被转接两次。
            <br />
            (2)若客户同意，转接后客户将在24小时后成功转接；若客户拒绝，本次转接将不会生效，还是由原来的员工继续服务客户。
          </div>
          <div className={style.staffChooseTree}>
            <div className={style.treeName}>选择接替员工</div>
            <div className={style.treeWrap}>
              <div className={style.inputWrap}>
                <Input
                  className={style.searchTree}
                  placeholder={'搜索人员'}
                  // @ts-ignore
                  onChange={debounce(treeSearchOnChange, 500)}
                  // addonBefore={<Icon className={style.searchIcon} name="icon_common_16_seach" />}
                />
              </div>
              {!treeSearchList || (
                <div className={style.searchListWrap}>
                  {treeSearchList.length
                    ? (
                        treeSearchList.map((item: any) => (
                      <div
                        key={item.id}
                        className={classNames(style.searchItem, {
                          [style.active]: selectedList?.some((selectItem) => item.id === selectItem.id)
                        })}
                        onClick={() =>
                          clickSearchList(
                            item,
                            selectedList.some((selectItem) => item.id === selectItem.id)
                          )
                        }
                      >
                        <div className={style.name}>{item.name}</div>
                      </div>
                        ))
                      )
                    : (
                    <div className={style.empty}>
                      <Empty />
                    </div>
                      )}
                </div>
              )}
              <Tree
                selectedKeys={selectedList?.map((staffItem) => staffItem.staffId)}
                className={classNames(style.tree, { [style.hiden]: treeSearchList })}
                fieldNames={{ title: 'name', key: 'id' }}
                loadData={onLoadDataHandle}
                // @ts-ignore
                treeData={treeData}
                onSelect={treeOnSelectHandle}
              />
            </div>
          </div>
        </>
      )}
      {stepIndex === 2 && (
        <>
          <div className={style.distriSpeechTitle}>将转接1位客户给李斯</div>
          <div className={style.distriTips}>客户将收到以下提示</div>
          <div className={style.distriSpeechContent}>
            <Icon name="a-bianzu101" className={style.icon} />
            <TextArea
              defaultValue={'您好，您的服务已升级，后续将由我的同事李斯@XX保险接替我的工作，继续为您服务。'}
              autoSize
              readOnly={textAreaReadOnly}
              className={style.distriSpeechTextArea}
            ></TextArea>
            <Icon className={style.editIcon} onClick={() => setTextReadOnly((param) => !param)} name="bianji" />
            <div></div>
          </div>
        </>
      )}
    </NgModal>
  );
};
export default DistributionClient;
