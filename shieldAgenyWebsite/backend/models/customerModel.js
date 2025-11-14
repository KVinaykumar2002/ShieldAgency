const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, 'Please add a company name'],
    trim: true
  },
  contactPerson: {
    type: String,
    required: [true, 'Please add a contact person name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number'],
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  serviceType: {
    type: String,
    required: [true, 'Please add a service type'],
    trim: true
  },
  contractStartDate: {
    type: Date,
    required: [true, 'Please add a contract start date']
  },
  contractEndDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Pending', 'Terminated'],
    default: 'Active'
  },
  notes: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Customer', CustomerSchema);

