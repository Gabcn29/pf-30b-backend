const { Address } = require("../db.js");

const getAddress = async (req, res) => {
  try {
    const address = await Address.findAll();
    return res.status(202).json({ address });
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
  }
};

const insert = async (req, res) => {
  const {
    firstName,
    lastName,
    city,
    province,
    postalCode,
    country,
    addressLine,
  } = req.body;

  try {
    let valideAddress = await Address.findOne({
      where: {
        firstName: firstName,
        lastName: lastName,
        city: city,
        province: province,
        postalCode: postalCode,
        country: country,
        addressLine: addressLine,
      },
    });
    if (!valideAddress) {
      let createAddress = await Address.create({
        firstName,
        lastName,
        city,
        province,
        postalCode,
        country,
        addressLine,
      });
      return res
        .status(201)
        .json({ message: "Address created", createAddress });
    }
    return res.status(200).json({ message: "That address already exists" });
  } catch (error) {
    console.log(error);
    return res
      .status(404)
      .json({ message: "The address was created previously" });
  }
};
const updateAddress = async (req, res) => {
  const {
    firstName,
    lastName,
    city,
    province,
    postalCode,
    country,
    addressLine,
  } = req.body;

  const { id } = req.params;

  if (isNaN(id))
    return res.status(400).json({ message: "ID must be a number" });

  try {
    const address = await Address.findByPk(id);

    if (address) {
      await address.update({
        firstName,
        lastName,
        city,
        province,
        postalCode,
        country,
        addressLine,
      });
      return res.status(200).json({
        message: "Address was updated successfully",
        updatedArticle: address,
      });
    } else {
      return res.status(404).json({ message: "No Address found with that ID" });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
  }
};

const deleteAddress = async (req, res) => {
  const { id } = req.params;

  if (isNaN(id))
    return res.status(400).json({ message: "ID must be a number" });

  try {
    const address = await Address.findByPk(id);
    if (address) {
      await address.destroy();
      return res
        .status(200)
        .json({ message: "Address was deleted successfully" });
    } else {
      return res.status(404).json({ message: "No address found with that ID" });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
  }
};

module.exports = {
  insert,
  getAddress,
  updateAddress,
  deleteAddress,
};
