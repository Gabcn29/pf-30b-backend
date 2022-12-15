const nodemailer = require("nodemailer");
const { VERIFICATION_TOKEN_MAILER, EMAIL } = process.env;

const createTransp = () =>{
  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: `${EMAIL}`,
      pass: `${VERIFICATION_TOKEN_MAILER}`
    }
  });
  return transport
}

const sendMail = async (userEmail, userName, itemsComprados) =>{
    const transport = createTransp()
    let list = ""
    for (let i = 0; i < itemsComprados.length; i++) {
      if(i === itemsComprados.length - 1 ){
        list += "y " +  `<b>${itemsComprados[i].title}</b>` + ` por $${itemsComprados[i].price}` + ", "
      }else{
        list += `<b>${itemsComprados[i].title}</b>` + ` por $${itemsComprados[i].price}` + ", "
      }
    }
    const info = await transport.sendMail({
      from: '"Compra exitosa" <nicosilvaa97@gmail.com>', // sender address
      to: `${userEmail}`, // list of receivers
      subject: ` ${userName} tu compra ha sido procesada correctamente ✔`, // Subject line
      html: `
      <h3 style="text-align:center">
        <span style="text-align:center; color:#492DBF">TechComponents</span>
      </h3>
      <div style="margin:10px 50px 10px 50px">
        <div style="margin:10px 50px 10px 50px">
            <p>Su compra de ${list} fue procesada correctamente, si quíeres hacer el seguimiento de tu compra, puedes hacerlo a travez de este link: <a href="#">seguitupaquete.com</a></p>
        </div>
        <div style="margin:10px 50px 10px 50px">
          <p>Si quíeres ver tu historial de compras puedes ir a tu perfil en:  <a href="https://ecommerce-frontend-30b.vercel.app/">TiendaTech.com</a></p>
        </div>
        <p style="margin:10px 50px 10px 50px">Gracias por confiar en nosotros, esperamos disfrutes tu compra</p>
      </div>
      `, // html body
    });
    console.log("Envio correctamente %s", info.messageId)

    return 
}
module.exports = {createTransp, sendMail}
