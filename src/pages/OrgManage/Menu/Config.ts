import { SearchCol } from 'src/components/SearchComponent/SearchComponent';

export const searchCols: SearchCol[] = [
  {
    name: 'name',
    type: 'input',
    label: '菜单名称',
    placeholder: '请输入',
    width: 320
  },
  {
    name: 'status',
    type: 'select',
    label: '状态',
    options: [{ id: '1', name: '已启用' }]
  }
];
