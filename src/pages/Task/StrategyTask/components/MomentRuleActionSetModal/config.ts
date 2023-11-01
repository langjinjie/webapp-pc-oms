import { SearchCol } from 'src/components';

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
    label: '朋友圈Feed-文章',
    value: 11
  },
  {
    value: 12,
    label: '朋友圈Feed-产品'
  },
  {
    label: '朋友圈Feed-活动',
    value: 13
  },
  {
    value: 14,
    label: '朋友圈Feed-单张海报'
  },
  { value: 15, label: '朋友圈Feed-9宫格海报' }
];
