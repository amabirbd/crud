const express = require('express');
const app = express();
const { nanoid } = require('nanoid');
const PORT = process.env.PORT || 3000;
const orderSchema = require('./orderSchema');
const morgan = require('morgan');


// Middleware to log incoming requests
app.use(morgan('dev'));

// Middleware to parse JSON bodies
app.use(express.json());

// Dummy data to simulate orders
let orders = [];

// Function to validate order data
const validateOrderData = (data) => {
    try {
        orderSchema.parse(data);
        return true;
    } catch (error) {
        return false;
    }
}

// Function to generate a unique ID for orders
const generateOrderId = () => {
    return nanoid(8);
}
// GET endpoint to fetch all orders
app.get('/orders', (req, res) => {
    try {
        res.json(orders);
    } catch (error) {
        console.error('Error while processing GET request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST endpoint to create a new order
app.post('/orders', (req, res) => {
    try {
        const data = req.body;
        if (!validateOrderData(data)) {
            return res.status(400).json({ error: 'Incomplete order data' });
        }

        // Generate unique ID for the order
        const orderId = generateOrderId();
        
        // Add order to the list with the generated ID
        const newOrder = { id: orderId, ...data };
        orders.push(newOrder);
        res.status(201).json({ message: 'Order created successfully', orderId });
    } catch (error) {
        console.error('Error while processing POST request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET endpoint to fetch a specific order by its ID
app.get('/orders/:order_id', (req, res) => {
    try {
        const orderId = req.params.order_id;

        // Find the order by its ID
        const order = orders.find(order => order.id === orderId);

        // Check if the order exists
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Return the order
        res.json(order);
    } catch (error) {
        console.error('Error while processing GET request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT endpoint to update an existing order by its ID
app.put('/orders/:order_id', (req, res) => {
    try {
        const orderId = req.params.order_id;
        const data = req.body;
        if (!validateOrderData(data)) {
            return res.status(400).json({ error: 'Incomplete order data' });
        }

        // Find the index of the order by its ID
        const orderIndex = orders.findIndex(order => order.id === orderId);

        // Check if the order exists
        if (orderIndex === -1) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Update order data
        orders[orderIndex] = { id: orderId, ...data };
        res.json({ message: 'Order updated successfully' });
    } catch (error) {
        console.error('Error while processing PUT request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PATCH endpoint to partially update an existing order by its ID
app.patch('/orders/:order_id', (req, res) => {
    try {
        const orderId = req.params.order_id;
        const data = req.body;

        // Check if data is provided for update
        if (!data) {
            return res.status(400).json({ error: 'No data provided for update' });
        }

        // Find the index of the order by its ID
        const orderIndex = orders.findIndex(order => order.id === orderId);

        // Check if the order exists
        if (orderIndex === -1) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Partially update order data
        Object.assign(orders[orderIndex], data);
        res.json({ message: 'Order partially updated successfully' });
    } catch (error) {
        console.error('Error while processing PATCH request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE endpoint to delete an existing order by its ID
app.delete('/orders/:order_id', (req, res) => {
    try {
        const orderId = req.params.order_id;

        // Find the index of the order by its ID
        const orderIndex = orders.findIndex(order => order.id === orderId);

        // Check if the order exists
        if (orderIndex === -1) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Delete the order
        orders.splice(orderIndex, 1);
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Error while processing DELETE request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});