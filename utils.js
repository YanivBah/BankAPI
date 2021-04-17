const fs = require("fs").promises;

const getAllUsers = async () => {
  const users = JSON.parse(await fs.readFile("./database/users.json", "utf-8"));
  return users;
}

const getUserIndex = async (passportID) => {
  const users = await getAllUsers();
  const userIndex = users.findIndex((user) => user.passportID === passportID);
  if (userIndex !== -1 && !users[userIndex].isActive) return { users, userIndex: "NOT_ACTIVE" };
  return { users, userIndex };
}

const updateMoney = (type, user, cash) => {
  if (type === 'decrease') {
    if (user.cash + user.credit >= cash) {
      user.cash -= cash;
      return "DONE";
    }
  } else if (type === 'increase') {
    user.cash += cash;
    return "DONE";
  }
  return null;
}

const response = (statusCode, data) => {
return {status: statusCode, data};
}

const saveData = async (database) => {
  await fs.writeFile("./database/users.json", JSON.stringify(database));
}

const newUser = async (passportID) => {
  const users = await getAllUsers();
  const isExist = users.find(user => user.passportID === passportID);
  if (!isExist) {
    const newUser = { passportID, cash: 0, credit: 0, isActive: true };
    users.push(newUser);
    saveData(users);
    return response(201, newUser);
  } 
  return response(409, {error: 'User with this passportID already exist!'});
}

const deposit = async (passportID, cash) => {
  const regex = /^([.]\d+|\d+([.]\d+)?)$/;
  const vaildCash = regex.test(cash);
  if (!vaildCash || Number(cash) === 0) return response(406, {error: 'Cash is negative or not in the right format!'});
  const { users, userIndex } = await getUserIndex(passportID);
  if (userIndex === "NOT_ACTIVE") return response(406, {error: "User not active!"});
  if (userIndex === -1) return response(404, { error: "User with this passportID not found!" });
  users[userIndex].cash += Number(cash);
  saveData(users);
  return response(200, users[userIndex]);
}

const updateCredit = async (passportID, credit) => {
  const regex = /^([.]\d+|\d+([.]\d+)?)$/;
  const vaildCredit = regex.test(credit);
  if (!vaildCredit || Number(credit) === 0) return response(406, {error: 'Credit is negative or not in the right format!'});
  const { users, userIndex } = await getUserIndex(passportID);
  if (userIndex === "NOT_ACTIVE") return response(406, {error: "User not active!"});
  if (userIndex === -1) return response(404, { error: "User with this passportID not found!" });
  users[userIndex].credit = Number(credit);
  saveData(users);
  return response(200, users[userIndex]);
}

const withdraw = async (passportID, cash) => {
  const regex = /^([.]\d+|\d+([.]\d+)?)$/;
  const vaildCash = regex.test(cash);
  if (!vaildCash || Number(cash) === 0) return response(406, {error: 'Cash is negative or not in the right format!'});
  const { users, userIndex } = await getUserIndex(passportID);
  if (userIndex === "NOT_ACTIVE") return response(406, {error: "User not active!"});
  if (userIndex === -1) return response(404, { error: "User with this passportID not found!" });
  const decrease = updateMoney("decrease", users[userIndex], Number(cash));
  if (!decrease) return response(404, { error: "You don't have enough money." });
  saveData(users);
  return response(200, users[userIndex]);
};

const transfer = async (fromPassportID, cash, toPassportID) => {
  const regex = /^([.]\d+|\d+([.]\d+)?)$/;
  const vaildCash = regex.test(cash);
  if (!vaildCash || Number(cash) === 0) return response(406, {error: 'Cash is negative or not in the right format!'});
  const { users, userIndex: fromUserIndex } = await getUserIndex(fromPassportID);
  if (fromUserIndex === "NOT_ACTIVE") return response(406, {error: "User you are trying to transfer from not active!"});
  if (fromUserIndex === -1) return response(404, { error: "The user you are trying to transfer from not found." });
  const toUserIndex = users.findIndex((user) => user.passportID === toPassportID);
  if (toUserIndex !== -1 && !users[toUserIndex].isActive) return response(406, {error: "User you are trying to transfer to not active!"});
  if (toUserIndex === -1) return response(404, { error: "The user you are trying to transfer to not found." });
  const decrease = updateMoney("decrease", users[fromUserIndex], Number(cash));
  if (!decrease) return response(404, { error: "You don't have enough money." });
  updateMoney("increase", users[toUserIndex], Number(cash));
  saveData(users);
  return response(200, users[fromUserIndex]);
};


const userDetails = async (passportID) => {
  const { users, userIndex } = await getUserIndex(passportID);
  if (userIndex === -1) return response(404, { error: "User with this passportID not found!" });
  return response(200, users[userIndex]);
}

const usersDetails = async () => {
  const users = await getAllUsers();
  return response(200, users);
}

const filteredUsers = async (query) => {
  const users = await getAllUsers();
  let filtered = [`Didn't found!`];
  if (!query.type) return response(400, { error: "Missing type query!" });

  const { amount } = query;
  switch (query.type) {
    case "minus": {
      filtered = users.filter((user) => user.cash < 0);
      break;
    }
    case "credit": {
      if (!amount) return response(400, { error: "Missing amount query!" });
      filtered = users.filter((user) => user.credit >= Number(amount));
      break;
    }
    case "cash": {
      if (!amount) return response(400, { error: "Missing amount query!" });
      filtered = users.filter((user) => user.cash >= Number(amount));
      break;
    }

    default:
      break;
  }
  return response(200, filtered);
}

module.exports = {
  getAllUsers,
  usersDetails,
  newUser,
  deposit,
  updateCredit,
  transfer,
  withdraw,
  userDetails,
  filteredUsers
};