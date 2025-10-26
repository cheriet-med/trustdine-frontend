

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import LanguageSelect from "../header/languages";
import IpInfo from "./geolocationInfo";
const End = () => {
  const t = useTranslations('Footer');

    return (
        <footer className="bg-a pb-20 text-gray-400 ">
 <div className="flex flex-wrap-reverse sm:justify-center mx-6 md:mx-16 custom:mx-72">
      <div className="flex  flex-wrap text-xs gap-4  text-gray-100 ">
                 <p >&copy; {t('All rights reserved')}</p>
                <p>|</p>
                 <Link href="/privacy-policy"><p className="cursor-pointer hover:underline">{t('Privacy Policy')} </p></Link>
              
            <p>|</p>
                <Link href="/terms-and-conditions"> <p className="cursor-pointer hover:underline">{t('Terms and Conditions')} </p></Link>
                
                 <p>|</p>
                  <Link href="/cookies-policy"> <p className="cursor-pointer hover:underline">{t('Cookies Policy')}</p></Link>

              </div>

 </div>
          
           
      </footer>
      
    );
  };
  
  export default End;
  