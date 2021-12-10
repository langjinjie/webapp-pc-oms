/**
 * @name Organization
 * @author Lester
 * @date 2021-12-10 10:36
 */
import React from 'react';
import StaffList from './StaffList/StaffList';

const Organization: React.FC = () => {
  return (
    <div>
      <div>左侧</div>
      <div>
        <StaffList />
      </div>
    </div>
  );
};

export default Organization;
