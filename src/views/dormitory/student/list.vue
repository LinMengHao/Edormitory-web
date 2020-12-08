<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="studentQuery.dormitoryId" clearable placeholder="请选择宿舍名" @change="handleFilter">
        <el-option
          v-for="item in dormitoryAllList"
          :key="item.id"
          :label="item.roomNum"
          :value="item.id">
          {{item.buildId}}号楼-{{item.roomNum}}
        </el-option>
      </el-select>
      <el-input v-model="studentQuery.name" placeholder="姓名" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-input v-model="studentQuery.studentId" placeholder="学号" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-input v-model="studentQuery.phoneNum" placeholder="电话" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-select v-model="studentQuery.sex" clearable placeholder="性别" @change="handleFilter">
        <el-option :value="'男'" label="男"/>
        <el-option :value="'女'" label="女"/>
      </el-select>
      <el-select v-model="studentQuery.status" clearable placeholder="状态" @change="handleFilter">
        <el-option :value="0" label="入住"/>
        <el-option :value="1" label="外出"/>
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
      <el-table-column label="学号" prop="studentId" width="150px" align="center">
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
      <el-table-column label="出生日期" prop="birthDay" width="200px" align="center">
      </el-table-column>
      <el-table-column label="修改时间" prop="modifiedTime" width="200px" align="center">
      </el-table-column>
      <el-table-column label="状态" width="60" align="center">
        <template slot-scope="scope">
          <!-- ===判断类型和值 -->
          {{ scope.row.status===0?'入住':'外出' }}
        </template>
      </el-table-column>
      <el-table-column label="宿舍详情" fixed="right" width="90" align="center">
        <template slot-scope="scope">
          <el-button type="primary" plain="true" size="mini" icon="el-icon-view"
                     @click="openDialog(scope.row.dormitoryId)">详情
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="修改学生信息" width="90" fixed="right" align="center">
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
    <el-dialog :title="入住宿舍详情" :visible.sync="dialogFormVisible">
      <el-link type="success">入住宿舍详情</el-link>
      <el-form :label-position="right" label-width="80px" :model="dormitory" >
        <el-form-item label="宿舍ID">
          <el-input v-model="dormitory.id" placeholder="宿舍id" readonly/>
        </el-form-item>
        <el-form-item label="楼ID">
          <el-select v-model="dormitory.buildId"  placeholder="请选择楼名" readonly>
            <el-option
              v-for="item in buildList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="楼层">
          <el-select v-model="dormitory.storey"  placeholder="请选择楼层" readonly>
            <el-option
              v-for="item in storeys"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="宿舍名">
          <el-input v-model="dormitory.roomNum" placeholder="宿舍名" readonly/>
        </el-form-item>
        <el-form-item label="最大入住">
          <el-input v-model="dormitory.maxNum" placeholder="最大入住人数" readonly/>
        </el-form-item>
        <el-form-item label="已入住">
          <el-input v-model="dormitory.nowNum" placeholder="已入住人数" readonly/>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="dormitory.status" placeholder="状态" readonly>
            <el-option label="无损坏" value="0"/>
            <el-option label="需维修" value="1"/>
          </el-select>
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
      <el-form :label-position="right" label-width="80px" :model="student" :rules="rules">
        <el-form-item label="学生ID">
          <el-input v-model="student.id" placeholder="学生ID" readonly/>
        </el-form-item>
        <el-form-item label="宿舍ID">
          <el-input v-model="student.dormitoryId" placeholder="宿舍ID" readonly/>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="student.name"></el-input>
        </el-form-item>
        <el-form-item label="学号">
          <el-input v-model="student.studentId" placeholder="学号" readonly/>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="student.sex"  placeholder="请选择">
            <el-option :value="'男'" label="男"/>
            <el-option :value="'女'" label="女"/>
          </el-select>
        </el-form-item>
        <el-form-item label="电话号码" prop="phoneNum">
          <el-input v-model="student.phoneNum"></el-input>
        </el-form-item>
        <el-form-item label="出生日期" prop="birthDay">
          <el-date-picker
            v-model="student.birthDay"
            type="date"
            placeholder="选择日期"
            format="yyyy/MM/dd"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="student.address"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="student.status"  placeholder="状态">
            <el-option :value="0" label="在校"/>
            <el-option :value="1" label="外出"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateStudent()">确定</el-button>
        <el-button type="primary" @click="dialogPvVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <!--    //添加-->
    <el-dialog :visible.sync="dialogSaveVisible" title="添加">
      <el-form :label-position="right" label-width="80px" :model="student" :rules="rules">
        <el-form-item label="宿舍ID" prop="dormitoryId">
          <el-select v-model="student.dormitoryId"  placeholder="请选择宿舍名" >
            <el-option
              v-for="item in dormitoryList"
              :key="item.id"
              :value="item.id">{{item.buildId}}号楼-{{item.roomNum}}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="student.name"></el-input>
        </el-form-item>
        <el-form-item label="学号" prop="studentId">
          <el-input v-model="student.studentId"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="student.sex"  placeholder="性别">
            <el-option :value="'男'" label="男"/>
            <el-option :value="'女'" label="女"/>
          </el-select>
        </el-form-item>
        <el-form-item label="电话号码" prop="phoneNum">
          <el-input v-model="student.phoneNum"></el-input>
        </el-form-item>
        <el-form-item label="出生日期" prop="birthDay">
          <el-date-picker
            v-model="student.birthDay"
            type="date"
            placeholder="选择日期"
            format="yyyy/MM/dd"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="student.address"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="student.status"  placeholder="状态">
            <el-option :value="0" label="在校" />
            <el-option :value="1" label="外出"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addStudent()">添加</el-button>
        <el-button type="primary" @click="dialogSaveVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import dormitoryApi from '@/api/dormitory/dormitory'
  import studentApi from '@/api/manager/student'
  import waves from '@/directive/waves' // waves directive
  import { parseTime } from '@/utils'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  export default {
    components: { Pagination },
    directives: { waves },
    data() {
      const validatePhoneNumber = (rule, value, callback) => {
        if (/^1[34578]\d{9}$/.test(value) === false) {
          callback(new Error("手机号格式错误"));
        } else {
          callback();
        }
      }
      return {
        list: null,
        build: {
          id: 0,
          name: '',
          address: ''
        },
        dormitory: {},
        dormitoryList: [],
        dormitoryAllList: [],
        student: {},
        total: 0,
        listLoading: true,
        current: 1,
        size: 20,
        studentQuery: {},
        dormitoryQuery: {},
        dialogFormVisible: false,
        dialogSaveVisible: false,
        dialogPvVisible: false,
        downloadLoading: false,
        rules: {
          // 要以数组形式展示
          name: [
            { required: true, message: '用户名不能为空', trigger: 'blur' }
          ],
          studentId: [
            {
              required: true, message: '学号不能为空', trigger: 'blur'
            }
          ],
          address: [
            {
              required: true, message: '地址不能为空', trigger: 'blur'
            }
          ],
          birthDay: [
            {
              required: true, message: '出生日期不能为空', trigger: 'blur'
            }
          ],
          sex: [
            {
              required: true, message: '性别不能为空', trigger: 'blur'
            }
          ],
          dormitoryId: [
            {
              required: true, message: '宿舍id不能为空', trigger: 'blur'
            }
          ],
          phoneNum: [
            {
              required: true,
              message: '请输入手机号码',
              trigger: 'blur'
            },
            {
              validator: validatePhoneNumber,
              trigger: 'blur'
            }
          ]
        }
      }
    },
    created() {
      this.getAllDormitory()
      this.getAllDormitory1()
      this.getList()
    },
    methods: {
      //查询所有dormitory
      getAllDormitory1() {
        dormitoryApi.getDormitory(this.current,this.size,this.dormitoryQuery).then(response => {
          this.dormitoryAllList = response.data.records
        }).catch(error => { //请求失败
          console.log(error)
        })
      },
      //查询符合入住条件所有dormitory，使下拉列表可以有值
      getAllDormitory() {
        dormitoryApi.findDormitoryCan().then(response => {
          this.dormitoryList = response.data.dormitories
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
      addStudent() {
        studentApi.addStudent(this.student)
          .then(response => { // 添加成功
            // 提示成功
            this.$message({
              type: 'success',
              message: '添加成功！ 😄'
            })
            // 回到用户列表页面
            // vue路由跳转
            this.dialogSaveVisible = false
            this.student = {}
            this.handleFilter()
          })
      },
      //添加楼字弹窗开启
      openDialog2() {
        this.student = {}
        this.dialogSaveVisible = true
      },
      //删除楼宇
      removeDataById(id) { // 删除讲师按钮的方法
        this.$confirm('此操作将删除楼字信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          studentApi.delete(id)
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
        studentApi.getStudentById(id).then(response => {
          this.student = response.data.student
          if (this.student.status === 0) {
            this.student.status = '在校'
          } else {
            this.student.status = '外出'
          }
          this.dialogPvVisible = true
        }).catch(error => { //请求失败
          console.log(error)
        })
      },
      //修改方法
      updateStudent() {
        if (this.student.status === '在校') {
          this.student.status = 0
        }
        if (this.student.status === '外出') {
          this.student.status = 1
        }
        studentApi.updateStudent(this.student).then(response => {
          this.$message({
            type: 'success',
            message: '修改成功！ 🧙‍♂️'
          })
          this.dialogPvVisible = false
          this.handleFilter()
        }).catch(error => {
          console.log(error)
        })
      },
      //详情方法
      openDialog(id) {
        dormitoryApi.getDormitoryById(id).then(response => {
          this.dormitory = response.data.dormitory
          if (this.dormitory.status === 0) {
            this.dormitory.status = '无损坏'
          } else {
            this.dormitory.status = '需维修'
          }
          this.dialogFormVisible = true
        }).catch(error => { //请求失败
          console.log(error)
        })
      },
      getList() {
        this.listLoading = true
        studentApi.getStudent(this.current, this.size, this.studentQuery).then(response => {
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
          const tHeader = ['ID', '姓名', '学号','地址', '性别', '电话号码', '出生日期', '状态', '入住宿舍ID']
          const filterVal = ['id', 'name', 'studentId', 'address', 'sex', 'phoneNum', 'birthDay', 'status', 'dormitoryId']
          const data = this.formatJson(filterVal)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '宿舍成员表'
          })
          this.downloadLoading = false
        })
        // 清空已输入数据
        this.studentQuery = {}
        // 查询所有  恢复未进行条件查询的状态
        this.getList()
      },
      formatJson(filterVal) {
        this.list.map(s => {
          if (s.status === 0) {
            s.status = '在校'
          } else {
            s.status = '外出'
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
  .studentList {
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
  }
</style>
