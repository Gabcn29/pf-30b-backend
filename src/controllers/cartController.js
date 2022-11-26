const { User, Article, Cartitems } = require("../db.js");

const getCart = async (req, res) => {
  const { user } = req.body;
  const usuario = await User.findOne({ where: { email: user.email }, include: Article });
  return res.status(200).json(usuario);
};

const updateCart = async (req, res) => {
  const { user, carro } = req.body;

  const usuario = await User.findOne({ where: { email: user.email }, include: Article });
  await usuario.setArticles([]);
  //esta verga de sequelize tiene la peor documentacion de la historia, no tengo la menor idea como relacionar un array salvo de hacerlo 1 por 1. Reitero Sequelize <MongoDB
  //Explica que es addArticleS con S para arrays, pero no explica como cambiar la propiedad de quantity por ningun lado, literalmente le chupa 3 bolas, mongo te lo deja hacer recontra sencillo, y si pones el array en quantity aca te toma las comas del array como decimales
  if (carro.length > 0)
    await Cartitems.bulkCreate(
      carro.map((x) => {
        return { userId: usuario.id, articleId: x.id, quantity: x.quantity };
      })
    );

  const updatedUser = await User.findOne({ where: { email: user.email }, include: Article });
  return res.status(200).json(updatedUser);
};

module.exports = {
  updateCart,
  getCart,
};
