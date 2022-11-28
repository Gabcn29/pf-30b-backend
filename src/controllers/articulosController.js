const { Article, Category } = require("../db.js");
const { Op } = require("sequelize");

const getAll = async (req, res) => {
  const articulos = await Article.findAll({ include: Category });
  const categorias = await Category.findAll();
  const deletedArticles = await Article.findAll({
    where: {
      [Op.not]: [{ deletedAt: null }],
    },
    paranoid: false,
  });
  const deletedCategories = await Category.findAll({
    where: {
      [Op.not]: [{ deletedAt: null }],
    },
    paranoid: false,
  });
  return res
    .status(200)
    .json({ articulos, deletedArticles, categorias, deletedCategories });
};

const getOne = async (req, res) => {
  const { id } = req.params;
  if (isNaN(id))
    return res.status(400).json({ message: "ID must be a number" });
  try {
    const articulo = await Article.findByPk(id, { include: Category });
    const deletedArticle = await Article.findByPk(id, { paranoid: false });
    if (articulo) {
      return res.status(200).json({ message: "Article is active", articulo });
    } else if (deletedArticle) {
      return res
        .status(200)
        .json({ message: "Article is deleted", deletedArticle });
    } else {
      return res
        .status(404)
        .json({ message: "Article with that ID could not be found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const createItem = async (req, res) => {
  const { category } = req.body;
  try {
    const checkCategoryByPk = await Category.findByPk(category.id);
    const checkCategoryByName = await Category.findOne({
      where: {
        name: category.name,
      },
    });
    const checkItem = await Article.findOne({
      where: {
        title: req.body.title,
      },
    });
    if (checkItem) {
      return res
        .status(400)
        .json({ message: "An article with that name already exists" });
    }
    if (!checkCategoryByPk && !checkCategoryByName) {
      await Category.create({
        name: category.name,
        image: category.image,
      });
    }
    const newItem = await Article.create({
      ...req.body,
      price: parseFloat(req.body.precio),
    });

    const articleCategory = await Category.findOne({
      where: {
        name: category.name,
      },
    });
    await articleCategory.addArticle(newItem.id);
    await Article.update(
      { categoryId: articleCategory.id },
      { where: { id: newItem.id } }
    );

    return res.status(200).json(newItem);
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
  }
};

const updateItem = async (req, res) => {
  const { title, images, price, description, stock } = req.body;
  const { id } = req.params;
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
        price: parseFloat(price),
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
  const { id } = req.params;
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

const restoreItem = async (req, res) => {
  const { id } = req.params;
  if (isNaN(id))
    return res.status(400).json({ message: "ID must be a number" });
  try {
    const deletedArticle = await Article.findOne({
      where: {
        id: id,
        [Op.not]: [{ deletedAt: null }],
      },
      paranoid: false,
    });
    if (deletedArticle) {
      await deletedArticle.restore();
      return res
        .status(200)
        .json({ message: "Article restored successfully", deletedArticle });
    } else {
      return res
        .status(404)
        .json({ message: "Article with that ID could not be found or is already restored" });
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
  restoreItem,
};
