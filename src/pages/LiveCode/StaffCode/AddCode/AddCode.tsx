import { Button, DatePicker, Form, Input, Radio, RadioChangeEvent, Select } from 'antd';
import classNames from 'classnames';
import React, { /* Key, */ useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { BreadCrumbs, Icon, NgTable } from 'src/components';
import { SelectStaff } from 'src/pages/StaffManage/components';
import CustomTextArea from 'src/pages/SalesCollection/SpeechManage/Components/CustomTextArea';
import style from './style.module.less';

export const expireDayList = [
  { value: 0, label: '永久' },
  { value: 1, label: '7天' },
  { value: 2, label: '15天' },
  { value: 3, label: '30天' },
  { value: 4, label: '自定义' }
];

export const liveTypeList = [
  { value: 1, label: '单人活码' },
  { value: 2, label: '批量单人' },
  { value: 3, label: '多人活码' }
];

export const assignTypeList = [
  { value: 1, label: '随机分配' },
  { value: 2, label: '依次分配' },
  { value: 3, label: '定量分配' }
];

const AddCode: React.FC = () => {
  const [readOnly, setReadOnly] = useState(false);
  const [endTime, setEndTime] = useState<number>(); // 有效期
  const [liveType, setLiveType] = useState<number>(); // 活码类型
  const [assignType, setAssignType] = useState<number>(); // 分配方式
  const [selectStaffList, setSelectStaffList] = useState<any[]>();
  // const [staffListSelectKeys, setStaffListSelectKeys] = useState<Key[]>([]);

  const [form] = Form.useForm();
  const { Item } = Form;
  const { Group } = Radio;
  const { TextArea } = Input;

  const history = useHistory();
  const location = useLocation();

  // 有效期切换
  const expireDayOnChange = (e: RadioChangeEvent) => {
    setEndTime(e.target.value);
  };

  // 活码类型切换
  const liveTypeOnChange = (e: RadioChangeEvent) => {
    setLiveType(e.target.value);
  };

  useEffect(() => {
    setReadOnly(false);
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
        onFinish={(values) => console.log('values1', values)}
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
            <Item label="有效期" name="expireDay">
              <Group value={endTime} onChange={expireDayOnChange}>
                {expireDayList.map((mapItem) => (
                  <Radio key={mapItem.value} value={mapItem.value}>
                    {mapItem.label}
                  </Radio>
                ))}
              </Group>
            </Item>
            {endTime === 4 && (
              <div className={style.expireDayData}>
                <Item noStyle name="expireDayData">
                  <DatePicker />
                </Item>
                <div className={style.remarks}>备注：活码有效期后到</div>
              </div>
            )}
            <Item label="活码类型" name="liveType">
              <Group value={liveType} onChange={liveTypeOnChange}>
                {liveTypeList.map((mapItem) => (
                  <Radio key={mapItem.value} value={mapItem.value}>
                    {mapItem.label}
                  </Radio>
                ))}
              </Group>
            </Item>
            <Item label="使用成员" name="staffs">
              <SelectStaff
                value={selectStaffList}
                onChange={(value) => setSelectStaffList(value)}
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
                      <SelectStaff type="dept" className={style.staffListSelect} singleChoice />
                    </Item>
                    <Button className={style.staffListSearch} type="primary">
                      搜索
                    </Button>
                  </div>

                  <NgTable
                    className={style.staffList}
                    scroll={{ x: 760 }}
                    columns={[{ title: '序号' }, { title: '员工姓名' }, { title: '部门' }, { title: '操作' }]}
                    rowSelection={{
                      onChange () {
                        console.log(11);
                      }
                    }}
                  />
                  <span>已选中 0/10 个员工</span>
                  <Button className={style.batchDel}>批量删除</Button>
                </div>
              </>
            )}
          </div>
        </div>
        <div className={style.panel}>
          <div className={style.title}>个性设置</div>
          <div className={style.content}>
            <Item label="添加好友无需验证">
              <Group>
                <Radio value={1}>开启</Radio>
                <Radio value={2}>关闭</Radio>
              </Group>
            </Item>
          </div>
        </div>
        <div className={style.panel}>
          <div className={style.title}>渠道设置</div>
          <div className={classNames(style.content, style.previewContent)}>
            <Item label="投放渠道" required>
              <Item noStyle>
                <Select className={style.select} placeholder="默认渠道" />
              </Item>
              <span className={style.chooseStaff}>
                <Icon className={style.addIcon} name="tianjiabiaoqian1" />
                添加渠道
              </span>
            </Item>
            <Item label="活码备注">
              <TextArea className={style.textArea} placeholder="选填，如不填则默认抓取选定任务推荐话术" />
            </Item>
            <Form.Item label="欢迎语配置" name="contentObj.content" rules={[{ required: true }]}>
              <CustomTextArea maxLength={1200} />
            </Form.Item>
            <Item noStyle>
              <span className={style.chooseStaff}>
                <Icon className={style.addIcon} name="tianjiabiaoqian1" />
                添加图片/链接/文章/海报/活动/产品
              </span>
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
