import request from '@/utils/request'

export default {
  // 用户条件查询并分页
  getUser(current, size, userQuery) {
    return request({
      method: 'POST',
      url: `/adminService/user/findAll/${current}/${size}`,
      data: userQuery
    })
  },
  // 添加用户
  addUser(user) {
    return request({
      method: 'POST',
      data: user,
      url: `/adminService/user/addUser`
    })
  },
  // 删除用户
  delete(id) {
    return request({
      method: 'DELETE',
      url: `/adminService/user/delete/${id}`
    })
  },
  // 根据id返回用户信息
  getUserById(id) {
    return request({
      method: 'GET',
      url: `/adminService/user/findById/${id}`
    })
  },
  // 修改用户
  updateUser(user) {
    return request({
      method: 'POST',
      url: `/adminService/user/update`,
      data: user
    })
  }
}
