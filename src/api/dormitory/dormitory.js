import request from '@/utils/request'

export default {
  // 宿舍房间条件查询并分页
  getDormitory(current, size, dormitoryQuery) {
    return request({
      method: 'POST',
      url: `/dormitoryService/dormitory/findAll/${current}/${size}`,
      data: dormitoryQuery
    })
  },
  // 添加楼字
  addDormitory(dormitory) {
    return request({
      method: 'POST',
      data: dormitory,
      url: `/dormitoryService/dormitory/addDormitory`
    })
  },
  // 删除楼字
  delete(id) {
    return request({
      method: 'DELETE',
      url: `/dormitoryService/dormitory/deleteDormitory/${id}`
    })
  },
  // 根据id返回宿舍成员信息
  getStudentsById(id) {
    return request({
      method: 'GET',
      url: `/dormitoryService/dormitory/getStudentById/${id}`
    })
  },
  // 根据id返回宿舍信息
  getDormitoryById(id) {
    return request({
      method: 'GET',
      url: `/dormitoryService/dormitory/getDormitoryById/${id}`
    })
  },
  // 修改宿舍
  updateDormitory(dormitory) {
    return request({
      method: 'POST',
      url: `/dormitoryService/dormitory/updateDormitory`,
      data: dormitory
    })
  },
  //根据宿舍id减少现入住人数
  reduceNowNum(id) {
    return request({
      method: 'POST',
      url: `/dormitoryService/dormitory/reduceNowNum/${id}`,
    })
  },
  //根据宿舍id增加先入住人数
  addNowNum(id) {
    return request({
      method: 'POST',
      url: `/dormitoryService/dormitory/addNowNum/${id}`,
    })
  }

}

