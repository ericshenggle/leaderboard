<template>
  <div>
    <p>Filter</p>
  </div>
  <el-row justify="center" class="filter-row">
    <el-col :span="2">
      Start Time
    </el-col>
    <el-col :span="4">
      <el-date-picker
          v-model="filterByStartTime"
          type="daterange"
          start-placeholder="From"
          end-placeholder="To"
          style="width: 100%">
      </el-date-picker>
    </el-col>
    <el-col :span="3">
      Question Name
    </el-col>
    <el-col :span="6">
      <el-input v-model="filterByName" placeholder="Filter by Question Name"></el-input>
    </el-col>
    <el-col :span="3">
      <el-select
          v-model="filterByDatabaseInstance"
          filterable
          placeholder="Select Database Instance"
          style="width: 100%;"
          clearable>
        <el-option
            v-for="item in databaseInstances"
            :key="item"
            :label="item"
            :value="item">
        </el-option>
      </el-select>
    </el-col>
    <el-col :span="6">
      <el-switch
        v-model="isActive"
        active-text="Show active questions"
        inactive-text="Show all questions">
      </el-switch>
    </el-col>
  </el-row>
  <el-divider></el-divider>
  <el-row justify="center">
    <el-table :data="paginatedData" border style="width: 70%" max-height="500px" v-loading="loading">
      <el-table-column label="Start Time">
        <template #default="scope">
          {{ formatDate(scope.row.startTime) }}
        </template>
      </el-table-column>
      <el-table-column label="Question Name" width="500">
        <template #default="scope">
          <el-link @click="handleDetail(scope.row.problemId)" >{{ scope.row.name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="dbInstance" label="Database Instance"> </el-table-column>
      <el-table-column label="Deadline Progress" width="300">
        <template #default="scope">
          <el-progress :percentage="calculateDeadlineProgress(scope.row.startTime, scope.row.deadline)"
                       :color="customColors" :format="format"></el-progress>
        </template>
      </el-table-column>
    </el-table>
  </el-row>
  <el-row justify="center">
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[1, 10, 20, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total"
        class="pagination">
    </el-pagination>
  </el-row>

</template>

<script>
export default {
  name: 'HomeView',
  data() {
    return {
      tableData: [
        {
          problemId: 1,
          startTime: '2024-03-01T00:00',
          deadline: '2024-03-28T00:00',
          name: 'Top 10 Stocks in Singapore',
          dbInstance: 'TPC-C',
        },
      ],
      customColors: [
        { color: '#f56c6c', percentage: 90 },
        { color: '#e6a23c', percentage: 70 },
        { color: '#5cb87a', percentage: 40 }
      ],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      loading: true,
      filterByName: '',
      filterByStartTime: '',
      filterByDatabaseInstance: '',
      isActive: true,
      databaseInstances: ['TPC-C', 'TPC-H', 'TPC-DS'], // This should be fetched from the server
    }
  },
  computed: {
    filteredData() {
      return this.tableData.filter(row => {
        const matchesName = this.filterByName ? row.name.toLowerCase().includes(this.filterByName.toLowerCase()) : true;
        const matchesStartTime = this.filterByStartTime ? new Date(row.startTime) >= new Date(this.filterByStartTime[0]) &&
            new Date(row.startTime) <= new Date(this.filterByStartTime[1]) : true;
        const matchesDatabaseInstance = this.filterByDatabaseInstance ? row.dbInstance === this.filterByDatabaseInstance : true;
        const matchesIsActive = this.isActive ? new Date(row.deadline) > new Date() : true;
        return matchesName && matchesStartTime && matchesDatabaseInstance && matchesIsActive;
      });
    },
    paginatedData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredData.slice(start, end);
    },
  },
  methods: {
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.currentPage = 1; // Reset the current page to 1 when the page size changes
    },
    handleCurrentChange(newPage) {
      this.currentPage = newPage;
    },
    calculateDeadlineProgress(startTime, deadline) {
      const startDate = new Date(startTime);
      const endDate = new Date(deadline);
      const today = new Date();
      console.log(startDate);
      console.log(today);
      console.log(endDate);
      const totalDuration = endDate - startDate;
      const elapsed = today - startDate;
      const progress = (elapsed / totalDuration) * 100;
      console.log(Math.round(Math.min(Math.max(progress, 0), 100)));
      return Math.round(Math.min(Math.max(progress, 0), 100));
    },
    handleDetail(id) {
      // Judge whether the user has logged in
      if (!this.$store.state.isAuthenticated) {
        this.$router.push({ name: 'login' });
        this.$message.error('Please log in first');
      }
      else {
        this.$router.push({ name: 'question', params: { id } });
      }
    },
    format(percentage) {
      return percentage === 100 ? 'Terminate' : `In progress`
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    },
    getDatabaseInstanceOptions() {
      this.databaseInstances = [...new Set(this.tableData.map(row => row.dbInstance))];
      console.log(this.databaseInstances);
    },
    getTableData() {
      this.$axios.get('/problems/all/').then((Response) => {
        if (Response.data.status === 200) {
          console.log(Response.data);
          this.tableData = Response.data.data;
          this.loading = false;
          this.getDatabaseInstanceOptions();
          this.total = this.tableData.length;
        } else {
          this.tableData = [];
          this.loading = false;
          this.$message.error(Response.data.message);
        }
      }).catch((failResponse) => {
        this.loading = false;
        console.log(failResponse);
      });
    },
  },
  mounted() {
    // Get the table data from the server
    this.getTableData();
  },
}
</script>

<style>
.pagination {
  margin-top: 20px;
}
.search-row {
  margin-bottom: 20px;
}
.search-input, .filter-select {
  margin-right: 10px;
}
</style>