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

const rellenarBase = async (req, res) => {
  await fetch("https://api.escuelajs.co/api/v1/products", {
    method: "GET",
  })
    .then((data) => data.json())
    .then(async (answer) => {
      for (let i = 0; i < answer.length; i++) {
        const newItem = await Article.create({
          ...answer[i],
          stock: Math.floor(Math.random() * 100),
        });
        const checkCategory = await Category.findByPk(answer[i].category.id);
        if (!checkCategory) {
          const newCategory = await Category.create({ ...answer[i].category });
          await newCategory.addArticle(newItem.id);
          await Article.update({ categoryId: newCategory.id }, { where: { id: newItem.id } });
        } else {
          await checkCategory.addArticle(newItem.id);
          await Article.update({ categoryId: checkCategory.id }, { where: { id: newItem.id } });
        }
      }
    })
    .then(async () => {
      const list = await Article.findAll({ include: Category });
      return res.status(200).json(list);
    });
};

module.exports = {
  getAll,
  getOne,
  createItem,
  rellenarBase,
};
