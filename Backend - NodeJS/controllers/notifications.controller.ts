const accountSid = 'AC69d68dcbd0da567875b8ea5e8abf4cd8';
const authToken = 'edad43fbfa888c63174c183215df626a';
const client = require('twilio')(accountSid, authToken);

// Helper function to send WhatsApp messages
function enviarMensaje(sender: string, message: string): Promise<any> {
    return client.messages.create({
        from: "whatsapp:+14155238886",
        body: message,
        to: `whatsapp:${sender.startsWith('+') ? sender : '+' + sender}`
    });
}

export const sendMessages = async (notification: any) => {
    const bodyMessage = `${notification.body}. ${notification.title}`;
    const phoneNumber = notification.user.phone;

    try {
        // Enviar mensaje de WhatsApp
        await enviarMensaje(phoneNumber, bodyMessage);
        
        console.log("Mensaje de WhatsApp enviado correctamente");

    } catch (error) {
        console.error("Error enviando mensaje de WhatsApp:", error);
    }

};
