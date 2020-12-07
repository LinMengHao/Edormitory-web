<!--修改和添加弹窗可以合并优化-->
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="dormitoryQuery.buildId" clearable placeholder="请选择楼名" @change="handleFilter">
        <el-option
          v-for="item in buildList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-select v-model="dormitoryQuery.storey" clearable placeholder="请选择楼层" @change="handleFilter">
        <el-option
          v-for="item in storeys"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-input v-model="dormitoryQuery.roomNum" placeholder="输入宿舍名，例如：101" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-input v-model="dormitoryQuery.maxNum" placeholder="最大入住数" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-input v-model="dormitoryQuery.nowNum" placeholder="已入住人数" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-select v-model="dormitoryQuery.status" clearable placeholder="请选择" @change="handleFilter">
        <el-option :value="0" label="无损坏"/>
        <el-option :value="1" label="需维修"/>
      </el-select>
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
      <el-table-column label="宿舍名" prop="roomNum" width="100px" align="center">
      </el-table-column>
      <el-table-column label="楼字ID" prop="buildId" width="90px" align="center">
      </el-table-column>
      <el-table-column label="楼层" prop="storey" width="90px" align="center">
      </el-table-column>
      <el-table-column label="最大入住" prop="maxNum" width="100px" align="center">
      </el-table-column>
      <el-table-column label="已入住" prop="nowNum" width="100px" align="center">
      </el-table-column>
      <el-table-column label="修改时间" prop="modifiedTime" width="200px" align="center">
      </el-table-column>
      <el-table-column label="状态" prop="status" width="100px" align="center">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status===0" type="success" plain="true" size="mini" icon="el-icon-check">
            无损坏
          </el-button>

<!--          TODO 跳转到维修页面，带id的，获取维修信息-->
          <router-link :to="'/system/update/'+scope.row.id">
            <el-button v-if="scope.row.status===1" type="danger" plain="true" size="mini" icon="el-icon-close">
              需维修
            </el-button>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="宿管详情" fixed="right" width="90" align="center">
        <template slot-scope="scope">
          <el-button type="primary" plain="true" size="mini" icon="el-icon-view" @click="openDialog(scope.row.id)">宿管
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="成员详情" fixed="right" width="90" align="center">
        <template slot-scope="scope">
          <el-button type="primary" plain="true" size="mini" icon="el-icon-view" @click="openDialog4(scope.row.id)">成员
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="修改宿舍信息" width="90" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button type="primary" plain="true" size="mini" icon="el-icon-edit" @click="openDialog1(scope.row.id)">修改
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="楼字详情" width="90" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button type="primary" plain="true" size="mini" icon="el-icon-view" @click="openDialog3(scope.row.buildId)">楼字
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="90" align="center" fixed="right">
        <template slot-scope="scope">
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

    <!-- 宿管详情弹框-->
    <el-dialog :title="详情" :visible.sync="dialogFormVisible">
      <ul class="memberList">
        <el-button type="info" size="mini" plain="true">楼字管理员</el-button>
        <li><br/></li>
        <li v-for="member in members" :key="member.id">
          <el-row>
            <el-button type="primary" size="mini" plain="true">姓名：{{member.name}}</el-button>
            <el-button type="success" size="mini" plain="true">{{member.sex}}</el-button>
            <el-button type="info" size="mini" plain="true">电话号码：{{member.phoneNum}}</el-button>
            <el-button type="warning" size="mini" plain="true">{{member.status===0?'在岗':'休息'}}
            </el-button>
            <el-button type="danger" size="mini" plain="true">楼字ID：{{member.buildId}}</el-button>
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

