const { Article, Category } = require("../db.js");

const getAll = async (req, res) => {
  const articulos = await Article.findAll({ include: Category });
  const categorias = await Category.findAll();
  return res.status(200).json({ articulos, categorias });
};

const getOne = async (req, res) => {
  const articulo = await Article.findByPk(req.params.id, { include: Category });
  return res.status(200).json(articulo);
};

const createItem = async (req, res) => {
  if (req.body.category.new) {
  } else
    try {
      const newItem = await Article.create({ ...req.body, price: parseFloat(req.body.precio) });

      const checkCategory = await Category.findByPk(req.body.category.id);
      await checkCategory.addArticle(newItem.id);
      await Article.update({ categoryId: checkCategory.id }, { where: { id: newItem.id } });

      res.status(200).json(newItem);
    } catch (e) {
      console.log(e);
      res.status(500).json(e);
    }
};

module.exports = {
  getAll,
  getOne,
  createItem,
};
