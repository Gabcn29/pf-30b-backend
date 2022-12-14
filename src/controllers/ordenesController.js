const { Article, User, Factura } = require("../db.js");

const getAll = async (req, res) => {
  try {
    const facturas = await Factura.findAll({ include: [Article, User] });
    res.status(200).json(facturas);
  } catch (e) {
    res.status(500).json(e);
  }
};

const updateOrder = async (req, res) => {
  try {
    const factura = await Factura.findByPk(req.params.id);
    await factura.update({ ...req.body });
    await factura.save();
    res.status(200).json(factura);
  } catch (e) {
    res.status(500).json(e);
  }
};

module.exports = {
  getAll,
  updateOrder,
};
