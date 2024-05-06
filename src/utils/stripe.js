const stripe = require('stripe')(process.env.STRIPE_TEST_SK)


const createCustomer = async (email, name, phone)=>{
  try{
  const customer = await stripe.customers.create({
    email,
    name,
    phone
  })
  return customer
}catch(e){}
}

const retrieveCustomer = async (id) => {
try{
  const customer = await stripe.customers.retrieve(id)
  return customer
}catch(e){}
}


const updateCustomer = async (id, data) => {    
  try{
    const customer = await stripe.customers.update(id,data)
    return customer
  }catch(e){}
}

const deleteCustomer = async(id) => {
  try{

const deleted = await stripe.customers.del(id);
return deleted
  }catch(e){

  }
}

const createPaymentIntent = async (amount, currency) => {
try{
const paymentIntent = await stripe.paymentIntents.create({
  amount,
  currency,
  automatic_payment_methods: {
    enabled: true,
  },
});
return paymentIntent
}catch(e){
console.log(e)
}
}

const retrievePaymentIntent = async (id) => {
  try{
      console.log(id)
const paymentIntent = await stripe.paymentIntents.retrieve(id);

return paymentIntent
  }catch(e){
    console.log(e)
  }
}


module.exports = {
  createCustomer,
  retrieveCustomer,
  updateCustomer,
  deleteCustomer,
  createPaymentIntent,
  retrievePaymentIntent
}