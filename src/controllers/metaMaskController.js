require("dotenv").config();
const { Factura, User, Article } = require("../db.js");
const { METAMASK_API_TOKEN } = process.env;

const createOrder = async (req, res) => {
  const { carro, txHash, email } = req.body;

  const newItem = await Factura.create({ transaction_id: txHash, total: carro.reduce((a, b) => a + b.price * b.quantity, 0), payment_status: "pending", payment_method: "MetaMask" });
  const comprador = await User.findOne({ where: { email: email } });
  await comprador.addFactura(newItem.id);
  await newItem.setUser(comprador.id);
  let array = [];
  for (let i = 0; i < carro.length; i++) {
    await newItem.addArticle(carro[i].id);
    array.push(carro[i].quantity);
  }
  await Factura.update({ quantity: array }, { where: { id: newItem.id } });
  const compra = await Factura.findOne({ where: { transaction_id: txHash }, include: Article });
  res.status(200).json(compra);
};

const checkPurchase = async (req, res) => {
  const factura = await Factura.findByPk(req.params.id);

  if (factura && factura.payment_method === "MetaMask")
    await fetch(`https://api-goerli.etherscan.io/api?module=transaction&action=gettxreceiptstatus&txhash=${factura.transaction_id}&apikey=${METAMASK_API_TOKEN}`, { method: "GET" })
      .then((data) => data.json())
      .then((answer) => res.status(200).json(answer));
  else res.status(500).json({ error: "Esta factura no existe o no es de metamask" });
};

module.exports = {
  createOrder,
  checkPurchase,
};
