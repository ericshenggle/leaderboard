<template>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-card>
            <div slot="header" class="clearfix">
              <span>SQL Challenge: {{ questionData.name }}</span>
            </div>
            <el-descriptions title="Question Detail" direction="vertical" column="4">
              <el-descriptions-item label="Start Time">{{ formatDate(questionData.startTime) }}</el-descriptions-item>
              <el-descriptions-item label="Deadline">{{ formatDate(questionData.deadline) }}</el-descriptions-item>
              <el-descriptions-item label="Database Instance">{{ questionData.dbInstance }}</el-descriptions-item>
              <el-descriptions-item label="Benchmark Time">{{ questionData.benchmarkTime }} seconds</el-descriptions-item>
              <el-descriptions-item label="Description">{{ questionData.description }}</el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20" style="margin-top: 20px;">
        <el-col :span="24">
          <el-tooltip effect="dark"
                      content="The given expected output is just an example of data format and does not represent the final output."
                      placement="top"
          >
          <el-card>
              <div slot="header" class="clearfix">
                <span>Expected Output</span>
              </div>
            <el-table
                :data="formattedExpectedOutput"
                style="width: 100%"
                border
                stripe
                height="150px">
              <el-table-column
                  v-for="(header, index) in questionData.expectedOutput[0]"
                  :key="index"
                  :prop="'col' + index"
                  :label="header">
              </el-table-column>
            </el-table>
          </el-card>
          </el-tooltip>
        </el-col>
      </el-row>

      <el-row :gutter="20" style="margin-top: 20px;">
        <el-col :span="8">
          <el-card>
            <div slot="header" class="clearfix">
              <span>Upload your SQL script</span>
            </div>
            <el-upload
                ref="upload"
                class="upload-demo"
                drag
                :auto-upload="false"
                :on-change="handleFileChange"
                :before-remove="beforeRemove"
                :on-exceed="handleExceed"
                :limit="1"
                accept=".sql">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">Drag your file here or <em>click to upload</em></div>
            <div class="el-upload__tip" slot="tip">Only SQL files are accepted</div>
            </el-upload>
            <el-button type="primary" @click="submitUpload">Submit</el-button>
            <!-- show the result of the query -->
            <div v-if="runResult" style="margin-top: 20px;">
              <p><strong>Your current rank:</strong> {{ runResult.currentRank }}  &nbsp;
                <strong>Current Execution Time:</strong> {{ runResult.executionTime }} seconds
              </p>
            </div>
          </el-card>
        </el-col>
        <el-col :span="16">
          <el-card>
            <div slot="header" class="clearfix">
              <span>Leaderboard</span>
            </div>
            <div v-if="currentUserScore" class="current-user-score">
              <p><strong>Your Rank:</strong> {{ currentUserScore.rank }}</p>
              <p><strong>Your Score:</strong> {{ currentUserScore.score }}</p>
            </div>
            <el-skeleton :loading="leaderboardLoading" animated>
              <template #template>
                <el-skeleton-item variant="text" :rows="3"></el-skeleton-item>
                <el-skeleton-item variant="caption" :rows="1"></el-skeleton-item>
                <el-skeleton-item variant="text" :rows="3"></el-skeleton-item>
              </template>
              <el-table
                :data="questionLeaderboard"
                style="width: 100%"
                highlight-current-row>
              <el-table-column prop="rank" label="Rank"></el-table-column>
              <el-table-column prop="username" label="Username"></el-table-column>
              <el-table-column prop="score" label="Score"></el-table-column>
            </el-table>
            </el-skeleton>
          </el-card>
        </el-col>
      </el-row>
</template>


