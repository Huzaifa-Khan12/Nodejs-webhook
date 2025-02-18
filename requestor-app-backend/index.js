import express from "express";
import "dotenv/config";

const app = express();
const port = process.env.port || 5601;

app.use(express.json());

//Storing incoming data in memory
const messages = [];

//Middleware to make sure the secret that is contained in header matches
const authMiddleware = (req, res, next) => {
  const headers = req.headers;
  const secretHeader = headers["x-secret"];
  if (secretHeader !== process.env.WEBHOOK_SECRET) {
    //Not allowed "Unauthorized" access
    return res.sendStatus(401);
  }
  next();
};

app.post("/git-info", authMiddleware, (req, res) => {
  const data = req.body;
  messages.push(data);
  res.sendStatus(200);
});

app.get("/", (req, res) => {
  return res.json(messages);
});

app.listen(port, () => console.log("Listening on port ", port));
