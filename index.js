const express = require("express");
const { newUser, deposit, usersDetails, userDetails, updateCredit, transfer, withdraw } = require("./utils");

const app = express();
app.use(express.json());

app.post("/api/newuser/:passportID", async (req, res) => {
  const { passportID } = req.params;
  const {status, data} = await newUser(passportID);
  res.status(status).json(data);
});

app.put("/api/deposit/:passportID/:cash", async (req, res) => {
  const { passportID, cash } = req.params;
  const { status, data } = await deposit(passportID, cash);
  res.status(status).json(data);
});

app.put("/api/credit/:passportID/:credit", async (req, res) => {
  const { passportID, credit } = req.params;
  const { status, data } = await updateCredit(passportID, credit);
  res.status(status).json(data);
});

app.put("/api/transfer/:fromPassportID/:cash/:toPassportID", async (req, res) => {
  const { fromPassportID, cash, toPassportID } = req.params;
  const { status, data } = await transfer(fromPassportID, cash, toPassportID);
  res.status(status).json(data);
});

app.put("/api/withdraw/:passportID/:cash", async (req, res) => {
  const { passportID, cash } = req.params;
  const { status, data } = await withdraw(passportID, cash);
  res.status(status).json(data);
});

app.get("/api/users", async (req, res) => {
  const { status, data } = await usersDetails();
  res.status(status).json(data);
});

app.get("/api/user/:passportID", async (req, res) => {
  const { passportID } = req.params;
  const { status, data } = await userDetails(passportID);
  res.status(status).json(data);
});

app.listen(3000, () => console.log("The server is on localhost:3000"));
