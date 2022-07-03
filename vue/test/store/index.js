import Vuex from 'vuex'
import task from './module/task'
const createStore = () => {
  return new Vuex.Store({
    modules: {
      task,
    },
  })
}
export default createStore
