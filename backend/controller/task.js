const { sequelize } = require("../models/index");
const uuid = require("uuid");

async function getAllTasks(req, res) {
  try {
    const tasks = await sequelize.models.Tasks.findAll({
      where: { recordStatus: "latest" },
    });
    res.send(tasks);
  } catch (error) {
    res.send(error.message);
  }
}

async function createNewTask(req, res) {
  let data = req.body.payload;
  let _id = uuid.v4();
  try {
    const tasks = await sequelize.models.Tasks.create({
      _id,
      name: data.name,
      description: data.description,
      type: data.type,
      assigneeName: data.assigneeName,
      claimed: data.claimed,
      priority: data.priority,
      priorityImpact: data.priorityImpact,
      severity: data.severity,
      severityImpact: data.severityImpact,
      dueDate: data.dueDate,
      dueTime: data.dueTime,
      estTime: data.estTime,
      tags: data.tags,
      recordStatus: "latest",
      checked: false,
    });
    for (let i = 0; i < data.friends.length; i++) {
      await sequelize.models.Assigneds.create({
        _id: uuid.v4(),
        user: data.friends[i],
        task: _id,
        recordStatus: "latest",
      });
    }
    res.send(tasks);
  } catch (error) {
    res.send(error.message);
  }
}

async function deleteTask(req, res) {
  let data = req.params.id;
  try {
    const tasks = await sequelize.models.Tasks.update(
      {
        recordStatus: "deleted",
      },
      {
        where: { _id: data },
      }
    );
    res.status(200).json(tasks);
  } catch (error) {
    res.status(400).json(error.message);
  }
}

async function checkTask(req, res) {
  let data = req.params.id;
  try {
    const tasks = await sequelize.models.Tasks.update(
      { checked: sequelize.literal("NOT checked") },
      {
        where: { _id: data },
      }
    );
    res.send(tasks);
  } catch (error) {
    res.send(error.message);
  }
}

async function editTask(req, res) {
  let data = req.body.payload.EditTask;
  let friends = req.body.payload.friends;
  try {
    const tasks = await sequelize.models.Tasks.update(
      {
        recordStatus: "updated",
      },
      {
        where: { _id: data._id },
      }
    );
    const newTask = await sequelize.models.Tasks.create({
      _id: data._id,
      name: data.name,
      description: data.description,
      type: data.type,
      assigneeName: data.assigneeName,
      claimed: data.claimed,
      priority: data.priority,
      priorityImpact: data.priorityImpact,
      severity: data.severity,
      severityImpact: data.severityImpact,
      dueDate: data.dueDate,
      dueTime: data.dueTime,
      estTime: data.estTime,
      tags: data.tags,
      checked: data.checked,
      recordStatus: "latest",
    });
    for (let i = 0; i < friends.length; i++) {
      await sequelize.models.Assigneds.update(
        {
          recordStatus: "updated",
        },
        {
          where: { task: data._id },
        }
      );

      await sequelize.models.Assigneds.create({
        _id: friends[i]._id || uuid.v4(),
        user: friends[i].user,
        task: data._id,
        recordStatus: "latest",
      });
    }
    res.send(newTask);
  } catch (error) {
    res.send(error.message);
  }
}

async function getAllAssigned(req, res) {
  let data = req.params.id;
  try {
    const Assigneds = await sequelize.models.Assigneds.findAll({
      where: { task: data, recordStatus: "latest" },
    });
    res.send(Assigneds);
  } catch (error) {
    res.send(error.message);
  }
}

module.exports = {
  getAllTasks,
  createNewTask,
  deleteTask,
  checkTask,
  editTask,
  getAllAssigned,
};
