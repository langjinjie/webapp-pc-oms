import { SearchCol } from 'src/components/SearchComponent/SearchComponent';

export const searchCols: SearchCol[] = [
  {
    name: 'title',
    type: 'input',
    label: '策略任务名称',
    width: '200px',
    placeholder: '待输入'
  }
];

export const contentTypeList = [
  {
    label: '文章',
    value: 1
  },
  {
    value: 2,
    label: '海报'
  },
  {
    label: '产品',
    value: 3
  },
  {
    value: 4,
    label: '活动'
  },
  { value: 5, label: '话术' }
];
