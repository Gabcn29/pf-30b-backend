const mercadopago = require("mercadopago");
require("dotenv").config();
const { MP_ACCESS_TOKEN } = process.env;

mercadopago.configure({
  access_token: MP_ACCESS_TOKEN,
});

const createOrder = async (req, res) => {
  let preference = {
    items: [],
    auto_return: "approved",
    external_reference: req.body.user.email,
    back_urls: {
      success: "http://localhost:3000/successBuy",
      pending: "http://localhost:3000/pending",
      failure: "http://localhost:3000/cart",
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
};

module.exports = {
  createOrder,
};
