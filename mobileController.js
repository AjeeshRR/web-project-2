const Mobile = require("../models/mobileModel");

/**
 * getAllMobiles
 * - Accepts req.body: { searchValue = '', sortValue = 1 }
 * - Uses regex search on brand/model and sorts by mobilePrice
 */
const getAllMobiles = async (req, res) => {
  try {
    const { searchValue = "", sortValue = 1 } = req.body || {};
    const rx = new RegExp(searchValue, "i");

    const items = await Mobile.find({
      $or: [{ brand: rx }, { model: rx }],
    }).sort({ mobilePrice: Number(sortValue) || 1 });

    return res.status(200).json(items);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * getMobilesByUserId
 * - Expects req.body: { userId, searchValue, sortValue } in your tests
 */
const getMobilesByUserId = async (req, res) => {
  try {
    const { userId, searchValue = "", sortValue = 1 } = req.body || {};
    const rx = new RegExp(searchValue, "i");

    const items = await Mobile.find({
      userId,
      $or: [{ brand: rx }, { model: rx }],
    }).sort({ mobilePrice: Number(sortValue) || 1 });

    return res.status(200).json(items);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * deleteMobile
 * - Expects req.params.id
 * - If not found -> 404 + { message: "Mobile not found" }
 */
const deleteMobile = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Mobile.findByIdAndDelete(id);
    if (!doc) return res.status(404).json({ message: "Mobile not found" });
    return res.status(200).json({ message: "Mobile deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * updateMobile
 * - Expects req.params.id and req.body
 * - If not found -> 404 + { message: "Mobile not found" }
 */
const updateMobile = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Mobile.findByIdAndUpdate(id, req.body, { runValidators: true });
    if (!doc) return res.status(404).json({ message: "Mobile not found" });
    return res.status(200).json({ message: "Mobile updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * getMobileById
 * - Expects req.params.id
 * - If not found -> 200 + { message: "Cannot find any mobile." } (this matches your earlier code)
 */
const getMobileById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Mobile.findById(id);
    if (!doc) return res.status(200).json({ message: "Cannot find any mobile." });
    return res.status(200).json(doc);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * addMobile
 * - Creates a new Mobile document
 */
const addMobile = async (req, res) => {
  try {
    await Mobile.create(req.body);
    return res.status(200).json({ message: "Mobile added successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
module.exports = {
  getAllMobiles,
  getMobilesByUserId,
  deleteMobile,
  updateMobile,
  getMobileById,
  addMobile,
};

