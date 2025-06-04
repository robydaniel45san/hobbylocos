
import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Inicializar estado de autenticación
  const initializeAuth = useCallback(async () => {
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      
      // Verificar sesión actual
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);

      // Configurar listener para cambios de autenticación
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      );

      setLoading(false);
      return () => subscription.unsubscribe();
    } catch (error) {
      console.error('Error inicializando auth:', error);
      setLoading(false);
    }
  }, []);

  // Iniciar sesión
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Bienvenido",
        description: "Has iniciado sesión correctamente",
      });

      return { success: true, user: data.user };
    } catch (error: any) {
      toast({
        title: "Error de autenticación",
        description: error.message || "Error al iniciar sesión",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  }, []);

  // Registrarse
  const signUp = useCallback(async (email: string, password: string, metadata?: any) => {
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;

      toast({
        title: "Registro exitoso",
        description: "Verifica tu correo para activar tu cuenta",
      });

      return { success: true, user: data.user };
    } catch (error: any) {
      toast({
        title: "Error de registro",
        description: error.message || "Error al registrarse",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  }, []);

  // Cerrar sesión
  const signOut = useCallback(async () => {
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;

      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Error al cerrar sesión",
        variant: "destructive",
      });
    }
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user
  };
};
