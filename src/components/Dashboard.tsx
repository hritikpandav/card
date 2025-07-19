
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Eye, QrCode, Share2, Edit, Globe, BarChart3, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";

interface DigitalCard {
  id: string;
  name: string;
  template: string;
  is_public: boolean;
  slug: string;
  created_at: string;
  updated_at: string;
  title?: string;
  company?: string;
  views?: number;
}

interface CardStats {
  totalViews: number;
  totalScans: number;
}

const Dashboard = ({ onNavigate }: { onNavigate: (section: string) => void }) => {
  const { user } = useAuth();
  const { subscription, getSubscriptionStatus } = useSubscription();
  const [cards, setCards] = useState<DigitalCard[]>([]);
  const [cardStats, setCardStats] = useState<CardStats>({ totalViews: 0, totalScans: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserCards();
    }
  }, [user]);

  const fetchUserCards = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('digital_cards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch view counts for each card
      const cardsWithViews = await Promise.all(
        (data || []).map(async (card) => {
          const { data: viewCount } = await supabase
            .rpc('get_card_view_count', { card_uuid: card.id });
          
          return {
            ...card,
            views: viewCount || 0
          };
        })
      );

      setCards(cardsWithViews);

      // Calculate total stats
      const totalViews = cardsWithViews.reduce((sum, card) => sum + (card.views || 0), 0);
      setCardStats({ totalViews, totalScans: 0 });
    } catch (error) {
      console.error('Error fetching cards:', error);
      toast.error('Failed to load your cards');
    } finally {
      setLoading(false);
    }
  };

  const deleteCard = async (cardId: string) => {
    try {
      const { error } = await supabase
        .from('digital_cards')
        .delete()
        .eq('id', cardId);

      if (error) throw error;

      setCards(prev => prev.filter(c => c.id !== cardId));
      toast.success('Card deleted successfully!');
    } catch (error) {
      console.error('Error deleting card:', error);
      toast.error('Failed to delete card');
    }
  };

  const toggleCardLive = async (cardId: string) => {
    const card = cards.find(c => c.id === cardId);
    if (!card) return;

    try {
      const { error } = await supabase
        .from('digital_cards')
        .update({ is_public: !card.is_public })
        .eq('id', cardId);

      if (error) throw error;

      setCards(prev => prev.map(c => 
        c.id === cardId 
          ? { ...c, is_public: !c.is_public }
          : c
      ));

      toast.success(`Card "${card.name}" ${card.is_public ? 'taken offline' : 'is now live'}!`);
    } catch (error) {
      console.error('Error updating card status:', error);
      toast.error('Failed to update card status');
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

  const handleShareCard = (card: DigitalCard) => {
    if (card.slug) {
      const shareUrl = `${window.location.origin}/card/${card.slug}`;
      copyToClipboard(shareUrl)
        .then(() => toast.success('Share link copied to clipboard!'))
        .catch(() => toast.error('Failed to copy share link'));
    } else {
      toast.error('Card slug not available');
    }
  };

  const handleGenerateQR = (card: DigitalCard) => {
    if (card.slug) {
      toast.success('QR code feature coming soon!');
    } else {
      toast.error('Card slug not available');
    }
  };

  const subscriptionStatus = getSubscriptionStatus();
  const liveCards = cards.filter(card => card.is_public).length;

  if (loading) {
    return (
      <div className="pt-20 pb-16 px-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-16 px-4 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">My Digital Cards</h1>
            <p className="text-slate-600">Manage and track your digital business cards</p>
          </div>
          <Button 
            onClick={() => onNavigate("templates")}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white mt-4 md:mt-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Card
          </Button>
        </div>

        {/* Subscription Status Banner */}
        {subscriptionStatus && (
          <div className="mb-8">
            {subscriptionStatus.status === 'trial' && subscriptionStatus.daysLeft && subscriptionStatus.daysLeft > 0 && (
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-700 font-medium">
                      🎉 Free Trial Active - {subscriptionStatus.daysLeft} days remaining
                    </p>
                    <p className="text-blue-600 text-sm">
                      Upgrade to continue using all features after your trial expires.
                    </p>
                  </div>
                  <Button
                    onClick={() => onNavigate("payment")}
                    variant="outline"
                    className="border-blue-300 text-blue-700 hover:bg-blue-50"
                  >
                    Upgrade Now
                  </Button>
                </div>
              </div>
            )}
            
            {subscriptionStatus.status === 'expired' && (
              <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-700 font-medium">
                      ⚠️ Trial Expired - Upgrade to continue
                    </p>
                    <p className="text-red-600 text-sm">
                      Your cards are still visible, but some features are limited.
                    </p>
                  </div>
                  <Button
                    onClick={() => onNavigate("payment")}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Upgrade Now
                  </Button>
                </div>
              </div>
            )}
            
            {subscriptionStatus.status === 'active' && (
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                <p className="text-green-700 font-medium">
                  ✅ Premium Subscription Active
                </p>
              </div>
            )}
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Total Cards</p>
                  <p className="text-2xl font-bold text-slate-900">{cards.length}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white">
                  <BarChart3 className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Live Cards</p>
                  <p className="text-2xl font-bold text-slate-900">{liveCards}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white">
                  <Globe className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Total Views</p>
                  <p className="text-2xl font-bold text-slate-900">{cardStats.totalViews}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white">
                  <Eye className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">QR Scans</p>
                  <p className="text-2xl font-bold text-slate-900">{cardStats.totalScans}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white">
                  <QrCode className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cards Grid */}
        {cards.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No cards yet</h3>
            <p className="text-slate-600 mb-6">Create your first digital business card to get started.</p>
            <Button 
              onClick={() => onNavigate("templates")}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Card
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card) => (
              <Card key={card.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-slate-900 mb-1">{card.name}</CardTitle>
                      <p className="text-sm text-slate-600">
                        {card.title && card.company ? `${card.title} at ${card.company}` : 'Professional Template'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        className={card.is_public 
                          ? "bg-green-100 text-green-700 border-green-200" 
                          : "bg-slate-100 text-slate-700 border-slate-200"
                        }
                      >
                        {card.is_public ? "Live" : "Draft"}
                      </Badge>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Card</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{card.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => deleteCard(card.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-slate-900">{card.views || 0}</div>
                      <div className="text-xs text-slate-600">Views</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-slate-900">0</div>
                      <div className="text-xs text-slate-600">Scans</div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => onNavigate("builder")}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleGenerateQR(card)}
                    >
                      <QrCode className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleShareCard(card)}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    {card.is_public && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/card/${card.slug}`, '_blank', 'noopener,noreferrer')}
                      >
                        View
                      </Button>
                    )}
                  </div>

                  <Button 
                    onClick={() => toggleCardLive(card.id)}
                    className={`w-full ${
                      card.is_public 
                        ? "bg-red-500 hover:bg-red-600 text-white" 
                        : "bg-green-500 hover:bg-green-600 text-white"
                    }`}
                    size="sm"
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    {card.is_public ? "Take Offline" : "Make Live"}
                  </Button>
                  
                  <p className="text-xs text-slate-500 text-center">
                    Updated {new Date(card.updated_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
