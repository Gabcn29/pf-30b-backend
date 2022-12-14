require("dotenv").config();
const { Factura, User, Article, Billitems } = require("../db.js");
const { METAMASK_API_TOKEN } = process.env;

const createOrder = async (req, res) => {
  const { carro, txHash, email } = req.body;

  const newItem = await Factura.create({ transaction_id: txHash, total: carro.reduce((a, b) => a + b.price * b.quantity, 0), payment_status: "pending", payment_method: "MetaMask" });
  const comprador = await User.findOne({ where: { email: email } });
  await comprador.addFactura(newItem.id);
  await newItem.setUser(comprador.id);

  for (let i = 0; i < carro.length; i++) {
    await newItem.addArticle(carro[i].id, { through: { quantity: carro[i].quantity } });
  }

  const compra = await Factura.findOne({ where: { transaction_id: txHash }, include: Article });
  res.status(200).json(compra);
};

const checkPurchase = async (req, res) => {
  const factura = await Factura.findByPk(req.params.id, { include: Article });

  if (factura && factura.payment_method === "MetaMask" && factura.payment_status === "pending")
    await fetch(`https://api-goerli.etherscan.io/api?module=transaction&action=gettxreceiptstatus&txhash=${factura.transaction_id}&apikey=${METAMASK_API_TOKEN}`, { method: "GET" })
      .then((data) => data.json())
      .then(async (answer) => {
        res.status(200).json({ answer, factura, estado: factura.payment_status });
        if (answer.result.status === "1" && !factura.stockChanged) {
          await factura.update({ stockChanged: true });
          for (let i = 0; i < factura.articles.length; i++) {
            const articulo = await Article.findByPk(factura.articles[i].id);
            await articulo.update({ stock: articulo.stock - factura.articles[i].billitems.quantity });
          }
        }
        if (answer.result.status === "1") factura.update({ payment_status: "approved" });
      });
  else if (factura.payment_status === "approved") {
    res.status(200).json({ result: { status: "1" }, factura, estado: factura.payment_status });
  } else res.status(500).json({ error: "tu factura no existe o es de mercado pago y estas revisando metamask" });
};

module.exports = {
  createOrder,
  checkPurchase,
};
