 
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('Attempting sign in for:', email);
    setLoading(true);
    let error = null;
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      error = signInError;
      if (signInError) {
        console.error('Sign in error:', signInError);
        // Show custom message for invalid credentials
        if (
          signInError.message?.toLowerCase().includes('invalid login credentials') ||
          signInError.message?.toLowerCase().includes('invalid email or password') ||
          signInError.status === 400
        ) {
          toast.error('Invalid login credentials');
        } else {
          toast.error(signInError.message);
        }
      } else {
        toast.success('Signed in successfully!');
      }
    } catch (err) {
      console.error('Unexpected sign in error:', err);
      toast.error('Unexpected error during sign in.');
      error = err;
    }
    setLoading(false);
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    console.log('Attempting sign up for:', email);
    setLoading(true);
    const redirectUrl = 'https://card-rouge-psi.vercel.app/verify-email'; // public URL for email verification page
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      // @ts-ignore
      emailRedirectTo: redirectUrl,
    } as any);

    if (error) {
      console.error('Sign up error:', error);
      // Check for duplicate email error from Supabase
      if (
        error.message?.toLowerCase().includes('user already registered') ||
        (error.message?.toLowerCase().includes('email') && error.message?.toLowerCase().includes('exists')) ||
        error.status === 400
      ) {
        toast.error('Email is already registered.');
      } else {
        toast.error(error.message);
      }
      setLoading(false);
      return { error };
    }

    toast.success('Account created! Please check your email to verify your account.');
    setLoading(false);
    return { error: null };
  };

  const signOut = async () => {
    console.log('Signing out user');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
      toast.error('Error signing out');
    } else {
      toast.success('Signed out successfully');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signIn,
      signUp,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
