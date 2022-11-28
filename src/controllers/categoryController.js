const { Category } = require("../db.js");
const { Op } = require("sequelize");

const getAll = async (req, res) => {
  const categorias = await Category.findAll();
  if (categorias.length === 0) {
    return res
      .status(404)
      .json({ message: "No categories available on the database" });
  }
  return res.status(200).json(categorias);
};

const getOne = async (req, res) => {
  const { id } = req.params;
  if (isNaN(id))
    return res.status(400).json({ message: "ID must be a number" });
  const category = await Category.findByPk(id);
  if (!category) {
    return res
      .status(404)
      .json({ message: "A category with that ID could not be found" });
  }
  return res.status(200).json(category);
};

const createCategory = async (req, res) => {
  const { name, image } = req.body;
  try {
    const findCategory = await Category.findOne({
      where: {
        name: name,
      },
    });
    if (findCategory) {
      return res
        .status(400)
        .json({ message: "A category with that name already exists" });
    } else {
      const newCategory = await Category.create({
        name: name,
        image: image,
      });
      return res
        .status(201)
        .json({ message: "Category created successfully", newCategory });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const modifyCategory = async (req, res) => {
  const { name, image } = req.body;
  const { id } = req.params;
  if (isNaN(id))
    return res.status(400).json({ messsage: "ID must be a number" });
  try {
    const findCategoryByPk = await Category.findByPk(id);
    const findCtegoryByName = await Category.findOne({
      where: {
        name: name,
      },
    });
    if (findCtegoryByName) {
      return res
        .status(400)
        .json({ message: "A category with that name already exists" });
    }
    if (findCategoryByPk) {
      const updatedCategory = await findCategoryByPk.update({
        name,
        image,
      });
      return res
        .status(200)
        .json({ message: "Category updated successfully", updatedCategory });
    } else {
      return res
        .status(404)
        .json({ message: "Category with that ID not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;
  if (isNaN(id))
    return res.status(400).json({ message: "ID must be a number" });
  try {
    const findCategoryByPk = await Category.findByPk(id);
    if (findCategoryByPk) {
      await findCategoryByPk.destroy();
      return res.status(200).json({ message: "Category deleted successfully" });
    } else {
      return res
        .status(404)
        .json({ message: "Category with that ID could not be found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const restoreCategory = async (req, res) => {
  const { id } = req.params;
  if (isNaN(id))
    return res.status(400).json({ message: "ID must be a number" });
  try {
    const deletedCategory = await Category.findOne({
      where: {
        id: id,
        [Op.not]: [{ deletedAt: null }],
      },
      paranoid: false,
    });
    if (deletedCategory) {
      await deletedCategory.restore();
      return res
        .status(200)
        .json({ message: "Category restored successfully", deletedCategory });
    } else {
      return res.status(404).json({
        message:
          "Category with that ID could not be found or is already restored",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

module.exports = {
  getAll,
  getOne,
  createCategory,
  modifyCategory,
  deleteCategory,
  restoreCategory,
};
