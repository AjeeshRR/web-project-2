const router = require("express").Router();
const {
  getAllMobiles,
  getMobilesByUserId,
  deleteMobile,
  updateMobile,
  getMobileById,
  addMobile,
} = require("../controllers/mobileController");

router.post("/", getAllMobiles);
router.post("/seller", getMobilesByUserId); // matches your frontend /seller endpoint which posts body { userId,... }
router.delete("/:id", deleteMobile);
router.put("/:id", updateMobile);
router.get("/:id", getMobileById);
router.post("/add", addMobile);

module.exports = router;
