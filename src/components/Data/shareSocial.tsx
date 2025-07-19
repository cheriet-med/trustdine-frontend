import { useState, useRef, useEffect } from "react";
import { 
  Link, 
  Mail, 
  MessageSquare, 
  Facebook, 
  Twitter, 
  Share2,
  ChevronRight
} from "lucide-react";

const ShareButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const shareOptions = [
    { icon: Link, label: "Copy Link", action: () => copyToClipboard() },
    { icon: Mail, label: "Email", action: () => window.location.href = "mailto:?subject=Check%20this%20place&body=..." },
    { icon: MessageSquare, label: "Messages", action: () => {} },
    { icon: WhatsApp, label: "WhatsApp", action: () => window.open(`https://wa.me/?text=Check%20this%20place%20${window.location.href}`) },
    { icon: Facebook, label: "Facebook", action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`) },
    { icon: Twitter, label: "Twitter", action: () => window.open(`https://twitter.com/intent/tweet?url=${window.location.href}&text=Check%20this%20place`) },
    { icon: ChevronRight, label: "Embed", action: () => {} },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    // You might want to show a toast notification here
  };

  return (
    <div className="relative inline-block" ref={popupRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-1  border border-black rounded-3xl hover:bg-gray-50 transition-colors"
      >
        <Share2 className="w-4 h-4" />
        <span>Share</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-lg font-playfair">Share this place</h3>
            <p className="text-sm text-gray-500 mt-1">
              Rental unit in Alicante • 4.94 • 1 bedroom • 1 bed • 1 shared bath
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {shareOptions.map((option, index) => (
              <button
                key={index}
                onClick={option.action}
                className="flex items-center w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
              >
                <option.icon className="w-5 h-5 text-gray-700 mr-3" />
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Mock WhatsApp icon since it's not in lucide-react
const WhatsApp = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default ShareButton;