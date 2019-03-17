const express = require("express");
const router = express.Router();
const Flower = require("../model/flowers");
const upload = require("../public/config/multerConfig");
const User = require("../model/users");

router.get("/", async (req, res) => {
  const flowers = await Flower.find({ active: true }).sort("name");
  res.send(flowers);
});

router.get("/catalog", async (req, res) => {
  const flowers = await Flower.find({ active: true }).sort("name");
  let user = await User.findOne({ name: req.query.username }).exec();
  user.password = "*********";
  res.render("../views/catalog", {
    flowers: flowers,
    user: user
  });
});

router.post("/", async (req, res) => {
  const { name, price, image, color, active } = req.query;
  // const { error } = validateFlower(req.query);
  // if (error) return res.status(400).send(error.details[0].message);
  const isFlower = await Flower.find({ name: flowerName }).exec();
  if (isFlower) {
    console.log("isFlower", isFlower);
    res.status(400).send("The flower already exist");
  }
  let flower = new Flower({
    name: name,
    price: price,
    image: image,
    color: color,
    active: active
  });
  flower = await flower.save();
  res.send(flower);
});

router.get("/upload", (req, res) => {
  res.render("../views/upload");
});

router.post("/upload", upload.single("flowerImage"), async (req, res) => {
  var applicationForm = {
    flowerName: req.body.flowerName,
    flowerColor: req.body.flowerColor,
    flowerPrice: req.body.flowerPrice,
    file: req.file
  };

  const { flowerName, flowerColor, flowerPrice, file } = applicationForm;

  console.log(flowerColor);

  const isFlower = await Flower.findOne({
    name: flowerName
  }).exec();
  if (isFlower) {
    res.status(400).send("The flower already exist");
  }
  let flower = new Flower({
    name: flowerName,
    price: flowerPrice,
    image: "\\uploads\\" + file.filename,
    color: flowerColor,
    active: true
  });

  try {
    flower = await flower.save();
  } catch (err) {
    console.log(err);
    return res.status(400).json(err.message);
  }
  // log applicationForm
  console.log(JSON.stringify(applicationForm, null, 4));
  console.log(flower);
  res.send("Uploaded Successfully!");
});

router.get("/:id", async (req, res) => {
  const flower = await Flower.findById(req.param.id);
  if (!flower)
    return res.status(404).send("The flower with the given ID does not exist");
  res.send(flower);
});

router.put("/:id", async (req, res) => {
  const { flowerId, numberOfEmployees, manager, phone, active } = req.query;
  // const { error } = validateFlower(req.query);
  // if (error) return res.status(400).send(error.details[0].message);
  const flower = await Flower.findByIdAndUpdate(
    req.param.id,
    {
      name: name,
      price: price,
      image: image,
      color: color,
      active: active
    },
    { new: true }
  );
  if (!flower)
    return res.status(404).send("The flower with the given ID does not exist");
  res.send(flower);
});

router.delete("/:id", async (req, res) => {
  const flower = await Flower.findByIdAndUpdate(
    req.param.id,
    {
      $set: { active: false }
    },
    { new: true }
  );
  if (!flower)
    return res.status(404).send("The flower with the given ID does not exist");
  res.send(flower);
});

module.exports = router;
