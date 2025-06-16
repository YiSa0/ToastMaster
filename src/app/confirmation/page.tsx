
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Order } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import SectionWrapper from '@/components/SectionWrapper';
import { CheckCircle, ShoppingBag, Clock, Home } from 'lucide-react';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';

export default function ConfirmationPage() {
  const router = useRouter();
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [estimatedPrepTime, setEstimatedPrepTime] = useState<string>("15-20 分鐘"); // Example in Chinese

  useEffect(() => {
    const orderData = localStorage.getItem('toastMasterOrder');
    if (orderData) {
      const parsedOrder: Order = JSON.parse(orderData);
      setConfirmedOrder(parsedOrder);
      // Simulate prep time calculation based on items
      const baseTime = 10; // minutes
      const perItemTime = parsedOrder.items.reduce((acc, item) => acc + (item.type === 'custom' ? 3 : 1) * item.quantity, 0);
      const totalEstTime = baseTime + perItemTime;
      setEstimatedPrepTime(`${totalEstTime}-${totalEstTime + 5} 分鐘`);

      // localStorage.removeItem('toastMasterOrder');
    } else {
      const timer = setTimeout(() => {
         router.push('/');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [router]);

  if (!confirmedOrder) {
    return (
      <div className="container mx-auto px-6 py-12 text-center">
        <SectionWrapper title="正在載入訂單..." icon={<ShoppingBag className="w-8 h-8" />}>
          <p>若頁面未自動跳轉，請點擊下方按鈕。</p>
          <Button onClick={() => router.push('/')} className="mt-4">
            <Home className="mr-2 h-4 w-4" /> 前往首頁
          </Button>
        </SectionWrapper>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <SectionWrapper
        title="訂單已確認！"
        description="感謝您的訂購，我們正在為您準備！"
        icon={<CheckCircle className="w-10 h-10 text-green-500" />}
        className="max-w-2xl mx-auto"
      >
        <Card className="shadow-none border-none">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">您的訂單摘要</CardTitle>
              <Image src="https://placehold.co/100x100.png?text=Toast+Master" alt="Toast Master Logo" width={80} height={80} data-ai-hint="logo cooking" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold text-lg mb-2">品項:</h4>
              <ul className="space-y-3">
                {confirmedOrder.items.map((item, index) => (
                  <li key={index} className="flex justify-between items-start p-3 bg-secondary/50 rounded-md">
                    <div>
                      <p className="font-medium">{item.name} (x{item.quantity})</p>
                      {item.type === 'custom' && item.details && (
                        <p className="text-xs text-muted-foreground max-w-xs">{item.details}</p>
                      )}
                    </div>
                    <p className="font-medium">NT${(item.itemPrice * item.quantity).toFixed(2)}</p>
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            <div className="text-right">
              <p className="text-2xl font-bold text-primary">總計: NT${confirmedOrder.totalPrice.toFixed(2)}</p>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold text-lg mb-2">取餐詳情:</h4>
              <p className="flex items-center"><Clock className="w-5 h-5 mr-2 text-primary" /> 預計取餐時間: <strong>{confirmedOrder.pickupTime || "盡快"}</strong></p>
              {confirmedOrder.specialRequests && (
                <p className="mt-2">特殊需求: <em>{confirmedOrder.specialRequests}</em></p>
              )}
            </div>

            <div className="mt-6 p-4 bg-accent/30 rounded-lg text-center">
              <p className="text-lg font-semibold">預計準備時間:</p>
              <p className="text-2xl font-bold text-primary">{estimatedPrepTime}</p>
            </div>

          </CardContent>
          <CardFooter className="flex justify-center mt-6">
            <Button onClick={() => router.push('/')} size="lg">
              <Home className="mr-2 h-4 w-4" /> 返回首頁
            </Button>
          </CardFooter>
        </Card>
      </SectionWrapper>
    </div>
  );
}
