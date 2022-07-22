import { SearchCol } from 'src/components/SearchComponent/SearchComponent';

export const searchCols: SearchCol[] = [
  {
    name: 'title',
    type: 'input',
    label: '策略任务名称',
    width: '240px',
    placeholder: '待输入'
  }
];

export type TplType = {
  displayCoverImg: string;
  resultDesc: string;
  sceneDesc: string;
  taskDesc: string;
  tplCode: string;
  tplId: string;
  tplName: string;
};
