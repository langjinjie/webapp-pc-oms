import React, { useState, Dispatch, SetStateAction, Key, useEffect } from 'react';
import { NgModal } from 'src/components';
import { Form, Input, TreeSelect } from 'antd';
import { LegacyDataNode } from 'rc-tree-select/lib/TreeSelect';
import { ITreeDate } from 'src/utils/interface';
import { queryDepartmentList } from 'src/apis/organization';
import { StaffTagModal } from '../index';
import { debounce, tree2Arry } from 'src/utils/base';
import { requestAddGroupTag } from 'src/apis/orgManage';
import style from './style.module.less';

interface IAddTagModal {
  addTagParam: { visible: boolean };
  setAddTagParam: Dispatch<SetStateAction<{ visible: boolean }>>;
  updateList?: () => void;
}

const AddTagModal: React.FC<IAddTagModal> = ({ addTagParam, setAddTagParam, updateList }) => {
  const [treeData, setTreeData] = useState<any[]>([]);
  const { SHOW_ALL } = TreeSelect;
  const [form] = Form.useForm();
  const { Item } = Form;
  // 向树结构添加子节点
  const updateTreeData = (list: any[], key: React.Key, children: any[]): any[] => {
    return list.map((node) => {
      if (node.deptId === key) {
        return {
          ...node,
          children
        };
      }
      if (node.children) {
        return {
          ...node,
          children: updateTreeData(node.children, key, children)
        };
      }
      return node;
    });
  };
  // 获取组织架构部门
  const getCorpOrg = async (deptId?: Key) => {
    // 获取部门
    let res1: ITreeDate[] = (await queryDepartmentList({ parentId: deptId })).map((item: ITreeDate) => ({
      ...item,
      parentId: deptId
    }));
    // ,并且过滤掉未完善员工
    res1 = res1.filter((item: any) => item.deptId !== -1);
    return [...res1];
  };
  // 异步获取组织架构及当前目录下的员工
  const onLoadData = async ({ key }: LegacyDataNode) => {
    // 获取对应的子节点
    const res: any = await getCorpOrg(key);
    if (res) {
      setTreeData((treeData) => updateTreeData(treeData, key as Key, res));
    }
  };
  // 监听form表单变化
  const formOnchange = (_: any, allValues: any) => {
    let deptName = '';
    if (allValues.deptList) {
      deptName =
        '部门：' +
        tree2Arry(treeData)
          .filter((filterItem) => allValues.deptList.includes(filterItem.deptId))
          .map((mapItem) => mapItem.deptName)
          .toString()
          .replace(/,/g, '+') +
        '+';
    }
    const ruleTypeName = (allValues.staffTagList || []).reduce((prev: string, now: any) => {
      prev = prev + now.tagName + '：' + now.tagValues + '+';
      return prev;
    }, '');
    const textAreaVal = (deptName + ruleTypeName).replace(/^(\s|\+)+|(\s|\+)+$/g, '');
    form.setFieldsValue({ filterName: textAreaVal });
  };
  const onOk = async () => {
    const { name, filterName, deptList, staffTagList } = form.getFieldsValue();
    const param = { name, filterName, deptList: deptList?.map((item: number) => ({ deptId: item })), staffTagList };
    const res = await requestAddGroupTag(param);
    if (res) {
      setAddTagParam({ visible: false });
      form.resetFields();
      updateList?.();
    }
  };
  const onCancel = () => {
    setAddTagParam({ visible: false });
    form.resetFields();
  };
  useEffect(() => {
    (async () => {
      setTreeData(await getCorpOrg());
    })();
  }, []);
  return (
    <NgModal
      title="添加标签"
      closable={false}
      visible={addTagParam.visible}
      className={style.wrap}
      onOk={onOk}
      onCancel={onCancel}
      maskClosable={false}
    >
      <Form className={style.form} form={form} onValuesChange={debounce(formOnchange, 500)}>
        <Item className={style.formItem} name="name" label="标签名称：">
          <Input className={style.input} placeholder="请输入" />
        </Item>
        <Item className={style.formItem} name="deptList" label="选择组织部门：">
          <TreeSelect
            virtual={false}
            fieldNames={{ label: 'deptName', value: 'deptId', children: 'children' }}
            className={style.treeSelect}
            dropdownClassName={style.treeSelectDropdown}
            multiple
            showCheckedStrategy={SHOW_ALL}
            allowClear
            placeholder="请选择部门"
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            loadData={onLoadData}
            treeData={treeData}
          />
        </Item>
        <Item className={style.formItem} name="staffTagList" label="选择人员标签：">
          <StaffTagModal />
        </Item>
        <Item name="filterName" className={style.formItem} label="标签筛选逻辑：">
          <Input.TextArea className={style.textAreaVal} readOnly disabled />
        </Item>
      </Form>
    </NgModal>
  );
};
export default AddTagModal;
