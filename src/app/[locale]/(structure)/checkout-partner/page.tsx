'use client'
import React, { useState } from 'react';
import { ChevronRight, Check, Mail, Lock, User, MapPin, Phone, Building, CreditCard, Calendar, Shield } from 'lucide-react';

interface FormData {
  // Step 1: Auth
  email: string;
  password: string;
  confirmPassword: string;
  
  // Step 2: Information
  businessName: string;
  contactName: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
  phoneNumber: string;
  businessType: string;
  
  // Step 3: Payment
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

const PartnerRegistrationCheckout: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    contactName: '',
    address: '',
    city: '',
    zipCode: '',
    country: '',
    phoneNumber: '',
    businessType: 'hotel',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  const steps = [
    { id: 1, title: 'Account Setup', icon: User },
    { id: 2, title: 'Business Information', icon: Building },
    { id: 3, title: 'Payment Details', icon: CreditCard }
  ];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Registration submitted:', formData);
    alert('Registration completed successfully!');
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.email && formData.password && formData.confirmPassword && formData.password === formData.confirmPassword);
      case 2:
        return !!(formData.businessName && formData.contactName && formData.address && formData.city && formData.phoneNumber);
      case 3:
        return !!(formData.cardNumber && formData.expiryDate && formData.cvv && formData.cardholderName);
      default:
        return false;
    }
  };

  return (
    <div >
       <div className="flex  items-center justify-center mb-10 lg:mb-14  h-56 pt-16 rounded-b-3xl bg-[url('/profile.avif')] bg-no-repeat bg-center bg-cover">
              
        <div className="text-2xl font-bold md:text-3xl md:leading-tight text-white dark:text-neutral-200 font-playfair uppercase">
         <h2>Partner Registration</h2> 
        </div>
       
      </div>
      <div className="max-w-7xl mx-auto mb-8">
        {/* Header */}
        <div className="text-center mb-8">
        
          <p className="text-gray-600">Join our platform and start growing your business</p>
        </div>

        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                      isCompleted 
                        ? 'bg-accent border-accent text-white' 
                        : isActive 
                        ? 'bg-black border-black text-white' 
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}>
                      {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                    </div>
                    <div className="mt-2 text-center">
                      <p className={`text-sm font-medium ${isActive ? 'text-black' : 'text-gray-500'}`}>
                        {step.title}
                      </p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 ml-4 ${isCompleted ? 'bg-accent' : 'bg-gray-300'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
            {/* Form Section */}
            <div className="lg:col-span-2 p-8">
              {/* Step 1: Account Setup */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="bg-black text-white p-4 rounded-lg">
                    <h2 className="text-xl font-bold mb-2 font-playfair">1. Account Setup</h2>
                    <p className="text-gray-200">Create your partner account credentials</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-transparent"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="password"
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-transparent"
                          placeholder="Create a password"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-transparent"
                          placeholder="Confirm your password"
                        />
                      </div>
                      {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Business Information */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="bg-black text-white p-4 rounded-lg">
                    <h2 className="text-xl font-bold mb-2 font-playfair">2. Business Information</h2>
                    <p className="text-gray-200">Tell us about your business</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
                      <select
                        value={formData.businessType}
                        onChange={(e) => handleInputChange('businessType', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-transparent "
                      >
                        <option value="hotel hover:bg-accent">Hotel</option>
                        <option value="restaurant">Restaurant</option>
                        <option value="restaurant-hotel">Hotel & Restaurant</option>
                        <option value="cafe">Cafe</option>
                        <option value="bar">Bar</option>
                        <option value="cafe-restaurant">Cafe & Restaurant</option>
                      </select>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                      <div className="relative">
                        <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.businessName}
                          onChange={(e) => handleInputChange('businessName', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-transparent"
                          placeholder="Enter business name"
                        />
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.contactName}
                          onChange={(e) => handleInputChange('contactName', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-transparent"
                          placeholder="Enter contact person name"
                        />
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-transparent"
                          placeholder="Enter business address"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-transparent"
                        placeholder="City"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                      <input
                        type="text"
                        value={formData.zipCode}
                        onChange={(e) => handleInputChange('zipCode', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-transparent"
                        placeholder="ZIP Code"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                      <input
                        type="text"
                        value={formData.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-transparent"
                        placeholder="Country"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="tel"
                          value={formData.phoneNumber}
                          onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-transparent"
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Payment Details */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="bg-black text-white p-4 rounded-lg">
                    <h2 className="text-xl font-bold mb-2">3. Payment Details</h2>
                    <p className="text-gray-200">Secure payment information</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                      <input
                        type="text"
                        value={formData.cardholderName}
                        onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-transparent"
                        placeholder="Name on card"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.cardNumber}
                          onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-transparent"
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            value={formData.expiryDate}
                            onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-transparent"
                            placeholder="MM/YY"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                        <div className="relative">
                          <Shield className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            value={formData.cvv}
                            onChange={(e) => handleInputChange('cvv', e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-transparent"
                            placeholder="123"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t">
                {currentStep > 1 && (
                  <button
                    onClick={handlePrevStep}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </button>
                )}
                
                <div className="ml-auto">
                  {currentStep < 3 ? (
                    <button
                      onClick={handleNextStep}
                      disabled={!isStepValid(currentStep)}
                      className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                      Continue
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={!isStepValid(currentStep)}
                      className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      Complete Registration
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Summary Section */}
            <div className="bg-gray-50 p-8 border-l">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 font-playfair">Registration Summary</h3>
              
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-900 font-playfair">Partner Registration</span>
                    <span className="text-sm font-semibold text-gray-900">$99.00</span>
                  </div>
                  <p className="text-xs text-gray-600">One-time setup fee</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-900 font-playfair">Monthly Subscription</span>
                    <span className="text-sm font-semibold text-gray-900">$29.99</span>
                  </div>
                  <p className="text-xs text-gray-600">First month included</p>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-bold text-lg text-gray-900">$99.00</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-accent rounded-lg">
                <h4 className="text-sm font-medium text-white mb-2">What's included:</h4>
                <ul className="text-xs text-white space-y-1">
                  <li>• Business profile setup</li>
                  <li>• Online booking system</li>
                  <li>• 24/7 customer support</li>
                  <li>• Marketing tools</li>
                  <li>• Analytics dashboard</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerRegistrationCheckout;