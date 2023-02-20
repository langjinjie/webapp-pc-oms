import { Button, DatePicker, Form, Input, message, Popconfirm, Radio, RadioChangeEvent, Table } from 'antd';
import classNames from 'classnames';
import React, { Key, useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { BreadCrumbs, ImageUpload } from 'src/components';
import { SelectStaff } from 'src/pages/StaffManage/components';
import { AddMarket } from 'src/pages/LiveCode/StaffCode/components';
import { IChannelTagList } from 'src/pages/Operation/ChannelTag/Config';
import { requestGetChannelGroupList } from 'src/apis/channelTag';
import { requestEditStaffLive } from 'src/apis/liveCode';
import CustomTextArea from 'src/pages/SalesCollection/SpeechManage/Components/CustomTextArea';
import style from './style.module.less';
import FilterChannelTag from '../../MomentCode/components/FilterChannelTag/FilterChannelTag';

export const expireDayList = [
  { value: 1, label: '永久' },
  // { value: 2, label: '7天' },
  // { value: 3, label: '15天' },
  // { value: 4, label: '30天' },
  { value: 5, label: '自定义' }
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
  const [selectStaffList, setSelectStaffList] = useState<any[]>();
  const [staffSearchValues, setStaffSearchValues] = useState<{ [key: string]: any }>({});
  const [staffRowKeys, setStaffRowKeys] = useState<Key[]>([]);
  const [isWelcomeMsg, setIsWelcomeMsg] = useState<number>();
  const [pageNum, setPageNum] = useState(1);
  const [channelTagList, setChannelTagList] = useState<IChannelTagList[]>([]);

  const [form] = Form.useForm();
  const { Item } = Form;
  const { Group } = Radio;
  const { TextArea } = Input;

  const history = useHistory();
  const location = useLocation();

  // 获取投放渠道标签
  const getChannelGroupList = async () => {
    const res = await requestGetChannelGroupList({ groupName: '投放渠道' });
    if (res) {
      setChannelTagList(res.list?.[0]?.tagList || []);
    }
  };

  // 有效期切换
  const expireDayOnChange = (e: RadioChangeEvent) => {
    setExpireDay(e.target.value);
  };

  // 活码类型切换
  const liveTypeOnChange = (e: RadioChangeEvent) => {
    setLiveType(e.target.value);
  };

  // 选择员工
  const selectStaffOnChange = (value: any) => {
    setSelectStaffList(value.map((mapItem: any, index: number) => ({ ...mapItem, sort: index + 1 })));
    setPageNum(1);
  };

  // 批量删除员工
  const batchDelStaff = (keys: Key[]) => {
    // 删除及重新排序
    const filterStaffList = (selectStaffList || [])
      .filter((filterItem) => !keys.includes(filterItem.id))
      .map((mapItem, index) => ({ ...mapItem, sort: index + 1 }));
    setSelectStaffList(filterStaffList);
    form.setFieldsValue({ staffs: selectStaffList });
    setStaffRowKeys([]);
  };

  // 搜索员工列表
  const searchStaffList = () => {
    const { staffName, dept } = form.getFieldsValue();
    setStaffSearchValues({ staffName, dept });
  };

  // 上移/下移/置顶 -1 上移 1 下移 0 置顶
  const sortHandle = (type: -1 | 1 | 0, currentSort: number) => {
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
    console.log('values', values);
    // 处理有效期
    if (expireDay === 5) {
      values.expireData = values.expireData?.format('YYYY-MM-DD');
      values.expireDay = undefined;
    }
    values.channelTagList = channelTagList.filter((filterItem) => filterItem.tagId === values.channelTagList);
    values.staffs = values.staffs.map(({ staffId }: { staffId: string }) => ({ staffId }));
    const param = { ...values };
    console.log('param', param);
    const res = await requestEditStaffLive(param);
    if (res) {
      message.success('员工活码新增成功');
      history.push('/staffCode');
    }
  };

  const tableDataSource = useMemo(() => {
    const { staffName, dept } = staffSearchValues;
    const depts = (dept || []).map((mapItem: any) => mapItem.deptId.toString());
    return (selectStaffList || []).filter(
      (fliterItem) =>
        (!staffName || fliterItem.staffName.includes(staffName)) &&
        (!dept || fliterItem.fullDeptId.split(',').some((deptId: string) => depts.includes(deptId)))
    );
  }, [staffSearchValues, selectStaffList]);

  useEffect(() => {
    setReadOnly(false);
    getChannelGroupList();
  }, []);
  return (
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
      <Form
        form={form}
        className={style.form}
        // onFinish={() => history.push('/staffCode')}
        onFinish={onFinishHandle}
        // @ts-ignore
        initialValues={location.state?.row || {}}
      >
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
              <Group value={expireDay} onChange={expireDayOnChange}>
                {expireDayList.map((mapItem) => (
                  <Radio key={mapItem.value} value={mapItem.value}>
                    {mapItem.label}
                  </Radio>
                ))}
              </Group>
            </Item>
            {expireDay === 5 && (
              <div className={style.expireDayData}>
                <Item name="expireDate" rules={[{ required: true, message: '请选择失效日期' }]}>
                  <DatePicker />
                </Item>
                <div className={style.remarks}>备注：活码有效期后到</div>
              </div>
            )}
            <Item label="活码类型" name="liveType" rules={[{ required: true, message: '请选择活码类型' }]}>
              <Group value={liveType} onChange={liveTypeOnChange}>
                {liveTypeList.map((mapItem) => (
                  <Radio key={mapItem.value} value={mapItem.value}>
                    {mapItem.label}
                  </Radio>
                ))}
              </Group>
            </Item>
            <Item label="使用成员" name="staffs" rules={[{ required: true, message: '请选择使用成员' }]}>
              <SelectStaff
                value={selectStaffList}
                onChange={selectStaffOnChange}
                className={style.select}
                singleChoice={liveType === 1}
              />
            </Item>
            {[2, 3].includes(liveType as number) && (
              <>
                {liveType === 3 && (
                  <Item label="配置详情" name="assignType">
                    <Group value={assignType} onChange={(e) => setAssignType(e.target.value)}>
                      {assignTypeList.map((mapItem) => (
                        <Radio key={mapItem.value} value={mapItem.value}>
                          {mapItem.label}
                        </Radio>
                      ))}
                    </Group>
                  </Item>
                )}
                <div className={style.tableWrap}>
                  <div className={style.searchWrap}>
                    <Item label="员工名称" name="staffName">
                      <Input className={style.staffListInput} placeholder="待输入" />
                    </Item>
                    <Item label="选择部门" name="dept">
                      <SelectStaff type="dept" className={style.staffListSelect} />
                    </Item>
                    <Button className={style.staffListSearch} type="primary" onClick={searchStaffList}>
                      搜索
                    </Button>
                  </div>

                  <Table
                    rowKey={(record: any) => record.id + record.sort}
                    className={style.staffList}
                    scroll={{ x: 760 }}
                    dataSource={tableDataSource.slice(pageNum * 10 - 10, pageNum * 10)}
                    pagination={{
                      current: pageNum,
                      simple: true,
                      total: tableDataSource.length,
                      onChange (page: number) {
                        setPageNum(page);
                        setStaffRowKeys([]);
                      }
                    }}
                    columns={[
                      {
                        title: '序号',
                        render (value: any) {
                          return <>{value.sort}</>;
                        }
                      },
                      { title: '员工姓名', dataIndex: 'staffName' },
                      { title: '部门', dataIndex: 'deptName' },
                      {
                        title: '操作',
                        render (value: any) {
                          return (
                            <>
                              {assignType === 2 && value.sort !== 1 && (
                                <span
                                  className={classNames('text-primary mr5 pointer')}
                                  onClick={() => sortHandle(-1, value.sort)}
                                >
                                  上移
                                </span>
                              )}
                              {assignType === 2 && value.sort !== tableDataSource.length && (
                                <span
                                  className={classNames('text-primary mr5 pointer')}
                                  onClick={() => sortHandle(1, value.sort)}
                                >
                                  下移
                                </span>
                              )}
                              <Popconfirm title="确定删除该员工吗？" onConfirm={() => batchDelStaff([value.id])}>
                                <span className={classNames('text-primary mr5 pointer')}>删除</span>
                              </Popconfirm>
                              {assignType === 2 && value.sort !== 1 && (
                                <span
                                  className={classNames('text-primary mr5 pointer')}
                                  onClick={() => sortHandle(0, value.sort)}
                                >
                                  置顶
                                </span>
                              )}
                            </>
                          );
                        }
                      }
                    ]}
                    rowSelection={{
                      selectedRowKeys: staffRowKeys,
                      onChange (keys: Key[]) {
                        setStaffRowKeys(keys);
                      }
                    }}
                  />
                  <span>
                    已选中 {staffRowKeys.length}/{tableDataSource.length} 个员工
                  </span>
                  <Button
                    className={style.batchDel}
                    disabled={staffRowKeys.length === 0}
                    onClick={() => batchDelStaff(staffRowKeys)}
                  >
                    批量删除
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
        <div className={style.panel}>
          <div className={style.title}>个性设置</div>
          <div className={style.content}>
            <Item label="是否开启只能添加同一客户" name="isExclusive" initialValue={0}>
              <Group>
                <Radio value={1}>开启</Radio>
                <Radio value={0}>关闭</Radio>
              </Group>
            </Item>
            <Item label="添加好友无需验证" name="isOpenVerify">
              <Group>
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
                placeholder="选填，如不填则默认抓取选定任务推荐话术"
                maxLength={50}
                showCount
              />
            </Item>
            <Form.Item label="欢迎语配置" name="isWelcomeMsg" rules={[{ required: true }]}>
              <Group onChange={(e) => setIsWelcomeMsg(e.target.value)}>
                <Radio value={0}>不发送</Radio>
                <Radio value={1}>渠道欢迎语</Radio>
              </Group>
            </Form.Item>
            {isWelcomeMsg === 1 && (
              <>
                <Form.Item name="welcomeWord" rules={[{ required: true }]}>
                  <CustomTextArea maxLength={1200} />
                </Form.Item>
                <Item noStyle name="welcomes">
                  <AddMarket />
                </Item>
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
              <Button className={style.submitBtn} type="primary" htmlType="submit">
                确定
              </Button>
              <Button className={style.cancelBtn} onClick={() => history.goBack()}>
                取消
              </Button>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};
export default AddCode;
