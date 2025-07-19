import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PricingSection from "@/components/PricingSection";
import Dashboard from "@/components/Dashboard";
import TemplateGallery from "@/components/TemplateGallery";
import CardBuilder from "@/components/CardBuilder";
import PaymentPage from "@/components/PaymentPage";
import HomePage from "@/components/HomePage";
import AIChatBot from "@/components/AIChatBot";
import { useAuth } from "@/hooks/useAuth";
import AuthDialog from "@/components/AuthDialog";
import { useSubscription } from "@/hooks/useSubscription";

const Index = () => {
  const [currentSection, setCurrentSection] = useState("home");
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const { user } = useAuth();
  const { getSubscriptionStatus, loading: subscriptionLoading } = useSubscription();

  useEffect(() => {
    console.log('Current section:', currentSection, 'User:', user?.email);
  }, [user, currentSection]);

  const handleNavigate = (section: string, data?: { selectedTemplate?: any; selectedPlan?: any }) => {
    console.log('Navigating to:', section, 'with data:', data);
    if ((section === "dashboard" || section === "templates" || section === "builder" || section === "payment") && !user) {
      setShowAuthDialog(true);
      return;
    }
    if (data?.selectedTemplate) {
      console.log('Setting selectedTemplate:', data.selectedTemplate);
      setSelectedTemplate(data.selectedTemplate);
    }
    if (data?.selectedPlan) {
      console.log('Setting selectedPlan:', data.selectedPlan);
      setSelectedPlan(data.selectedPlan);
    }
    console.log('Setting currentSection to:', section);
    setCurrentSection(section);
  };

  const handleTemplateSelect = (template: any) => {
    if (subscriptionLoading) {
      // Optionally show loading or prevent action
      return;
    }
    const subscriptionStatus = getSubscriptionStatus();
    if (subscriptionStatus.isActive) {
      setSelectedTemplate(template);
      setCurrentSection("builder");
    } else {
      setSelectedTemplate(template);
      // Ensure selectedTemplate is set before navigating to pricing
      setCurrentSection("pricing");
    }
  };

  const onPlanSelect = (plan: any, template?: any) => {
    console.log('onPlanSelect called with plan:', plan, 'template:', template);
    if (template) {
      console.log('Setting selectedTemplate:', template);
      setSelectedTemplate(template);
    }
    if (plan) {
      // Transform plan to match PaymentPage expected format
      const transformedPlan = {
        id: plan.id,
        name: plan.name,
        price: plan.price_cents ? plan.price_cents / 100 : 0,
        duration: plan.duration_months,
        features: plan.duration_months ? getPlanFeatures(plan.duration_months) : []
      };
      setSelectedPlan(transformedPlan);
    }
    if (!template && !selectedTemplate) {
      console.log('No template selected, navigating to templates');
      setCurrentSection("templates");
    } else {
      console.log('Navigating to payment page');
      setCurrentSection("payment");
    }
  };

  // Helper function to get plan features (copied from PricingSection)
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

  const renderSection = () => {
    console.log('Rendering section:', currentSection);
    switch (currentSection) {
      case "dashboard":
        return <Dashboard onNavigate={handleNavigate} />;
      case "templates":
        return <TemplateGallery 
          onTemplateSelect={handleTemplateSelect} 
          onNavigate={handleNavigate} 
        />;
      case "builder":
        return <CardBuilder selectedTemplate={selectedTemplate} selectedPlan={selectedPlan} onNavigate={handleNavigate} />;
      case "payment":
        console.log('Rendering PaymentPage with selectedTemplate:', selectedTemplate, 'selectedPlan:', selectedPlan);
        return <PaymentPage selectedTemplate={selectedTemplate} selectedPlan={selectedPlan} onNavigate={handleNavigate} />;
      case "pricing":
        console.log('Rendering PricingSection with selectedTemplate:', selectedTemplate);
        return <PricingSection selectedTemplate={selectedTemplate} onPlanSelect={onPlanSelect} />;
      case "home":
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header onNavigate={handleNavigate} activeSection={currentSection} />
      
      {renderSection()}
      
      <Footer />
      
      {/* AI Chatbot - available on all pages */}
      <AIChatBot />
      
      <AuthDialog 
        isOpen={showAuthDialog} 
        onClose={() => setShowAuthDialog(false)} 
      />
    </div>
  );
};

export default Index;
