const express = require("express");
const router = express.Router();
const Flower = require("../model/flowers");

router.get("/", async (req, res) => {
  const flowers = await Flower.find({ active: true }).sort("name");
  res.send(flowers);
});

app.get("/catalog", async (req, res) => {
  const flowers = await Flower.find({ active: true }).sort("name");
  res.render("../public/partials/catalog", {
    flowers: flowers
  });
});

router.post("/", async (req, res) => {
  const { name, price, image, color, active } = req.body;
  const { error } = validateFlower(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const isFlower = await Flower.find({ flowerNumber: flowerId });
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

router.get("/:id", async (req, res) => {
  const flower = await Flower.findById(req.param.id);
  if (!flower)
    return res.status(404).send("The flower with the given ID does not exist");
  res.send(flower);
});

router.put("/:id", async (req, res) => {
  const { flowerId, numberOfEmployees, manager, phone, active } = req.body;
  const { error } = validateFlower(req.body);
  if (error) return res.status(400).send(error.details[0].message);
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
