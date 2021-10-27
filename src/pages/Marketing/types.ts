export interface PaginationProps {
  current: number;
  pageSize: number;
  total: number;
  showTotal: (total: any) => string;
}
