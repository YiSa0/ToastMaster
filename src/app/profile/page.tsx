
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import type { Order, OrderItem, UserProfileData, GenderOption } from '@/lib/types';
import { genderOptions } from '@/lib/types'; // Import genderOptions
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

const CLEAR_GENDER_VALUE = "_clear_gender_"; // Special value for clearing gender

export default function ProfilePage() {
  const { user, loading: authLoading, signInWithGoogle } = useAuth();
  const { toast: showToast } = useToast();

  const [profileData, setProfileData] = useState<UserProfileData>({
    name: '',
    email: '',
    phone: '',
    birthday: '',
    gender: '',
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  useEffect(() => {
    if (user && db) { 
      setProfileData(prev => ({
        ...prev,
        name: user.displayName || '',
        email: user.email || '',
        // In a real app, you'd fetch phone, birthday, gender from Firestore here
      }));

      const fetchOrderHistory = async () => {
        setIsLoadingHistory(true);
        try {
          const ordersRef = collection(db, 'orders');
          const q = query(ordersRef, where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
          const querySnapshot = await getDocs(q);
          const orders: Order[] = [];
          querySnapshot.forEach((doc) => {
            orders.push({ id: doc.id, ...doc.data() } as Order);
          });
          setOrderHistory(orders);
        } catch (error) {
          console.error("讀取訂單歷史時發生錯誤:", error);
          showToast({ title: "錯誤", description: "無法讀取您的訂單歷史。", variant: "destructive" });
        } finally {
          setIsLoadingHistory(false);
        }
      };
      fetchOrderHistory();
    } else {
      setProfileData({ name: '', email: '', phone: '', birthday: '', gender: '' });
      setOrderHistory([]);
    }
  }, [user, showToast, db]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenderChange = (value: GenderOption) => {
    setProfileData(prev => ({ ...prev, gender: value }));
  };

  const handleSubmitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast({ title: "尚未登入", description: "請先登入以儲存您的個人資料。", variant: "destructive" });
      return;
    }
    setIsSavingProfile(true);
    // Simulate saving to a backend. In a real app, you'd update Firestore here.
    console.log("Simulating profile save:", profileData); 
    setTimeout(() => {
      showToast({
        title: '個人資料已更新 (模擬)',
        description: '您的額外資訊（電話、生日、性別）已被記錄（此展示中未實際儲存至資料庫）。',
      });
      setIsSavingProfile(false);
    }, 1000);
  };

  if (authLoading) {
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
          <Button onClick={signInWithGoogle} size="lg">
            <LogIn className="mr-2 h-5 w-5" /> 使用 Google 登入
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
          <form onSubmit={handleSubmitProfile}>
            <CardHeader>
              <CardTitle className="text-xl">編輯您的詳細資料</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">全名</Label>
                <Input id="name" name="name" value={profileData.name} onChange={handleChange} placeholder="輸入您的全名" disabled />
                 <p className="text-xs text-muted-foreground">姓名由您的 Google 帳戶管理。</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">電子郵件地址</Label>
                <Input id="email" name="email" type="email" value={profileData.email} onChange={handleChange} placeholder="your@email.com" disabled />
                <p className="text-xs text-muted-foreground">電子郵件由您的 Google 帳戶管理。</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">電話號碼 (選填)</Label>
                <Input id="phone" name="phone" type="tel" value={profileData.phone || ''} onChange={handleChange} placeholder="0912-345-678" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthday" className="flex items-center gap-1"><Cake className="w-4 h-4" /> 生日 (選填)</Label>
                <Input id="birthday" name="birthday" type="date" value={profileData.birthday || ''} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender" className="flex items-center gap-1"><Users className="w-4 h-4" /> 性別 (選填)</Label>
                <Select 
                  value={profileData.gender || ''} 
                  onValueChange={(value) => {
                    if (value === CLEAR_GENDER_VALUE) {
                      handleGenderChange('');
                    } else {
                      handleGenderChange(value as GenderOption);
                    }
                  }}
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
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isSavingProfile}>
                <Save className="mr-2 h-4 w-4" /> {isSavingProfile ? '儲存中...' : '儲存變更 (模擬)'}
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
                        {order.createdAt ? new Date((order.createdAt as Timestamp).toDate()).toLocaleDateString() : 'N/A'}
                        {' 於 '}
                        {order.createdAt ? new Date((order.createdAt as Timestamp).toDate()).toLocaleTimeString() : 'N/A'}
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

