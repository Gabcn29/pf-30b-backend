const { Auth0users } = require("../db.js");

const getAll = async (req, res) => {
  const usuarios = await Auth0users.findAll();
  return res.status(200).json(usuarios);
};

module.exports = {
  getAll,
};
