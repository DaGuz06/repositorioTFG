import { sendMessages } from './controllers/notifications.controller';

// Simulación de datos de notificación (como vendrían de otra parte del sistema)
const mockNotification = {
    title: "Mensaje Citación",
    body: "Vinicius balon de oro", //Crear mensaje con variables fecha, lugar, hora, etc
    user: {
        phone: "+34695671661" // Aqui hay que poner la variable numero, si no existe hay que crearla
    }
};

console.log("Iniciando prueba de integración...");

sendMessages(mockNotification)
    .then(() => console.log("Prueba finalizada."))
    .catch((error) => console.error("La prueba falló:", error));
