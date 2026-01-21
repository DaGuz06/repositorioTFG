import { sendMessages } from "./controllers/notifications.controller";

// Simulación de datos de notificación (como vendrían de otra parte del sistema)
const mockNotification = {
  title: "Prueba de Integración",
  body: "Este es un mensaje enviado usando la función sendMessages importada.",
  user: {
    phone: "+34695671661", // Tu número de prueba
  },
};

console.log("Iniciando prueba de integración...");

sendMessages(mockNotification)
  .then(() => console.log("Prueba finalizada. Revisa si llegó el mensaje."))
  .catch((error) => console.error("La prueba falló:", error));
