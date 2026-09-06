const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { createOrder, getOrderById } = require('../controllers/orderController');
const { validate } = require('../middleware/validate');

router.post(
  '/',
  [
    body('customerName').trim().notEmpty().withMessage('Customer name is required'),
    body('customerEmail').isEmail().withMessage('A valid email is required'),
    body('shippingAddress').trim().notEmpty().withMessage('Shipping address is required'),
    body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  ],
  validate,
  createOrder
);

router.get('/:id', getOrderById);

module.exports = router;
