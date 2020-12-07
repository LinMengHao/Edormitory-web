<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="memberQuery.buildId" clearable placeholder="请选择楼名" @change="handleFilter">
        <el-option
          v-for="item in buildList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-input v-model="memberQuery.name" placeholder="宿管名" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-input v-model="memberQuery.address" placeholder="地址" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-input v-model="memberQuery.phoneNum" placeholder="电话" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-select v-model="memberQuery.sex" clearable placeholder="性别" @change="handleFilter">
        <el-option :value="'男'" label="男"/>
        <el-option :value="'女'" label="女"/>
      </el-select>
      <el-select v-model="memberQuery.status" clearable placeholder="状态" @change="handleFilter">
        <el-option :value="0" label="在岗"/>
        <el-option :value="1" label="休息"/>
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
      <el-table-column label="姓名" prop="name" width="150px" align="center">
      </el-table-column>
      <el-table-column label="性别" width="60">
        <template slot-scope="scope">
          <!-- ===判断类型和值 -->
          {{ scope.row.sex}}
        </template>
      </el-table-column>
      <el-table-column label="电话号码" prop="phoneNum" width="150px" align="center">
      </el-table-column>
      <el-table-column label="地址" prop="address" width="300px" align="center">
      </el-table-column>
      <el-table-column label="修改时间" prop="modifiedTime" width="200px" align="center">
      </el-table-column>
      <el-table-column label="状态" width="60" align="center">
        <template slot-scope="scope">
          <!-- ===判断类型和值 -->
          {{ scope.row.status===0?'在岗':'休息' }}
        </template>
      </el-table-column>
      <el-table-column label="楼字详情" fixed="right" width="90" align="center" >
        <template slot-scope="scope">
          <el-button type="primary" plain="true" size="mini" icon="el-icon-view" @click="openDialog(scope.row.buildId)">详情
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="修改宿管信息" width="90" fixed="right" align="center" >
        <template slot-scope="scope">
          <el-button type="primary" plain="true" size="mini" icon="el-icon-edit" @click="openDialog1(scope.row.id)">修改
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="删除" width="90" align="center" fixed="right">
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

    <!-- 详情弹框-->
    <el-dialog :title="详情" :visible.sync="dialogFormVisible">
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
        <el-button @click="dialogFormVisible = false">
          确定
        </el-button>
      </div>
    </el-dialog>

    <!--    //修改弹窗-->
    <el-dialog :visible.sync="dialogPvVisible" title="修改">
      <el-form :label-position="right" label-width="80px" :model="member">
        <el-form-item label="宿舍ID">
          <el-input v-model="member.id" placeholder="宿管id" readonly/>
        </el-form-item>
        <el-form-item label="楼字ID">
          <el-select v-model="member.buildId" clearable placeholder="请选择楼名">
            <el-option
              v-for="item in buildList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="member.name"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="member.sex" clearable placeholder="请选择">
            <el-option :value="'男'" label="男" />
            <el-option :value="'女'" label="女" />
          </el-select>
        </el-form-item>
        <el-form-item label="电话号码">
          <el-input v-model="member.phoneNum"></el-input>
        </el-form-item>
        <el-form-item label="出生日期" prop="birthDay">
          <el-date-picker
            v-model="member.birthDay"
            type="date"
            placeholder="选择日期"
            format="yyyy/MM/dd"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="member.address"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="member.status" clearable placeholder="请选择">
            <el-option :value="0" label="在岗" />
            <el-option :value="1" label="休息" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateMember()">确定</el-button>
        <el-button type="primary" @click="dialogPvVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <!--    //添加-->
    <el-dialog :visible.sync="dialogSaveVisible" title="添加">
      <el-form :label-position="right" label-width="80px" :model="member">
        <el-form-item label="楼字ID">
          <el-select v-model="member.buildId" clearable placeholder="请选择楼名">
            <el-option
              v-for="item in buildList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="member.name"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="member.sex" clearable placeholder="性别">
            <el-option :value="'男'" label="男" />
            <el-option :value="'女'" label="女" />
          </el-select>
        </el-form-item>
        <el-form-item label="电话号码">
          <el-input v-model="member.phoneNum"></el-input>
        </el-form-item>
        <el-form-item label="出生日期" prop="birthDay">
          <el-date-picker
            v-model="member.birthDay"
            type="date"
            placeholder="选择日期"
            format="yyyy/MM/dd"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="member.address"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="member.status" clearable placeholder="请选择">
            <el-option :value="0" label="在岗" />
            <el-option :value="1" label="休息" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addMember()">添加</el-button>
        <el-button type="primary" @click="dialogSaveVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import buildApi from '@/api/dormitory/build'
  import memberApi from '@/api/manager/member'
  import waves from '@/directive/waves' // waves directive
  import { parseTime } from '@/utils'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  export default {
    components: { Pagination },
    directives: { waves },
    data() {
      return {
        list: null,
        build: {
          id: 0,
          name: '',
          address: '',
        },
        member: {},
        buildList: [],
        total: 0,
        listLoading: true,
        current: 1,
        size: 20,
        memberQuery: {},
        buildQuery: {},
        dialogFormVisible: false,
        dialogSaveVisible: false,
        dialogPvVisible: false,
        downloadLoading: false
      }
    },
    created() {
      this.getAllBuild()
      this.getList()
    },
    methods: {
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
      //添加
      addMember(){
        memberApi.addMember(this.member)
          .then(response => { // 添加成功
            // 提示成功
            this.$message({
              type: 'success',
              message: '添加成功！ 😄'
            })
            // 回到用户列表页面
            // vue路由跳转
            this.dialogSaveVisible=false
            this.member={}
            this.handleFilter()
          })
      },
      //添加楼字弹窗开启
      openDialog2(){
        this.member={}
        this.dialogSaveVisible=true
      },
      //删除楼宇
      removeDataById(id){ // 删除讲师按钮的方法
        this.$confirm('此操作将删除楼字信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          memberApi.delete(id)
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

        memberApi.getMemberById(id).then(response => {
          this.member=response.data.member
          if(this.member.status===0){
            this.member.status='在岗'
          }else {
            this.member.status='休息'
          }
          this.dialogPvVisible=true
        }).catch(error => { //请求失败
          console.log(error)
        })
      },
      //修改方法
      updateMember() {
        if(this.member.status==='在岗'){
          this.member.status=0
        }
        if(this.member.status==='休息'){
          this.member.status=1
        }
        memberApi.updateMember(this.member).then(response=>{
          this.$message({
            type: 'success',
            message: '修改成功！ 🧙‍♂️'
          })
          this.dialogPvVisible=false
          this.handleFilter()
        }).catch(error => { console.log(error)})
      },
      //详情方法
      openDialog(id) {
        buildApi.getBuildById(id).then(response => {
          this.build = response.data.build
          this.dialogFormVisible = true
        }).catch(error => { //请求失败
          console.log(error)
        })
      },
      getList() {
        this.listLoading = true
        memberApi.getMember(this.current, this.size, this.memberQuery).then(response => {
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
          const tHeader = ['ID', '姓名', '地址','性别','电话号码','出生日期','状态','管理楼字ID']
          const filterVal = ['id', 'name', 'address','sex','phoneNum','birthDay','status','buildId']
          const data = this.formatJson(filterVal)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '宿舍管理员表'
          })
          this.downloadLoading = false
        })
        // 清空已输入数据
        this.memberQuery = {}
        // 查询所有  恢复未进行条件查询的状态
        this.getList()
      },
      formatJson(filterVal) {
        this.list.map(s=>{
          if(s.status===0){
            s.status='在岗'
          }else {
            s.status='休息'
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
