const express = require('express'); 
const router = express.Router(); 
const cors = require('cors'); 
const { genKey } = require('./hooks/randNum.js')
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SK);

router.get("/", (req, res, next) => {
    res.send('Hello, world!')
})

router.post("/create_payment", cors(), async (req, res, next)=>{
    const { order, customer } = req.body;
    try {
        var line_items = order.map(item => {
            return {
                quantity: item.quantity, 
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.name,
                        description: item.description, 
                    },
                    unit_amount: item.price * 100,
                } 
            }
        })
        const session = await stripe.checkout.sessions.create({
            customer_email: customer.email, 
            payment_method_types: ["card"],
            currency: "usd", 
            line_items,
            mode: "payment",
            success_url: "http://localhost:3000/order_summary",
        });
        console.log("Order is successful")
        res.status(200).json({ message: "Order is confirmed."});
    } catch (e) {
        console.log("Payment error: ", e.message)
        res.status(500).json({error: e.message})
    }
})

module.exports = router; 