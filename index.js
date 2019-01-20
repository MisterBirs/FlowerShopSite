var path = require("path");
var bodyParser = require("body-parser");
var express = require("express");
var ejs = require("ejs");
var app = express();
let usersData = require("./public/users.json");
let catalogData = require("./public/flower.json");
const ejsLint = require("ejs-lint");
const us = require("./public/partials/users.ejs");

//ejsLint(us);

function filterData(jsonList) {
  return jsonList.filter(element => {
    return element.active == "true";
  });
}

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("../public/index.ejs");
});

app.post("/auth", (req, res) => {
  const { username, password } = req.body;
  const user = usersData.users.find(user => {
    return user.name === username;
  });
  // console.log(username);
  //console.log(user);
  // console.log(usersData);
  if (user && user.password === password) {
    res.send();
  } else {
    res.status(500).send("Authentication Error");
  }
});

app.post("/auth/:username", (req, res) => {
  const { username } = req.params;
  console.log(username);
  const user = usersData.users.find(user => {
    return user.name === username;
  });
  if (username in users) {
    res.json(user);
    // res.send(users[username]);
  }
});

app.get("/auth/:username", (req, res) => {
  const { username } = req.params;
  //console.log(username);
  const user = usersData.users.find(user => {
    return user.name === username;
  });
  res.json(user);
});

app.get("/manage/:username", (req, res) => {
  const { username } = req.params;
  const user = usersData.users.find(user => {
    return user.name === username;
  });
  if (user && user.position === "manager") {
    //res.render("../public/partials/manage");
  }
});

app.get("/logout/", (req, res) => {
  res.send();
});

app.get("/users", (req, res) => {
  const { username } = req.query;
  const user = usersData.users.find(user => {
    return user.name === username;
  });
  if (user && (user.position === "manager" || user.position === "worker")) {
    let usersList = [];
    if (user.position === "manager") {
      usersList = filterData(usersData.users);
    }
    if (user.position === "worker") {
      usersList = filterData(usersData.users).map(user => {
        user.password = "*********";
        return user;
      });
    }
    res.render("../public/partials/users", {
      users: usersList
    });
  }
});

app.get("/updateForm", (req, res) => {
  const { username, userToUpdate } = req.query;
  const user = usersData.users.find(user => {
    return user.name === username;
  });
  if (user.position == "manager") {
    res.render("../public/partials/managerUpdateForm", {
      user: usersData.users.find(user => {
        return user.name === userToUpdate;
      })
    });
  }
});

app.put("/mUpdate", (req, res) => {
  const {
    username,
    userToUpdate,
    newUsername,
    newPassword,
    newPosition,
    newBranch
  } = req.query;
  const user = usersData.users.find(user => {
    return user.name === username;
  });
  console.log(username);
  if (user.position == "manager") {
    usersData.users = usersData.users.map(user => {
      if (user.name == userToUpdate) {
        console.log(user);
        user.name = newUsername;
        user.password = newPassword;
        user.position = newPosition;
        user.numberBranch = newBranch ? newBranch : "";
      }
      return user;
    });
    res.json(`${userToUpdate} update successfully`);
  } else {
    res.status(500).json("Not a manager");
  }
});

app.get("/catalog", (req, res) => {
  const { username } = req.query;
  const user = usersData.users.find(user => {
    return user.name === username;
  });
  if (user) {
    res.render("../public/partials/catalog", {
      flowers: filterData(catalogData.flowers)
    });
  }
});

app.listen(3000, function() {
  console.log("Example app listening on port 3000!");
});
