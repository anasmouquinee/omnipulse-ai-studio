/**
 * OmniPulse AI - Authentication Service
 * Manages user credentials, session state and access control.
 */

const AUTH_STORAGE_KEY = 'omnipulse_auth_session';

export interface UserSession {
  username: string;
  displayName: string;
  role: 'admin' | 'creator';
  loginTimestamp: number;
  token: string;
}

export const AuthService = {
  /**
   * Check if current user is logged in with a valid session
   */
  isAuthenticated(): boolean {
    try {
      const sessionStr = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!sessionStr) return false;
      const session: UserSession = JSON.parse(sessionStr);
      return session.username === 'anasmouquine' && !!session.token;
    } catch {
      return false;
    }
  },

  /**
   * Get current authenticated user details
   */
  getCurrentUser(): UserSession | null {
    try {
      const sessionStr = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!sessionStr) return null;
      return JSON.parse(sessionStr);
    } catch {
      return null;
    }
  },

  /**
   * Authenticate user with predefined credentials
   */
  login(username: string, pass: string): { success: boolean; message: string } {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (cleanUser === 'anasmouquine' && cleanPass === 'anaskaelar2004') {
      const session: UserSession = {
        username: 'anasmouquine',
        displayName: 'Anas Mouquine',
        role: 'admin',
        loginTimestamp: Date.now(),
        token: `tok_omni_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
      return { success: true, message: 'Connexion réussie.' };
    }

    return { 
      success: false, 
      message: 'Identifiant ou mot de passe incorrect. Veuillez réessayer.' 
    };
  },

  /**
   * Logout user and clear session
   */
  logout(): void {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
};
