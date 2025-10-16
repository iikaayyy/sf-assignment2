const { readJSONFile, writeJSONFile } = require("./fileOperations.js");

const users = [];
const requests = [];
const groupRequests = [];

class User {
  roles = [];
  groups = [];
  constructor(username, password, email, id, roles, groups) {
    this.username = username;
    this.password = password;
    this.email = email;
    this.id = id;
    this.roles.push(roles);
    this.avatar = "http://localhost:3000/avatars/default.png";
  }
}

function createUser(username, password, email, role = "CA") {
  return new User(username, password, email, users.length + 1, role);
}

const usernameAvailable = (arr, username) =>
  arr.find((el) => el.username === username);

users.push(createUser("super", "123", "super@super.com", "SU"));
users.push(createUser("yashee", "123", "y@y.com", "GA"));
users.push(createUser("john", "123", "j@j.com", "CA"));

// console.log("users.js", readJSONFile("userData.json"));
// writeJSONFile("userData.json", users);
// console.log("users.js", readJSONFile("userData.json"));

module.exports = {
  users,
  createUser,
  usernameAvailable,
  requests,
  groupRequests,
};
