'use client'

import React, { useState } from 'react';
import { Plus, Twitter, Facebook, Instagram, Linkedin, Github, Youtube, X } from 'lucide-react';

interface SocialMediaLink {
  id: string;
  platform: string;
  url: string;
}

interface PlatformOption {
  value: string;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
  placeholder: string;
}

const platformOptions: PlatformOption[] = [
  {
    value: 'twitter',
    label: 'Twitter/X',
    icon: X,
    color: 'text-black hover:text-gray-700',
    placeholder: 'https://twitter.com/username'
  },
  {
    value: 'facebook',
    label: 'Facebook',
    icon: Facebook,
    color: 'text-blue-600 hover:text-blue-700',
    placeholder: 'https://facebook.com/username'
  },
  {
    value: 'instagram',
    label: 'Instagram',
    icon: Instagram,
    color: 'text-pink-600 hover:text-pink-700',
    placeholder: 'https://instagram.com/username'
  },
  {
    value: 'linkedin',
    label: 'LinkedIn',
    icon: Linkedin,
    color: 'text-blue-700 hover:text-blue-800',
    placeholder: 'https://linkedin.com/in/username'
  },
  {
    value: 'github',
    label: 'GitHub',
    icon: Github,
    color: 'text-gray-800 hover:text-black',
    placeholder: 'https://github.com/username'
  },
  {
    value: 'youtube',
    label: 'YouTube',
    icon: Youtube,
    color: 'text-red-600 hover:text-red-700',
    placeholder: 'https://youtube.com/channel/channelid'
  },

];

export default function SocialMediaForm() {
  const [links, setLinks] = useState<SocialMediaLink[]>([]);
  const [newLink, setNewLink] = useState({ platform: '', url: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return url.startsWith('http://') || url.startsWith('https://');
    } catch {
      return false;
    }
  };

  const addLink = () => {
    const newErrors: { [key: string]: string } = {};

    if (!newLink.platform) {
      newErrors.platform = 'Please select a platform';
    }

    if (!newLink.url) {
      newErrors.url = 'Please enter a URL';
    } else if (!validateUrl(newLink.url)) {
      newErrors.url = 'Please enter a valid URL (starting with http:// or https://)';
    }

    // Check for duplicate platforms
    if (links.some(link => link.platform === newLink.platform)) {
      newErrors.platform = 'This platform has already been added';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const link: SocialMediaLink = {
      id: Date.now().toString(),
      platform: newLink.platform,
      url: newLink.url
    };

    setLinks([...links, link]);
    setNewLink({ platform: '', url: '' });
    setErrors({});
  };

  const removeLink = (id: string) => {
    setLinks(links.filter(link => link.id !== id));
  };

  const selectedPlatform = platformOptions.find(p => p.value === newLink.platform);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Social Media Links:', links);
    alert(`Added ${links.length} social media links! Check console for details.`);
  };

  return (
    <div className="p-4 font-montserrat">
      <div>
        <div className="bg-white  rounded-xl shadow-sm border border-1 p-8">
          <div className="text-center mb-8">
           
            <h1 className="text-3xl font-bold text-gray-800 mb-2 font-playfair">Add Social Media Links</h1>
            <p className="text-gray-600">Connect your social media profiles</p>
          </div>

          <div onSubmit={handleSubmit} className="space-y-6">
            {/* Platform Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Choose Platform
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {platformOptions.map((platform) => {
                  const IconComponent = platform.icon;
                  const isSelected = newLink.platform === platform.value;
                  const isDisabled = links.some(link => link.platform === platform.value);
                  
                  return (
                    <button
                      key={platform.value}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => !isDisabled && setNewLink({ ...newLink, platform: platform.value })}
                      className={`
                        relative p-4 rounded-xl border-2 transition-all duration-200
                        ${isSelected 
                          ? 'border-accent bg-gray-50 shadow-md' 
                          : isDisabled
                          ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                          : 'border-gray-200 hover:border-accent hover:bg-gray-50'
                        }
                      `}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <IconComponent className={`w-6 h-6 ${isDisabled ? 'text-gray-400' : platform.color}`} />
                        <span className={`text-xs font-medium ${isDisabled ? 'text-gray-400' : 'text-gray-700'}`}>
                          {platform.label}
                        </span>
                      </div>
                      {isDisabled && (
                        <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                    </button>
                  );
                })}
              </div>
              {errors.platform && (
                <p className="mt-2 text-sm text-red-600">{errors.platform}</p>
              )}
            </div>

            {/* URL Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 ">
                Profile URL
              </label>
              <div className="relative">
                {selectedPlatform && (
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <selectedPlatform.icon className={`w-5 h-5 ${selectedPlatform.color}`} />
                  </div>
                )}
                <input
                  type="url"
                  value={newLink.url}
                  onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                  placeholder={selectedPlatform?.placeholder || "https://..."}
                  className={`
                    w-full ${selectedPlatform ? 'pl-12' : 'pl-4'} pr-4 py-3 
                    border-2 rounded-xl transition-all duration-200
                    ${errors.url ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-accent'}
                    focus:outline-none focus:ring-1 focus:ring-accent
                    placeholder-gray-400 text-gray-700
                  `}
                />
              </div>
              {errors.url && (
                <p className="mt-2 text-sm text-red-600">{errors.url}</p>
              )}
            </div>

            {/* Add Button */}
            <button
              type="button"
              onClick={addLink}
              disabled={!newLink.platform || !newLink.url}
              className="w-full bg-accent text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-5 h-5 inline-block mr-2" />
              Add Social Media Link
            </button>

            {/* Added Links */}
            {links.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <span className="bg-purple-100 text-purple-800 text-sm font-medium px-2.5 py-0.5 rounded-full mr-3">
                    {links.length}
                  </span>
                  Added Links
                </h3>
                <div className="space-y-3">
                  {links.map((link) => {
                    const platform = platformOptions.find(p => p.value === link.platform);
                    if (!platform) return null;
                    const IconComponent = platform.icon;

                    return (
                      <div key={link.id} className="bg-gray-50 rounded-xl p-4 flex items-center justify-between border border-gray-200">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <IconComponent className={`w-5 h-5 ${platform.color}`} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{platform.label}</p>
                            <p className="text-sm text-gray-500 truncate max-w-xs">{link.url}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeLink(link.id)}
                          className="text-red-500 hover:text-red-700 transition-colors duration-200 p-2 hover:bg-red-50 rounded-lg"
                        >
                          <Plus className="w-4 h-4 rotate-45" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}