
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Globe, Linkedin, Twitter, Instagram, Facebook, Youtube } from "lucide-react";

interface CardData {
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  bio: string;
  profileImage?: string | null;
  social: {
    linkedin: string;
    twitter: string;
    instagram: string;
    facebook: string;
    youtube: string;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  template: string;
}

interface CardPreviewProps {
  cardData: CardData;
}

const CardPreview = ({ cardData }: CardPreviewProps) => {
  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'linkedin': return <Linkedin className="h-5 w-5" />;
      case 'twitter': return <Twitter className="h-5 w-5" />;
      case 'instagram': return <Instagram className="h-5 w-5" />;
      case 'facebook': return <Facebook className="h-5 w-5" />;
      case 'youtube': return <Youtube className="h-5 w-5" />;
      default: return <Globe className="h-5 w-5" />;
    }
  };

  // Create gradient background using the user's colors - matching PublicCardView exactly
  const gradientStyle = {
    background: `linear-gradient(to right, ${cardData.colors.primary || '#8B5CF6'}, ${cardData.colors.secondary || '#3B82F6'}, ${cardData.colors.accent || '#06B6D4'})`
  };

  return (
    <div className="max-w-sm mx-auto">
      {/* Mobile Frame */}
      <div className="relative bg-gray-800 rounded-[2.5rem] p-2 shadow-2xl">
        <div className="bg-black rounded-[2rem] p-1">
          <div className="bg-white rounded-[1.5rem] overflow-hidden relative">
            {/* Status Bar */}
            <div className="h-6 bg-black flex items-center justify-center">
              <div className="flex items-center space-x-1">
                <div className="w-1 h-1 bg-white rounded-full"></div>
                <div className="w-1 h-1 bg-white rounded-full"></div>
                <div className="w-1 h-1 bg-white rounded-full"></div>
              </div>
            </div>

            {/* Card Content - Matching PublicCardView exactly */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* Header Section with Gradient - using user's exact colors */}
              <div 
                className="p-8 text-white relative"
                style={gradientStyle}
              >
                {/* Decorative circles */}
                <div className="absolute top-4 right-4 w-16 h-16 bg-white/20 rounded-full"></div>
                <div className="absolute bottom-8 right-8 w-12 h-12 bg-white/30 rounded-full"></div>
                <div className="absolute top-16 right-16 w-8 h-8 bg-white/25 rounded-full"></div>
                
                {/* Profile Section */}
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 overflow-hidden">
                    {cardData.profileImage ? (
                      <img
                        src={cardData.profileImage}
                        alt={cardData.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-blue-600">
                        {cardData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl font-bold mb-1">{cardData.name}</h1>
                  {cardData.title && (
                    <p className="text-lg opacity-90 mb-1">{cardData.title}</p>
                  )}
                  {cardData.company && (
                    <p className="text-sm opacity-80">{cardData.company}</p>
                  )}
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 space-y-4">
                {/* Bio */}
                {cardData.bio && (
                  <div>
                    <p className="text-gray-600 text-sm leading-relaxed">{cardData.bio}</p>
                  </div>
                )}

                {/* Contact Information */}
                <div className="space-y-3">
                  {cardData.email && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                      <Mail className="h-5 w-5 text-gray-600" />
                      <span className="text-gray-700 text-sm">{cardData.email}</span>
                    </div>
                  )}

                  {cardData.phone && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                      <Phone className="h-5 w-5 text-gray-600" />
                      <span className="text-gray-700 text-sm">{cardData.phone}</span>
                    </div>
                  )}

                  {cardData.website && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                      <Globe className="h-5 w-5 text-gray-600" />
                      <span className="text-gray-700 text-sm">{cardData.website}</span>
                    </div>
                  )}
                </div>

                {/* Social Media Links */}
                {Object.values(cardData.social).some(url => url) && (
                  <div className="flex justify-center space-x-4 pt-4">
                    {Object.entries(cardData.social).map(([platform, url]) => {
                      if (!url) return null;
                      return (
                        <button
                          key={platform}
                          className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-blue-100 transition-colors"
                        >
                          {getSocialIcon(platform)}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1 text-blue-600 border-blue-600 hover:bg-blue-50"
                  >
                    Call
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 text-blue-600 border-blue-600 hover:bg-blue-50"
                  >
                    Email
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 text-blue-600 border-blue-600 hover:bg-blue-50"
                  >
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardPreview;
