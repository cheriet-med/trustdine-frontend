"use client"
import React, { useState,useRef, useEffect } from 'react';
import { ChevronRight, Check, Mail, Lock, User, MapPin, Phone, Building, CreditCard, Calendar, Shield, Eye, EyeOff, ArrowDown , ChevronDown, Check as CheckIcon} from 'lucide-react';
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import moment from 'moment';
import MailChecker from "mailchecker";
import validator from "validator";

// Country data with phone codes (unchanged)

const countries = [
  { name: 'Afghanistan', code: 'AF', phoneCode: '+93' },
  { name: 'Albania', code: 'AL', phoneCode: '+355' },
  { name: 'Algeria', code: 'DZ', phoneCode: '+213' },
  { name: 'American Samoa', code: 'AS', phoneCode: '+1-684' },
  { name: 'Andorra', code: 'AD', phoneCode: '+376' },
  { name: 'Angola', code: 'AO', phoneCode: '+244' },
  { name: 'Anguilla', code: 'AI', phoneCode: '+1-264' },
  { name: 'Antarctica', code: 'AQ', phoneCode: '+672' },
  { name: 'Antigua and Barbuda', code: 'AG', phoneCode: '+1-268' },
  { name: 'Argentina', code: 'AR', phoneCode: '+54' },
  { name: 'Armenia', code: 'AM', phoneCode: '+374' },
  { name: 'Aruba', code: 'AW', phoneCode: '+297' },
  { name: 'Australia', code: 'AU', phoneCode: '+61' },
  { name: 'Austria', code: 'AT', phoneCode: '+43' },
  { name: 'Azerbaijan', code: 'AZ', phoneCode: '+994' },
  { name: 'Bahamas', code: 'BS', phoneCode: '+1-242' },
  { name: 'Bahrain', code: 'BH', phoneCode: '+973' },
  { name: 'Bangladesh', code: 'BD', phoneCode: '+880' },
  { name: 'Barbados', code: 'BB', phoneCode: '+1-246' },
  { name: 'Belarus', code: 'BY', phoneCode: '+375' },
  { name: 'Belgium', code: 'BE', phoneCode: '+32' },
  { name: 'Belize', code: 'BZ', phoneCode: '+501' },
  { name: 'Benin', code: 'BJ', phoneCode: '+229' },
  { name: 'Bermuda', code: 'BM', phoneCode: '+1-441' },
  { name: 'Bhutan', code: 'BT', phoneCode: '+975' },
  { name: 'Bolivia', code: 'BO', phoneCode: '+591' },
  { name: 'Bosnia and Herzegovina', code: 'BA', phoneCode: '+387' },
  { name: 'Botswana', code: 'BW', phoneCode: '+267' },
  { name: 'Brazil', code: 'BR', phoneCode: '+55' },
  { name: 'British Indian Ocean Territory', code: 'IO', phoneCode: '+246' },
  { name: 'British Virgin Islands', code: 'VG', phoneCode: '+1-284' },
  { name: 'Brunei', code: 'BN', phoneCode: '+673' },
  { name: 'Bulgaria', code: 'BG', phoneCode: '+359' },
  { name: 'Burkina Faso', code: 'BF', phoneCode: '+226' },
  { name: 'Burundi', code: 'BI', phoneCode: '+257' },
  { name: 'Cambodia', code: 'KH', phoneCode: '+855' },
  { name: 'Cameroon', code: 'CM', phoneCode: '+237' },
  { name: 'Canada', code: 'CA', phoneCode: '+1' },
  { name: 'Cape Verde', code: 'CV', phoneCode: '+238' },
  { name: 'Cayman Islands', code: 'KY', phoneCode: '+1-345' },
  { name: 'Central African Republic', code: 'CF', phoneCode: '+236' },
  { name: 'Chad', code: 'TD', phoneCode: '+235' },
  { name: 'Chile', code: 'CL', phoneCode: '+56' },
  { name: 'China', code: 'CN', phoneCode: '+86' },
  { name: 'Christmas Island', code: 'CX', phoneCode: '+61' },
  { name: 'Cocos Islands', code: 'CC', phoneCode: '+61' },
  { name: 'Colombia', code: 'CO', phoneCode: '+57' },
  { name: 'Comoros', code: 'KM', phoneCode: '+269' },
  { name: 'Cook Islands', code: 'CK', phoneCode: '+682' },
  { name: 'Costa Rica', code: 'CR', phoneCode: '+506' },
  { name: 'Croatia', code: 'HR', phoneCode: '+385' },
  { name: 'Cuba', code: 'CU', phoneCode: '+53' },
  { name: 'Curacao', code: 'CW', phoneCode: '+599' },
  { name: 'Cyprus', code: 'CY', phoneCode: '+357' },
  { name: 'Czech Republic', code: 'CZ', phoneCode: '+420' },
  { name: 'Democratic Republic of the Congo', code: 'CD', phoneCode: '+243' },
  { name: 'Denmark', code: 'DK', phoneCode: '+45' },
  { name: 'Djibouti', code: 'DJ', phoneCode: '+253' },
  { name: 'Dominica', code: 'DM', phoneCode: '+1-767' },
  { name: 'Dominican Republic', code: 'DO', phoneCode: '+1-809, +1-829, +1-849' },
  { name: 'East Timor', code: 'TL', phoneCode: '+670' },
  { name: 'Ecuador', code: 'EC', phoneCode: '+593' },
  { name: 'Egypt', code: 'EG', phoneCode: '+20' },
  { name: 'El Salvador', code: 'SV', phoneCode: '+503' },
  { name: 'Equatorial Guinea', code: 'GQ', phoneCode: '+240' },
  { name: 'Eritrea', code: 'ER', phoneCode: '+291' },
  { name: 'Estonia', code: 'EE', phoneCode: '+372' },
  { name: 'Eswatini', code: 'SZ', phoneCode: '+268' },
  { name: 'Ethiopia', code: 'ET', phoneCode: '+251' },
  { name: 'Falkland Islands', code: 'FK', phoneCode: '+500' },
  { name: 'Faroe Islands', code: 'FO', phoneCode: '+298' },
  { name: 'Fiji', code: 'FJ', phoneCode: '+679' },
  { name: 'Finland', code: 'FI', phoneCode: '+358' },
  { name: 'France', code: 'FR', phoneCode: '+33' },
  { name: 'French Polynesia', code: 'PF', phoneCode: '+689' },
  { name: 'Gabon', code: 'GA', phoneCode: '+241' },
  { name: 'Gambia', code: 'GM', phoneCode: '+220' },
  { name: 'Georgia', code: 'GE', phoneCode: '+995' },
  { name: 'Germany', code: 'DE', phoneCode: '+49' },
  { name: 'Ghana', code: 'GH', phoneCode: '+233' },
  { name: 'Gibraltar', code: 'GI', phoneCode: '+350' },
  { name: 'Greece', code: 'GR', phoneCode: '+30' },
  { name: 'Greenland', code: 'GL', phoneCode: '+299' },
  { name: 'Grenada', code: 'GD', phoneCode: '+1-473' },
  { name: 'Guam', code: 'GU', phoneCode: '+1-671' },
  { name: 'Guatemala', code: 'GT', phoneCode: '+502' },
  { name: 'Guernsey', code: 'GG', phoneCode: '+44-1481' },
  { name: 'Guinea', code: 'GN', phoneCode: '+224' },
  { name: 'Guinea-Bissau', code: 'GW', phoneCode: '+245' },
  { name: 'Guyana', code: 'GY', phoneCode: '+592' },
  { name: 'Haiti', code: 'HT', phoneCode: '+509' },
  { name: 'Honduras', code: 'HN', phoneCode: '+504' },
  { name: 'Hong Kong', code: 'HK', phoneCode: '+852' },
  { name: 'Hungary', code: 'HU', phoneCode: '+36' },
  { name: 'Iceland', code: 'IS', phoneCode: '+354' },
  { name: 'India', code: 'IN', phoneCode: '+91' },
  { name: 'Indonesia', code: 'ID', phoneCode: '+62' },
  { name: 'Iran', code: 'IR', phoneCode: '+98' },
  { name: 'Iraq', code: 'IQ', phoneCode: '+964' },
  { name: 'Ireland', code: 'IE', phoneCode: '+353' },
  { name: 'Isle of Man', code: 'IM', phoneCode: '+44-1624' },
  { name: 'Israel', code: 'IL', phoneCode: '+972' },
  { name: 'Italy', code: 'IT', phoneCode: '+39' },
  { name: 'Ivory Coast', code: 'CI', phoneCode: '+225' },
  { name: 'Jamaica', code: 'JM', phoneCode: '+1-876' },
  { name: 'Japan', code: 'JP', phoneCode: '+81' },
  { name: 'Jersey', code: 'JE', phoneCode: '+44-1534' },
  { name: 'Jordan', code: 'JO', phoneCode: '+962' },
  { name: 'Kazakhstan', code: 'KZ', phoneCode: '+7' },
  { name: 'Kenya', code: 'KE', phoneCode: '+254' },
  { name: 'Kiribati', code: 'KI', phoneCode: '+686' },
  { name: 'Kosovo', code: 'XK', phoneCode: '+383' },
  { name: 'Kuwait', code: 'KW', phoneCode: '+965' },
  { name: 'Kyrgyzstan', code: 'KG', phoneCode: '+996' },
  { name: 'Laos', code: 'LA', phoneCode: '+856' },
  { name: 'Latvia', code: 'LV', phoneCode: '+371' },
  { name: 'Lebanon', code: 'LB', phoneCode: '+961' },
  { name: 'Lesotho', code: 'LS', phoneCode: '+266' },
  { name: 'Liberia', code: 'LR', phoneCode: '+231' },
  { name: 'Libya', code: 'LY', phoneCode: '+218' },
  { name: 'Liechtenstein', code: 'LI', phoneCode: '+423' },
  { name: 'Lithuania', code: 'LT', phoneCode: '+370' },
  { name: 'Luxembourg', code: 'LU', phoneCode: '+352' },
  { name: 'Macau', code: 'MO', phoneCode: '+853' },
  { name: 'Madagascar', code: 'MG', phoneCode: '+261' },
  { name: 'Malawi', code: 'MW', phoneCode: '+265' },
  { name: 'Malaysia', code: 'MY', phoneCode: '+60' },
  { name: 'Maldives', code: 'MV', phoneCode: '+960' },
  { name: 'Mali', code: 'ML', phoneCode: '+223' },
  { name: 'Malta', code: 'MT', phoneCode: '+356' },
  { name: 'Marshall Islands', code: 'MH', phoneCode: '+692' },
  { name: 'Mauritania', code: 'MR', phoneCode: '+222' },
  { name: 'Mauritius', code: 'MU', phoneCode: '+230' },
  { name: 'Mayotte', code: 'YT', phoneCode: '+262' },
  { name: 'Mexico', code: 'MX', phoneCode: '+52' },
  { name: 'Micronesia', code: 'FM', phoneCode: '+691' },
  { name: 'Moldova', code: 'MD', phoneCode: '+373' },
  { name: 'Monaco', code: 'MC', phoneCode: '+377' },
  { name: 'Mongolia', code: 'MN', phoneCode: '+976' },
  { name: 'Montenegro', code: 'ME', phoneCode: '+382' },
  { name: 'Montserrat', code: 'MS', phoneCode: '+1-664' },
  { name: 'Morocco', code: 'MA', phoneCode: '+212' },
  { name: 'Mozambique', code: 'MZ', phoneCode: '+258' },
  { name: 'Myanmar', code: 'MM', phoneCode: '+95' },
  { name: 'Namibia', code: 'NA', phoneCode: '+264' },
  { name: 'Nauru', code: 'NR', phoneCode: '+674' },
  { name: 'Nepal', code: 'NP', phoneCode: '+977' },
  { name: 'Netherlands', code: 'NL', phoneCode: '+31' },
  { name: 'Netherlands Antilles', code: 'AN', phoneCode: '+599' },
  { name: 'New Caledonia', code: 'NC', phoneCode: '+687' },
  { name: 'New Zealand', code: 'NZ', phoneCode: '+64' },
  { name: 'Nicaragua', code: 'NI', phoneCode: '+505' },
  { name: 'Niger', code: 'NE', phoneCode: '+227' },
  { name: 'Nigeria', code: 'NG', phoneCode: '+234' },
  { name: 'Niue', code: 'NU', phoneCode: '+683' },
  { name: 'North Korea', code: 'KP', phoneCode: '+850' },
  { name: 'North Macedonia', code: 'MK', phoneCode: '+389' },
  { name: 'Northern Mariana Islands', code: 'MP', phoneCode: '+1-670' },
  { name: 'Norway', code: 'NO', phoneCode: '+47' },
  { name: 'Oman', code: 'OM', phoneCode: '+968' },
  { name: 'Pakistan', code: 'PK', phoneCode: '+92' },
  { name: 'Palau', code: 'PW', phoneCode: '+680' },
  { name: 'Palestine', code: 'PS', phoneCode: '+970' },
  { name: 'Panama', code: 'PA', phoneCode: '+507' },
  { name: 'Papua New Guinea', code: 'PG', phoneCode: '+675' },
  { name: 'Paraguay', code: 'PY', phoneCode: '+595' },
  { name: 'Peru', code: 'PE', phoneCode: '+51' },
  { name: 'Philippines', code: 'PH', phoneCode: '+63' },
  { name: 'Pitcairn', code: 'PN', phoneCode: '+64' },
  { name: 'Poland', code: 'PL', phoneCode: '+48' },
  { name: 'Portugal', code: 'PT', phoneCode: '+351' },
  { name: 'Puerto Rico', code: 'PR', phoneCode: '+1-787, +1-939' },
  { name: 'Qatar', code: 'QA', phoneCode: '+974' },
  { name: 'Republic of the Congo', code: 'CG', phoneCode: '+242' },
  { name: 'Reunion', code: 'RE', phoneCode: '+262' },
  { name: 'Romania', code: 'RO', phoneCode: '+40' },
  { name: 'Russia', code: 'RU', phoneCode: '+7' },
  { name: 'Rwanda', code: 'RW', phoneCode: '+250' },
  { name: 'Saint Barthelemy', code: 'BL', phoneCode: '+590' },
  { name: 'Saint Helena', code: 'SH', phoneCode: '+290' },
  { name: 'Saint Kitts and Nevis', code: 'KN', phoneCode: '+1-869' },
  { name: 'Saint Lucia', code: 'LC', phoneCode: '+1-758' },
  { name: 'Saint Martin', code: 'MF', phoneCode: '+590' },
  { name: 'Saint Pierre and Miquelon', code: 'PM', phoneCode: '+508' },
  { name: 'Saint Vincent and the Grenadines', code: 'VC', phoneCode: '+1-784' },
  { name: 'Samoa', code: 'WS', phoneCode: '+685' },
  { name: 'San Marino', code: 'SM', phoneCode: '+378' },
  { name: 'Sao Tome and Principe', code: 'ST', phoneCode: '+239' },
  { name: 'Saudi Arabia', code: 'SA', phoneCode: '+966' },
  { name: 'Senegal', code: 'SN', phoneCode: '+221' },
  { name: 'Serbia', code: 'RS', phoneCode: '+381' },
  { name: 'Seychelles', code: 'SC', phoneCode: '+248' },
  { name: 'Sierra Leone', code: 'SL', phoneCode: '+232' },
  { name: 'Singapore', code: 'SG', phoneCode: '+65' },
  { name: 'Sint Maarten', code: 'SX', phoneCode: '+1-721' },
  { name: 'Slovakia', code: 'SK', phoneCode: '+421' },
  { name: 'Slovenia', code: 'SI', phoneCode: '+386' },
  { name: 'Solomon Islands', code: 'SB', phoneCode: '+677' },
  { name: 'Somalia', code: 'SO', phoneCode: '+252' },
  { name: 'South Africa', code: 'ZA', phoneCode: '+27' },
  { name: 'South Korea', code: 'KR', phoneCode: '+82' },
  { name: 'South Sudan', code: 'SS', phoneCode: '+211' },
  { name: 'Spain', code: 'ES', phoneCode: '+34' },
  { name: 'Sri Lanka', code: 'LK', phoneCode: '+94' },
  { name: 'Sudan', code: 'SD', phoneCode: '+249' },
  { name: 'Suriname', code: 'SR', phoneCode: '+597' },
  { name: 'Svalbard and Jan Mayen', code: 'SJ', phoneCode: '+47' },
  { name: 'Sweden', code: 'SE', phoneCode: '+46' },
  { name: 'Switzerland', code: 'CH', phoneCode: '+41' },
  { name: 'Syria', code: 'SY', phoneCode: '+963' },
  { name: 'Taiwan', code: 'TW', phoneCode: '+886' },
  { name: 'Tajikistan', code: 'TJ', phoneCode: '+992' },
  { name: 'Tanzania', code: 'TZ', phoneCode: '+255' },
  { name: 'Thailand', code: 'TH', phoneCode: '+66' },
  { name: 'Togo', code: 'TG', phoneCode: '+228' },
  { name: 'Tokelau', code: 'TK', phoneCode: '+690' },
  { name: 'Tonga', code: 'TO', phoneCode: '+676' },
  { name: 'Trinidad and Tobago', code: 'TT', phoneCode: '+1-868' },
  { name: 'Tunisia', code: 'TN', phoneCode: '+216' },
  { name: 'Turkey', code: 'TR', phoneCode: '+90' },
  { name: 'Turkmenistan', code: 'TM', phoneCode: '+993' },
  { name: 'Turks and Caicos Islands', code: 'TC', phoneCode: '+1-649' },
  { name: 'Tuvalu', code: 'TV', phoneCode: '+688' },
  { name: 'U.S. Virgin Islands', code: 'VI', phoneCode: '+1-340' },
  { name: 'Uganda', code: 'UG', phoneCode: '+256' },
  { name: 'Ukraine', code: 'UA', phoneCode: '+380' },
  { name: 'United Arab Emirates', code: 'AE', phoneCode: '+971' },
  { name: 'United Kingdom', code: 'GB', phoneCode: '+44' },
  { name: 'United States', code: 'US', phoneCode: '+1' },
  { name: 'Uruguay', code: 'UY', phoneCode: '+598' },
  { name: 'Uzbekistan', code: 'UZ', phoneCode: '+998' },
  { name: 'Vanuatu', code: 'VU', phoneCode: '+678' },
  { name: 'Vatican', code: 'VA', phoneCode: '+379' },
  { name: 'Venezuela', code: 'VE', phoneCode: '+58' },
  { name: 'Vietnam', code: 'VN', phoneCode: '+84' },
  { name: 'Wallis and Futuna', code: 'WF', phoneCode: '+681' },
  { name: 'Western Sahara', code: 'EH', phoneCode: '+212' },
  { name: 'Yemen', code: 'YE', phoneCode: '+967' },
  { name: 'Zambia', code: 'ZM', phoneCode: '+260' },
  { name: 'Zimbabwe', code: 'ZW', phoneCode: '+263' }
];


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
  phoneCode: string;
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
    phoneCode: '',
    businessType: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [error1, setError1] = useState("");
  const [error2, setError2] = useState("");
  const [emailExists, setEmailExists] = useState<boolean | null>(null);
  const [emailDebounce, setEmailDebounce] = useState<NodeJS.Timeout | null>(null);

  const isValidEmail = async (email: string): Promise<{ valid: boolean; message?: string }> => {
    if (!email || email.trim() === "") {
      return { valid: false, message: 'Email is required' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { valid: false, message: 'Invalid email format' };
    }

    if (!validator.isEmail(email)) {
      return { valid: false, message: 'Invalid email format'};
    }

    if (!MailChecker.isValid(email)) {
      return { valid: false, message: 'Disposable emails are not allowed' };
    }

    return { valid: true };
  };

  const validatePassword = (password: string): string | null => {
    if (!password) {
      return 'Password is required';
    }

    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }

    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }

    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }

    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one digit';
    }

    if (!/[!@#$%^&*]/.test(password)) {
      return 'Password must contain at least one special character (!@#$%^&*)';
    }

    return null;
  };

  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}infoglobal/?email=${email}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Token " + process.env.NEXT_PUBLIC_TOKEN,
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return Array.isArray(data) && data.length > 0;
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  };

  // Real-time email validation with debounce
  const handleEmailChange = (email: string) => {
    handleInputChange('email', email);
    
    // Clear previous debounce
    if (emailDebounce) {
      clearTimeout(emailDebounce);
    }

    // Clear error if email is empty
    if (!email.trim()) {
      setError1("");
      setEmailExists(null);
      return;
    }

    // Set new debounce for email validation
    const timeout = setTimeout(async () => {
      const validation = await isValidEmail(email);
      if (!validation.valid) {
        setError1(validation.message || 'Invalid email');
        setEmailExists(null);
      } else {
        setError1("");
        // Check if email exists only after format is valid
        const exists = await checkEmailExists(email);
        setEmailExists(exists);
      }
    }, 500);

    setEmailDebounce(timeout);
  };

  // Real-time password validation
  const handlePasswordChange = (password: string) => {
    handleInputChange('password', password);
    
    if (!password) {
      setError2("");
      return;
    }

    const passwordError = validatePassword(password);
    setError2(passwordError || "");
  };

  // Clear validation errors when component unmounts
  useEffect(() => {
    return () => {
      if (emailDebounce) {
        clearTimeout(emailDebounce);
      }
    };
  }, [emailDebounce]);

  const CustomSelect = ({ 
    value, 
    onChange, 
    options, 
    placeholder,
    className = ""
  }: {
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    placeholder: string;
    className?: string;
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);
    const selectedLabel = options.find(opt => opt.value === value)?.label || placeholder;

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    return (
      <div className={`relative ${className}`} ref={selectRef}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className={`flex h-12 w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-3 text-left text-sm transition-all hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-accent ${
            isOpen ? 'ring-2 ring-accent' : ''
          }`}
        >
          <span className="truncate text-left">{selectedLabel}</span>
          <ChevronDown
            className={`h-4 w-4 text-gray-500 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isOpen && (
          <div 
            className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              className="max-h-60 overflow-y-auto"
              onWheel={(e) => {
                e.stopPropagation();
                const { currentTarget } = e;
                if (
                  e.deltaY < 0 && currentTarget.scrollTop <= 0 ||
                  e.deltaY > 0 && currentTarget.scrollHeight - currentTarget.clientHeight <= currentTarget.scrollTop
                ) {
                  e.preventDefault();
                }
              }}
            >
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`relative flex w-full cursor-pointer select-none items-center px-4 py-2 text-sm text-left ${
                    value === option.value
                      ? 'bg-accent text-white'
                      : 'text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span className="flex-1 truncate text-left">{option.label}</span>
                  {value === option.value && (
                    <CheckIcon className="ml-2 h-4 w-4 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const steps = [
    { id: 1, title: 'Account Setup', icon: User },
    { id: 2, title: 'Business Information', icon: Building }
  ];
  
  const router = useRouter();
  
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountry = countries.find(c => c.name === e.target.value);
    if (selectedCountry) {
      setFormData(prev => ({
        ...prev,
        country: selectedCountry.name,
        phoneCode: selectedCountry.phoneCode
      }));
    }
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

  const handleSubmit = async () => {
    if (currentStep < 2) {
      handleNextStep();
      return;
    }

    setIsLoading(true);
    setError(null);

    const email = formData.email;
    const password = formData.password;

    // Final validation before submission
    const emailValidation = await isValidEmail(email);
    if (!emailValidation.valid) {
      setError1(emailValidation.message || 'Invalid email');
      setIsLoading(false);
      return;
    }

    // Check email existence one more time before submission
    const exists = await checkEmailExists(email);
    if (exists) {
      setError1("This email is already registered");
      setEmailExists(true);
      setIsLoading(false);
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError2(passwordError);
      setIsLoading(false);
      return;
    }

    try {
      // Final submission logic
      const userResponse = await fetch(`${process.env.NEXT_PUBLIC_URL}auth/users/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Token " + process.env.NEXT_PUBLIC_TOKEN,
        },
        body: JSON.stringify({ 
          email: email, 
          password: password, 
          register_as: 'partner'
        }),
      });
      
      if (!userResponse.ok) {
        throw new Error('User registration failed');
      }

      const userData = await userResponse.json();
      const userId = userData.id;

      // Sign in the user
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email, 
        password: formData.password, 
      });

      // Update partner info
      const partnerResponse = await fetch(`${process.env.NEXT_PUBLIC_URL}infoid/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Token " + process.env.NEXT_PUBLIC_TOKEN,
        },
        body: JSON.stringify({
          full_name: formData.businessName,
          types: formData.businessType,
          username: formData.contactName,
          address_line_1: formData.address,
          city: formData.city,
          postalCode: formData.zipCode,
          countryCode: formData.country,
          phoneNumber: `${formData.phoneCode}${formData.phoneNumber}`,
          plan: "free",
          joined: moment().format('ll')
        }),
      });

      if (!partnerResponse.ok) {
        throw new Error('Partner info update failed');
      }

      router.push('/en/account/profile');  
      
    } catch (err) {
      setError('Registration error please verify your data');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.email && formData.password && formData.confirmPassword && 
                 formData.password === formData.confirmPassword && !error1 && !error2 && 
                 emailExists === false);
      case 2:
        return !!(formData.businessName && formData.contactName && formData.address && 
                 formData.city && formData.phoneNumber && formData.businessType);
      default:
        return false;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen ">
      <div className="flex items-center justify-center mb-10 lg:mb-14 h-56 pt-28 rounded-b-3xl bg-[url('/profile.avif')] bg-no-repeat bg-center bg-cover">
        <div className="text-2xl font-bold md:text-3xl md:leading-tight text-white dark:text-neutral-200 font-playfair uppercase">
          <h2>Partner Registration</h2> 
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mb-8 px-4 sm:px-6 lg:px-8">
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
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                      isCompleted 
                        ? 'bg-accent border-accent text-white' 
                        : isActive 
                        ? 'bg-black border-black text-white' 
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}>
                      {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <div className="mt-2 text-center">
                      <p className={`text-xs font-medium ${isActive ? 'text-black' : 'text-gray-500'}`}>
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
                          onChange={(e) => handleEmailChange(e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition ${
                            error1 || emailExists ? 'border-secondary' : 'border-gray-300'
                          }`}
                          placeholder="Enter your email"
                        />
                      </div>
                      {error1 && <p className="text-secondary text-sm mt-1">{error1}</p>}
                      {emailExists === true && (
                        <p className="mt-1 text-sm text-secondary">This email is already registered. Please use another.</p>
                      )}
                      {emailExists === false && (
                        <p className="mt-1 text-sm text-green-600">Email is available</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) => handlePasswordChange(e.target.value)}
                          className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition ${
                            error2 ? 'border-secondary' : 'border-gray-300'
                          }`}
                          placeholder="Create a password"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      {error2 && <p className="text-secondary text-sm mt-1">{error2}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition ${
                            formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword 
                              ? 'border-secondary' 
                              : 'border-gray-300'
                          }`}
                          placeholder="Confirm your password"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                        <p className="mt-1 mb-2 text-sm text-secondary">Passwords do not match</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Business Information */}
              {currentStep === 2 && (
                <div className="space-y-6 relative">
                  <div className="bg-black text-white p-4 rounded-lg">
                    <h2 className="text-xl font-bold mb-2 font-playfair">2. Business Information</h2>
                    <p className="text-gray-200">Tell us about your business</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full pb-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
                      <CustomSelect
                        value={formData.businessType}
                        onChange={(value) => handleInputChange('businessType', value)}
                        placeholder="Select business type"
                        options={[
                          { value: 'hotel', label: 'Hotel' },
                          { value: 'restaurant', label: 'Restaurant' },
                          { value: 'restaurant-hotel', label: 'Hotel & Restaurant' },
                          { value: 'cafe', label: 'Cafe' },
                          { value: 'bar', label: 'Bar' },
                          { value: 'cafe-restaurant', label: 'Cafe & Restaurant' },
                        ]}
                      />
                    </div>

                    <div className='md:flex gap-2 w-full space-y-6 md:space-y-0 md:col-span-2'>
                      <div className="md:col-span-2 w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                        <div className="relative">
                          <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            value={formData.businessName}
                            onChange={(e) => handleInputChange('businessName', e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition"
                            placeholder="Enter business name"
                          />
                        </div>
                      </div>
                      
                      <div className="md:col-span-2 w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            value={formData.contactName}
                            onChange={(e) => handleInputChange('contactName', e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition"
                            placeholder="Enter contact person name"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="md:col-span-2 w-full">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition"
                          placeholder="Enter business address"
                        />
                      </div>
                    </div>
                    
                    <div className='md:flex gap-2 w-full space-y-6 md:space-y-0'>
                      <div className='w-full mb:2'>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition"
                          placeholder="City"
                        />
                      </div>
                      
                   
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                      <CustomSelect
                        value={formData.country}
                        onChange={(value) => {
                          handleInputChange('country', value);
                          const selectedCountry = countries.find(c => c.name === value);
                          if (selectedCountry) {
                            handleInputChange('phoneCode', selectedCountry.phoneCode);
                          }
                        }}
                        placeholder="Select country"
                        options={countries.map(country => ({
                          value: country.name,
                          label: country.name
                        }))}
                      />
                    </div>

                    <div className='flex flex-col md:flex-row w-full md:col-span-2 gap-3 '>
                       <div className='w-1/2 md:w-1/3 '>
                        <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                        <input
                          type="text"
                          value={formData.zipCode}
                          onChange={(e) => handleInputChange('zipCode', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition"
                          placeholder="ZIP Code"
                        />
                      </div>
                    <div className='pb-6 w-full'>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <div className='flex gap-2 w-full'>
                          <div className="h-12 px-4 py-3 border border-gray-300 rounded-lg select-none flex items-center justify-center min-w-[80px]">
                            <span className="text-gray-700 font-medium">{formData.phoneCode || '+1'}</span>
                          </div>
                        <div className="flex-1">
                          <input
                            type="tel"
                            value={formData.phoneNumber}
                            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                            className="w-full pl-4 pr-4 py-3 h-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition"
                            placeholder="(415) 123-4567"
                          />
                        </div>
                      </div>
                    </div>
                    </div>
                    {error && <p className="text-secondary text-sm mb-4">{error}</p>}
                  </div>
                   <hr/>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6 ">
              
                {currentStep > 1 && (
                  <button
                    onClick={handlePrevStep}
                    className="sm:px-6 py-1.5 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </button>
                )}
                
                <div className="ml-auto">
                  {currentStep < 2 ? (
                    <button
                      onClick={handleSubmit}
                      disabled={!isStepValid(currentStep)}
                      className="sm:px-6 sm:py-2 text-sm sm:text-base py-2 px-2 bg-black text-white rounded-lg hover:bg-accent disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                      Continue
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={!isStepValid(currentStep) || isLoading}
                      className="sm:px-6 sm:py-2 py-3 text-sm sm:text-base px-2 bg-black text-white rounded-lg hover:bg-accent disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center min-w-40"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        'Complete Registration'
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Summary Section (unchanged) */}
            <div className="bg-gray-50 p-8 border-l">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 font-playfair">Registration Summary</h3>
              
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-900 font-playfair">Partner Registration</span>
                    <span className="text-sm font-semibold text-gray-900">$0.00</span>
                  </div>
                  <p className="text-xs text-gray-600">One-time setup fee</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-900 font-playfair">Monthly Subscription</span>
                    <span className="text-sm font-semibold text-gray-900">$0.00</span>
                  </div>
                  <p className="text-xs text-gray-600">First month included</p>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-bold text-lg text-gray-900">$0.00</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-accent rounded-lg">
                <h4 className="text-sm font-medium text-white mb-2">What's included:</h4>
                <ul className="text-xs text-white space-y-1">
                  <li>Business profile setup</li>
                  <li>Online booking system</li>
                  <li>24/7 customer support</li>
                  <li>Marketing tools</li>
                  <li>Analytics dashboard</li>
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