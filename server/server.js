const express = require("express");
const path = require("path");
const http = require("http");
const multer = require("multer");
const {
  users,
  createUser,
  requests,
  usernameAvailable,
  groupRequests,
} = require("./users");
const { groups, createGroup, groupNameAvailable } = require("./groups");
const { MongoClient } = require("mongodb");

const cors = require("cors");
const { Server } = require("socket.io");
const { readJSONFile, writeJSONFile } = require("./fileOperations.js");

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/avatars", express.static(path.join(__dirname, "avatars")));

// ✅ Root + Health routes
app.get("/", (req, res) => {
  res.send("ChatApp API is running ✅");
});
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

let db;
async function connectToDB() {
  const client = new MongoClient(`mongodb://localhost:27017/`);
  await client.connect();
  db = client.db("chatApp");
}
connectToDB();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:4200", // Replace with your client-side URL
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`${socket.id} just joined!`);

  socket.on("join-room", (data) => {
    socket.join(data.room);
    socket.to(data.room).emit("receive-msg", data);
  });

  socket.on("message", async (data) => {
    console.log(data);

    //data.content data.username data.room data.type data.time
    const collectionName = data.room;

    const collection = db.collection(collectionName);

    await collection.insertOne({
      username: data.username,
      message: data.content,
      type: data.type,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    });

    socket.to(data.room).emit("receive-msg", data);
  });

  socket.on("leave-room", (data) => {
    socket.leave();
    socket.to(data.room).emit("receive-msg", data);
  });

  socket.on("imageMessage", async (data) => {
    const collectionName = data.room;

    const collection = db.collection(collectionName);

    await collection.insertOne({
      username: data.username,
      type: data.type,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    });

    socket.to(data.room).emit("receive-msg", data);
  });

  socket.on("join-video-room", (data) => {
    data.content = `${data.content} at ${data.time}`;
    socket.to(data.room).emit("receive-msg", data);
  });

  socket.on("leave-video-room", (data) => {
    data.content = `${data.content} at ${data.time}`;
    socket.to(data.room).emit("receive-msg", data);
  });

  socket.on("new-peer", (data) => {
    socket.to(data.room).emit("new-peer", data);
  });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "avatars"); // Folder to store the uploaded files
  },
  filename: (req, file, cb) => {
    // Wait until Multer has processed the request body
    const ext = path.extname(file.originalname); // Get file extension
    // console.log(file.originalname);
    cb(null, file.originalname); // Save the file with userId in the name
  },
});

const upload = multer({ storage: storage });

//edits users
app.post("/upload-avatar", upload.single("avatar"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  const userId = Number(req.file.originalname.split(".")[0].split("").pop());
  const ext = req.file.originalname.split(".")[1];
  for (const user of users) {
    if (user.id === userId) {
      user.avatar = `http://localhost:3000/avatars/user${userId}.${ext}`;
    }
  }
  res.json({ status: "upload successfull" });
});

//signUp route
app.post("/sign-up", async (req, res) => {
  const { email, username, password } = req.body;
  let reqs = await readJSONFile("requests.json");
  // console.log(reqs);

  //push request to requests.json
  if (
    !usernameAvailable(users, username) &&
    !usernameAvailable(requests, username)
  ) {
    requests.push({ email, username, password });
    // await writeJSONFile("requests.json", requests);
    // console.log(requests);

    res.json({ status: "request sent" });
  } else res.json({ status: "fail", message: "username already taken" });
});

app.get("/requests", async (req, res) => {
  // const reqs = await readJSONFile("requests.json");
  res.json(requests);
});

app.get("/users", (req, res) => {
  //read and return the users file
  res.json(users);
});

app.post("/join-group", async (req, res) => {
  const { userId, groupId, groupName, username } = req.body;
  let groupReqs = readJSONFile("groupRequests.json");
  //add request to groupRequests
  if (
    !groupRequests.find((g) => g.userId === userId && g.groupId === groupId)
  ) {
    groupRequests.push({ groupName, username, groupId, userId });
    // console.log(`group reqs`, groupRequests);
    await writeJSONFile("groupRequests.json", groupRequests);
  }

  // console.log(groupRequests);
  res.json({ status: "request sent" });
});

app.get("/join-group-reqs", (req, res) => {
  res.json(groupRequests);
});

app.post("/modify-request", async (req, res) => {
  const { type, req: request } = req.body;
  // console.log(request);
  const u = readJSONFile("userData.json");

  const idx = requests.findIndex((r) => r.username === request.username);
  requests.splice(idx, 1);
  writeJSONFile("requests.json", requests);
  if (type === "approve") {
    users.push(createUser(request.username, request.password, request.email));
    // console.log(users.at(-1));
    writeJSONFile("userData.json", users);
    res.json({ status: "added" });
  } else res.json({ status: "denied" });
});

app.post("/modify-group-request", (req, res) => {
  const {
    type,
    request: { userId, groupId },
  } = req.body;
  // console.log(type, userId, groupId);

  if (type === "approve") {
    if (!users.find((u) => u.id === userId).groups.includes(groupId)) {
      users.find((u) => u.id === userId).groups.push(groupId);
      writeJSONFile("userData.json", users);
    }

    if (!groups.find((g) => g.id === groupId).users.includes(userId)) {
      groups.find((g) => g.id === groupId).users.push(userId);
      writeJSONFile("groupData.json", groups);
    }
  }

  const idx = groupRequests.findIndex(
    (g) => g.userId === userId && g.groupId === groupId
  );

  groupRequests.splice(idx, 1);

  res.json({ status: "progress" });
});

//Login Route
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    (user) => username === user.username && password === user.password
  );

  if (!user) return res.json({ valid: false });
  res.json({ valid: true, user });
});

//route to return groups
app.get("/groups", (req, res) => {
  res.json(groups);
});

//create Route
app.post("/create-group", (req, res) => {
  const { name, userId: adminId } = req.body;

  if (groupNameAvailable(name)) {
    createGroup(name, adminId);
    const user = users.find((user) => user.id === adminId);
    res.json({ status: "OK", user });
  } else res.json({ status: "fail" });
});

app.post("/delete-user", (req, res) => {
  const { id } = req.body;
  const { groups: userGroups } = users.find((u) => u.id === id);

  const userIdx = users.findIndex((u) => u.id === id);

  //remove user from their groups users array
  for (const groupId of userGroups) {
    const group = groups.find((group) => group.id === groupId);
    const userIdxInGroup = group.users.indexOf(id);
    group.users.splice(userIdxInGroup, 1);
    writeJSONFile("groupData.json", groups);
  }

  //finally delete user
  users.splice(userIdx, 1);
  writeJSONFile("userData.json", users);
  res.json({ status: "ok" });
});

app.post("/remove-user", (req, res) => {
  const { userId, groupId } = req.body;

  //remove userId from group's users array
  const group = groups.find((group) => group.id === groupId);
  const userIdxInGroup = group.users.indexOf(userId);
  group.users.splice(userIdxInGroup, 1);

  //remove groupId from user's groups array
  const groupIndex = users.at(userId - 1).groups.indexOf(groupId);
  users.at(userId - 1).groups.splice(groupIndex, 1);
  res.json({ status: "ok", user: users.at(userId - 1) });
});

server.listen(3000, () => {
  console.log(`Server listening at port 3000`);
});

module.exports = app;
