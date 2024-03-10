const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/', userController.createUser);
router.get('/', authenticateToken, userController.getAllUsers);
router.get('/:id', userController.getUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
