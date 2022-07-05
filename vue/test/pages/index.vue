<template>
  <v-container>
    <h1>Home</h1>

    <v-toolbar flat>
      <v-toolbar-title>My CRUD</v-toolbar-title>
      <v-divider class="mx-4" inset vertical></v-divider>
      <v-spacer></v-spacer>
      <v-dialog max-width="500px">
        <template v-slot:activator="{}">
          <v-btn color="blue lighten-2" dark @click="toggle = true">
            add task
          </v-btn>
        </template>
      </v-dialog>
    </v-toolbar>
    <AddTask :toggle="toggle" @close="toggle = false" />
    <v-card elevation="4" outlined>
      <v-row class="my-3 px-6 text-center">
        <v-col>
          <b>Task Name</b>
        </v-col>
        <v-col>
          <b>Assignee</b>
        </v-col>
        <v-col>
          <b>Priority</b>
        </v-col>
        <v-col>
          <b>Severity</b>
        </v-col>
        <v-col>
          <b>Type</b>
        </v-col>
        <v-col>
          <b>Due Date</b>
        </v-col>
        <v-col>
          <b>Due Time</b>
        </v-col>
        <v-col>
          <b>Edit</b>
        </v-col>
        <v-col>
          <b>Delete</b>
        </v-col>
      </v-row>
    </v-card>
    <Tasks @getTasks="getTasks" />

    <template>
      <div class="text-center my-6">
        <v-pagination v-model="page" :length="totalPages"></v-pagination>
      </div>
    </template>

    <!-- 
    <NuxtLink to="/about"> to About </NuxtLink>
    <button @click="toContact">to contact</button> -->
  </v-container>
</template>

<script>
import Tasks from '../components/tasks.vue'
import AddTask from '../components/addTask.vue'
import axios from 'axios'

export default {
  name: 'IndexPage',
  components: {
    Tasks,
    AddTask,
  },
  data() {
    return {
      toggle: false,
      page: 1,
      totalPages: 1,
      tasks: this.$store.state.task,
    }
  },
  methods: {
    async getTasks() {
      try {
        const result = await axios.get(
          `http://localhost:4444/tasks/${this.page}`
        )
        this.$store.commit('setTasks', result.data.tasks.rows)
        this.totalPages = Math.ceil(result.data.tasks.count / 5)
      } catch (error) {
        console.log(error)
      }
    },
    // deleteTask(id) {
    //   this.tasks = this.tasks.filter((task) => task.id !== id)
    // },
    // checkTask(id) {
    //   this.tasks = this.tasks.map((task) =>
    //     task.id === id ? { ...task, checked: !task.checked } : task
    //   )
    //},
    // ToggleAddTask() {
    //   this.showAddTask = !this.showAddTask
    // },
    // AddTask(task) {
    //   this.task = this.tasks.push({ ...task, id: this.tasks.length })
    // },
    // setArticals() {
    //   this.$store.commit('setArticals', ['2', '3'])
    // },
    toContact() {
      // this.$router.push({ path: '/contact', params: { data: '+079809' } })
      this.$router.push({ path: `/artical/${5}` })
    },
  },
  mounted() {
    this.getTasks()
  },
  updated() {
    this.getTasks()
  },
  watch: {
    page(newVal, old) {
      this.getTasks()
    },
  },
}
</script>
<style scoped></style>
