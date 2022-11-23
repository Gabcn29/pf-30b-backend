const { Category } = require("../db.js");

const getAll = async (req, res) => {
  const categorias = await Category.findAll();
  return res.status(200).json(categorias);
};

const getOne = async (req, res) => {
  const category = await Category.findByPk(req.params.id);
  return res.status(200).json(category);
};

module.exports = {
  getAll,
  getOne,
};
