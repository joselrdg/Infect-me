const nodemailer =require("nodemailer");

let transporter = nodemailer.createTransport({
    service:'Gmail',
    auth: {
        user: process.env.NN_USER,
        pass: process.env.NN_PWD
    }
});


module.exports.sendMail = (email,token) => {
    transporter.sendMail({
        from: `"Infect-me " <${process.env.NN_USER}>`,
        to:email,
        subject:`Confirmación alta de servicio`,
        text:`Confirma el alta en el servicio`,
        html:`
        <h1> Confirmación de alta</h1>
        <b>Por favor confirma el alta en el servicio Infect-me</b>
        <a href="${process.env.HOST || `http://localhost:${process.env.PORT || 3000}`}/activate/${token}">Click Here </a>
        `
        
    })
    .then(info => console.log(info))
    .catch(error => console.log(error))
};

module.exports.sendMailFriend = (userName,email,token) => {
    transporter.sendMail({
        from: `"Infect-me " <${process.env.NN_USER}>`,
        to:email,
        subject:`Confirmación solicitud de amistad`,
        text:`confirma la solicitud de amistad`,
        html:`
        <h1> Confirmacion de solicitud de amistad</h1>
        <b>Has recibido una solicitud de amistad de ${userName} </b>
        <a href="${process.env.HOST || `http://localhost:${process.env.PORT || 3000}`}/dashboard/activate/${token}">Click Here </a>
        `
        
        
    })
    .then(info => console.log(info))
    .catch(error => console.log(error))
};

