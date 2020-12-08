import request from '@/utils/request'

export default {
  // 条件查询并分页
  getStudent(current, size, studentQuery) {
    return request({
      method: 'POST',
      url: `/manageService/student/findAll/${current}/${size}`,
      data: studentQuery
    })
  },
  // 添加宿管
  addStudent(student) {
    return request({
      method: 'POST',
      data: student,
      url: `/manageService/student/addStudent`
    })
  },
  // 删除宿管
  delete(id) {
    return request({
      method: 'DELETE',
      url: `/manageService/student/deleteStudent/${id}`
    })
  },
  // 根据id返回管理员信息
  getStudentById(id) {
    return request({
      method: 'GET',
      url: `/manageService/student/findById/${id}`
    })
  },
  // 修改用户
  updateStudent(student) {
    return request({
      method: 'POST',
      url: `/manageService/student/updateStudent`,
      data: student
    })
  },
}
