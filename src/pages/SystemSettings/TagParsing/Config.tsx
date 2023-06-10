import { ColumnsType } from 'antd/lib/table';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';

export const searchCols: SearchCol[] = [
  { name: '客户昵称', label: '客户昵称', type: 'input' },
  { name: '外部联系人id', label: '外部联系人id', type: 'input' },
  { name: '标签名称', label: '标签名称', type: 'input' },
  { name: '客户经理姓名', label: '客户经理姓名', type: 'input' },
  { name: '标签生成时间', label: '标签生成时间', type: 'rangePicker' }
];

export const tableColumns: () => ColumnsType<any> = () => {
  return [
    { title: '客户昵称' },
    { title: '外部联系人id' },
    { title: '客户经理姓名' },
    { title: '客户经理企业微信账号' },
    { title: '聊天内容' },
    { title: '关键词' },
    { title: '生成标签' },
    { title: '生成标签值' },
    { title: '标签生成时间' },
    { title: '更新标签' },
    { title: '更新标签值' },
    { title: '更新时间' },
    { title: '更新人' },
    { title: '操作' }
  ];
};
