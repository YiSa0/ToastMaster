
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/context/AuthContext';
import { LogIn, UserPlus, KeyRound, Mail, UserCircle as UserIcon, ChromeIcon } from 'lucide-react'; // UserCircle aliased to avoid conflict
import SectionWrapper from '@/components/SectionWrapper';
import { useToast } from '@/hooks/use-toast';
import { auth as firebaseAuthService } from '@/lib/firebase/config'; // Import directly for currentUser check

const signUpSchema = z.object({
  displayName: z.string().min(2, { message: "顯示名稱至少需要2個字元。" }),
  email: z.string().email({ message: "請輸入有效的電子郵件地址。" }),
  password: z.string().min(6, { message: "密碼至少需要6個字元。" }),
});

const signInSchema = z.object({
  email: z.string().email({ message: "請輸入有效的電子郵件地址。" }),
  password: z.string().min(1, { message: "請輸入密碼。" }),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;
type SignInFormValues = z.infer<typeof signInSchema>;

export default function AuthPage() {
  const router = useRouter();
  const { signInWithGoogle, signUpWithEmailPassword, signInWithEmailPassword, user, loading } = useAuth();
  const { toast: showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const signUpForm = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      displayName: "",
      email: "",
      password: "",
    },
  });

  const signInForm = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (user && !loading) {
      router.replace('/');
    }
  }, [user, loading, router]);

  const handleSignUp = async (values: SignUpFormValues) => {
    setIsSubmitting(true);
    const signedUpUser = await signUpWithEmailPassword(values.email, values.password, values.displayName);
    setIsSubmitting(false);
    if (signedUpUser) {
      // Redirection is handled by the useEffect hook now
    }
  };

  const handleSignIn = async (values: SignInFormValues) => {
    setIsSubmitting(true);
    const signedInUser = await signInWithEmailPassword(values.email, values.password);
    setIsSubmitting(false);
    if (signedInUser) {
       // Redirection is handled by the useEffect hook now
    }
  };
  
  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    await signInWithGoogle();
    setIsSubmitting(false);
    // Redirection is handled by the useEffect hook observing user state change
  };

  if (loading) {
    return <div className="container mx-auto px-6 py-12 text-center">載入中...</div>;
  }

  // If user is already logged in and useEffect hasn't redirected yet, show loading.
  // The useEffect will handle the actual redirect.
  if (user) {
    return <div className="container mx-auto px-6 py-12 text-center">已登入，正在重新導向...</div>;
  }

  return (
    <div className="container mx-auto px-6 py-12 flex justify-center items-center min-h-[calc(100vh-150px)]">
      <SectionWrapper title="加入或登入 Toast Master" icon={<LogIn className="w-8 h-8" />} className="max-w-md w-full">
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">登入</TabsTrigger>
            <TabsTrigger value="signup">註冊新帳號</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">歡迎回來！</CardTitle>
                <CardDescription>輸入您的電子郵件和密碼以登入。</CardDescription>
              </CardHeader>
              <Form {...signInForm}>
                <form onSubmit={signInForm.handleSubmit(handleSignIn)}>
                  <CardContent className="space-y-4">
                    <FormField
                      control={signInForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2"><Mail /> 電子郵件</FormLabel>
                          <FormControl>
                            <Input placeholder="your@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signInForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2"><KeyRound /> 密碼</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter className="flex flex-col gap-4">
                    <Button type="submit" className="w-full" disabled={isSubmitting || loading}>
                      {isSubmitting ? '登入中...' : '登入'}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>
          </TabsContent>
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">建立新帳號</CardTitle>
                <CardDescription>填寫以下資訊以完成註冊。</CardDescription>
              </CardHeader>
               <Form {...signUpForm}>
                <form onSubmit={signUpForm.handleSubmit(handleSignUp)}>
                  <CardContent className="space-y-4">
                    <FormField
                      control={signUpForm.control}
                      name="displayName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2"><UserIcon /> 顯示名稱</FormLabel>
                          <FormControl>
                            <Input placeholder="您的暱稱或姓名" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signUpForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2"><Mail /> 電子郵件</FormLabel>
                          <FormControl>
                            <Input placeholder="your@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signUpForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2"><KeyRound /> 密碼</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="設定您的密碼 (至少6位數)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full" disabled={isSubmitting || loading}>
                       {isSubmitting ? '註冊中...' : <><UserPlus className="mr-2 h-4 w-4" /> 建立帳號</>}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>
          </TabsContent>
        </Tabs>
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">或使用其他方式登入：</p>
          <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isSubmitting || loading}>
             {isSubmitting ? '處理中...' : <><ChromeIcon className="mr-2 h-5 w-5" /> 使用 Google 登入</>}
          </Button>
        </div>
      </SectionWrapper>
    </div>
  );
}
