const Stripe = require("stripe");
const { startSession } = require("../../models/user-model");

module.exports.getPaymentFromUser = async function (req) {
    const {amount, plan} = req.body
 try {
    
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [{
           price_data: {
            currency: 'pkr',
            product_data: {name: `${plan.toUpperCase()} Membership`},
            unit_amount: amount * 100
         },
         quantity: 1
                }],
  success_url: 'http://localhost:3000',
  cancel_url: 'http://localhost:3000/profile'
        });

 return [session.url];
 } catch (err) {
  throw err;
 }
}

