import request from '@/utils/request'

export default {
  // 添加
  addScore(score) {
    return request({
      method: 'POST',
      data: score,
      url: `/scoreService/score/addScore`
    })
  },
  findById(id) {
    return request({
      method: 'POST',
      url: `/scoreService/score/findById/${id}`
    })
  },
  updateScore(score) {
    return request({
      data: score,
      method: 'POST',
      url: `/scoreService/score/updateScore`
    })
  },
}
