import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const db = new pg.Client({
  user : process.env.DB_USER,
  host : process.env.DB_HOST,
  database :process.env.DB_NAME,
  password :process.env.DB_PASSWORD,
  port : Number(process.env.DB_PORT),
});

db.connect();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const items = [];
app.get("/", async (req, res) => {
  const result = await db.query("select * from list");

  res.render("index.ejs", {
    listTitle: "TODO List",
    listItems: result.rows,
  });
});

app.post("/add", (req, res) => {
  const item = req.body.newItem;
  db.query("insert into list(title) values ($1)",[item]);
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  const updatedId = req.body.updatedItemId;
  const updatedItemTitle = req.body.updatedItemTitle;
  db.query("update list set title = $1 where id = $2",[updatedItemTitle,updatedId]);
  res.redirect("/");
});

app.post("/delete", (req, res) => {
  const deletedId = req.body.deleteItemId;
  db.query("delete from list where id = $1",[deletedId]);
  res.redirect("/");
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
