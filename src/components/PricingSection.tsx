import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import AuthDialog from "./AuthDialog";
import { toast } from "sonner";

interface SubscriptionPlan {
  id: string;
  name: string;
  duration_months: number;
  price_cents: number;
}

interface UserSubscription {
  status: string;
  trial_end: string;
  subscription_end: string;
  plan_id: string;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  duration_months: number;
  price_cents: number;
}

interface UserSubscription {
  status: string;
  trial_end: string;
  subscription_end: string;
  plan_id: string;
}

interface PricingSectionProps {
  selectedTemplate?: any;
  onPlanSelect?: (plan: SubscriptionPlan, selectedTemplate?: any) => void;
  onNavigate?: (section: string) => void;
}

const PricingSection = ({ selectedTemplate, onPlanSelect }: PricingSectionProps) => {
  const { user } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authDefaultTab, setAuthDefaultTab] = useState<"signin" | "signup">("signup");
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
    if (user) {
      fetchUserSubscription();
    }
  }, [user]);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .order('duration_months');
      
      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast.error('Failed to load subscription plans');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserSubscription = async () => {
    if (!user) return;
    
    try {
      const { data, error, status } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && status !== 406 && error.code !== 'PGRST116') throw error;
      if (status === 406) {
        console.warn('Received 406 Not Acceptable from Supabase, retrying with explicit accept header');
        // Retry with explicit accept header
        const { data: retryData, error: retryError } = await supabase
          .from('user_subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .single();
        if (retryError) {
          console.error('Retry error fetching user subscription:', retryError);
        } else {
          setUserSubscription(retryData);
        }
      } else {
        setUserSubscription(data);
      }
    } catch (error) {
      console.error('Error fetching user subscription:', error);
    }
  };

  const isTrialActive = (subscription: UserSubscription) => {
    return subscription.status === 'trial' && new Date(subscription.trial_end) > new Date();
  };

  const isSubscriptionActive = (subscription: UserSubscription) => {
    return subscription.status === 'active' && new Date(subscription.subscription_end) > new Date();
  };

  const getCurrentPlanId = () => {
    if (!userSubscription) return null;
    if (isTrialActive(userSubscription) || isSubscriptionActive(userSubscription)) {
      return userSubscription.plan_id;
    }
    return null;
  };

  const formatPrice = (priceCents: number) => {
    return `₹${(priceCents / 100).toFixed(0)}`;
  };

  const getPlanFeatures = (duration: number) => {
    const baseFeatures = [
      "Unlimited digital cards",
      "Premium templates",
      "Custom branding",
      "Analytics & insights",
      "Priority support",
      "Export as image/PDF",
      "Social media integration"
    ];

    if (duration >= 12) {
      return [...baseFeatures, "Advanced customization", "WhatsApp integration", "Bulk card creation"];
    } else if (duration >= 6) {
      return [...baseFeatures, "Advanced customization", "WhatsApp integration"];
    } else if (duration >= 3) {
      return [...baseFeatures, "Advanced customization"];
    }
    
    return baseFeatures;
  };

  const handlePlanSelect = (plan: SubscriptionPlan) => {
    console.log('PricingSection - plan selected:', plan);
    if (!user) {
      setAuthDefaultTab("signup");
      setShowAuthDialog(true);
      return;
    }

    if (onPlanSelect) {
      console.log('PricingSection - calling onPlanSelect with plan and selectedTemplate:', plan, selectedTemplate);
      onPlanSelect(plan, selectedTemplate);
    }
  };

  if (loading) {
    return (
      <div className="pt-20 pb-16 px-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading subscription plans...</p>
        </div>
      </div>
    );
  }

  const currentPlanId = getCurrentPlanId();

  return (
    <div className="pt-20 pb-16 px-4 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 px-4 py-2">
            💳 Simple Pricing
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Start with a 7-day free trial, then choose the plan that works best for you.
            All plans include unlimited digital cards and premium features.
          </p>
        </div>

        {/* Trial Status */}
        {userSubscription && isTrialActive(userSubscription) && (
          <div className="mb-8 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
            <div className="text-center">
              <p className="text-green-700 font-medium">
                🎉 You're on a free trial! 
                <span className="ml-2">
                  Expires: {new Date(userSubscription.trial_end).toLocaleDateString()}
                </span>
              </p>
            </div>
          </div>
        )}

        {/* Free Plan Card */}
        <div className="mb-8">
          <Card className="relative border-0 shadow-lg bg-gradient-to-br from-slate-50 to-slate-100 max-w-md mx-auto">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-slate-600 to-slate-800 flex items-center justify-center text-white mx-auto mb-4">
                <Star className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-900">Free Trial</CardTitle>
              <div className="text-center">
                <span className="text-3xl font-bold text-slate-900">₹0</span>
                <span className="text-slate-600">/7 days</span>
              </div>
              <p className="text-sm text-slate-600">Perfect for getting started</p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                {[
                  "7-day free trial",
                  "3 digital cards",
                  "Basic templates",
                  "QR code generation",
                  "Basic analytics"
                ].map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                onClick={() => {
                  if (!user) {
                    setAuthDefaultTab("signup");
                    setShowAuthDialog(true);
                  }
                }}
                disabled={!!userSubscription}
                className="w-full bg-gradient-to-r from-slate-600 to-slate-800 hover:opacity-90 text-white font-medium py-2.5 rounded-lg"
              >
                {userSubscription ? 'Trial Active' : 'Start Free Trial'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Subscription Plans Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {plans.map((plan, index) => {
            const isCurrentPlan = currentPlanId === plan.id;
            const isPopular = plan.duration_months === 3;
            // Add highlight for selected/hovered plan
            return (
              <div className={`relative group transition-all duration-300 ${isCurrentPlan ? 'z-10' : ''}`} key={plan.id}>
                <Card 
                  className={`relative border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group bg-white/80 backdrop-blur-sm
                    ${isPopular ? 'scale-105' : ''}
                    ${isCurrentPlan ? 'ring-4 ring-offset-2 ring-transparent bg-clip-padding before:content-[\'\'] before:absolute before:inset-0 before:rounded-2xl before:z-[-1] before:bg-[conic-gradient(at_top_left,_#6366f1,_#06b6d4,_#f59e42,_#f43f5e,_#6366f1)] before:animate-spin-slow before:opacity-80' :
                      'hover:ring-2 hover:ring-blue-400'}
                  `}
                  style={isCurrentPlan ? { boxShadow: '0 0 0 4px #fff, 0 0 0 8px #6366f1' } : {}}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0 px-4 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  {isCurrentPlan && (
                    <div className="absolute -top-3 right-4">
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 px-3 py-1">
                        Current Plan
                      </Badge>
                    </div>
                  )}
                  {/* ... existing CardHeader and CardContent ... */}
                  <CardHeader className="text-center pb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Zap className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-900">{plan.name}</CardTitle>
                    <div className="text-center">
                      <span className="text-3xl font-bold text-slate-900">{formatPrice(plan.price_cents)}</span>
                      <span className="text-slate-600">/{plan.duration_months === 1 ? 'month' : `${plan.duration_months} months`}</span>
                    </div>
                    <p className="text-sm text-slate-600">
                      {plan.duration_months >= 12 ? 'Best value for professionals' : 
                        plan.duration_months >= 6 ? 'Great for growing businesses' :
                        plan.duration_months >= 3 ? 'Perfect for small teams' : 'Ideal for individuals'}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {getPlanFeatures(plan.duration_months).map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start space-x-3">
                          <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-slate-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      onClick={() => handlePlanSelect(plan)}
                      disabled={isCurrentPlan}
                      className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white font-medium py-2.5 rounded-lg transition-all duration-300 ${
                        isPopular ? 'shadow-lg hover:shadow-xl' : ''
                      } ${isCurrentPlan ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isCurrentPlan ? 'Current Plan' : `Upgrade to ${plan.name}`}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                question: "How does the 7-day free trial work?",
                answer: "Start using all premium features immediately. No credit card required. After 7 days, choose a plan to continue."
              },
              {
                question: "Can I change plans anytime?",
                answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
              },
              {
                question: "What happens if I don't subscribe after the trial?",
                answer: "Your account will be limited to basic features, but your cards will remain accessible."
              },
              {
                question: "Do you offer refunds?",
                answer: "We offer a 30-day money-back guarantee for all paid plans if you're not completely satisfied."
              }
            ].map((faq, index) => (
              <Card key={index} className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-slate-900 mb-2">{faq.question}</h3>
                  <p className="text-slate-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 p-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl text-white">
          <h2 className="text-2xl font-bold mb-4">
            Ready to create your digital business card?
          </h2>
          <p className="text-lg opacity-90 mb-6">
            Start your free trial today and see the difference professional digital cards can make.
          </p>
          <Button 
            onClick={() => {
              if (!user) {
                setAuthDefaultTab("signup");
                setShowAuthDialog(true);
              } else {
                console.log("Navigate to templates");
              }
            }}
            size="lg" 
            className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-3 font-semibold rounded-xl"
          >
            {user ? "Create Your Card" : "Start Free Trial"}
          </Button>
        </div>
      </div>

      <AuthDialog 
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        defaultTab={authDefaultTab}
      />
    </div>
  );
};

export default PricingSection;
