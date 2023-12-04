import React, { Key, useEffect, useMemo, useState } from 'react';
import { Button, DatePicker, Form, Input, message, Radio, RadioChangeEvent, Spin } from 'antd';
import { useHistory /* , useLocation */ } from 'react-router-dom';
import { BreadCrumbs, ImageUpload, SelectOrg } from 'src/components';
import { AddMarket, Preview, StaffList } from 'src/pages/LiveCode/StaffCode/components';
import { IChannelTagList } from 'src/pages/Operation/ChannelTag/Config';
import { requestGetChannelGroupList } from 'src/apis/channelTag';
import { requestEditStaffLive, requestGetStaffLiveDetail, requestGetLiveStaffList } from 'src/apis/liveCode';
import { IValue } from 'src/pages/LiveCode/StaffCode/components/Preview/Preview';
import { useDidCache, useDidRecover } from 'react-router-cache-route';
import CustomTextArea from 'src/pages/SalesCollection/SpeechManage/Components/CustomTextArea';
import FilterChannelTag from '../../MomentCode/components/FilterChannelTag/FilterChannelTag';
import moment from 'moment';
import qs from 'qs';
import classNames from 'classnames';
import style from './style.module.less';

export const expireDayList = [
  { value: -1, label: '永久' },
  { value: 7, label: '7天' },
  { value: 15, label: '15天' },
  { value: 30, label: '30天' },
  { value: 0, label: '自定义' }
];

export const liveTypeList = [
  { value: 1, label: '单人活码' },
  { value: 2, label: '批量单人' },
  { value: 3, label: '多人活码' }
];

export const assignTypeList = [
  { value: 1, label: '随机分配' },
  { value: 2, label: '依次分配' }
  // { value: 3, label: '定量分配' }
];

