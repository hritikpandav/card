 import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  Globe, 
  Share2, 
  QrCode,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  Youtube,
  Phone
} from "lucide-react";
import { toast } from "sonner";
import QRCodeGenerator from "@/components/QRCodeGenerator";

interface DigitalCard {
  id: string;
  name: string;
  title?: string;
  company?: string;
  email?: string;
  phone?: string;
  website?: string;
  bio?: string;
  profileImage?: string | null;
  social?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
  };
}

const PublicCardView = () => {
  const { slug } = useParams<{ slug: string }>();
  const [card, setCard] = useState<DigitalCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchCard();
    }
  }, [slug]);

  const fetchCard = async () => {
    try {
      const { data, error } = await supabase
        .from('digital_cards')
        .select('*')
        .eq('slug', slug)
        .eq('is_public', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          setError('Card not found or not public');
        } else {
          throw error;
        }
        return;
      }

      const cardData: DigitalCard = {
        id: data.id,
        name: data.name,
        title: data.title || undefined,
        company: data.company || undefined,
        email: data.email || undefined,
        phone: data.phone || undefined,
        website: data.website || undefined,
        bio: data.bio || undefined,
        profileImage: data.profile_image || undefined,
        social: data.social as DigitalCard['social'] || {},
        colors: data.colors as DigitalCard['colors'] || {},
      };

      setCard(cardData);

      // Track the view
      await trackCardView(data.id);
    } catch (error) {
      console.error('Error fetching card:', error);
      setError('Failed to load card');
    } finally {
      setLoading(false);
    }
  };

  const trackCardView = async (cardId: string) => {
    try {
      await supabase
        .from('card_analytics')
        .insert({
          card_id: cardId,
          viewer_ip: null, // Could be populated with actual IP if needed
          user_agent: navigator.userAgent,
          referrer: document.referrer || null,
        });
    } catch (error) {
      console.error('Error tracking card view:', error);
      // Don't show error to user, just log it
    }
  };

  // Helper function to copy text to clipboard with fallback
  const copyToClipboard = (text: string): Promise<void> => {
    if (navigator.clipboard) {
      return navigator.clipboard.writeText(text);
    } else {
      return new Promise((resolve, reject) => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';  // Prevent scrolling to bottom of page in MS Edge.
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        try {
          const successful = document.execCommand('copy');
          document.body.removeChild(textarea);
          if (successful) {
            resolve();
          } else {
            reject(new Error('Copy command was unsuccessful'));
          }
        } catch (err) {
          document.body.removeChild(textarea);
          reject(err);
        }
      });
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${card?.name}'s Digital Business Card`,
          text: `Check out ${card?.name}'s digital business card`,
          url: window.location.href,
        });
      } else {
        await copyToClipboard(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Failed to share');
    }
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'facebook': return <Facebook className="h-5 w-5" />;
      case 'twitter': return <Twitter className="h-5 w-5" />;
      case 'instagram': return <Instagram className="h-5 w-5" />;
      case 'linkedin': return <Linkedin className="h-5 w-5" />;
      case 'youtube': return <Youtube className="h-5 w-5" />;
      default: return <Globe className="h-5 w-5" />;
    }
  };

  const openSocialLink = (platform: string, url: string) => {
    let fullUrl = url;
    
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      switch (platform) {
        case 'facebook':
          fullUrl = `https://facebook.com/${url}`;
          break;
        case 'twitter':
          fullUrl = `https://twitter.com/${url}`;
          break;
        case 'instagram':
          fullUrl = `https://instagram.com/${url}`;
          break;
        case 'linkedin':
          fullUrl = `https://linkedin.com/in/${url}`;
          break;
        case 'youtube':
          fullUrl = `https://youtube.com/@${url}`;
          break;
        default:
          fullUrl = `https://${url}`;
      }
    }
    
    window.open(fullUrl, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading business card...</p>
        </div>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">❌</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Card Not Found</h1>
          <p className="text-gray-600 mb-6">
            {error || 'This business card is not available or has been set to private.'}
          </p>
        </div>
      </div>
    );
  }

  // Create gradient background using the user's colors
  const gradientStyle = {
    background: `linear-gradient(to right, ${card.colors?.primary || '#8B5CF6'}, ${card.colors?.secondary || '#3B82F6'}, ${card.colors?.accent || '#06B6D4'})`
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-sm mx-auto">
        {/* Card Container */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header Section with Gradient */}
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
                {card?.profileImage ? (
                  <img
                    src={card.profileImage}
                    alt={card.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-blue-600">
                    {card.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold mb-1">{card.name}</h1>
              {card.title && (
                <p className="text-lg opacity-90 mb-1">{card.title}</p>
              )}
              {card.company && (
                <p className="text-sm opacity-80">{card.company}</p>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 space-y-4">
            {/* Bio */}
            {card.bio && (
              <div>
                <p className="text-gray-600 text-sm leading-relaxed">{card.bio}</p>
              </div>
            )}

            {/* Contact Information */}
            <div className="space-y-3">
              {card.email && (
                <div 
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => window.open(`mailto:${card.email}`, '_blank')}
                >
                  <Mail className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700 text-sm">{card.email}</span>
                </div>
              )}

              {card.phone && (
                <div 
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => window.open(`tel:${card.phone}`, '_blank')}
                >
                  <Phone className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700 text-sm">{card.phone}</span>
                </div>
              )}

              {card.website && (
                <div 
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => window.open(
                    card.website?.startsWith('http') ? card.website : `https://${card.website}`,
                    '_blank',
                    'noopener,noreferrer'
                  )}
                >
                  <Globe className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700 text-sm">{card.website}</span>
                </div>
              )}
            </div>

            {/* Social Media Links */}
            {card.social && Object.keys(card.social).length > 0 && (
              <div className="flex justify-center space-x-4 pt-4">
                {Object.entries(card.social).map(([platform, url]) => {
                  if (!url) return null;
                  return (
                    <button
                      key={platform}
                      onClick={() => openSocialLink(platform, url)}
                      className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-blue-100 transition-colors"
                    >
                      {getSocialIcon(platform)}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4 flex-nowrap">
              <Button
                onClick={() => window.open(`tel:${card.phone}`, '_blank')}
                variant="outline"
                className="flex-shrink min-w-[60px] px-2 text-blue-600 border-blue-600 hover:bg-blue-50 text-xs"
              >
                Call
              </Button>
              <Button
                onClick={() => window.open(`mailto:${card.email}`, '_blank')}
                variant="outline"
                className="flex-shrink min-w-[60px] px-2 text-blue-600 border-blue-600 hover:bg-blue-50 text-xs"
              >
                Email
              </Button>
              <Button
                onClick={() => setShowQRCode(true)}
                variant="outline"
                className="flex-shrink min-w-[60px] px-2 text-blue-600 border-blue-600 hover:bg-blue-50 flex items-center justify-center space-x-1 text-xs"
              >
                <QrCode className="h-3 w-3" />
                <span>QR</span>
              </Button>
              <Button
                onClick={handleShare}
                variant="outline"
                className="flex-shrink min-w-[60px] px-2 text-blue-600 border-blue-600 hover:bg-blue-50 text-xs"
              >
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>
      {showQRCode && card && (
        <QRCodeGenerator
          cardData={card}
          onClose={() => setShowQRCode(false)}
          cardUrl={window.location.href}
        />
      )}
      {/* App Branding and CTA Button - Improved UX */}
      <div className="max-w-sm mx-auto mt-12 flex flex-col items-center">
        <hr className="w-full mb-4 border-gray-200" />
        <div className="flex items-center justify-center gap-3 w-full flex-wrap">
          <span className="text-slate-500 text-xs">
            Powered by <span className="font-bold text-blue-600">DigitalCards</span>
          </span>
          <Button
            className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-105 hover:shadow-lg transition-transform text-white px-3 py-1.5 rounded-full font-medium text-xs min-h-0 min-w-0"
            aria-label="Create your own digital card"
            onClick={() => window.location.href = '/'}
          >
            {/* Plus icon SVG */}
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Create Your Own Digital Card
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PublicCardView;
