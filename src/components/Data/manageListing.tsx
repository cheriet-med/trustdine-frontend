'use client'

import { CiCircleChevDown } from "react-icons/ci";
import React, { useState, useRef, useEffect } from 'react';
import { IoSettingsOutline, IoCreateOutline, IoTrashOutline, IoEyeOutline } from "react-icons/io5";
import { AiOutlineDownCircle } from "react-icons/ai";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface DropdownItem {
  label: string;
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'link';
  icon?: React.ReactNode;
}

interface DropdownProps {
  children: React.ReactNode;
  items: DropdownItem[];
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  children,
  items,
  className = '',
  buttonClassName = '',
  menuClassName = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        className={`inline-flex justify-between items-center w-full rounded-2xl border border-secondary shadow-xs px-3 py-1 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 ${
          isOpen ? 'ring-1 ring-secondary' : ''
        } ${buttonClassName}`}
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <IoSettingsOutline
          className={`-mr-1 mr-2 h-5 w-5 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
          aria-hidden="true"
        />
        {children}
        <AiOutlineDownCircle
          className={`-mr-1 ml-2 h-5 w-5 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          className={`origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 ${menuClassName}`}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="py-1" role="none">
            {items.map((item, index) => (
              <React.Fragment key={index}>
                {item.type === 'button' || !item.href ? (
                  <button
                    onClick={item.onClick}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-highlights hover:text-white transition-colors duration-150"
                    role="menuitem"
                  >
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    {item.label}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-highlights hover:text-white transition-colors duration-150"
                    role="menuitem"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    {item.label}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ManageListing = ({ id, category, mutate }: { id: string; category: string | null, mutate?: () => Promise<any> }) => {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}productid/${id}`, {
          method: "DELETE",
          headers: {
            "Authorization": "Token " + process.env.NEXT_PUBLIC_TOKEN,
            "Content-Type": "application/json",
          },
        });

      if (response.ok) {
        // Handle successful deletion
        if (mutate) await mutate();
        // Alternatively: router.push('/some-success-page');
      } else {
        console.error('Failed to delete listing');
      }
    } catch (error) {
      console.error('Error deleting listing:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const dropdownItems: DropdownItem[] = [
    { 
      label: 'Edit', 
      href: category == 'Hotel'? `/en/account/edit-hotel-listing?q=${id}` : `/en/account/edit-restaurant-listing?q=${id}`, 
      type: 'link',
      icon: <IoCreateOutline className="h-4 w-4" />
    },
    { 
      label: 'Delete', 
      onClick: () => setShowDeleteModal(true), 
      type: 'button',
      icon: <IoTrashOutline className="h-4 w-4" />
    },
    { 
      label: 'View', 
      href: `/en/booking/${id}`, 
      type: 'link',
      icon: <IoEyeOutline className="h-4 w-4" />
    },
  ];

  return (
    <div className="p-4">
      <Dropdown
        items={dropdownItems}
        buttonClassName="px-3 py-1 text-base"
        menuClassName="shadow-xs"
      >
        Manage Your Listing
      </Dropdown>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4 font-playfair">Confirm Deletion</h3>
            <p className="mb-6 text-gray-600">Are you sure you want to delete this listing? This action cannot be undone.</p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-1 bg-secondary rounded-md text-sm font-medium text-white hover:bg-highlihts disabled:bg-highlihts"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageListing;