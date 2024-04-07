const { z } = require('zod');

// Define the schema for order validation
const orderSchema = z.object({
    user_id: z.string(),
    products: z.record(z.number().positive()), // keys are product id and value is the quantity
    payment_info: z.string()
});

module.exports = orderSchema;
