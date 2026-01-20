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
const createTableQuery = `
CREATE TABLE IF NOT EXISTS chef_profiles (
  user_id INT PRIMARY KEY,
  specialties TEXT,
  work_zone VARCHAR(255),
  has_vehicle TINYINT DEFAULT 0,
  bio TEXT,
  rating DECIMAL(3,1) DEFAULT 5.0,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`;
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_1.promisePool.query(createTableQuery);
        console.log('Table chef_profiles created successfully or already exists.');
        process.exit(0);
    }
    catch (err) {
        console.error('Error creating table:', err);
        process.exit(1);
    }
});
run();
