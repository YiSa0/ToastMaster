
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import type { User } from 'firebase/auth';
import { 
  onAuthStateChanged, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth as firebaseAuthService, db } from '@/lib/firebase/config';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmailPassword: (email: string, password: string, displayName: string) => Promise<User | null>;
  signInWithEmailPassword: (email: string, password: string) => Promise<User | null>;
  signOut: () => Promise<void>;
  updateUserDisplayName: (displayName: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasWelcomeToastShown, setHasWelcomeToastShown] = useState(false);
  const { toast: showToast } = useToast();
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    console.log("AuthContext: AuthProvider mounted. Setting up Firebase listeners.");

    if (!firebaseAuthService) {
      console.error("AuthContext: Firebase auth service is not initialized. Login/logout will not work.");
      if (isMountedRef.current) {
        setLoading(false);
      }
      return () => {
        isMountedRef.current = false;
      };
    }
    
    // No getRedirectResult processing needed for popup or email/password flows directly here.
    // onAuthStateChanged will handle the user state updates.

    const unsubscribe = onAuthStateChanged(firebaseAuthService, (currentUser) => {
      if (!isMountedRef.current) {
        console.log("AuthContext: onAuthStateChanged triggered on unmounted component. Skipping update.");
        return;
      }
      console.log("AuthContext: onAuthStateChanged event. CurrentUser:", currentUser ? currentUser.email : 'null');
      setUser(currentUser);

      if (currentUser && !hasWelcomeToastShown) {
        showToast({ title: "登入成功", description: `歡迎，${currentUser.displayName || currentUser.email}！` });
        setHasWelcomeToastShown(true);
      } else if (!currentUser) {
        setHasWelcomeToastShown(false); // Reset for next login
      }
      
      console.log("AuthContext: Auth state updated via onAuthStateChanged. Setting loading to false.");
      setLoading(false);
    });

    return () => {
      console.log("AuthContext: Cleaning up onAuthStateChanged listener.");
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
      isMountedRef.current = false;
    };
  }, [showToast, hasWelcomeToastShown]); // Dependencies for useEffect

  const updateUserDisplayName = async (displayName: string) => {
    if (!firebaseAuthService.currentUser) {
      showToast({ title: "錯誤", description: "使用者未登入，無法更新顯示名稱。", variant: "destructive" });
      throw new Error("User not logged in");
    }
    try {
      await updateProfile(firebaseAuthService.currentUser, { displayName });
      // Manually update the user state in the context, as onAuthStateChanged might not fire for profile updates
      // Creating a new object to ensure react state updates correctly
      setUser(prevUser => prevUser ? ({ ...prevUser, displayName } as User) : null);
      showToast({ title: "成功", description: "顯示名稱已更新。" });
    } catch (error) {
      console.error("Error updating display name:", error);
      showToast({ title: "錯誤", description: "無法更新顯示名稱。", variant: "destructive" });
      throw error; // Re-throw error to be caught by the calling function
    }
  };

  const signInWithGoogle = async () => {
    console.log("AuthContext: signInWithGoogle (popup mode) initiated.");
    if (!firebaseAuthService) {
      showToast({
        title: "登入錯誤",
        description: "Firebase 未設定。請檢查 .env 變數與控制台日誌。",
        variant: "destructive"
      });
      console.error("AuthContext: Cannot signInWithGoogle, Firebase auth service not initialized.");
      return;
    }

    const { id: toastId, update: updateToast } = showToast({
      title: "登入中...",
      description: "請稍候，正在處理您的 Google 登入請求。",
    });

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(firebaseAuthService, provider);
      console.log("✅ 登入成功:", result.user.email);
      updateToast({
        id: toastId,
        title: "Google 登入成功!",
        description: `Google 帳號 ${result.user.displayName || result.user.email} 登入成功。`,
        variant: "default",
      });
      // onAuthStateChanged will set user and trigger welcome toast
    } catch (error: unknown) {
      console.error("AuthContext: signInWithGoogle - RAW ERROR OBJECT:", error); 
      if (isMountedRef.current) setLoading(false); 

      let errorMessage = "登入 Google 失敗，請再試一次。";
      let logMessage = "❌ 其他 Google 登入錯誤:";
      
      if (error instanceof FirebaseError) {
        logMessage = `❌ Firebase Google 登入錯誤 (${error.code}):`;
        switch (error.code) {
          case "auth/popup-closed-by-user":
            logMessage = "⚠️ 使用者關閉了登入視窗 或 登入程序中斷";
            errorMessage = "登入程序未完成。彈出視窗可能已關閉，或有其他技術問題。請再試一次。";
            console.warn(`${logMessage}. 在 Cloud Workstations 等沙盒環境中，此錯誤可能由於環境限制導致，即使您未手動關閉。`, error.message);
            break;
          case 'auth/cancelled-popup-request':
            logMessage = "⚠️ 多個登入彈出視窗 或 程序被取消";
            errorMessage = "偵測到多個登入請求或程序被取消。請關閉多餘的視窗並重試。";
            console.warn(logMessage, error.message);
            break;
          case 'auth/popup-blocked':
            logMessage = "⚠️ 登入彈出視窗被阻擋";
            errorMessage = "登入彈出視窗被瀏覽器阻擋。請檢查您的彈出視窗設定並重試。";
            console.warn(logMessage, error.message);
            break;
          case 'auth/operation-not-allowed':
            errorMessage = "您的 Firebase 專案尚未啟用 Google 登入，或相關設定有誤。請洽系統管理員檢查 Firebase 控制台設定。";
            console.error(logMessage, error.message);
            break;
          case 'auth/account-exists-with-different-credential':
            errorMessage = "此電子郵件已使用不同的登入方式註冊帳戶。請嘗試其他登入方式或聯繫支援。";
            console.error(logMessage, error.message);
            break;
          case 'auth/unauthorized-domain':
             errorMessage = "目前的網域未被授權執行此操作。請洽系統管理員檢查 Firebase 控制台的授權網域設定。";
             console.error(logMessage, error.message);
            break;
          default:
            errorMessage = `登入失敗：${error.message} (代碼: ${error.code})`;
            console.error(logMessage, error); 
        }
      } else {
         console.error(logMessage, error); 
      }
      
      updateToast({
        id: toastId,
        title: "Google 登入失敗",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const signUpWithEmailPassword = async (email: string, password: string, displayName: string): Promise<User | null> => {
    console.log("AuthContext: signUpWithEmailPassword initiated.");
    if (!firebaseAuthService) {
      showToast({ title: "註冊錯誤", description: "Firebase 未設定。", variant: "destructive" });
      return null;
    }
    const { id: toastId, update: updateToast } = showToast({ title: "註冊中...", description: "請稍候..." });
    try {
      const userCredential = await createUserWithEmailAndPassword(firebaseAuthService, email, password);
      await updateProfile(userCredential.user, { displayName });
      console.log("✅ 註冊成功並更新個人資料:", userCredential.user.email);
      updateToast({ id: toastId, title: "註冊成功！", description: `帳號 ${displayName} (${email}) 已成功建立。`, variant: "default" });
      // onAuthStateChanged will handle setting the user and the main welcome toast
      return userCredential.user;
    } catch (error: unknown) {
      console.error("AuthContext: signUpWithEmailPassword - RAW ERROR OBJECT:", error);
      let errorMessage = "註冊失敗，請再試一次。";
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = "此電子郵件已被註冊。";
            break;
          case 'auth/invalid-email':
            errorMessage = "電子郵件格式無效。";
            break;
          case 'auth/weak-password':
            errorMessage = "密碼強度不足，請設定至少6個字元的密碼。";
            break;
          default:
            errorMessage = `註冊失敗：${error.message} (代碼: ${error.code})`;
        }
      }
      updateToast({ id: toastId, title: "註冊失敗", description: errorMessage, variant: "destructive" });
      return null;
    }
  };

  const signInWithEmailPassword = async (email: string, password: string): Promise<User | null> => {
    console.log("AuthContext: signInWithEmailPassword initiated.");
    if (!firebaseAuthService) {
      showToast({ title: "登入錯誤", description: "Firebase 未設定。", variant: "destructive" });
      return null;
    }
    const { id: toastId, update: updateToast } = showToast({ title: "登入中...", description: "請稍候..." });
    try {
      const userCredential = await signInWithEmailAndPassword(firebaseAuthService, email, password);
      console.log("✅ Email/密碼登入成功:", userCredential.user.email);
      updateToast({ id: toastId, title: "登入成功！", description: `歡迎回來，${userCredential.user.displayName || userCredential.user.email}！`, variant: "default" });
      // onAuthStateChanged will handle setting the user and the main welcome toast
      return userCredential.user;
    } catch (error: unknown) {
      console.error("AuthContext: signInWithEmailPassword - RAW ERROR OBJECT:", error);
      let errorMessage = "登入失敗，請檢查您的電子郵件和密碼。";
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential': // Covers both user-not-found and wrong-password in newer SDK versions
            errorMessage = "電子郵件或密碼錯誤，請再試一次。";
            break;
          case 'auth/invalid-email':
            errorMessage = "電子郵件格式無效。";
            break;
          case 'auth/user-disabled':
            errorMessage = "此帳號已被停用。";
            break;
          default:
            errorMessage = `登入失敗：${error.message} (代碼: ${error.code})`;
        }
      }
      updateToast({ id: toastId, title: "登入失敗", description: errorMessage, variant: "destructive" });
      return null;
    }
  };

  const signOut = async () => {
    console.log("AuthContext: signOut initiated.");
    if (!firebaseAuthService) {
      showToast({ title: "登出錯誤", description: "Firebase 未設定。", variant: "destructive" });
      console.error("AuthContext: Cannot signOut, Firebase auth service not initialized.");
      return;
    }
    try {
      await firebaseSignOut(firebaseAuthService);
      console.log("AuthContext: Successfully signed out from Firebase.");
      showToast({ title: "已登出", description: "您已成功登出。" });
    } catch (error: unknown) {
      console.error("AuthContext: signOut - RAW ERROR OBJECT:", error);
      let description = "無法登出";
      if (error instanceof FirebaseError) {
        description = `無法登出：${error.message} (代碼: ${error.code})`;
        console.error(`AuthContext: Firebase signOut Error (${error.code})`, error.message);
      } else if (error instanceof Error) {
        description = `無法登出：${error.message}`;
        console.error("AuthContext: Generic signOut Error", error.message);
      }
      showToast({ title: "登出錯誤", description, variant: "destructive" });
      if (isMountedRef.current) setLoading(false); 
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signUpWithEmailPassword, signInWithEmailPassword, signOut, updateUserDisplayName }}>
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
