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
const db_1 = require("./db");
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield db_1.promisePool.query(`
            SELECT COLUMN_TYPE, COLLATION_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'users' 
            AND COLUMN_NAME = 'id' 
            AND TABLE_SCHEMA = 'chef_pro'
        `);
        console.log(JSON.stringify(rows));
        process.exit(0);
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
});
run();
