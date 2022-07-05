<template>
  <div>
    <div :key="task.id" v-for="task in tasks">
      <Task :task="task" @getTasks="getTasks" />
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
  methods: {
    getTasks() {
      this.$emit('getTasks')
    },
  },
  computed: {
    tasks() {
      return this.$store.getters.getTasks
    },
  },
}
</script>
