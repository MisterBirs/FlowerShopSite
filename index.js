var path = require("path");
var bodyParser = require("body-parser");
var express = require("express");
var ejs = require("ejs");
var app = express();
let usersData = require("./public/users.json");
const users = require("./routes/users");
let catalogData = require("./public/flower.json");
const ejsLint = require("ejs-lint");
const us = require("./public/partials/users.ejs");
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/flower_shop")
  .then(() => console.log("connected to MongoDB"))
  .catch(err => console.error("Could not connect to MongoDB...", err));

app.use("/api/users", users);

async function createUser(name, password, position, id, active, numberBranch) {
  if (numberBranch === undefined) numberBranch = null;
  const user = new User({
    name: name,
    password: password,
    position: position,
    id: id,
    active: active,
    numberBranch: numberBranch
  });

  const result = await user.save();
  console.log(result);
}

usersData.users.forEach(user => {
  const { name, password, position, id, active, numberBranch } = user;
  createUser(name, password, position, id, active, numberBranch);
  // console.log(name, password, position, id, active, numberBranch);
});

//createUser();

let contactUsData = [];

function filterData(jsonList) {
  return jsonList.filter(element => {
    return element.active == "true";
  });
}

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.set("view engine", "ejs");

app.get("/contactUs", (req, res) => {
  res.render("../public/partials/contactUs");
});

app.post("/contactUs", (req, res) => {
  const { email, name, text } = req.body;
  //console.log(email + " " + name + " " + text);
  res.send();
});

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
  if (user) {
    let userToSend = { ...user };
    userToSend.password = "*******";
    res.json(userToSend);
    // res.send(users[username]);
  }
});

app.get("/addUser", (req, res) => {
  const { username } = req.query;
  const user = usersData.users.find(user => {
    return user.name === username;
  });
  if (user && (user.position === "manager" || user.position === "worker")) {
    res.render("../public/partials/addUser");
  }
});

app.put("/addUser", (req, res) => {
  const { username, password, userToAdd, position, branch, ID } = req.query;
  const user = usersData.users.find(user => {
    return user.name === username;
  });
  if (user && (user.position === "manager" || user.position === "worker")) {
    let newUser = usersData.users.find(user => {
      return user.name === userToAdd;
    });
    setTimeout(() => {
      if (newUser) {
        res.status(501).json("Username already exist!");
      } else {
        let newUser = {};
        newUser.name = userToAdd;
        newUser.password = password;
        newUser.position = position;
        newUser.numberBranch = branch;
        newUser.id = ID;
        newUser.active = "true";
        console.log(newUser);
        usersData.users.push(newUser);
        res.json(`${newUser.name} added successfully`);
      }
    }, 1000);
  } else {
    res.status(501).json("You are not a worker");
  }
});

app.get("/auth/:username", (req, res) => {
  const { username } = req.params;
  //console.log(username);
  const user = usersData.users.find(user => {
    return user.name === username;
  });
  if (user) {
    let userToSend = { ...user };
    userToSend.password = "*******";
    res.json(userToSend);
    // res.send(users[username]);
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
      users: usersList,
      position: user.position
    });
  }
});

app.get("/about", (req, res) => {
  res.render(`../public/partials/about`);
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
  if (user.position === "worker") {
    res.render("../public/partials/workerUpdateForm", {
      user: usersData.users.find(user => {
        return user.name === userToUpdate;
      })
    });
  }
});

app.delete("/deleteUser", (req, res) => {
  const { username, userToDelete } = req.query;
  const user = usersData.users.find(user => {
    return user.name === username;
  });
  setTimeout(() => {
    if (user.position == "manager") {
      usersData.users = usersData.users.map(user => {
        if (user.name == userToDelete) {
          user.active = "false";
        }
        return user;
      });
      res.json(`${userToDelete} deleted successfully`);
    } else {
      res.status(500).json("Not a manager");
    }
  }, 1000);
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
  setTimeout(() => {
    if (user.position == "manager") {
      usersData.users = usersData.users.map(user => {
        if (user.name == userToUpdate) {
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
  }, 1000);
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
