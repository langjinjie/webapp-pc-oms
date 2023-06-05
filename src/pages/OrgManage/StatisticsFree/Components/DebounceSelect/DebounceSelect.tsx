import React, { useMemo, useState } from 'react';
import { Empty, Select, Spin } from 'antd';
import { SelectProps } from 'antd/es/select';
import { debounce } from 'src/utils/base';

export interface DebounceSelectProps<ValueType = any> extends Omit<SelectProps<ValueType>, 'options' | 'children'> {
  fetchOptions: (search: string) => Promise<ValueType[]>;
  debounceTimeout?: number;
}

const DebounceSelect = <ValueType extends { key?: string; label: React.ReactNode; value: string | number } = any>({
  fetchOptions,
  debounceTimeout = 800,
  ...props
}: DebounceSelectProps): React.ReactElement => {
  const [fetching, setFetching] = React.useState(false);
  const [options, setOptions] = React.useState<ValueType[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const fetchRef = React.useRef(0);

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value: string) => {
      setSearchValue(value);
      if (!value) return setOptions([]);
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);

      fetchOptions(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }

        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);

  return (
    <Select<ValueType>
      labelInValue
      value={searchValue}
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={
        fetching ? <Spin size="small" /> : searchValue ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> : null
      }
      {...props}
      options={options}
      onBlur={() => {
        setSearchValue('');
        setOptions([]);
      }}
    />
  );
};

// async function fetchUserList(username: string): Promise<UserValue[]> {
//   console.log('fetching user', username);

//   return fetch('https://randomuser.me/api/?results=5')
//     .then((response) => response.json())
//     .then((body) =>
//       body.results.map((user: { name: { first: string; last: string }; login: { username: string } }) => ({
//         label: `${user.name.first} ${user.name.last}`,
//         value: user.login.username
//       }))
//     );
// }

export default DebounceSelect;
