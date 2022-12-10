const { Article, Category, Review } = require("../db.js");
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
  const { title, images, price, properties, stock } = req.body;
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
        properties,
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

const createReview = async (req, res, next) => {
  const {username, rating, review, image = "xd", item} = req.body
  try {
      if(!rating) return res.status(500).send('Se requiere establecer una puntuacion')
      let newReview = await Review.create({
          username,
          rating,
          review,
          image,
      })
      let articleDb = await Article.findAll({
          where:{ id: item }
      })
      
      await articleDb.addReview(newReview)

      res.send('ok')
  } catch (error) {
      next(error)
  }
} 

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
      return res.status(404).json({
        message:
          "Article with that ID could not be found or is already restored",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const populateDb = async (req, res) => {
  const { items } = req.body;
  try {
    //Ram fill
    let findRam = await Category.findOne({
      where: {
        name: "RAM",
      },
      paranoid: false,
    });
    if (!findRam) {
      findRam = await Category.create({
        name: "RAM",
        image:
          "https://i.pinimg.com/originals/60/44/99/60449931da3d9581496abfc48ba39b10.jpg",
      });
    }
    for (let i = 0; i < items[0].length; i++) {
      const newArticle = await Article.create(items[0][i]);
      await findRam.addArticle(newArticle.id);
      await newArticle.update({ categoryId: findRam.id });
    }

    // Case Fan fill
    let findCaseFan = await Category.findOne({
      where: {
        name: "Case Fans",
      },
      paranoid: false,
    });
    if (!findCaseFan) {
      findCaseFan = await Category.create({
        name: "Case Fans",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/80mm_fan.jpg/1200px-80mm_fan.jpg",
      });
    }
    for (let i = 0; i < items[1].length; i++) {
      const newArticle = await Article.create(items[1][i]);
      await findCaseFan.addArticle(newArticle.id);
      await newArticle.update({ categoryId: findCaseFan.id });
    }

    //Mice fill
    let findMouse = await Category.findOne({
      where: {
        name: "Mice",
      },
      paranoid: false,
    });
    if (!findMouse) {
      findMouse = await Category.create({
        name: "Mice",
        image:
          "https://expertreviews.b-cdn.net/sites/expertreviews/files/2022/04/best_mouse_-_hero.jpg",
      });
    }
    for (let i = 0; i < items[2].length; i++) {
      const newArticle = await Article.create(items[2][i]);
      await findMouse.addArticle(newArticle.id);
      await newArticle.update({ categoryId: findMouse.id });
    }

    //keyboard fill
    let findKeyboard = await Category.findOne({
      where: {
        name: "Keyboards",
      },
      paranoid: false,
    });
    if (!findKeyboard) {
      findKeyboard = await Category.create({
        name: "Keyboards",
        image:
          "https://media.wired.com/photos/636c0be61f24b6f9091f7b6c/master/w_2400,h_1800,c_limit/Roccat-Vulcan-II-Mini-Gear.jpg",
      });
    }
    for (let i = 0; i < items[3].length; i++) {
      const newArticle = await Article.create(items[3][i]);
      await findKeyboard.addArticle(newArticle.id);
      await newArticle.update({ categoryId: findKeyboard.id });
    }

    //CPU fan fill
    let findCpuFan = await Category.findOne({
      where: {
        name: "CPU Fans",
      },
      paranoid: false,
    });
    if (!findCpuFan) {
      findCpuFan = await Category.create({
        name: "CPU Fans",
        image:
          "https://4.imimg.com/data4/UE/AS/MY-5812789/17-cpu-fan-500x500.jpg",
      });
    }
    for (let i = 0; i < items[4].length; i++) {
      const newArticle = await Article.create(items[4][i]);
      await findCpuFan.addArticle(newArticle.id);
      await newArticle.update({ categoryId: findCpuFan.id });
    }

    //Cases fill
    let findCase = await Category.findOne({
      where: {
        name: "Cases",
      },
      paranoid: false,
    });
    if (!findCase) {
      findCase = await Category.create({
        name: "Cases",
        image:
          "https://image.made-in-china.com/2f0j00ScCYTsfyLNqk/Office-Micro-ATX-PC-Case-High-Quality-All-in-One-Computer-Case.jpg",
      });
    }
    for (let i = 0; i < items[5].length; i++) {
      const newArticle = await Article.create(items[5][i]);
      await findCase.addArticle(newArticle.id);
      await newArticle.update({ categoryId: findCase.id });
    }

    //Storage fill
    let findStorage = await Category.findOne({
      where: {
        name: "Storage",
      },
      paranoid: false,
    });
    if (!findStorage) {
      findStorage = await Category.create({
        name: "Storage",
        image:
          "https://acf.geeknetic.es/imagenes/tutoriales/2019/1695-los-mejores-ssd-m2-nvme-sata/1695-los-mejores-ssd-m2-nvme-sata-muestra2.jpg",
      });
    }
    for (let i = 0; i < items[6].length; i++) {
      const newArticle = await Article.create(items[6][i]);
      await findStorage.addArticle(newArticle.id);
      await newArticle.update({ categoryId: findStorage.id });
    }

    //CPU fill
    let findCPU = await Category.findOne({
      where: {
        name: "CPU",
      },
      paranoid: false,
    });
    if (!findCPU) {
      findCPU = await Category.create({
        name: "CPU",
        image:
          "https://salesystems.es/wp-content/uploads/2018/12/hardware-1200x797.jpg",
      });
    }
    for (let i = 0; i < items[7].length; i++) {
      const newArticle = await Article.create(items[7][i]);
      await findCPU.addArticle(newArticle.id);
      await newArticle.update({ categoryId: findCPU.id });
    }

    //GPU fill
    let findGPU = await Category.findOne({
      where: {
        name: "GPU",
      },
      paranoid: false,
    });
    if (!findGPU) {
      findGPU = await Category.create({
        name: "GPU",
        image:
          "https://www.hardwaretimes.com/wp-content/uploads/2020/01/14-487-488-V01.jpg",
      });
    }
    for (let i = 0; i < items[8].length; i++) {
      const newArticle = await Article.create(items[8][i]);
      await findGPU.addArticle(newArticle.id);
      await newArticle.update({
        categoryId: findGPU.id,
      });
    }

    //Motherboard fill
    let findMB = await Category.findOne({
      where: {
        name: "Motherboards",
      },
      paranoid: false,
    });
    if (!findMB) {
      findMB = await Category.create({
        name: "Motherboards",
        image:
          "https://mexx-img-2019.s3.amazonaws.com/placa-madre-msi-b660m-ddr4_42388_4.jpeg",
      });
    }
    for (let i = 0; i < items[9].length; i++) {
      const newArticle = await Article.create(items[9][i]);
      await findMB.addArticle(newArticle.id);
      await newArticle.update({
        categoryId: findMB.id,
      });
    }

    return res.status(200).json({ message: "Paso algo OwO" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = {
  getAll,
  getOne,
  createItem,
  updateItem,
  deleteItem,
  restoreItem,
  populateDb,
  createReview,
};
