
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Shield, Zap, Globe, Users, Star } from "lucide-react";

interface HomePageProps {
  onNavigate: (section: string) => void;
}

const HomePage = ({ onNavigate }: HomePageProps) => {
  const features = [
    {
      icon: <Sparkles className="h-8 w-8 text-blue-500" />,
      title: "Beautiful Templates",
      description: "Choose from our collection of professionally designed templates"
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-500" />,
      title: "Instant Creation",
      description: "Create your digital business card in minutes, not hours"
    },
    {
      icon: <Globe className="h-8 w-8 text-green-500" />,
      title: "Share Anywhere",
      description: "Share your card with a simple link or QR code"
    },
    {
      icon: <Shield className="h-8 w-8 text-purple-500" />,
      title: "Secure & Private",
      description: "Your data is safe and secure with enterprise-grade protection"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Director",
      content: "The best digital card platform I've used. Clean, professional, and easy to share.",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Entrepreneur",
      content: "Saved me hours of design work. The templates are gorgeous and customizable.",
      rating: 5
    },
    {
      name: "Emma Wilson",
      role: "Sales Manager",
      content: "My clients love receiving my digital card. It's so much more impressive than paper cards.",
      rating: 5
    }
  ];

  return (
    <div className="pt-20 pb-16">
      {/* Hero Section */}
      <section className="px-4 py-20 text-center">
        <div className="max-w-5xl mx-auto">
          <Badge className="mb-6 bg-blue-100 text-blue-700 border-blue-200 px-4 py-2">
            ✨ Create Your Digital Identity
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent mb-8 leading-tight">
            Professional Digital
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Business Cards
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Create stunning, professional digital business cards in minutes. 
            Share them instantly with QR codes, links, or social media. 
            No more lost paper cards or outdated contact information.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              onClick={() => onNavigate("templates")}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => onNavigate("templates")}
              className="border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-4 text-lg"
            >
              View Templates
            </Button>
          </div>
          
          <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-slate-500">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>10,000+ Users</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 fill-current text-yellow-400" />
              <span>4.9/5 Rating</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4" />
              <span>50+ Countries</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Why Choose DigitalCards?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Everything you need to create, customize, and share professional digital business cards
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <div className="mb-4 flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Loved by Professionals
            </h2>
            <p className="text-lg text-slate-600">
              See what our users have to say about DigitalCards
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-slate-700 mb-6 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-semibold text-slate-900">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-slate-600">
                      {testimonial.role}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Create Your Digital Card?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have already made the switch to digital business cards
          </p>
          <Button 
            size="lg" 
            onClick={() => onNavigate("templates")}
            className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold"
          >
            Start Creating Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
