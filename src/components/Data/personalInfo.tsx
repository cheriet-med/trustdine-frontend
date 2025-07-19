
import { GoPencil } from "react-icons/go";
import { MdOutlineSecurity } from "react-icons/md";

interface PersonalInfo {
  legalName: string;
  preferredName: string;
  email: string;
  phone: string;
  identityVerification: string;
  residentialAddress: string;
  mailingAddress: string;
  emergencyContact: string;
}

export default function PersonalInformation() {
  const personalData: PersonalInfo = {
    legalName: 'Margot Foster',
    preferredName: '***********',
    email: 'm*****@example.com',
    phone: 'Not provided',
    identityVerification: 'Not started',
    residentialAddress: 'Not provided',
    mailingAddress: 'Not provided',
    emergencyContact: 'Not provided'
  };

  return (
    <div className=" mx-1 lg:mx-6 bg-white p-6 border border-gray-200 shadow-sm rounded-xl font-montserrat mt-6">
      <div className="px-4 sm:px-0">
        
        <h2 className="text-xl font-medium text-gray-900 mt-4 mb-6 font-playfair">Personal information</h2>
      </div>

      <div className="mt-6 border-t border-gray-200">
        <dl className="divide-y divide-gray-200">
          {/* Legal Name */}
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="font-medium text-gray-900 font-playfair">Legal name</dt>
            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0 flex justify-between items-center">
              <span>{personalData.legalName}</span>
              <button className="text-sm font-medium text-accent hover:text-secondary flex items-center">
                <GoPencil className="h-4 w-4 mr-1" />
                Edit
              </button>
            </dd>
          </div>

        
          {/* Email Address */}
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="font-medium text-gray-900 font-playfair">Email address</dt>
            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0 flex justify-between items-center">
              <span>{personalData.email}</span>
              <button className="text-sm font-medium text-accent hover:text-secondary flex items-center">
                <GoPencil className="h-4 w-4 mr-1" />
                Edit
              </button>
            </dd>
          </div>

  {/* Preferred First Name */}
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="font-medium text-gray-900 font-playfair">Password</dt>
            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0 flex justify-between items-center">
              <span>{personalData.preferredName}</span>
              <button className="text-sm font-medium text-accent hover:text-secondary flex items-center">
                <GoPencil className="h-4 w-4 mr-1" />
                {personalData.preferredName === 'Not provided' ? 'Add' : 'Edit'}
              </button>
            </dd>
          </div>


          {/* Phone Numbers */}
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="font-medium text-gray-900 font-playfair">Phone numbers</dt>
            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-700">{personalData.phone}</p>
                  <p className="text-gray-500 mt-1">
                    Add a number so confirmed guests and Airbnb can get in touch. You can add other numbers and choose how they're used.
                  </p>
                </div>
                <button className="text-sm font-medium text-accent hover:text-secondary flex items-center ml-4">
                  <GoPencil className="h-4 w-4 mr-1" />
                  {personalData.phone === 'Not provided' ? 'Add' : 'Edit'}
                </button>
              </div>
            </dd>
          </div>

          {/* Identity Verification */}
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="font-medium text-gray-900 font-playfair">Identity verification</dt>
            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0 flex justify-between items-center">
              <span>{personalData.identityVerification}</span>
              <button className="text-sm font-medium text-accent hover:text-secondary flex items-center">
                <GoPencil className="h-4 w-4 mr-1" />
                {personalData.identityVerification === 'Not started' ? 'Start' : 'Edit'}
              </button>
            </dd>
          </div>

          {/* Residential Address */}
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="font-medium text-gray-900 font-playfair">Residential address</dt>
            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0 flex justify-between items-center">
              <span>{personalData.residentialAddress}</span>
              <button className="text-sm font-medium text-accent hover:text-secondary flex items-center">
                <GoPencil className="h-4 w-4 mr-1" />
                {personalData.residentialAddress === 'Not provided' ? 'Add' : 'Edit'}
              </button>
            </dd>
          </div>

 
        </dl>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex gap-2 items-center mt-8 ">
<MdOutlineSecurity size={24} className="text-accent"/> 
 <h3 className="font-medium text-gray-900 font-playfair">Why isn't my info shown here?</h3>
        </div>
      
        <p className="mt-2 text-sm text-gray-500">
          We're hiding some account details to protect your identity. If you need to update this information, <span className="underline">please contact support</span> .
        </p>
      </div>
    </div>
  );
}