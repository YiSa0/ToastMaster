
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs, orderBy, Timestamp, doc, setDoc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Order, OrderItem, UserProfileData, GenderOption } from '@/lib/types';
import { UserProfileSchema } from '@/lib/types';
import SectionWrapper from '@/components/SectionWrapper';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { UserCircle, Save, ShoppingBag, CalendarDays, DollarSign, AlertTriangle, Loader2, LogIn, Cake, Users } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import Link from 'next/link';
import * as z from 'zod';

const CLEAR_GENDER_VALUE = "__clear_gender__"; 

export default function ProfilePage() {
  const { user, loading: authLoading, updateUserDisplayName } = useAuth();
  const { toast: showToast } = useToast();

  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const form = useForm<z.infer<typeof UserProfileSchema>>({
    resolver: zodResolver(UserProfileSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      birthday: '',
      gender: '',
    },
  });

  useEffect(() => {
    if (user && db) { 
      const fetchUserProfile = async () => {
        try {
          const userProfileRef = doc(db, "userProfiles", user.uid);
          const docSnap = await getDoc(userProfileRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            form.reset({
              name: user.displayName || data.name || '',
              email: user.email || data.email || '',
              phone: data.phone || '',
              birthday: data.birthday || '',
              gender: data.gender || '',
            });
            if (data.updatedAt && data.updatedAt instanceof Timestamp) {
              setLastUpdated(data.updatedAt.toDate());
            }
          } else {
            console.log("未找到用戶資料，使用 Auth 資料初始化。");
             form.reset({
                name: user.displayName || '',
                email: user.email || '',
                phone: '',
                birthday: '',
                gender: '',
            });
          }
        } catch (error) {
          console.error("獲取用戶資料時出錯:", error);
          showToast({ title: "錯誤", description: "無法讀取您的個人資料。", variant: "destructive" });
           form.reset({ // Fallback to auth data on error
            name: user.displayName || '',
            email: user.email || '',
            phone: '',
            birthday: '',
            gender: '',
          });
        }
      };

      fetchUserProfile();

      const fetchUserOrders = async () => {
        setIsLoadingHistory(true);
        try {
          const ordersRef = collection(db, "orders");
          const q = query(
            ordersRef,
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc")
          );
          const querySnapshot = await getDocs(q);
          const orders = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Order[];
          setOrderHistory(orders);
        } catch (error) {
          console.error("獲取訂單時出錯:", error);
          showToast({ title: "錯誤", description: "無法讀取您的訂單記錄。", variant: "destructive" });
        } finally {
           setIsLoadingHistory(false);
        }
      };
      fetchUserOrders();

    } else if (!authLoading) { // If not authLoading and no user
      form.reset({ name: '', email: '', phone: '', birthday: '', gender: '' });
      setOrderHistory([]);
    }
  }, [user, authLoading, showToast, db, form]);

  const handleSubmitProfile = async (values: z.infer<typeof UserProfileSchema>) => {
    if (!user || !db) {
      showToast({ title: "尚未登入或資料庫未連接", description: "請先登入以儲存您的個人資料。", variant: "destructive" });
      return;
    }
    setIsSavingProfile(true);

    try {
      // 1. Update Firebase Auth display name if it has changed
      if (user.displayName !== values.name) {
        await updateUserDisplayName(values.name);
      }

      // 2. Prepare data for Firestore
      const dataToSave: Omit<UserProfileData, 'updatedAt'> & { updatedAt: FieldValue } = { 
        name: values.name,
        email: values.email, // Keep email for reference, though not editable
        phone: values.phone || '',
        birthday: values.birthday || '',
        gender: values.gender || '',
        updatedAt: serverTimestamp(),
      };
      
      // 3. Update Firestore document
      const userProfileRef = doc(db, "userProfiles", user.uid);
      await setDoc(userProfileRef, dataToSave, { merge: true });

      showToast({
        title: '個人資料已更新',
        description: '您的資訊已成功儲存。',
      });

      // 4. Re-fetch profile to get the server-generated timestamp
      const docSnap = await getDoc(userProfileRef);
      if (docSnap.exists() && docSnap.data().updatedAt instanceof Timestamp) {
         setLastUpdated(docSnap.data().updatedAt.toDate());
      }
    } catch (error) {
      console.error("Error saving user profile:", error);
      showToast({ title: "儲存失敗", description: "無法儲存您的個人資料，請稍後再試。", variant: "destructive" });
    } finally {
      setIsSavingProfile(false);
    }
  };
  
  const isLoading = authLoading || form.formState.isLoading;

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-12 flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-6 py-12 text-center">
        <SectionWrapper
          title="個人資料與訂單紀錄"
          description="登入以管理您的詳細資料並查看過往訂單。"
          icon={<UserCircle className="w-10 h-10" />}
          className="max-w-xl mx-auto"
        >
          <AlertTriangle className="mx-auto h-16 w-16 text-destructive mb-4" />
          <p className="text-lg mb-6">請登入以存取您的個人資料和訂單紀錄。</p>
          <Button asChild size="lg">
            <Link href="/auth">
              <LogIn className="mr-2 h-5 w-5" /> 登入/註冊
            </Link>
          </Button>
        </SectionWrapper>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12 space-y-12">
      <SectionWrapper
        title="您的個人資料"
        description="管理您的個人資訊。"
        icon={<UserCircle className="w-10 h-10" />}
        className="max-w-2xl mx-auto"
      >
        <Card>
          <form onSubmit={form.handleSubmit(handleSubmitProfile)}>
            <CardHeader>
              <CardTitle className="text-xl">編輯您的詳細資料</CardTitle>
              {lastUpdated && (
                 <CardDescription className="text-xs text-muted-foreground mt-1">
                   上次更新時間: {lastUpdated.toLocaleString()}
                 </CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">顯示名稱</Label>
                <Input id="name" {...form.register('name')} placeholder="輸入您的顯示名稱" />
                {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">電子郵件地址</Label>
                <Input id="email" {...form.register('email')} placeholder="your@email.com" disabled />
                <p className="text-xs text-muted-foreground">電子郵件地址不可在此修改。</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">電話號碼 (選填)</Label>
                <Input id="phone" {...form.register('phone')} type="tel" placeholder="0912-345-678" />
                 {form.formState.errors.phone && <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthday" className="flex items-center gap-1"><Cake className="w-4 h-4" /> 生日 (選填)</Label>
                <Input id="birthday" {...form.register('birthday')} type="date" />
                 {form.formState.errors.birthday && <p className="text-sm text-destructive">{form.formState.errors.birthday.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender" className="flex items-center gap-1"><Users className="w-4 h-4" /> 性別 (選填)</Label>
                <Select
                  value={form.watch('gender') || CLEAR_GENDER_VALUE}
                  onValueChange={(value) => form.setValue('gender', value === CLEAR_GENDER_VALUE ? '' : value as GenderOption, { shouldValidate: true })}
                >
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="選擇您的性別" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={CLEAR_GENDER_VALUE}><em>不選擇</em></SelectItem>
                    {genderOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                 {form.formState.errors.gender && <p className="text-sm text-destructive">{form.formState.errors.gender.message}</p>}
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isSavingProfile || !form.formState.isDirty}>
                <Save className="mr-2 h-4 w-4" /> {isSavingProfile ? '儲存中...' : '儲存變更'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </SectionWrapper>

      <SectionWrapper
        title="訂單紀錄"
        description="查看您在 Toast Master 的過往訂單。"
        icon={<ShoppingBag className="w-10 h-10" />}
        className="max-w-3xl mx-auto"
      >
        {isLoadingHistory ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : orderHistory.length === 0 ? (
          <Card className="text-center py-8">
            <CardContent>
              <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground">您目前沒有任何訂單紀錄。</p>
              <Button asChild className="mt-4">
                <Link href="/">開始點餐</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orderHistory.map((order) => (
              <Card key={order.id} className="shadow-md">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">訂單 ID: <span className="font-mono text-sm bg-secondary p-1 rounded">{order.id?.substring(0,8)}...</span></CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <CalendarDays className="w-4 h-4" />
                        {order.createdAt && order.createdAt instanceof Timestamp ? new Date(order.createdAt.toDate()).toLocaleDateString() : 'N/A'}
                        {' 於 '}
                        {order.createdAt && order.createdAt instanceof Timestamp ? new Date(order.createdAt.toDate()).toLocaleTimeString() : 'N/A'}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-semibold text-primary flex items-center gap-1">
                           <DollarSign className="w-5 h-5"/> NT${(order.totalPrice || 0).toFixed(2)}
                        </p>
                        <p className={`text-xs font-medium px-2 py-0.5 rounded-full ${order.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                           狀態: {order.status || '處理中'}
                        </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <h4 className="font-semibold mb-2 text-sm">品項:</h4>
                  <ul className="space-y-2 text-xs">
                    {order.items.map((item: OrderItem, index: number) => (
                      <li key={index} className="flex justify-between items-center p-2 bg-secondary/30 rounded-md">
                        <div className="flex items-center gap-2">
                          {item.image && <Image src={item.image} alt={item.name} width={45} height={30} className="rounded object-cover" data-ai-hint={item.name.split(" ")[0].toLowerCase()} />}
                          <span>{item.name} (x{item.quantity})</span>
                        </div>
                        <span>NT${(item.itemPrice * item.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                  {order.pickupTime && <p className="text-xs mt-3">取餐時間: <strong>{order.pickupTime}</strong></p>}
                  {order.specialRequests && <p className="text-xs mt-1">備註: <em>{order.specialRequests}</em></p>}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </SectionWrapper>
    </div>
  );
}
