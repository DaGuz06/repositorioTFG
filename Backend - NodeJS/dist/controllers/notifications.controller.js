"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessages = void 0;
const sendMessages = (notification) => __awaiter(void 0, void 0, void 0, function* () {
    const accountSid = 'AC69d68dcbd0da567875b8ea5e8abf4cd8';
    const authToken = 'edad43fbfa888c63174c183215df626a';
    const client = require('twilio')(accountSid, authToken);
    const bodyMessage = `${notification.body}. ${notification.title}`;
    const phoneNumber = notification.user.phone;
    client.messages
        .create({
        body: bodyMessage,
        from: "whatsapp:+14155238886",
        to: `whatsapp:${phoneNumber}`
    })
        .then((message) => console.log("oki", message.sid));
    client.verify.v2.services("VA57b21076eb8c2b8d6a19f1579396c961")
        .verifications
        .create({ to: `whatsapp:${phoneNumber}`, channel: 'sms' })
        .then((verification) => console.log(verification.sid));
});
exports.sendMessages = sendMessages;
