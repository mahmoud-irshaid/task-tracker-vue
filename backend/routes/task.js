const router = require("express").Router();
const {
  getAllTasks,
  createNewTask,
  deleteTask,
  checkTask,
  editTask,
  getAllAssigned,
} = require("../controller/task");

router.get("/tasks/:page", getAllTasks);
router.post("/newTask", createNewTask);
router.put("/deleteTask/:id", deleteTask);
router.put("/checkTask/:id", checkTask);
router.put("/editTask/", editTask);
router.get("/assigned/:id", getAllAssigned);

module.exports = router;
