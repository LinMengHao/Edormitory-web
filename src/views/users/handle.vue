<template>
  <div class="app-container">
    <div style="font-size: 19PX; font-weight: 600; margin-bottom: 20px; margin-left: 20px;">
      <!--      判断路由里面有无数据和id判断出是添加页面还是修改页面-->
      <div v-if="this.$route.params && this.$route.params.id">修改用户</div>
      <div v-else>添加用户</div>
    </div>

    <el-form label-width="120px">
      <el-form-item label="用户名">
        <el-input v-model="user.username" readonly/>
      </el-form-item>
      <el-form-item  label="密码">
        <el-input v-if="this.$route.params && this.$route.params.id" v-model="user.password" readonly/>
        <el-input v-else v-model="user.password" />
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="user.nickname" />
      </el-form-item>
      <el-form-item label="性别">
        <el-select v-model="user.sex" clearable placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            value使用动态绑定的值，用户头衔由1 2代替
          -->
          <el-option :value="0" label="男" />
          <el-option :value="1" label="女" />
        </el-select>
      </el-form-item>
      <el-form-item label="电话号码">
        <el-input v-model="user.phoneNumber" />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="user.email" />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="user.status" clearable placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            value使用动态绑定的值，用户头衔由1 2代替
          -->
          <el-option :value="0" label="未激活" />
          <el-option :value="1" label="激活" />
        </el-select>
      </el-form-item>
      <el-form-item label="出生日期">
        <el-date-picker
          v-model="user.birth"
          type="date"
          placeholder="选择日期"
          format="yyyy/MM/dd"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <!-- 用户头像 -->
      <el-form-item label="用户头像">
        <el-upload
          :show-file-list="true"
          :on-success="handleAvatarSuccess"
          :on-error="handleAvatarError"
          :before-upload="beforeAvatarUpload"
          class="avatar-uploader"
          :action="BASE_API+'/eduOss/fileOss'"
        >
          <img v-if="user.avatar" :src="user.avatar" alt="">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-form-item>
      <span style="margin-left: 8.7%;font-size: 20px; font-weight: 400;">*点击图片框修改头像*</span>
      <br><br><br>
      <el-form-item>
        <el-button :disabled="saveBtnDisabled" plain="true" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
// 引入调用teacher.js文件
import userApi from '@/api/users/users'
// 引入上传头像的功能组件
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

export default {
  components: { ImageCropper, PanThumb }, // 组件的声明
  data() {
    return {
      user: {
        password: '',
        username: '',
        nickname: '',
        sex: 0,
        status: 1,
        phoneNumber: '',
        email: '',
        avatar: '',
        birth: ''
      }, // v-model双向绑定
      imagecropperShow: false, // 上传弹框组件是否显示
      imagecropperKey: 0, // 上传组件唯一标识
      BASE_API: process.env.VUE_APP_BASE_API, // 获取dev.env.js里面地址
      saveBtnDisabled: false // 保存按钮是否禁用
    }
  },
  watch: { // vue的监听
    $route(to, from) { // 路由变化方式，路由一发生变化 就执行方法
      this.init()
    }
  },
  created() { // 页面渲染前执行
    this.init()
  },
  methods: {
    // 文件上传成功
    handleAvatarSuccess(response) {
      if (response.success) {
        this.user.avatar = response.data.url
        // 强制重新渲染
        this.$forceUpdate()
      } else {
        this.$message.error('上传失败! （非20000）')
      }
    },

    // 文件上传失败（http）
    handleAvatarError() {
      this.$message.error('上传失败! （http失败）')
    },

    // 上传校验
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt3M = file.size / 1024 / 1024 < 3

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt3M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt3M
    },

    init() {
      // 判断路径有id值  修改操作
      if (this.$route.params && this.$route.params.id) {
        const id = this.$route.params.id
        this.getInfo(id)
      } else { // 判断路径没有id值  添加操作
        // 清空表单即清空teacher
        this.user = {
          username: '',
          nickname: '',
          sex: 0,
          status: 1,
          phoneNumber: '',
          email: '',
          avatar: '',
          birth: ''
        }// v-model双向绑定
      }
    },
    // 根据用户id查到用户信息 回显操作
    getInfo(id) {
      userApi.getUserById(id)
        .then(response => {
          this.user = response.data.user
        })
        .catch((response) => {
          this.$message({
            type: 'error',
            message: '获取数据失败'
          })
        })
    },

    // 保存按钮调用的方法，调用前判断是修改还是添加用户
    saveOrUpdate() {
      // 判断修改或添加 user是否有id
      if (!this.user.id) {
        // 添加
        this.addUser()
      } else {
        // 修改
        this.updateUser()
      }
    },

    // 添加用户的方法
    addUser() {
      userApi.addUser(this.user)
        .then(response => { // 添加成功
          // 提示成功
          this.$message({
            type: 'success',
            message: '添加成功！ 😄'
          })
          // 回到用户列表页面
          // vue路由跳转
          this.$router.push({
            path: '/system/user/list'
          })
        })
    },

    // 修改用户的方法
    updateUser() {
      userApi.updateUser(this.user)
        .then(response => { // 修改成功
          // 提示成功
          this.$message({
            type: 'success',
            message: '修改成功！ 🧙‍♂️'
          })
          // 回到用户列表页面
          // vue路由跳转
          this.$router.push({
            path: '/system/user/list'
          })
        })
    }

  }
}
</script>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar-uploader img {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
