const axios = require('axios');
const crypto = require('crypto');

const PAYSTACK_BASE_URL = 'https://api.paystack.co';
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

// Create axios instance for Paystack
const paystackClient = axios.create({
  baseURL: PAYSTACK_BASE_URL,
  headers: {
    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json',
  },
});

// Initialize payment transaction
exports.initializePayment = async (data) => {
  try {
    const response = await paystackClient.post('/transaction/initialize', {
      email: data.email,
      amount: data.amount, // Amount in kobo (NGN) or cents
      reference: data.reference,
      currency: data.currency || 'NGN',
      callback_url: data.callback_url,
      metadata: data.metadata || {},
      channels: data.channels || ['card', 'bank', 'ussd', 'qr', 'mobile_money'],
    });

    return response.data;
  } catch (error) {
    console.error('Paystack Initialization Error:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 
      'Payment initialization failed'
    );
  }
};

// Verify payment transaction
exports.verifyPayment = async (reference) => {
  try {
    const response = await paystackClient.get(`/transaction/verify/${reference}`);
    
    return response.data;
  } catch (error) {
    console.error('Paystack Verification Error:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 
      'Payment verification failed'
    );
  }
};

// Get transaction details
exports.getTransaction = async (transactionId) => {
  try {
    const response = await paystackClient.get(`/transaction/${transactionId}`);
    
    return response.data;
  } catch (error) {
    console.error('Paystack Transaction Fetch Error:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 
      'Failed to fetch transaction details'
    );
  }
};

// List transactions for a customer
exports.listTransactions = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams({
      perPage: params.perPage || 50,
      page: params.page || 1,
      ...(params.customer && { customer: params.customer }),
      ...(params.status && { status: params.status }),
      ...(params.from && { from: params.from }),
      ...(params.to && { to: params.to }),
    });

    const response = await paystackClient.get(`/transaction?${queryParams}`);
    
    return response.data;
  } catch (error) {
    console.error('Paystack List Transactions Error:', error.response?.data || error.message);
    throw new Error('Failed to list transactions');
  }
};

// Charge authorization (for saved cards)
exports.chargeAuthorization = async (data) => {
  try {
    const response = await paystackClient.post('/transaction/charge_authorization', {
      email: data.email,
      amount: data.amount,
      authorization_code: data.authorizationCode,
      reference: data.reference,
      currency: data.currency || 'NGN',
      metadata: data.metadata || {},
    });

    return response.data;
  } catch (error) {
    console.error('Paystack Charge Authorization Error:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 
      'Charge authorization failed'
    );
  }
};

// Verify webhook signature
exports.verifyWebhookSignature = (payload, signature) => {
  const hash = crypto
    .createHmac('sha512', PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  return hash === signature;
};

// Create refund
exports.createRefund = async (reference, amount) => {
  try {
    const response = await paystackClient.post('/refund', {
      transaction: reference,
      amount, // Optional: partial refund
    });

    return response.data;
  } catch (error) {
    console.error('Paystack Refund Error:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 
      'Refund failed'
    );
  }
};

// Create customer
exports.createCustomer = async (data) => {
  try {
    const response = await paystackClient.post('/customer', {
      email: data.email,
      first_name: data.firstName,
      last_name: data.lastName,
      phone: data.phone,
      metadata: data.metadata || {},
    });

    return response.data;
  } catch (error) {
    console.error('Paystack Create Customer Error:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 
      'Customer creation failed'
    );
  }
};

// Get customer
exports.getCustomer = async (emailOrCode) => {
  try {
    const response = await paystackClient.get(`/customer/${emailOrCode}`);
    
    return response.data;
  } catch (error) {
    console.error('Paystack Get Customer Error:', error.response?.data || error.message);
    throw new Error('Failed to fetch customer details');
  }
};

module.exports = exports;
