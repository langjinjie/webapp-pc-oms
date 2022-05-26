import React from 'react';
import { NgLineChart } from '../components/NgLineChart/NgLineChat';

const AddFriend: React.FC = () => {
  return (
    <div>
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <NgLineChart data={[1, 4, 8, 20, 14, 18, 40]} key={item} />
      ))}
      <NgLineChart data={[40, 30, 20, 30, 4, 1, 0]} width={200} height={80} />
    </div>
  );
};

export default AddFriend;
