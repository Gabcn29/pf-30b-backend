const { Op } = require("sequelize");
const { User, Factura, Article, Cartitems } = require("../db.js");

const getAll = async (req, res) => {
  const usuarios = await User.findAll();
  const deletedUsers = await User.findAll({
    where: {
      [Op.not]: [{ deletedAt: null }],
    },
    paranoid: false,
  });
  return res.status(200).json({usuarios, deletedUsers});
};

const getPurchaseHistory = async (req, res) => {
  const usuario = await User.findByPk(req.params.id, { include: Factura });
  return res.status(200).json(usuario);
};

const checkGoogleFacebook = async (req, res) => {
  const { email, sub, nickname } = req.body;
  const check = await User.findOne({ where: { email: email } });

  //para usuarios de google y facebook auth0 no requiere que tengan usuario, porque los auntehtifica desde facebook o google respectivamente
  //asi que les creo un usuario yo con contraseña sub, que es una combinacion de numeros y letras raras unicas por usuario
  //si la password siendo sub es medio flashero pero no la deshasheas ni a palos, porque para loguearte el back hashea tu password
  //asi que tenes que encontrar una combinacion que haseada de el string de sub

  if (check) {
    res.status(200).json(check);
  } else {
    const newItem = await User.create({ nickname, email, password: sub });
    res.status(200).json(newItem);
  }
};
const getProfile = async (req, res) => {
  const usuario = await User.findByPk(req.params.id, {
    include: [
      Factura,
      {
        model: Article,
        through: { model: Cartitems, attributes: ["quantity"], as: "itemEnCarro" },
      },
    ],
  });
  return res.status(200).json(usuario);
};

const updateProfile = async (req, res) => {
  try {
    const usuario = await User.findByPk(req.params.id);
    await usuario.update(req.body);
    res.status(200).json({ estado: "ok" });
  } catch (e) {
    res.status(500).json(e);
  }
};


const deleteProfile = async (req, res) => {

  try {
    const deletedUser = await User.destroy({
      where: {
        id: req.params.id,
      },
    });

    !deletedUser && res.status(404).send({msg: 'No se pudo eliminar'}) 

    res.send({deletedUser});

  } catch (error) {
    res.status(500).send(error.message);
  }
};

const restoreUser = async (req, res) => {
  const { id } = req.params;
  if (isNaN(id))
    return res.status(400).json({ message: "ID must be a number" });
  try {
    const deletedUser = await User.findOne({
      where: {
        id: id,
        [Op.not]: [{ deletedAt: null }],
      },
      paranoid: false,
    });
    if (deletedUser) {
      await deletedUser.restore();
      return res
        .status(200)
        .json({ message: "Article restored successfully", deletedUser });
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

module.exports = {
  getAll,
  getPurchaseHistory,
  checkGoogleFacebook,
  getProfile,
  updateProfile,
  deleteProfile,
  restoreUser
};
