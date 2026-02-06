//Se terminará de perfeccionar en la siguiente entrega, no está perfeccionado.

export const sendMessages = async (notification: any) => {
  const accountSid = "AC69d68dcbd0da567875b8ea5e8abf4cd8";
  const authToken = "edad43fbfa888c63174c183215df626a";
  const client = require("twilio")(accountSid, authToken);

  const bodyMessage = `${notification.body}. ${notification.title}`;
  const phoneNumber = notification.user.phone;

  function enviarMensaje(sender, message) {
    return new Promise((resolve, reject) => {
      client.messages
        .create({
          from: "whatsapp:+14155238886",
          body: bodyMessage,
          to: `whatsapp:+` + sender,
        })
        .then((message: any) => resolve())
        .catch((error: any) => reject(error));
    });
  }
  enviarMensaje("+34", "Esto funciona"); //Colocar número de tlf al que se quiere recibir el mensaje.

  client.verify.v2
    .services("VA57b21076eb8c2b8d6a19f1579396c961")
    .verifications.create({ to: `whatsapp:${phoneNumber}`, channel: "sms" })
    .then((verification: any) => console.log(verification.sid));
};