<!--    宿舍成员详情-->
    <el-dialog :title="宿舍成员" :visible.sync="dialogStudentsVisible">
      <ul class="memberList">
        <el-button type="info" size="mini" plain="true">宿舍成员</el-button>
        <li><br/></li>
        <li v-for="student in students" :key="student.id">
          <el-row>
            <el-button type="primary" size="mini" plain="true">姓名：{{student.name}}</el-button>
            <el-button type="primary" size="mini" plain="true">学号：{{student.studentId}}</el-button>
            <el-button type="success" size="mini" plain="true">{{student.sex}}</el-button>
            <el-button type="info" size="mini" plain="true">电话号码：{{student.phoneNum}}</el-button>
            <el-button type="warning" size="mini" plain="true">{{student.status===0?'在校':'外出'}}
            </el-button>
          </el-row>
          <br/>
        </li>
      </ul>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogStudentsVisible = false">
          确定
        </el-button>
      </div>
    </el-dialog>
    <!--    //楼字详情弹框-->
    <el-dialog :visible.sync="dialogPvVisible" title="楼字信息">
      <el-link type="success">楼字信息</el-link>
      <el-form :label-position="right" label-width="80px" :model="build">
        <el-form-item label="ID">
          <el-input v-model="build.id" readonly></el-input>
        </el-form-item>
        <el-form-item label="楼名">
          <el-input v-model="build.name" readonly></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="build.address" readonly></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">确定</el-button>
      </div>
    </el-dialog>
    <!--    //添加-->
    <el-dialog :visible.sync="dialogSaveVisible" title="添加">
      <el-form :label-position="right" label-width="80px" :model="dormitory">
        <el-form-item label="楼名">
          <el-select v-model="dormitory.buildId" clearable placeholder="请选择楼名">
            <el-option
              v-for="item in buildList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="楼层">
          <el-select v-model="dormitory.storey" clearable placeholder="请选择楼层">
            <el-option
              v-for="item in storeys"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="宿舍名">
          <el-input v-model="dormitory.roomNum" placeholder="输入宿舍名，例如：101"/>
        </el-form-item>
        <el-form-item label="最大入住人数">
          <el-input v-model="dormitory.maxNum" placeholder="最大入住人数"/>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="dormitory.status" placeholder="状态" clearable >
            <el-option label="无损坏" value="0"/>
            <el-option label="需维修" value="1"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addDormitory()">添加</el-button>
        <el-button type="primary" @click="dialogSaveVisible = false">取消</el-button>
      </div>
    </el-dialog>
