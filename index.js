const e = require("express");
const express = require("express");
const {
  newUser,
  deposit,
  usersDetails,
  userDetails,
  updateCredit,
  transfer,
  withdraw,
  filteredUsers,
} = require("./utils");

const app = express();
app.use(express.json());

app.post("/bank/newuser/:passportID", async (req,res) => {
  const { passportID } = req.params;
  const { status, data } = await newUser(passportID);
  res.status(status).json(data);
})

app.put("/bank/:passportID/query", async (req, res) => {
  const { passportID } = req.params;
  const { type } = req.query;
  if (!type) return res.status(400).json({error: 'Missing type query!'});
  switch (type) {
    case "deposit": {
      const { cash } = req.query;
      const { status, data } = await deposit(passportID, cash);
      res.status(status).json(data);
      break;
    }
    case "credit": {
      const { credit } = req.query;
      const { status, data } = await updateCredit(passportID, credit);
      res.status(status).json(data);
      break;
    }
    case "transfer": {
      const { cash, to } = req.query;
      const { status, data } = await transfer(passportID, cash, to);
      res.status(status).json(data);
      break;
    }
    case "withdraw": {
      const { cash } = req.query;
      const { status, data } = await withdraw(passportID, cash);
      res.status(status).json(data);
      break;
    }
    default:
      break;
  }
});

app.get("/bank/users", async (req,res) => {
  const {id} = req.query;
  if (!id) {
    const { status, data } = await usersDetails();
    return res.status(status).json(data);
  }
  const { status, data } = await userDetails(id);
  res.status(status).json(data);
});

app.get("/bank/users/filter", async (req, res) => {
  const { status, data } = await filteredUsers(req.query);
  res.status(status).json(data);
});

app.listen(3000, () => console.log("The server is on localhost:3000"));