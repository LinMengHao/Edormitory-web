import request from '@/utils/request'

export default {
  // 条件查询并分页
  getMember(current, size, memberQuery) {
    return request({
      method: 'POST',
      url: `/manageService/member/findAll/${current}/${size}`,
      data: memberQuery
    })
  },
  // 添加宿管
  addMember(member) {
    return request({
      method: 'POST',
      data: member,
      url: `/manageService/member/addMember`
    })
  },
  // 删除宿管
  delete(id) {
    return request({
      method: 'DELETE',
      url: `/manageService/member/deleteMember/${id}`
    })
  },
  // 根据id返回管理员信息
  getMemberById(id) {
    return request({
      method: 'GET',
      url: `/manageService/member/getByMemberId/${id}`
    })
  },
  // 修改用户
  updateMember(member) {
    return request({
      method: 'POST',
      url: `/manageService/member/updateMember`,
      data: member
    })
  },
  // 根据buildid返回楼字管理员信息
  getMembersById(id) {
    return request({
      method: 'GET',
      url: `/manageService/member/getByBuildId/${id}`
    })
  },
}