<!--    修改-->
    <el-dialog :visible.sync="dialogUpdateVisible" title="修改宿舍信息">
      <el-form :label-position="right" label-width="80px" :model="dormitory">
        <el-form-item label="宿舍ID">
          <el-input v-model="dormitory.id" placeholder="宿舍id" readonly/>
        </el-form-item>
        <el-form-item label="楼ID">
          <el-select v-model="dormitory.buildId" clearable placeholder="请选择楼名">
          <el-option
            v-for="item in buildList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="楼层">
          <el-select v-model="dormitory.storey" clearable placeholder="请选择楼层">
            <el-option
              v-for="item in storeys"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="宿舍名">
          <el-input v-model="dormitory.roomNum" placeholder="宿舍名"/>
        </el-form-item>
        <el-form-item label="最大入住">
          <el-input v-model="dormitory.maxNum" placeholder="最大入住人数"/>
        </el-form-item>
        <el-form-item label="已入住">
          <el-input v-model="dormitory.nowNum" placeholder="已入住人数"/>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="dormitory.status" placeholder="状态"  >
            <el-option label="无损坏" value="0"/>
            <el-option label="需维修" value="1"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateDormitory()">修改</el-button>
        <el-button type="primary" @click="dialogUpdateVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

  import dormitoryApi from '@/api/dormitory/dormitory'
  import waves from '@/directive/waves' // waves directive
  import { parseTime } from '@/utils'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import buildApi from '@/api/dormitory/build'

  export default {
    components: { Pagination },
    directives: { waves },
    data() {
      return {
        list: null,
        students: [],
        buildList: [],
        members: [],
        dormitory: {},
        dormitoryQuery: {},
        buildQuery: {},
        build: {
          id: 0,
          name: '',
          address: ''
        },
        total: 0,
        listLoading: true,
        current: 1,
        size: 20,
        storeys: [
          {
            id: 1,
            name: '1F'
          },
          {
            id: 1,
            name: '1F'
          },
          {
            id: 2,
            name: '2F'
          },
          {
            id: 3,
            name: '3F'
          },
          {
            id: 4,
            name: '4F'
          },
          {
            id: 5,
            name: '5F'
          },
          {
            id: 6,
            name: '6F'
          },
          {
            id: 7,
            name: '7F'
          },
          {
            id: 8,
            name: '8F'
          }//楼层数组
        ],
        //弹框控制器
        dialogFormVisible: false,//宿管详情
        dialogSaveVisible: false,//添加宿舍信息
        dialogPvVisible: false,//楼字详情
        dialogUpdateVisible: false,//修改弹框
        dialogStudentsVisible: false,//宿舍成员详情
        downloadLoading: false
      }
    },
    created() {
      this.getAllBuild()
      this.getList()
    },
    methods: {
      //开启宿舍成员弹框
      openDialog4(id){
        dormitoryApi.getStudentsById(id).then(response => {
          this.students = response.data.students
          this.dialogStudentsVisible = true
        }).catch(error => { //请求失败
          console.log(error)
        })
      },
      //开启楼字详情窗口
      openDialog3(id){
        buildApi.getBuildById(id).then(response => {
          this.build = response.data.build
          this.dialogPvVisible = true
        }).catch(error => { //请求失败
          console.log(error)
        })
      },
      //查询所有build，使下拉列表可以有值
      getAllBuild() {
        buildApi.getBuild(this.current, this.size, this.buildQuery).then(response => {
          this.buildList = response.data.records
        }).catch(error => { //请求失败
          console.log(error)
        })
      },
      //每页记录数改变
      sizeChange(v) {
        this.size = v
        this.getList()
      },
      //添加宿舍
      addDormitory() {
        dormitoryApi.addDormitory(this.dormitory)
          .then(response => { // 添加成功
            // 提示成功
            this.$message({
              type: 'success',
              message: '添加成功！ 😄'
            })
            // 回到用户列表页面
            // vue路由跳转
            this.dialogSaveVisible = false
            this.dormitory = {}
            this.handleFilter()
          })
      },
      //添加宿舍
      // 弹窗开启
      openDialog2() {
        this.dormitory={}
        this.dialogSaveVisible = true
      },
      //删除楼宇
      removeDataById(id) { // 删除讲师按钮的方法
        this.$confirm('此操作将删除楼字信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          dormitoryApi.delete(id)
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
      openDialog1(id) {
        dormitoryApi.getDormitoryById(id).then(response => {
          this.dormitory = response.data.dormitory
          if(this.dormitory.status===0){
            this.dormitory.status='无损坏'
          }else {
            this.dormitory.status='需维修'
          }
          this.dialogUpdateVisible = true
        }).catch(error => { //请求失败
          console.log(error)
        })
      },
      //修改方法
      updateDormitory() {
        dormitoryApi.updateDormitory(this.dormitory).then(response => {
          this.$message({
            type: 'success',
            message: '修改成功！ 🧙‍♂️'
          })
          this.dialogUpdateVisible = false
          this.handleFilter()
          this.dormitory={}
        }).catch(error => {
          console.log(error)
        })
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
        dormitoryApi.getDormitory(this.current, this.size, this.dormitoryQuery).then(response => {
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

      //TODO
      handleDownload() {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['ID', '楼字ID', '楼层','房间号','最大入住数','已入住数','创建时间','修改时间','状态']
          const filterVal = ['id', 'buildId', 'storey','roomNum','maxNum','nowNum','createTime','modifiedTime','status']
          const data = this.formatJson(filterVal)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '宿舍表'
          })
          this.downloadLoading = false
          // 清空已输入数据
          this.userQuery = {}
          // 查询所有  恢复未进行条件查询的状态
          this.getList()
        })
      },
      formatJson(filterVal) {
        this.list.map(s=>{
          if(s.status===0){
            s.status='无损坏'
          }else {
            s.status='需要维修'
          }
          return s
        })
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
<style>
  .memberList {
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
  }
</style>
