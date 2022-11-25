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
  const { category } = req.body;
  try {
    const checkCategory = await Category.findByPk(category.id);
    if (!checkCategory) {
      await Category.create({
        ...category,
      });
    }
    const newItem = await Article.create({
      ...req.body,
      price: parseFloat(req.body.precio),
    });

    const articleCategory = await Category.findByPk(category.id);
    await articleCategory.addArticle(newItem.id);
    await Article.update(
      { categoryId: articleCategory.id },
      { where: { id: newItem.id } }
    );

    res.status(200).json(newItem);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

const updateItem = async (req, res) => {
  const { title, images, price, description, stock } = req.body;
  const { id } = req.query;
  if (isNaN(id))
    return res.status(400).json({ message: "ID must be a number" });
  try {
    const findArticle = await Article.findOne({
      where: {
        id: id,
      },
    });
    if (findArticle) {
      await findArticle.update({
        title,
        images,
        price,
        description,
        stock,
      });
      return res.status(200).json({
        message: "Article updated successfully",
        updatedArticle: findArticle,
      });
    } else {
      return res.status(404).json({ message: "No article found with that ID" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
    return;
  }
};

const deleteItem = async (req, res) => {
  const { id } = req.query;
  if (isNaN(id))
    return res.status(400).json({ message: "ID must be a number" });
  try {
    const findArticle = await Article.findOne({
      where: {
        id: id,
      },
    });
    if (findArticle) {
      await findArticle.destroy();
      return res.status(200).json({ message: "Article deleted successfully" });
    } else {
      return res.status(404).json({ message: "No article found with that ID" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

module.exports = {
  getAll,
  getOne,
  createItem,
  updateItem,
  deleteItem,
};
