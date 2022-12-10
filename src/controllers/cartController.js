const { User, Article, Cartitems } = require("../db.js");

const getCart = async (req, res) => {
  try {
    const { user } = req.body;
    const usuario = await User.findOne({
      where: { email: user.email },
      include: [
        {
          model: Article,
          through: Cartitems, // This specifies that you want to include the articles in the user's cart
        },
      ],
    });
    return res.status(200).json(usuario);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

const updateCart = async (req, res) => {
  try {
    const { user, carro } = req.body;

    const usuario = await User.findOne({ where: { email: user.email }, include: Article });

    await Cartitems.destroy({ where: { userId: usuario.id } });
    //esta verga de sequelize tiene la peor documentacion de la historia, no tengo la menor idea como relacionar un array salvo de hacerlo 1 por 1. Reitero Sequelize <MongoDB
    //Explica que es addArticleS con S para arrays, pero no explica como cambiar la propiedad de quantity por ningun lado, literalmente le chupa 3 bolas, mongo te lo deja hacer recontra sencillo, y si pones el array en quantity aca te toma las comas del array como decimales

    if (carro.length > 0) {
      carro.forEach(async (element) => {
        const articulo = await Article.findByPk(element.id);
        await usuario.addArticle(articulo, { through: Cartitems, through: { quantity: element.quantity } });
      });
    }

    return res.status(200).json({ termino: true });
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

module.exports = {
  updateCart,
  getCart,
};
