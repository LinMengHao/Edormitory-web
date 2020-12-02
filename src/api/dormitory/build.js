import request from '@/utils/request'

export default {
  // 楼房条件查询并分页
  getBuild(current, size, buildQuery) {
    return request({
      method: 'POST',
      url: `/dormitoryService/build/findAll/${current}/${size}`,
      data: buildQuery
    })
  },
  // 添加楼字
  addBuild(build) {
    return request({
      method: 'POST',
      data: build,
      url: `/dormitoryService/build/addBuild`
    })
  },
  // 删除楼字
  delete(id) {
    return request({
      method: 'DELETE',
      url: `/dormitoryService/build/deleteBuild/${id}`
    })
  },
  // 根据id返回楼字管理员信息
  getById(id) {
    return request({
      method: 'GET',
      url: `/dormitoryService/build/getById/${id}`
    })
  },
  // 修改用户
  updateBuild(build) {
    return request({
      method: 'POST',
      url: `/dormitoryService/build/updateBuild`,
      data: build
    })
  }
}
