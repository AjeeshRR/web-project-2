const router = require("express").Router();
const { getUserByUsernameAndPassword, addUser, getAllUsers } = require("../controllers/userController");

router.post("/login", getUserByUsernameAndPassword);
router.post("/", addUser);
router.get("/", getAllUsers);

module.exports = router;
