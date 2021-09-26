/*
 * @Descripttion:通用工具函数
 * @version: 1.0.0
 * @Author: Jser
 * @Date: 2021-06-02 15:13:17
 */
import moment from 'moment';
//  判断时间戳是前几天
export const getDateTimeBefor = (publishtime: string): string => {
  const date: Date = new Date();
  const currTime: number = Date.parse(date.toString());
  const l = currTime - Date.parse(publishtime);
  // 少于一分钟
  const time = l / 1000;
  // 秒转天数
  const days = time / 3600 / 24;
  if (days < 1) {
    return '今日 ' + moment(publishtime).format('hh:mm');
  }
  if (days < 2) {
    return '昨日 ' + moment(publishtime).format('hh:mm');
  }
  return moment(publishtime).format('MM-DD hh:mm');
};
