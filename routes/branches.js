const express = require("express");
const router = express.Router();
const Branch = require("../model/branches");

router.get("/", async (req, res) => {
  const branches = await Branch.find({ active: true }).sort(
    "NumberOfEmployees"
  );
  res.send(branches);
});

router.post("/", async (req, res) => {
  const { id, numberOfEmployees, manager, phone, active } = req.query;
  // const { error } = validateBranch(req.query);
  // if (error) return res.status(400).send(error.details[0].message);
  const isBranch = await Branch.find({ branchNumber: id });
  if (isBranch) {
    return res.status(500).send("The branch with the given ID already exists");
  }
  let branch = new Branch({
    id: id,
    numberOfEmployees: numberOfEmployees,
    manager: manager,
    phone: phone,
    active: active
  });
  branch = await branch.save();
  res.send(branch);
});

router.get("/:id", async (req, res) => {
  const branch = await Branch.findById(req.param.id);
  if (!branch)
    return res.status(404).send("The branch with the given ID does not exist");
  res.send(branch);
});

router.put("/:id", async (req, res) => {
  const { id, numberOfEmployees, manager, phone, active } = req.query;
  // const { error } = validateBranch(req.query);
  // if (error) return res.status(400).send(error.details[0].message);
  const branch = await Branch.findByIdAndUpdate(
    req.param.id,
    {
      id: id,
      numberOfEmployees: numberOfEmployees,
      manager: manager,
      phone: phone,
      active: active
    },
    { new: true }
  );
  if (!branch)
    return res.status(404).send("The branch with the given ID does not exist");
  res.send(branch);
});

router.delete("/:id", async (req, res) => {
  const branch = await Branch.findByIdAndUpdate(
    req.param.id,
    {
      $set: { active: false }
    },
    { new: true }
  );
  if (!branch)
    return res.status(404).send("The branch with the given ID does not exist");
  res.send(branch);
});

module.exports = router;
