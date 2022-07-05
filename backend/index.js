const app = require("express")();
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const { sequelize } = require("./models/index");
const useRouter = require("./routes/task");
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());
app.use(cors());
sequelize.sync();

app.get("/", getHomePage);
app.get("/tasks/:page", useRouter);
app.post("/newTask", useRouter);
app.put("/deleteTask/:id", useRouter);
app.put("/checkTask/:id", useRouter);
app.put("/editTask/", useRouter);
app.get("/assigned/:id", useRouter);

function getHomePage(req, res) {
  res.send("home");
}

const port = process.env.PORT;

app.listen(port, () => console.log("listening on port"));
