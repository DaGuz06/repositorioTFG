"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chef_controller_1 = require("../controllers/chef.controller");
const router = (0, express_1.Router)();
router.get('/', chef_controller_1.getChefs);
router.get('/:id', chef_controller_1.getChefById);
router.post('/profile', chef_controller_1.createProfile);
exports.default = router;
