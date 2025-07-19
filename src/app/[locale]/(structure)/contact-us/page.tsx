'use client'
import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, User, MessageSquare } from 'lucide-react';
import { FaPhone } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaClock } from "react-icons/fa6";
import { LuHotel } from "react-icons/lu";


interface ContactInfo {
  icon: any;
  title: string;
  details: string[];
  color: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactInfo: ContactInfo[] = [
    {
      icon: <FaPhone size={54} className='text-highlights'/>,
      title: 'Phone Number',
      details: ['+91 80004 36640', '888-012-3567 (Toll Free)'],
      color: 'text-accent',
    },
    {
      icon: <MdEmail size={54} className='text-highlights'/>,
      title: 'Email Address',
      details: ['info@expertwebdesigning.com', 'sales@expertwebdesigning.com'],
      color: 'text-primary',
    },
    {
      icon: <FaMapMarkerAlt size={54} className='text-highlights'/>,
      title: 'Our Location',
      details: ['518, Rhythm Plaza, Amar Javan Circle,', 'Nikol, Ahmedabad, Gujarat – 382350'],
      color: 'text-accent',
    },
    {
      icon: <FaClock size={54} className='text-highlights'/>,
      title: 'Working Hours',
      details: ['Monday To Saturday', '09:00 AM To 06:00 PM'],
      color: 'text-primary',
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

  

    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      message: '',
    });

    setIsSubmitting(false);
  };

  return (
      <div className="relative isolate bg-[url('/assets/image-9.avif')] bg-no-repeat bg-center bg-cover overflow-auto font-montserrat">
      {/* Header Section */}
      <div>
        <div className="flex flex-col px-4 text-center items-center justify-center  lg:mb-14 bg-highlights h:96 lg:h-60 pt-40 pb-16  lg:pt-16 rounded-b-3xl text-white opacity-90">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 font-playfair ">Get In Touch With Us</h1>
          <p className="text-base md:text-lg opacity-90 max-w-4xl mx-auto">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </div>

      <div className=" mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
          

            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="shadow-sm hover:shadow-lg bg-white rounded-xl transition-all duration-300 border-0  opacity-90">
                  <div className="p-6 h-72 flex justify-center items-center">
                    <div className="flex flex-col gap-4 text-center items-center justify-center">
                      
                      {info.icon}
                      
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-800 mb-2 font-playfair uppercase font-bold">{info.title}</h3>
                        {info.details.map((detail, idx) => (
                          <p key={idx} className=" text-gray-500">
                            {detail}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-100 rounded-2xl lg:p-8 shadow-sm  opacity-90">
            <div className="bg-highlights backdrop-blur-sm rounded-xl p-8">
              <h2 className="text-3xl font-bold text-white mb-6 font-playfair">Send Us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium text-white">
                      First Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-white" />
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="pl-10 h-12 w-full rounded-lg"
                        placeholder="Enter your first name"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium text-white">
                      Last Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-white" />
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="pl-10 h-12 w-full rounded-lg"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium text-white">
                      Company
                    </label>
                    <div className="relative">
                      <LuHotel className="absolute left-3 top-3 h-4 w-4 text-muted-white" />
                      <input
                        id="phone"
                        name="phone"
                        type="text"
                        //required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="pl-10 h-12 w-full rounded-lg"
                        placeholder="Enter your company name"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-white">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-white" />
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10 h-12 w-full rounded-lg"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-white">
                    Message *
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-white" />
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="pl-10 pt-3 resize-none w-full rounded-lg"
                      placeholder="Tell us about your project or ask us anything..."
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 text-lg font-semibold bg-primary hover:bg-secondary transition-colors duration-200 text-gray-200 flex text-center justify-center items-center"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-primary-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 ">
                      <Send className="h-5 w-5" />
                      <span>Send Message</span>
                    </div>
                  )}
                </button>
              </form>

              <p className="text-xs text-white mt-4 text-center ">
                * Required fields. We respect your privacy and will never share your information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;