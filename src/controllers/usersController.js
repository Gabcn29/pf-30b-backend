const { User, Factura, Article } = require("../db.js");

const getAll = async (req, res) => {
  const usuarios = await User.findAll();
  return res.status(200).json(usuarios);
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
    res.status(200).json({ created: false });
  } else {
    const newItem = await User.create({ nickname, email, password: sub });
    res.status(200).json({ created: true });
  }
};
const getProfile = async (req, res) => {
  const usuario = await User.findByPk(req.params.id, { include: [Factura, Article] });
  return res.status(200).json(usuario);
};

module.exports = {
  getAll,
  getPurchaseHistory,
  checkGoogleFacebook,
  getProfile,
};
