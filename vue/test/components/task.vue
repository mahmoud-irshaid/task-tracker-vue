<template>
  <v-card
    elevation="3"
    outlined
    :key="task.id"
    @dblclick="onCheck(task._id)"
    :class="[task.checked ? 'taskChecked' : '']"
    class="f-flex align-center pt-6"
  >
    <v-row class="px-6 text-center">
      <v-col>
        <b>{{ task.name }}</b>
      </v-col>
      <v-col>
        <p>
          {{
            ` ${this.assigned[0] && this.assigned[0].user} + ${
              this.assigned.length - 1
            } others`
          }}
        </p>
      </v-col>
      <v-col>
        <p>{{ task.priority }}</p>
      </v-col>
      <v-col>
        <p>{{ task.severity }}</p>
      </v-col>
      <v-col>
        <p>{{ task.type }}</p>
      </v-col>
      <v-col>
        <p>{{ task.dueDate }}</p>
      </v-col>
      <v-col>
        <p>{{ task.dueTime }}</p>
      </v-col>
      <v-col>
        <v-icon small class="mr-2" @click="toggle = true"> mdi-pencil </v-icon>
      </v-col>
      <v-col>
        <v-icon small @click="onDelete(task._id)"> mdi-delete </v-icon>
      </v-col>
    </v-row>
    <EditTask
      :editTask="task"
      :toggle="toggle"
      :assigned="assigned"
      @close="toggle = false"
    />
  </v-card>
</template>

<script>
import axios from 'axios'
import EditTask from './editTask.vue'

export default {
  name: 'Task',
  components: {
    EditTask,
  },
  props: {
    task: Object,
  },
  data() {
    return {
      toggle: false,
      assigned: [],
      model: 1,
    }
  },
  methods: {
    onDelete(id) {
      this.$store.commit('deleteTask', id)
    },
    onCheck(id) {
      this.$store.commit('checkTask', id)
    },
  },
  async mounted() {
    try {
      const assigned = await axios.get(
        `http://localhost:4444/assigned/${this.task._id}`
      )
      this.assigned = assigned.data
    } catch (error) {
      console.log(error)
    }
  },
}
</script>

<style scoped>
.taskChecked {
  background: gray;
}
</style>
