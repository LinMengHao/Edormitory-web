<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="userQuery.username" placeholder="用户名" style="width: 150px;" class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-input v-model="userQuery.nickname" placeholder="姓名" style="width: 150px;" class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-input v-model="userQuery.phoneNumber" placeholder="电话号码" style="width: 150px;" class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-select v-model="userQuery.sex" placeholder="性别" clearable style="width: 90px" class="filter-item" @change="handleFilter">
        <el-option label="男" value="0"/>
        <el-option label="女" value="1"/>
      </el-select>
      <el-select v-model="userQuery.status" placeholder="状态" clearable class="filter-item" style="width: 90px" @change="handleFilter">
      <el-option label="已激活" value="1"/>
      <el-option label="未激活" value="0"/>
    </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download"
                 @click="handleDownload">
        导出
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column fixed label="序号" width="50" align="center">
        <template slot-scope="scope">
          {{ (current - 1) * size + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="username" label="用户名" width="120" align="center"/>
      <el-table-column prop="nickname" label="姓名" width="120" align="center"/>
      <el-table-column prop="birth" label="出生日期" width="170" align="center"/>
      <el-table-column label="性别" width="60">
        <template slot-scope="scope">
          <!-- ===判断类型和值 -->
          {{ scope.row.sex===1?'女':'男' }}
        </template>
      </el-table-column>
      <el-table-column prop="phoneNumber" label="电话号码" width="120" align="center"/>
      <el-table-column prop="email" label="邮箱" width="150"/>
      <el-table-column prop="createTime" label="创建时间" width="160" align="center"/>
      <el-table-column label="状态" width="60" align="center">
        <template slot-scope="scope">
          <!-- ===判断类型和值 -->
          {{ scope.row.status===1?'激活':'未激活' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center" fixed="right">
        <template slot-scope="scope">
          <router-link :to="'/system/update/'+scope.row.id">
            <el-button type="primary" plain="true" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>
          <el-button type="danger" size="mini" plain="true" icon="el-icon-delete"
                     @click="removeDataById(scope.row.id)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChange"
      @current-change="getList"
      :current-page="current"
      :page-sizes="[10,20,30,40,50,1000,10000]"
      :page-size="size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>
<script>
  // 引入api下的user.js文件
  import userApi from '@/api/users/users.js'
  import waves from '@/directive/waves' // waves directive
  import { parseTime } from '@/utils'
  import Pagination from '@/components/Pagination'

  export default {
    components: { Pagination },
    directives: { waves },
    // 写核心代码的位置
    data() { // 定义变量和初始值
      return {
        listLoading: true,//加载方式
        downloadLoading: false,
        list: null, // 查询之后接口返回集合
        current: 1, // 当前页
        size: 10, // 每页记录数
        total: 0, // 总记录数
        userQuery: {} // 条件封装的对象 v-model双向绑定
      }
    },
    created() { // 页面渲染之前执行，调用method定义的方法
      // 调用
      this.getList()
    },
    methods: {
      //每页记录数改变
      sizeChange(v) {
        this.size = v
        this.getList()
      },
      handleFilter() {
        this.current = 1
        this.getList()
      },
      // 创建具体的方法，调用user.js定义的方法
      getList() { // 用户列表
        this.listLoading = true
        userApi.getUser(this.current, this.size, this.userQuery)
          .then(response => { // 请求成功
            // response接口返回的数据
            // console.log(response)
            this.list = response.data.records
            this.total = response.data.total
            setTimeout(() => {
              this.listLoading = false
            }, 1000)// 加载方式定时器
          })
          .catch(error => { // 请求失败
            console.log(error)
          })
      },
      resetData() { // 清空按钮的方法
        // 清空已输入数据
        this.userQuery = {}
        // 查询所有  恢复未进行条件查询的状态
        this.getList()
      },
      removeDataById(id) { // 删除讲师按钮的方法
        this.$confirm('此操作将删除用户信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          userApi.delete(id)
            .then(response => { // 删除成功
              // 提示信息
              this.$message({
                type: 'success',
                message: '删除成功🤭'
              })
              // 回到列表页面
              this.getList()
            })
        })
        // 点取消执行catch方法  用户体验角度
        // 此处无需进行提示取消
        // 框架在./utils/request.js封装好了提示error的方法
      },

      //导出excel表
      handleDownload() {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['出生日期', '用户名', '姓名', '性别', '电话号码', '邮箱', '状态', '创建时间']
          const filterVal = ['birth', 'username', 'nickname', 'sex', 'phoneNumber', 'email', 'status', 'createTime']
          const data = this.formatJson(filterVal)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '用户列表'
          })
          this.downloadLoading = false
        })
        // 清空已输入数据
        this.userQuery = {}
        // 查询所有  恢复未进行条件查询的状态
        this.getList()
      },
      formatJson(filterVal) {
        this.list.map(s => {
            if (s.sex === 1) {
              s.sex = '女'
            } else {
              s.sex = '男'
            }
            if (s.status===0) {
              s.status='未激活'
            } else {
              s.status='已激活'
            }
            return s
          }
        )
        return this.list.map(v => filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      }
    }
  }
</script>
