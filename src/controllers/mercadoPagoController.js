const mercadopago = require("mercadopago");
require("dotenv").config();
var request = require("request");
const { MP_ACCESS_TOKEN } = process.env;
const { Factura, User, Article, Billitems } = require("../db.js");
const { sendMail } = require("../config/emailer");

mercadopago.configure({
  access_token: MP_ACCESS_TOKEN,
});

const createOrder = async (req, res) => {
  try {
    let preference = {
      items: [],
      auto_return: "approved",
      external_reference: req.body.user.email,
      back_urls: {
        success: "https://ecommerce-frontend-30b.vercel.app/successBuy",
        pending: "https://ecommerce-frontend-30b.vercel.app/pending",
        failure: "https://ecommerce-frontend-30b.vercel.app/cart",
      },
    };

    req.body.carro.forEach((x) => preference.items.push({ title: x.title, unit_price: parseFloat(x.price), quantity: parseInt(x.quantity), id: x.id }));

    mercadopago.preferences
      .create(preference)
      .then((response) => {
        // En esta instancia deberás asignar el valor dentro de response.body.id por el ID de preferencia solicitado en el siguiente paso
        res.status(200).json({ id: response.body.id });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({ error });
      });
  } catch (e) {
    res.status(500).json(e);
  }
};

const checkPurchase = async (req, res) => {
  try {
    const { id } = req.params;
    if (id === null) {
      res.status(500).json({ estado: "error" });
    } else {
      const a = await request(`https://api.mercadopago.com/v1/payments/${id}/?access_token=${process.env.MP_ACCESS_TOKEN}`, async function (e, r, b) {
        const a = JSON.parse(b);
        const check = await Factura.findOne({ where: { transaction_id: id } });
        if (!check) {
          const newItem = await Factura.create({ transaction_id: id, total: a.transaction_details.total_paid_amount, payment_status: a.status, payment_method: a.payment_method_id });
          const comprador = await User.findOne({ where: { email: a.external_reference } });
          await comprador.addFactura(newItem.id);
          await newItem.setUser(comprador.id);
          for (let i = 0; i < a.additional_info.items.length; i++) {
            await newItem.addArticle(a.additional_info.items[i].id, { through: { quantity: a.additional_info.items[i].quantity } });
          }
        }

        const compra = await Factura.findOne({ where: { transaction_id: id }, include: Article });
        res.status(200).json({ compra, estado: a.status });

        if (compra.payment_status === "approved" && !compra.stockChanged) {
          await compra.update({ stockChanged: true });
          const user = await User.findOne({ where: { email: a.external_reference } });
          // const userRecipent = user.email;
          sendMail(user.email, user.nickname, compra.articles);
          for (let i = 0; i < compra.articles.length; i++) {
            const articulo = await Article.findByPk(compra.articles[i].id);
            await articulo.update({ stock: articulo.stock - compra.articles[i].billitems.quantity });
          }
        }
      });
    }
  } catch (e) {
    res.status(500).json(e);
  }
};

module.exports = {
  createOrder,
  checkPurchase,
};