<script>
export default {
  data() {
    return {
      questionData : {
        problemId: 1,
        startTime: "2024-03-01T00:00",
        deadline: "2024-03-28T00:00",
        name: "Top 10 Stocks in Singapore",
        description: "Select the top 10 stocks in the warehouse in Singapore that have the highest quantity of stock.",
        expectedOutput: [["stockId", "stockName", "quantity"], [1, "stock1", 100], [2, "stock2", 90]],
        benchmarkTime: 0.5,
        dbInstance: "TPC-C",
      },
      questionLeaderboard: [
        {
          rank: 1,
          username: "user1",
          score: 80,
        },
        {
          rank: 2,
          username: "user2",
          score: 60,
        },
        {
          rank: 3,
          username: "user3",
          score: 40,
        },
      ],
      currentUserScore: null,
      problemId: 1,
      dataLoading: true,
      leaderboardLoading: true,
      fileList: [],
      myNotifyType: {
        "RIGHT": "success",
        "WRONG": "error",
        "TIMEOUT": "error",
        "INVALID": "error",
      },
      runResult: null,
    };
  },
  computed: {
    formattedExpectedOutput() {
      const dataRows = this.questionData.expectedOutput.slice(1);
      return dataRows.map(row => {
        const rowData = {};
        row.forEach((item, index) => {
          rowData['col' + index] = item;
        });
        return rowData;
      });
    },
  },
  methods: {
    getQuestionData() {
      this.$axios
        .get(`/problems/detail/${this.problemId}`)
        .then((Response) => {
          if (Response.data.status === 200) {
            this.questionData = Response.data.data;
            this.questionData.expectedOutput = JSON.parse(Response.data.data.expectedOutput);
            this.dataLoading = false;
          } else {
            this.$message.warning(Response.data.message);
          }
        })
        .catch((failResponse) => {
          this.dataLoading = false;
          console.log(failResponse);
        });
    },
    getLeaderboardData() {
      this.$axios
        .get(`/problems/rank/${this.problemId}`)
        .then((Response) => {
          if (Response.data.status === 200) {
            this.questionLeaderboard = Response.data.data.leaderboard;
            const currentUser = this.$store.state.user.username; // get the current user
            this.currentUserScore = this.questionLeaderboard.find((user) => user.username === currentUser) || null;
            this.leaderboardLoading = false;
          } else {
            this.$message.warning(Response.data.message);
          }
        })
        .catch((failResponse) => {
          this.leaderboardLoading = false;
          console.log(failResponse);
        });
    },
    handleFileChange(file, fileList) {
      this.fileList = fileList;
    },
    submitUpload() {
      if (new Date() > new Date(this.questionData.deadline)) {
        this.$message.warning('The deadline has passed.');
        return;
      }
      if (this.fileList.length === 0) {
        this.$message.warning('Please select a file to upload.');
        return;
      }
      const formData = new FormData();
      this.leaderboardLoading = true; // show loading icon
      this.fileList.forEach((file) => {
        const fileReader = new FileReader();
        fileReader.readAsText(file.raw);
        fileReader.onload = (e) => {
          const fileData = e.target.result.replace(/--.*\n/g, '').replace(/[\t\n\r]/g, ' ');
          formData.append('sql', fileData);
          formData.append('userId', this.$store.state.user.userId);
          this.$axios.post(`/problems/run/${this.problemId}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }).then((response) => {
            console.log(response);
            if (response.data.status === 200) {
              this.runResult = Response.data.data;
              this.$notify({
                title: 'Notification',
                message: this.runResult.message,
                type: this.myNotifyType[this.runResult.status]
              });
              this.getLeaderboardData(); // get the latest leaderboard data
            } else {
              this.$message.warning(response.data.message);
              this.leaderboardLoading = false
            }
          }).catch((error) => {
            this.$message.error('An error occurred.');
            this.leaderboardLoading = false;
            console.error(error);
          });
        };
      });
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`Do you want to remove ${file.name}?`);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`The number of files selected exceeds the limit of ${this.limit}.`);
    }
  },
  mounted() {
    this.problemId = this.$route.params.id;
    console.log(this.problemId);
    this.getQuestionData();
    this.leaderboardLoading = true;
    this.getLeaderboardData();
  }
}
</script>

<style scoped>
.clearfix {
  display: block;
  clear: both;
  content: " ";
  font-size: 20px;
}
.upload-demo i {
  font-size: 28px;
  color: #409EFF;
}
.upload-demo .el-upload__text {
  margin-top: 16px;
  color: #666;
}
.upload-demo .el-upload__tip {
  display: block;
  margin-top: 10px;
  font-size: 12px;
  color: #999;
}
.current-user-score {
  padding: 10px;
  background-color: #f0f9eb; /* you can change the background color */
  border-left: 5px solid #67c23a; /* and the border color */
  margin-bottom: 20px; /* and the margin */
}
</style>

