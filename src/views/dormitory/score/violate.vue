<template>

  <div class="app-container">
    <div v-if="this.$route.params && this.$route.params.id"><h2 style="text-align: center;">修改课程信息</h2></div>
    <div v-else><h2 style="text-align: center;">发布新课程</h2></div>

    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写得分基本信息" />
      <el-step title="违规描述" />
      <el-step title="最终发布" />
    </el-steps>

    <el-form label-width="120px">

      <!-- 课程讲师 -->
      <el-form-item label="评分者">
        <el-select v-model="list.author" clearable placeholder="请选择评分者">
          <el-option
            v-for="item in memberList"
            :key="item.id"
            :label="item.name"
            :value="item.name">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="评分者电话">
        <el-input v-model="list.phoneNum"
                  placeholder=" 评分者电话号码" />
      </el-form-item>

      <el-form-item label="宿舍">
        <el-select  clearable placeholder="请选择楼名" @change="handleFilter(build.id)" v-model="build.id">
          <el-option
            v-for="item in buildList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <el-select  clearable placeholder="请选择宿舍" v-model="list.dormitoryId">
          <el-option
            v-for="items in dormitoryList"
            :key="items.id"
            :label="items.roomNum"
            :value="items.id">
            {{items.buildId}}-{{items.roomNum}}
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="评分">
        <el-rate
          :max="10"
          :allow-half="true"
          v-model="list.score"
          :colors="colors">
        </el-rate>
      </el-form-item>

      <el-form-item label="宿舍卫生简介">
        <editor :height="300" v-model="list.description" />
      </el-form-item>


      <el-form-item label="宿舍卫生照片">
        <el-upload :show-file-list="false"
                   :on-success="handleAvatarSuccess"
                   :before-upload="beforeAvatarUpload"
                   :action="BASE_API+'/ossService/fileOss/avatar'"
                   class="avatar-uploader">
          <img v-if="list.avatar" :src="list.avatar" alt="">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-form-item>
      <span style="margin-left: 8.7%;font-size: 20px; font-weight: 400;">*点击图片框修改头像*</span>
      <br/><br/><br/>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" plain="true" type="primary" @click="saveOrUpdate">保存并下一步</el-button>
      </el-form-item>

    </el-form>


  </div>
</template>
<script>

  import memberApi from '@/api/manager/member'
  import dormitoryApi from '@/api/dormitory/dormitory'
  import scoreApi from '@/api/score/score'
  import buildApi from '@/api/dormitory/build'
  //引入Tinymce富文本编辑器
  import Tinymce from '@/components/Tinymce'
  export default {
    components: {
      'editor': Tinymce
    }, //声明组件

    data() {
      return {
        build: {},
        list: {
          avatar: ''
        },
        scoreId: 0,
        buildList: [],
        dormitoryList: [],
        memberList: [],
        saveBtnDisabled: false, // 保存按钮是否禁用
        BASE_API: process.env.VUE_APP_BASE_API, // 接口API地址
        colors: { 3: '#99A9BF', 6: { value: '#F7BA2A', excluded: true }, 10: '#FF9900' }
      }
    },

    created() {
      //回显：获取路由中的id值
      if (this.$route.params && this.$route.params.id) {
        this.scoreId = this.$route.params.id
        //调用回显方法
        this.getInfo()
      }else{
        //初始化
        this.getAllMember()
        this.getAllBuild()
        this.init()
      }
    },

    watch: {  //vue的监听
      $route(to, from) {  //路由变化方式，路由一发生变化 就执行方法
        this.init()
      }
    },

    methods: {
      //获取所有member
      getAllMember(){
        memberApi.getAllMember().then(response =>{
          this.memberList=response.data.memberList
        })
      },
      //两级联动
      handleFilter(id){
        dormitoryApi.findByBuildId(id).then(response => {
          this.dormitoryList=response.data.dormitoryList
        })
      },
      //获取所有楼字
      getAllBuild(){
        buildApi.getAllBuild().then(response => {
          this.buildList=response.data.buildList
        })
      },
      //回显： 根据课程id查询信息进行回显
      getInfo(){
        scoreApi.findById(this.scoreId)
          .then(response => {
            this.list = response.data.score
            //初始化
            dormitoryApi.getDormitoryById(this.list.dormitoryId).then(response =>{
              this.build=response.data.dormitory.buildId
            })
          })
      },

      //bug：点击发布课程不刷新  初始化方法
      init(){
        //判断路径有id值  修改操作
        if (this.$route.params && this.$route.params.id) {
          const id = this.$route.params.id
          this.getInfo(id)
        }else{ //判断路径没有id值  添加操作
          //清空表单即清空teacher
          this.list = {
            avatar: ''
          }
          //初始化build
          this.build={}
        }
      },

      //上传封面成功调用方法
      handleAvatarSuccess(response, file) {
        this.list.avatar = response.data.url
      },

      //上传之前调用方法 规定文件类型大小等条件
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg'
        const isLt2M = file.size / 1024 / 1024 < 2

        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M
      },

      //添加
      addCourse(){
        scoreApi.addScore(this.list)
          .then(response => {
            //提示
            this.$message({
              type: 'success',
              message: '填写课程信息成功 ✌'
            })
            //跳转到下一步
            this.$router.push({
              path: '/score/violate/' + response.data.id
            })
          })
      },

      //修改课程
      updateCourse(){
        scoreApi.updateScore(this.list)
          .then(response => {
            //提示
            this.$message({
              type: 'success',
              message: '修改课程信息成功 ✌'
            })
            //跳转到下一步 修改的id路由中已经传过了
            this.$router.push({
              path: '/score/violate/' + this.scoreId
            })
          })
      },

      //下一步按钮方法
      saveOrUpdate() {
        //判断添加课程 or 修改课程
        if(!this.list.id){
          //无id --> 添加
          this.addCourse()
        }else{
          this.updateCourse()
        }
      },

    }
  }
</script>

<style scoped>
  .tinymce-container {
    line-height: 29px;
  }
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
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

</style>
