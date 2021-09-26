/**
 * @name sessionQuality
 * @author Lester
 * @date 2021-09-02 15:08
 */
import http, { HttpFunction, Void2Promise } from 'src/utils/http';

/**
 * 登录
 */
export const queryStatus: Void2Promise = () => {
  return http.get('/message_business/api/notify_user/status');
};

/**
 * 查询员工列表
 * @param param
 */
export const queryStaffList: HttpFunction = (param: Object) => {
  return http.post('/message_business/api/chat_record/member_list', param);
};

/**
 * 查询群聊列表
 * @param param
 */
export const queryGroupList: HttpFunction = (param: Object) => {
  return http.post('/message_business/api/chat_record/group_list', param);
};

/**
 * 查询群成员
 * @param param
 */
export const queryGroupMember: HttpFunction = (param: Object) => {
  return http.get('/message_business/api/chat_record/group_user_list', param);
};
