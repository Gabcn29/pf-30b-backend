const { User, Article, Cartitems, Wishlist } = require("../db.js");

const getCart = async (req, res) => {
  try {
    const { user } = req.body;
    const usuario = await User.findOne({
      where: { email: user.email },
      include: [
        {
          model: Article,
          through: { model: Cartitems, attributes: ["quantity"], as: "itemEnCarro" },
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
