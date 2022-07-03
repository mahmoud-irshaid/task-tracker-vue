<template>
  <div>
    <div :key="task.id" v-for="task in tasks">
      <Task :task="task" />
    </div>
  </div>
</template>

<script>
import Task from './task.vue'

export default {
  name: 'Tasks',
  components: {
    Task,
  },
  props: {},
  methods: {},
  computed: {
    tasks() {
      return this.$store.getters.getTasks
    },
  },
}
</script>
