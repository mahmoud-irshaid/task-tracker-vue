import axios from 'axios'

const task = {
  namespace: true,
  state: {
    tasks: [],
  },
  actions: {},
  mutations: {
    setTasks(state, payload) {
      return (state.tasks = payload)
    },

    async deleteTask(state, payload) {
      try {
        let deleteTask = await axios.put(
          `http://localhost:4444/deleteTask/${payload}`
        )
        if (deleteTask) {
          return (state.tasks = state.tasks.filter(
            (task) => task._id !== payload
          ))
        }
      } catch (error) {
        console.log(error)
      }
    },

    async checkTask(state, payload) {
      try {
        let updateTask = await axios.put(
          `http://localhost:4444/checkTask/${payload}`,
          {
            payload,
          }
        )
        if (updateTask) {
          return (state.tasks = state.tasks.map((task) =>
            task._id === payload ? { ...task, checked: !task.checked } : task
          ))
        }
      } catch (error) {
        console.log(error)
      }
    },

    async addTask(state, payload) {
      try {
        let newTask = await axios.post('http://localhost:4444/newTask', {
          payload,
        })
        if (newTask) {
          return state.tasks.push(newTask.data)
        }
      } catch (error) {
        console.log(error)
      }
    },

    async editTask(state, payload) {
      try {
        let updateTask = await axios.put(`http://localhost:4444/editTask`, {
          payload,
        })
        if (updateTask) {
          updateTask.data.newTask.newFriends = updateTask.data.newFriends
          return (state.tasks = state.tasks.map((task) =>
            task._id === payload.EditTask._id ? updateTask.data.newTask : task
          ))
        }
      } catch (error) {
        console.log(error)
      }
    },
  },
  getters: {
    getTasks(state) {
      return state.tasks
    },
  },
}

export default task
