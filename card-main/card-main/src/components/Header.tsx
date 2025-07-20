import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, X, User, Loader2 } from "lucide-react";
import { useState } from "react";
import AuthDialog from "./AuthDialog";
import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

const Header = ({ activeSection, onNavigate }: HeaderProps) => {
  const { user, signOut, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authDialogTab, setAuthDialogTab] = useState<"signin" | "signup">("signin");

  const navigation = [
    { name: "Home", section: "home" },
    { name: "Templates", section: "templates" },
    { name: "Pricing", section: "pricing" },
  ];

  const handleSignOut = async () => {
    await signOut();
    onNavigate("home");
  };

  const openSignInDialog = () => {
    setAuthDialogTab("signin");
    setShowAuthDialog(true);
  };

  const openSignUpDialog = () => {
    setAuthDialogTab("signup");
    setShowAuthDialog(true);
  };

  console.log('Header - user:', user?.email, 'loading:', loading);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div 
              onClick={() => onNavigate("home")}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                DigitalCards
              </span>
              <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-xs px-2 py-1">
                Pro
              </Badge>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => onNavigate(item.section)}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    activeSection === item.section
                      ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {item.name}
                </button>
              ))}
              {user && (
                <button
                  onClick={() => onNavigate("dashboard")}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    activeSection === "dashboard"
                      ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Dashboard
                </button>
              )}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-3">
              {user ? (
                <>
                  <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                    <User className="h-4 w-4 mr-2" />
                    {user.email?.split('@')[0]}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleSignOut}
                    className="text-slate-600 hover:text-slate-900"
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={openSignInDialog}
                    className="text-slate-600 hover:text-slate-900"
                    disabled={loading}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={openSignUpDialog}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg font-medium"
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Start Free Trial
                  </Button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-slate-600"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-slate-200 py-4">
              <div className="flex flex-col space-y-4">
                {navigation.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      onNavigate(item.section);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`text-left text-base font-medium transition-colors duration-200 py-2 ${
                      activeSection === item.section
                        ? "text-blue-600"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
                {user && (
                  <button
                    onClick={() => {
                      onNavigate("dashboard");
                      setIsMobileMenuOpen(false);
                    }}
                    className={`text-left text-base font-medium transition-colors duration-200 py-2 ${
                      activeSection === "dashboard"
                        ? "text-blue-600"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Dashboard
                  </button>
                )}
                <div className="flex flex-col space-y-2 pt-4 border-t border-slate-200">
                  {user ? (
                    <>
                      <Button variant="ghost" size="sm" className="justify-start text-slate-600 hover:text-slate-900">
                        <User className="h-4 w-4 mr-2" />
                        {user.email?.split('@')[0]}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          handleSignOut();
                          setIsMobileMenuOpen(false);
                        }}
                        className="justify-start text-slate-600 hover:text-slate-900"
                      >
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          openSignInDialog();
                          setIsMobileMenuOpen(false);
                        }}
                        className="justify-start text-slate-600 hover:text-slate-900"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Sign In
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => {
                          openSignUpDialog();
                          setIsMobileMenuOpen(false);
                        }}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white justify-start"
                      >
                        Start Free Trial
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <AuthDialog
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        defaultTab={authDialogTab}
      />
    </>
  );
};

export default Header;
