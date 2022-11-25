const { Article, Category } = require("../db.js");

const rellenarBase = async (req, res) => {
  await fetch("https://api.escuelajs.co/api/v1/products", {
    method: "GET",
  })
    .then((data) => data.json())
    .then(async (answer) => {
      console.log(answer.length);
      for (let i = 0; i < answer.length; i++) {
        const newItem = await Article.create({
          title: answer[i].title,
          images: answer[i].images,
          price: answer[i].price,
          description: answer[i].description,
          stock: Math.floor(Math.random() * 100),
          categoryId: null,
        });

        const checkCategory = await Category.findByPk(answer[i].category.id);
        if (!checkCategory) {
          const newCategory = await Category.create({ ...answer[i].category });
          await newCategory.addArticle(newItem.id);
          await Article.update(
            { categoryId: newCategory.id },
            { where: { id: newItem.id } }
          );
        } else {
          await checkCategory.addArticle(newItem.id);
          await Article.update(
            { categoryId: checkCategory.id },
            { where: { id: newItem.id } }
          );
        }
      }
    })
    .then(async () => {
      const list = await Article.findAll({ include: Category });
      return res.status(200).json(list);
    });
};

module.exports = {
  rellenarBase,
};
