import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Lock } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface PaymentFormData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  duration: number;
  features: string[];
}

interface PaymentPageProps {
  selectedTemplate?: any;
  selectedPlan?: Plan;
  onNavigate: (section: string, data?: { selectedTemplate?: any; selectedPlan?: Plan }) => void;
}

const PaymentPage = ({ selectedTemplate, selectedPlan, onNavigate }: PaymentPageProps) => {
  const { user } = useAuth();
  const [paymentData, setPaymentData] = useState<PaymentFormData>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: ""
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof PaymentFormData, value: string) => {
    setPaymentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const simulatePayment = async () => {
    setLoading(true);
    
    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock payment success (using free fake payment API concept)
        const paymentResult = {
          success: true,
          transactionId: `txn_${Date.now()}`,
          amount: selectedPlan && selectedPlan.price ? selectedPlan.price : 0,
          currency: 'USD'
        };

      console.log('simulatePayment - user:', user);
      console.log('simulatePayment - paymentResult:', paymentResult);

      if (!selectedTemplate || !selectedTemplate.id) {
        throw new Error('No template selected');
      }

      if (paymentResult.success) {
        // Update user subscription in database
        const subscriptionEnd = new Date();
        if (selectedPlan) {
          subscriptionEnd.setMonth(subscriptionEnd.getMonth() + selectedPlan.duration);
        }

        const { error: subscriptionError } = await supabase
          .from('user_subscriptions')
          .upsert({
            user_id: user ? user.id : 'test-user',
            plan_id: selectedPlan ? selectedPlan.id : '',
            status: 'active',
            subscription_start: new Date().toISOString(),
            subscription_end: subscriptionEnd.toISOString(),
            updated_at: new Date().toISOString()
          });

        if (subscriptionError) {
          console.error('Subscription upsert error:', subscriptionError);
          toast.error(`Subscription error: ${subscriptionError.message || subscriptionError}`, { duration: 3000 });
          // Do not return here
        }

        // Insert payment record for template
        const { error: paymentError } = await supabase
          .from('user_template_payments')
          .upsert({
            user_id: user ? user.id : 'test-user',
            template_id: selectedTemplate.id,
            plan_id: selectedPlan ? selectedPlan.id : '',
            payment_status: 'active',
            payment_date: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (paymentError) {
          console.error('Payment upsert error:', paymentError);
          // Removed toast error for paymentError as requested
          // toast.error(`Payment error: ${paymentError.message || paymentError}`, { duration: 3000 });
          // Do not return here
        }

        toast.success(`Payment successful! Welcome to ${selectedPlan ? selectedPlan.name : 'your'} plan!`);
        setTimeout(() => {
          onNavigate('builder', { selectedTemplate, selectedPlan });
        }, 1500);
      } else {
        toast.error('Payment failed. Please try again.', { duration: 2000 });
        setTimeout(() => {
          onNavigate('builder', { selectedTemplate, selectedPlan });
        }, 1500);
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(`Payment failed: ${error.message || error}`, { duration: 3000 });
      setTimeout(() => {
        onNavigate('builder', { selectedTemplate, selectedPlan });
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  const validatePaymentData = () => {
    // Card number: 16 digits
    const cardNumber = paymentData.cardNumber.replace(/\s/g, '');
    if (!/^\d{16}$/.test(cardNumber)) {
      toast.error('Please enter a valid 16-digit card number.', { duration: 2000 });
      return false;
    }
    // Expiry: MM/YY, month 01-12, year >= current year
    const [mm, yy] = paymentData.expiryDate.split('/');
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;
    if (!mm || !yy || isNaN(Number(mm)) || isNaN(Number(yy)) || Number(mm) < 1 || Number(mm) > 12) {
      toast.error('Please enter a valid expiry date (MM/YY).', { duration: 2000 });
      return false;
    }
    if (Number(yy) < currentYear || (Number(yy) === currentYear && Number(mm) < currentMonth)) {
      toast.error('Card expiry date must be in the future.', { duration: 2000 });
      return false;
    }
    // CVV: 3 digits
    if (!/^\d{3}$/.test(paymentData.cvv)) {
      toast.error('Please enter a valid 3-digit CVV.', { duration: 2000 });
      return false;
    }
    // Cardholder name: not empty
    if (!paymentData.cardholderName.trim()) {
      toast.error('Please enter the cardholder name.', { duration: 2000 });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please log in to continue', { duration: 2000 });
      return;
    }

    if (!selectedTemplate || !selectedTemplate.id) {
      toast.error('Please select a template before proceeding', { duration: 2000 });
      return;
    }

    if (!validatePaymentData()) {
      return;
    }

    await simulatePayment();
  };

  return (
    <div className="pt-20 pb-16 px-4 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:space-x-12">
        <div className="flex-1 text-center mb-8 md:mb-0">
          <h1 className="text-3xl font-bold text-slate-900 mb-6">Payment Details</h1>
          {selectedPlan && (
            <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200 max-w-md mx-auto">
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">
                <span>Select Plan Details</span>
              </h2>
              <div className="mb-4">
                <button
                  type="button"
                  onClick={() => onNavigate('pricing', { selectedTemplate })}
                  className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                >
                  &larr; Back to Plans
                </button>
              </div>
              <p className="text-lg font-semibold text-gray-800 mb-2">
                {selectedPlan?.name} - <span className="text-blue-600">${selectedPlan?.price ? selectedPlan.price.toFixed(2) : '0.00'}</span>
              </p>
              <p className="text-sm text-gray-600 mb-3">Duration: {selectedPlan?.duration} month{selectedPlan?.duration > 1 ? 's' : ''}</p>
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-2">Features:</p>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 max-h-40 overflow-y-auto">
                  {selectedPlan?.features?.map((feature, index) => (
                    <li key={index} className="pl-1">{feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          <p className="text-slate-600 mt-6 flex items-center justify-between max-w-md mx-auto">
            Complete your payment to unlock all features
            <button
              type="button"
              onClick={() => onNavigate('pricing', { selectedTemplate })}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-1 px-3 rounded shadow transition duration-200"
            >
              &larr; Back to Plans
            </button>
          </p>
        </div>

        <div className="flex-1 max-w-md mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Payment Details</span>
                </CardTitle>
                <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300 font-semibold text-xs px-2 py-1 rounded">Dummy Payment Gateway</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {/* Test Card Info */}
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                <strong>Test Card:</strong> Use any 16-digit card number, any future expiry, any 3-digit CVV.<br/>
                Example: 4242 4242 4242 4242, 12/34, 123
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="cardholderName">Cardholder Name</Label>
                  <Input
                    id="cardholderName"
                    placeholder="John Doe"
                    value={paymentData.cardholderName}
                    onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={paymentData.cardNumber}
                    onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                    maxLength={19}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/YY"
                      value={paymentData.expiryDate}
                      onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                      maxLength={5}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={paymentData.cvv}
                      onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                      maxLength={3}
                      required
                    />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold">Total:</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {selectedPlan && selectedPlan.price ? `$${selectedPlan.price}` : '$0'}
                    </span>
                   </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Lock className="h-4 w-4" />
                        <span>Pay ${selectedPlan && selectedPlan.price ? selectedPlan.price : 0}</span>
                      </div>
                    )}
                  </Button>
                </div>
              </form>

              <div className="mt-4 text-center">
                <p className="text-xs text-slate-500 flex items-center justify-center space-x-1">
                  <Lock className="h-3 w-3" />
                  <span>Secure payment powered by demo API</span>
                </p>
              </div>
            </CardContent>
          </Card>
          {/* Loading Overlay */}
          {loading && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                <div className="text-blue-700 font-semibold text-lg mb-1">Processing Payment...</div>
                <div className="text-xs text-slate-500">Please wait while we process your dummy payment.</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