const AddCode: React.FC = () => {
  const [readOnly, setReadOnly] = useState(false);
  const [expireDay, setExpireDay] = useState<number>(); // 有效期
  const [liveType, setLiveType] = useState<number>(); // 活码类型
  const [assignType, setAssignType] = useState<number>(); // 分配方式
  const [selectStaffList, setSelectStaffList] = useState<any[]>([]);
  const [staffSearchValues, setStaffSearchValues] = useState<{ [key: string]: any }>({});
  const [staffRowKeys, setStaffRowKeys] = useState<Key[]>([]);
  const [isWelcomeMsg, setIsWelcomeMsg] = useState<number>();
  const [pageNum, setPageNum] = useState(1);
  const [channelTagList, setChannelTagList] = useState<IChannelTagList[]>([]);
  const [previewValue, setPreviewValue] = useState<IValue>();
  const [getDetailloading, setGetDetailLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [form] = Form.useForm();
  const { Item } = Form;
  const { Group } = Radio;
  const { TextArea } = Input;

  const history = useHistory();
  // const location = useLocation();

  // 获取投放渠道标签
  const getChannelGroupList = async () => {
    const res = await requestGetChannelGroupList({ groupName: '投放渠道' });
    if (res) {
      setChannelTagList(res.list?.[0]?.tagList || []);
    }
  };

  const onResetHandle = () => {
    form.resetFields();
    setExpireDay(undefined);
    setIsWelcomeMsg(undefined);
    setPreviewValue(undefined);
    setLiveType(undefined);
    setAssignType(undefined);
    setSelectStaffList([]);
    setReadOnly(false);
  };

  // 获取员工活码详情
  const getLiveCodeDetail = async () => {
    const { liveId, readOnly } = qs.parse(location.search, { ignoreQueryPrefix: true });
    setReadOnly(!!readOnly);
    if (liveId) {
      setGetDetailLoading(true);
      const [liveDetail, staffs] = await Promise.all([
        requestGetStaffLiveDetail({ liveId }),
        // 全部请求，前端分页
        requestGetLiveStaffList({ liveId, pageSize: 9999 })
      ]);
      const { welcomeWord, welcomes, isWelcomeMsg, expireDate, liveType, assignType } = liveDetail;
      const expireDay = [-1, 7, 15, 30].includes(liveDetail?.expireDay) ? liveDetail?.expireDay : 0;
      setExpireDay(expireDay);
      setIsWelcomeMsg(isWelcomeMsg);
      setPreviewValue({ welcomeWord, welcomes });
      setLiveType(liveType);
      setAssignType(assignType);
      setSelectStaffList(staffs.list.map((staffItem: any) => ({ ...staffItem, deptName: staffItem.staffDeptName })));
      form.setFieldsValue({
        ...liveDetail,
        expireDate: moment(expireDate),
        expireDay,
        channelTagList: liveDetail.channelTagList[0].tagId,
        staffs: staffs.list,
        welcomeWord: welcomeWord || ''
      });
      setGetDetailLoading(false);
    }
  };

  // 有效期切换
  const expireDayOnChange = (e: RadioChangeEvent) => {
    setExpireDay(e.target.value);
  };

  // 活码类型切换
  const liveTypeOnChange = (e: RadioChangeEvent) => {
    setLiveType(e.target.value);
    // 切换活码类型处理使用成员
    if (e.target.value === 1) {
      selectStaffList?.length && form.setFieldsValue({ staffs: [selectStaffList?.[0]] });
    } else {
      form.setFieldsValue({ staffs: selectStaffList });
    }
  };

  // 选择员工
  const selectStaffOnChange = (value: any) => {
    setSelectStaffList((value || []).map((mapItem: any, index: number) => ({ ...mapItem, sort: index + 1 })));
    setPageNum(1);
  };

  // 批量删除员工
  const batchDelStaff = (keys: Key[]) => {
    if (readOnly) return;
    // 删除及重新排序
    const filterStaffList = (selectStaffList || [])
      .filter((filterItem) => !keys.includes(filterItem.id))
      .map((mapItem, index) => ({ ...mapItem, sort: index + 1 }));
    setSelectStaffList(filterStaffList);
    form.setFieldsValue({ staffs: filterStaffList });
    setStaffRowKeys([]);
  };

  // 搜索员工列表
  const searchStaffList = () => {
    setPageNum(1);
    const { staffName, dept } = form.getFieldsValue();
    setStaffSearchValues({ staffName, dept });
  };

  // 上移/下移/置顶 -1 上移 1 下移 0 置顶
  const sortHandle = (type: -1 | 1 | 0, currentSort: number) => {
    if (readOnly) return;
    let newSelectStaffList = [...(selectStaffList || [])];
    if (type === -1) {
      // 与前一个更换sort
      newSelectStaffList[currentSort - 1].sort = currentSort - 1;
      newSelectStaffList[currentSort - 2].sort = currentSort;
      newSelectStaffList = newSelectStaffList?.sort((now, next) => now.sort - next.sort);
    } else if (type === 1) {
      // 与后一个一个更换sort
      newSelectStaffList[currentSort - 1].sort = currentSort + 1;
      newSelectStaffList[currentSort].sort = currentSort;
      newSelectStaffList = newSelectStaffList?.sort((now, next) => now.sort - next.sort);
    } else {
      newSelectStaffList[currentSort - 1].sort = 0;
      newSelectStaffList = newSelectStaffList
        ?.sort((now, next) => now.sort - next.sort)
        .map((mapItem, index) => ({ ...mapItem, sort: index + 1 }));
    }
    setSelectStaffList(newSelectStaffList);
    form.setFieldsValue({ staffs: newSelectStaffList });
    message.success(`${type === -1 ? '上移' : '下移'}成功`);
  };

  // 创建员工活码
  const onFinishHandle = async (values?: any) => {
    setSubmitLoading(true);
    // 处理有效期
    if (!expireDay) {
      values.expireDate = values.expireDate?.format('YYYY-MM-DD');
      values.expireDay = undefined;
    }
    values.channelTagList = channelTagList.filter((filterItem) => filterItem.tagId === values.channelTagList);
    values.staffs = values.staffs.map(({ staffId }: { staffId: string }) => ({ staffId }));
    const param = { ...values };
    const res = await requestEditStaffLive(param);
    if (res) {
      message.success('员工活码新增成功');
      history.push('/staffCode');
      onResetHandle();
    }
    setSubmitLoading(false);
  };

  // 设置预览的值
  const onValuesChangeHandle = (changedValues: IValue) => {
    const { welcomeWord, welcomes } = changedValues;
    if (welcomeWord as string) {
      setPreviewValue((previewValue: any) => ({ ...previewValue, welcomeWord }));
    }
    if (welcomes) {
      setPreviewValue((previewValue: any) => ({ ...previewValue, welcomes }));
    }
  };

  const tableDataSource = useMemo(() => {
    const { staffName, dept } = staffSearchValues;
    const depts = (dept || []).map((mapItem: any) => mapItem.deptId.toString());
    return (selectStaffList || []).filter(
      (fliterItem) =>
        (!staffName || fliterItem.staffName.includes(staffName)) &&
        (!dept || fliterItem.fullDeptId?.split(',').some((deptId: string) => depts.includes(deptId)))
    );
  }, [staffSearchValues, selectStaffList]);

  // staffList表格配置
  const pagination = {
    current: pageNum,
    simple: true,
    total: tableDataSource.length,
    onChange (page: number) {
      setPageNum(page);
      setStaffRowKeys([]);
    }
  };

  const rowSelection: any = {
    selectedRowKeys: staffRowKeys,
    onChange (keys: Key[]) {
      setStaffRowKeys(keys);
    }
  };

  useEffect(() => {
    getChannelGroupList();
    getLiveCodeDetail();
  }, []);
  useDidRecover(() => {
    getLiveCodeDetail();
  }, []);
  useDidCache(() => {
    if (readOnly) onResetHandle();
  }, []);
  return (
    <Spin spinning={getDetailloading} tip="加载中...">
      <div className={style.wrap}>
        <BreadCrumbs
          navList={[
            {
              path: '/staffCode',
              name: '员工活码'
            },
            { name: '新增活码' }
          ]}
        />
        <Form form={form} className={style.form} onFinish={onFinishHandle} onValuesChange={onValuesChangeHandle}>
          <div className={style.panel}>
            <div className={style.title}>基本信息</div>
            <div className={style.content}>
              <Item label="活码名称" name="name" rules={[{ required: true, message: '请输入50个字以内的活码名称' }]}>
                <Input
                  placeholder="待输入"
                  disabled={readOnly}
                  className={style.input}
                  readOnly={readOnly}
                  showCount
                  maxLength={50}
                />
              </Item>
              <Item label="有效期" name="expireDay" rules={[{ required: true, message: '请选择有效期' }]}>
                <Group value={expireDay} onChange={expireDayOnChange} disabled={readOnly}>
                  {expireDayList.map((mapItem) => (
                    <Radio key={mapItem.value} value={mapItem.value}>
                      {mapItem.label}
                    </Radio>
                  ))}
                </Group>
              </Item>
              {expireDay === 0 && (
                <div className={style.expireDayData}>
                  <Item name="expireDate" rules={[{ required: true, message: '请选择失效日期' }]}>
                    <DatePicker disabled={readOnly} />
                  </Item>
                  <div className={style.remarks}>备注：有效日期到</div>
                </div>
              )}
              <Item label="活码类型" name="liveType" rules={[{ required: true, message: '请选择活码类型' }]}>
                <Group value={liveType} onChange={liveTypeOnChange} disabled={readOnly}>
                  {liveTypeList.map((mapItem) => (
                    <Radio key={mapItem.value} value={mapItem.value}>
                      {mapItem.label}
                    </Radio>
                  ))}
                </Group>
              </Item>
              <Item label="使用成员" name="staffs" rules={[{ required: true, message: '请选择使用成员' }]}>
                <SelectOrg
                  value={selectStaffList}
                  onChange={selectStaffOnChange}
                  className={style.select}
                  singleChoice={liveType === 1}
                  disabled={readOnly}
                />
              </Item>
              {[2, 3].includes(liveType as number) && (
                <>
                  {liveType === 3 && (
                    <Item label="配置详情" name="assignType" rules={[{ required: true, message: '请选择配置详情' }]}>
                      <Group value={assignType} onChange={(e) => setAssignType(e.target.value)}>
                        {assignTypeList.map((mapItem) => (
                          <Radio key={mapItem.value} value={mapItem.value} disabled={readOnly}>
                            {mapItem.label}
                          </Radio>
                        ))}
                      </Group>
                    </Item>
                  )}
                  <StaffList
                    dataSource={tableDataSource.slice(pageNum * 10 - 10, pageNum * 10)}
                    pagination={pagination}
                    searchStaffList={searchStaffList}
                    rowSelection={rowSelection}
                    assignType={assignType as number}
                    sortHandle={sortHandle}
                    batchDelStaff={batchDelStaff}
                    staffRowKeys={staffRowKeys}
                    disabled={readOnly}
                  />
                </>
              )}
            </div>
          </div>
          <div className={style.panel}>
            <div className={style.title}>个性设置</div>
            <div className={style.content}>
              <Item label="是否开启只能添加同一客户" name="isExclusive" initialValue={0}>
                <Group disabled={readOnly}>
                  <Radio value={1}>开启</Radio>
                  <Radio value={0}>关闭</Radio>
                </Group>
              </Item>
              <Item label="添加好友无需验证" name="isOpenVerify">
                <Group disabled={readOnly}>
                  <Radio value={1}>开启</Radio>
                  <Radio value={0}>关闭</Radio>
                </Group>
              </Item>
            </div>
          </div>
          <div className={style.panel}>
            <div className={style.title}>渠道设置</div>
            <div className={classNames(style.content, style.previewContent)}>
              <Item label="活码备注" name="remark">
                <TextArea
                  className={style.textArea}
                  placeholder="请输入活码备注"
                  maxLength={50}
                  showCount
                  disabled={readOnly}
                />
              </Item>
              <Form.Item label="欢迎语配置" name="isWelcomeMsg" rules={[{ required: true }]}>
                <Group onChange={(e) => setIsWelcomeMsg(e.target.value)} disabled={readOnly}>
                  <Radio value={0}>不发送</Radio>
                  <Radio value={1}>渠道欢迎语</Radio>
                </Group>
              </Form.Item>
              {isWelcomeMsg === 1 && (
                <>
                  <Form.Item name="welcomeWord">
                    <CustomTextArea maxLength={100} disabled={readOnly} />
                  </Form.Item>
                  <Item noStyle name="welcomes">
                    <AddMarket disabled={readOnly} />
                  </Item>
                  <Preview className={style.preview} value={previewValue} />
                </>
              )}
              <Item
                label="活码头像"
                name="qrLogo"
                // extra="为确保最佳展示效果，请上传670*200像素高清图片，仅支持.jpg格式"
              >
                <ImageUpload disabled={readOnly} />
                {/* <Input placeholder="请输入链接" className={style.input} /> */}
              </Item>
              <Item label="渠道标签">
                <div className={style.channelTag}>
                  <Item
                    name="channelTagList"
                    label="投放渠道标签"
                    rules={[{ required: true, message: '请选择投放渠道' }]}
                    extra="*未找到适合的渠道，请联系管理员进行新增"
                  >
                    <Radio.Group disabled={readOnly}>
                      {channelTagList.map((tagItem) => (
                        <Radio key={tagItem.tagId} value={tagItem.tagId}>
                          {tagItem.tagName}
                        </Radio>
                      ))}
                    </Radio.Group>
                  </Item>
                  <Item label="其他渠道标签" name="otherTagList">
                    <FilterChannelTag disabled={readOnly} />
                  </Item>
                </div>
              </Item>
              <div className={style.btnWrap}>
                <Button
                  className={style.submitBtn}
                  type="primary"
                  htmlType="submit"
                  disabled={readOnly}
                  loading={submitLoading}
                >
                  确定
                </Button>
                <Button
                  className={style.cancelBtn}
                  onClick={() => {
                    history.goBack();
                    onResetHandle();
                  }}
                >
                  {readOnly ? '返回' : '取消'}
                </Button>
              </div>
            </div>
          </div>
        </Form>
      </div>
    </Spin>
  );
};
export default AddCode;
