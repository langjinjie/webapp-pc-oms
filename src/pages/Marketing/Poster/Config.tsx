import { SearchCol } from 'src/components/SearchComponent/SearchComponent';

export const setSearchCols = (): SearchCol[] => {
  return [
    {
      name: 'title',
      type: 'input',
      label: '海报名称',
      placeholder: '海报名称'
    },
    {
      name: 'categoryId',
      type: 'select',
      label: '状态',
      width: 160
    },
    {
      name: 'syncBank',
      type: 'select',
      label: '分类',
      width: 160,
      options: [
        // { id: 0, name: '未上架' },
        { id: '1', name: '已上架' },
        { id: '2', name: '已下架' }
      ]
    }
  ];
};
