import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const VerifyEmail = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Supabase does not have getSessionFromUrl, so parse URL manually
        const url = new URL(window.location.href);
        const access_token = url.searchParams.get('access_token');
        const type = url.searchParams.get('type');

        if (type !== 'recovery' && access_token) {
          // Set session manually
          // Supabase setSession requires both access_token and refresh_token
          const refresh_token = url.searchParams.get('refresh_token');
          if (!refresh_token) {
            toast.error('Email verification failed: missing refresh token.');
            navigate('/signin');
            return;
          }
          await supabase.auth.setSession({ access_token, refresh_token });
          toast.success('Email verified successfully! You are now signed in.');
          navigate('/dashboard'); // Redirect to dashboard or home page
        } else {
          toast.error('Email verification failed or link expired.');
          navigate('/signin'); // Redirect to sign-in page
        }
      } catch (err) {
        toast.error('An unexpected error occurred during email verification.');
        navigate('/signin');
      }
    };

    verifyEmail();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg font-semibold">Verifying your email, please wait...</p>
    </div>
  );
};

export default VerifyEmail;
