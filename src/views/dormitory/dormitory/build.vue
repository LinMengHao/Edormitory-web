<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="buildQuery.name" placeholder="楼名" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-input v-model="buildQuery.address" placeholder="地址" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download"
                 @click="handleDownload">
        导出
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-edit" @click="openDialog2">
        添加
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
      <el-table-column label="创建时间" prop="createTime" width="200px" align="center">
      </el-table-column>
      <el-table-column label="ID" prop="id" align="center" width="100">
      </el-table-column>
      <el-table-column label="楼名" prop="name" width="150px" align="center">
      </el-table-column>
      <el-table-column label="地址" prop="address" width="300px" align="center">
      </el-table-column>
      <el-table-column label="修改时间" prop="modifiedTime" width="200px" align="center">
      </el-table-column>
      <el-table-column label="操作" width="100" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" plain="true" size="mini" icon="el-icon-edit" @click="openDialog(scope.row.id)">详情
          </el-button>
          <el-button type="primary" plain="true" size="mini" icon="el-icon-edit" @click="openDialog1(scope.row.id)">修改
          </el-button>
          <el-button type="danger" size="mini" plain="true" icon="el-icon-delete"
                     @click="removeDataById(scope.row.id)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="current"
      :page-size="size"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="getList"
    />

<!-- 详情弹框-->
    <el-dialog :title="详情" :visible.sync="dialogFormVisible">
      <ul class="memberList">
        <el-button type="info">楼字管理员</el-button>
        <li><br/></li>
        <li v-for="member in members" :key="member.id">
          <el-row>
            <el-button type="primary">姓名：{{member.name}}</el-button>
            <el-button type="success">{{member.sex}}</el-button>
            <el-button type="info">电话号码：{{member.phoneNum}}</el-button>
            <el-button type="warning">{{member.status===0?'在岗':'休息'}}
            </el-button>
            <el-button type="danger">楼字ID：{{member.buildId}}</el-button>
          </el-row>
          <br/>
        </li>
      </ul>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          确定
        </el-button>
      </div>
    </el-dialog>

<!--    //修改弹窗-->
    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-form :label-position="right" label-width="80px" :model="build">
        <el-form-item label="ID">
          <el-input v-model="build.id" readonly></el-input>
        </el-form-item>
        <el-form-item label="楼名">
          <el-input v-model="build.name"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="build.address"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateBuild()">确定</el-button>
        <el-button type="primary" @click="dialogPvVisible = false">取消</el-button>
      </div>
    </el-dialog>
<!--    //添加-->
    <el-dialog :visible.sync="dialogSaveVisible" title="Reading statistics">
      <el-form :label-position="right" label-width="80px" :model="build">
        <el-form-item label="楼名">
          <el-input v-model="build.name"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="build.address"></el-input>
        </el-form-item>
        <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addBuild()">添加</el-button>
        </span>
        <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogSaveVisible = false">取消</el-button>
        </span>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import buildApi from '@/api/dormitory/build'
  import waves from '@/directive/waves' // waves directive
  import { parseTime } from '@/utils'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  export default {
    components: { Pagination },
    directives: { waves },
    data() {
      return {
        list: null,
        members: [],
        build: {
          id: 0,
          name: '',
          address: '',
        },
        total: 0,
        listLoading: true,
        current: 1,
        size: 20,
        buildQuery: {},
        dialogFormVisible: false,
        dialogSaveVisible: false,
        dialogPvVisible: false,
        downloadLoading: false
      }
    },
    created() {
      this.getList()
    },
    methods: {
      //添加楼字
      addBuild(){
        buildApi.addBuild(this.build)
          .then(response => { // 添加成功
            // 提示成功
            this.$message({
              type: 'success',
              message: '添加成功！ 😄'
            })
            // 回到用户列表页面
            // vue路由跳转
            this.dialogSaveVisible=false
            this.build=null
          })
      },
      //添加楼字弹窗开启
      openDialog2(){
        this.build=null
        this.dialogSaveVisible=true
      },
      //删除楼宇
      removeDataById(id){ // 删除讲师按钮的方法
        this.$confirm('此操作将删除楼字信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          buildApi.delete(id)
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
      //修改弹框显示并添加信息回显
      openDialog1(id){
        buildApi.getBuildById(id).then(response => {
          this.build=response.data.build
          this.dialogPvVisible=true
        }).catch(error => { //请求失败
          console.log(error)
        })
      },
      //修改方法
      updateBuild() {
        buildApi.updateBuild(this.build).then(response=>{
          this.$message({
            type: 'success',
            message: '修改成功！ 🧙‍♂️'
          })
          this.dialogPvVisible=false
        }).catch(error => { console.log(error)})
      },
      //详情方法
      openDialog(id) {
        buildApi.getMembersById(id).then(response => {
          this.members = response.data.members
          this.dialogFormVisible = true
        }).catch(error => { //请求失败
          console.log(error)
        })
      },
      getList() {
        this.listLoading = true
        buildApi.getBuild(this.current, this.size, this.buildQuery).then(response => {
          this.list = response.data.records
          this.total = response.data.total
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        }).catch(error => { //请求失败
          console.log(error)
        })
      },
      handleFilter() {
        this.current = 1
        this.getList()
      },
      handleDownload() {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['ID', '楼名', '地址']
          const filterVal = ['id', 'name', 'address']
          const data = this.formatJson(filterVal)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'build-list'
          })
          this.downloadLoading = false
        })
      },
      formatJson(filterVal) {
        return this.list.map(v => filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      },
    }
  }
</script>
<style>
  .memberList {
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
  }
</style>
