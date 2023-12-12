import { useEffect } from 'react';
import { getCorpList } from 'src/apis/marketing';
import { OptionProps } from 'src/components';
import { useAsync } from 'src/utils/use-async';

const getCorps = async () => {
  const res = await getCorpList({});
  if (res) {
    const { corpList } = res;
    return corpList.map((corp: any) => ({ id: corp.corpId, name: corp.corpName }));
  }
  return [];
};

export const useGetCorps = (): { data: OptionProps[] } => {
  const { data, run } = useAsync<OptionProps[]>();
  useEffect(() => {
    run(getCorps());
  }, []);
  return {
    data: data || []
  };
};
