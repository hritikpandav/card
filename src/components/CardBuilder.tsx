import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import CardPreview from "@/components/CardPreview";
import QRCodeGenerator from "@/components/QRCodeGenerator";
import CardBuilderHeader from "@/components/card-builder/CardBuilderHeader";
import EditorTabs from "@/components/card-builder/EditorTabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSubscription } from "@/hooks/useSubscription";

interface CardBuilderProps {
  selectedTemplate: any;
  selectedPlan?: any;
  selectedCard?: any;
  onNavigate: (section: string) => void;
}

const CardBuilder = ({ selectedTemplate, selectedPlan, selectedCard, onNavigate }: CardBuilderProps) => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const { getSubscriptionStatus } = useSubscription();
  const [activeTab, setActiveTab] = useState("content");
  const [saving, setSaving] = useState(false);
  const [cardData, setCardData] = useState(() => {
    if (selectedCard) {
      return {
        name: selectedCard.name || "John Doe",
        title: selectedCard.title || "Marketing Manager",
        company: selectedCard.company || "TechCorp Inc.",
        email: selectedCard.email || "",
        phone: selectedCard.phone || "",
        website: selectedCard.website || "",
        bio: selectedCard.bio || "",
        profileImage: selectedCard.profile_image || null,
        social: selectedCard.social || {
          linkedin: "",
          twitter: "",
          instagram: "",
          facebook: "",
          youtube: ""
        },
        colors: selectedCard.colors || {
          primary: selectedTemplate?.colors?.[0] || "#1E40AF",
          secondary: selectedTemplate?.colors?.[1] || "#3B82F6",
          accent: selectedTemplate?.colors?.[2] || "#EF4444",
          background: selectedTemplate?.colors?.[3] || "#FFFFFF"
        },
        template: selectedCard.template || selectedTemplate?.id || "professional-navy"
      };
    } else {
      return {
        name: "John Doe",
        title: "Marketing Manager", 
        company: "TechCorp Inc.",
        email: "john.doe@techcorp.com",
        phone: "+1 (555) 123-4567",
        website: "www.johndoe.com",
        bio: "Passionate marketing professional with 8+ years of experience in digital marketing and brand strategy.",
        profileImage: null as string | null,
        social: {
          linkedin: "https://linkedin.com/in/johndoe",
          twitter: "https://twitter.com/johndoe",
          instagram: "https://instagram.com/johndoe",
          facebook: "https://facebook.com/johndoe",
          youtube: "https://youtube.com/@johndoe"
        },
        colors: {
          primary: selectedTemplate?.colors?.[0] || "#1E40AF",
          secondary: selectedTemplate?.colors?.[1] || "#3B82F6", 
          accent: selectedTemplate?.colors?.[2] || "#EF4444",
          background: selectedTemplate?.colors?.[3] || "#FFFFFF"
        },
        template: selectedTemplate?.id || "professional-navy"
      };
    }
  });

  const [showQRCode, setShowQRCode] = useState(false);
  const [savedCardSlug, setSavedCardSlug] = useState<string | null>(null);
  const [userCardsCount, setUserCardsCount] = useState<number | null>(null);

  // Fetch user's card count on mount
  useEffect(() => {
    const fetchCardCount = async () => {
      if (!user) return;
      const { count, error } = await supabase
        .from('digital_cards')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      if (!error) setUserCardsCount(count ?? 0);
    };
    if (!selectedCard) fetchCardCount();
  }, [user, selectedCard]);

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setCardData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev] as any,
          [child]: value
        }
      }));
    } else {
      setCardData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleImageUpload = (imageUrl: string) => {
    setCardData(prev => ({
      ...prev,
      profileImage: imageUrl
    }));
  };

  const handleColorChange = (colorType: string, color: string) => {
    setCardData(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorType]: color
      }
    }));
  };

  const handleApplyColorPreset = (preset: { name: string; colors: string[] }) => {
    setCardData(prev => ({
      ...prev,
      colors: {
        primary: preset.colors[0],
        secondary: preset.colors[1],
        accent: preset.colors[2],
        background: preset.colors[3]
      }
    }));
  };

  const handleSave = async () => {
    if (!user) {
      toast.error("Please sign in to save your card");
      return;
    }

    // Enforce free trial card limit
    const subscriptionStatus = getSubscriptionStatus();
    const isTrial = subscriptionStatus.status === 'trial';
    const trialCardLimit = 1;
    if (!selectedCard && isTrial && userCardsCount !== null && userCardsCount >= trialCardLimit) {
      toast.error("Free trial users can only create one card. Upgrade to add more.");
      return;
    }

    setSaving(true);

    try {
      console.log('Saving card with data:', cardData);

      let slugData = null;
      if (!selectedCard) {
        // Generate a unique slug only for new cards
        const { data: slugResponse, error: slugError } = await supabase
          .rpc('generate_card_slug', { input_name: cardData.name });

        if (slugError) {
          console.error('Error generating slug:', slugError);
          throw slugError;
        }
        slugData = slugResponse;
      }

      let data, error;
      if (selectedCard && selectedCard.id) {
        // Update existing card
        ({ data, error } = await supabase
          .from('digital_cards')
          .update({
            name: cardData.name,
            title: cardData.title,
            company: cardData.company,
            email: cardData.email,
            phone: cardData.phone,
            website: cardData.website,
            bio: cardData.bio,
            social: cardData.social,
            colors: cardData.colors,
            template: cardData.template,
            profile_image: cardData.profileImage
          })
          .eq('id', selectedCard.id)
          .select()
          .single());
      } else {
        // Insert new card
        ({ data, error } = await supabase
          .from('digital_cards')
          .insert({
            user_id: user.id,
            name: cardData.name,
            title: cardData.title,
            company: cardData.company,
            email: cardData.email,
            phone: cardData.phone,
            website: cardData.website,
            bio: cardData.bio,
            social: cardData.social,
            colors: cardData.colors,
            template: cardData.template,
            slug: slugData,
            is_public: true,
            profile_image: cardData.profileImage
          })
          .select()
          .single());
      }

      if (error) {
        console.error('Error saving card:', error);
        throw error;
      }

      console.log('Card saved successfully:', data);
      setSavedCardSlug(data.slug);
      toast.success(selectedCard ? "Card updated successfully!" : "Card saved successfully!", {
        description: selectedCard ? "Your digital card has been updated." : "Your digital card is now live and can be shared with others."
      });
    } catch (error) {
      console.error('Error saving card:', error);
      toast.error("Failed to save card", {
        description: "Please try again or check your connection."
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = () => {
    toast.success("Card downloaded!", {
      description: "Your card has been saved as an image."
    });
  };

  const handleShare = () => {
    if (savedCardSlug) {
      const shareUrl = `${window.location.origin}/card/${savedCardSlug}`;
      if (navigator.share) {
        navigator.share({
          title: `${cardData.name}'s Digital Card`,
          text: `Connect with ${cardData.name}`,
          url: shareUrl
        });
      } else {
        navigator.clipboard.writeText(shareUrl);
        toast.success("Card link copied!", {
          description: "Share this link with others to view your card."
        });
      }
    } else {
      toast.error("Please save your card first to get a shareable link");
    }
  };

  return (
    <div className="pt-16 md:pt-20 pb-8 md:pb-16 px-2 md:px-4 min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        <CardBuilderHeader
          onNavigate={onNavigate}
          onShowQRCode={() => setShowQRCode(true)}
          onDownload={handleDownload}
          onShare={handleShare}
          onSave={handleSave}
          saving={saving}
          savedCardSlug={savedCardSlug}
        />

        <div className={`grid ${isMobile ? 'grid-cols-1' : 'lg:grid-cols-2'} gap-4 md:gap-8`}>
          {/* Editor Panel */}
          <div className={`space-y-4 md:space-y-6 ${isMobile ? 'order-2' : ''}`}>
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3 md:pb-6">
                <CardTitle className="flex items-center space-x-2 text-lg md:text-xl">
                  <Eye className="h-4 w-4 md:h-5 md:w-5" />
                  <span>Live Editor</span>
                  <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                    Live Preview
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <EditorTabs
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  cardData={cardData}
                  selectedTemplate={selectedTemplate}
                  onInputChange={handleInputChange}
                  onImageUpload={handleImageUpload}
                  onColorChange={handleColorChange}
                  onApplyColorPreset={handleApplyColorPreset}
                />
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className={`${isMobile ? 'order-1 mb-4' : 'lg:sticky lg:top-24'}`}>
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3 md:pb-6">
                <CardTitle className="flex items-center justify-between text-lg md:text-xl">
                  <span>Live Preview</span>
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
                    Responsive
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardPreview cardData={cardData} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRCode && (
        <QRCodeGenerator
          cardData={cardData}
          cardUrl={savedCardSlug ? `${window.location.origin}/card/${savedCardSlug}` : ''}
          onClose={() => setShowQRCode(false)}
        />
      )}
    </div>
  );
};

export default CardBuilder;
