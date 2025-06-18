import React from 'react';
import Link from 'next/link';
import SectionWrapper from '@/components/SectionWrapper';
import AdventurousToastCard from '@/components/AdventurousToastCard';
import { ADVENTUROUS_TOAST_REVIEWS } from '@/lib/data';
import type { AdventurousToastCategory } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FlaskConical, Sprout, Flame, Dices, Sparkles, List as ListIcon, PackageOpen } from 'lucide-react';

const CATEGORIES_ORDER: AdventurousToastCategory[] = [
  '新手入門',
  '普通款',
  '私房推薦',
  '命運轉盤',
  '勇者挑戰',
];

const categoryDetails: Record<AdventurousToastCategory, { title: string, icon: React.ReactNode, description: string }> = {
  '新手入門': { title: '新手入門', icon: <Sprout className="w-6 h-6" />, description: "初次嘗試？從這些美味又有點小特別的選擇開始吧！" },
  '普通款': { title: '普通款', icon: <ListIcon className="w-6 h-6" />, description: "經典口味的延伸，熟悉中帶點新意。" },
  '私房推薦': { title: '私房推薦', icon: <Sparkles className="w-6 h-6" />, description: "店長與老饕們的秘密心頭好，錯過可惜！" },
  '命運轉盤': { title: '命運轉盤', icon: <Dices className="w-6 h-6" />, description: "閉上眼睛，讓命運決定你的下一口驚喜！" },
  '勇者挑戰': { title: '勇者挑戰', icon: <Flame className="w-6 h-6" />, description: "膽小者勿入！這些吐司將挑戰你的味蕾極限。" },
};

export default function AdventurousToastsPage() {
  const groupedToasts = ADVENTUROUS_TOAST_REVIEWS.reduce((acc, review) => {
    (acc[review.category] = acc[review.category] || []).push(review);
    return acc;
  }, {} as Record<AdventurousToastCategory, typeof ADVENTUROUS_TOAST_REVIEWS>);

  return (
    <div className="container mx-auto px-6 py-12">
      <SectionWrapper
        title="獵奇吐司圖鑑"
        description="探索本店最狂野、最奇特、也最受勇者們喜愛的吐司創作！"
        icon={<FlaskConical className="w-10 h-10" />}
        className="max-w-6xl mx-auto mb-8"
      >
        <div></div>
      </SectionWrapper>

      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        <aside className="w-full md:w-64 lg:w-72 md:sticky md:top-24 h-fit">
          <Card className="shadow-md">
            <CardHeader className="p-4">
              <CardTitle className="text-lg font-semibold">圖鑑目錄</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <nav>
                <ul className="space-y-1">
                  {CATEGORIES_ORDER.map((category) => {
                    const details = categoryDetails[category];
                    const sectionId = `category-title-${category.replace(/[^a-zA-Z0-9\u4e00-\u9fa5_]/g, '-')}`; 
                    return (
                      <li key={category}>
                        <Link
                          href={`#${sectionId}`}
                          className="flex items-center gap-3 p-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-sm font-medium"
                          aria-label={`跳至 ${details.title} 類別`}
                        >
                          {details.icon && React.cloneElement(details.icon as React.ReactElement, { className: "w-5 h-5 shrink-0" })}
                          <span>{details.title}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </CardContent>
          </Card>
        </aside>

        <main className="flex-1 min-w-0"> 
          {ADVENTUROUS_TOAST_REVIEWS.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-lg shadow-md">
              <PackageOpen className="w-20 h-20 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-xl text-muted-foreground">
                目前圖鑑還在編纂中... 敬請期待更多奇妙的吐司！
              </p>
            </div>
          ) : (
            <div className="space-y-16">
              {CATEGORIES_ORDER.map((category) => {
                const toastsInCategory = groupedToasts[category] || [];
                const details = categoryDetails[category];
                const sectionId = `category-title-${category.replace(/[^a-zA-Z0-9\u4e00-\u9fa5_]/g, '-')}`;
                return (
                  <section key={category} id={sectionId} aria-labelledby={sectionId} className="pt-2 -mt-2 scroll-mt-20"> 
                    <div className="mb-6 p-4 rounded-lg bg-secondary/50 border-l-4 border-primary shadow">
                      <h2 className="text-3xl font-bold flex items-center gap-3 text-primary">
                        {details.icon}
                        {details.title}
                      </h2>
                      <p className="text-muted-foreground mt-1">{details.description}</p>
                    </div>
                    {toastsInCategory.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                        {toastsInCategory.map((review) => (
                          <AdventurousToastCard key={review.id} review={review} />
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-6 bg-card rounded-md shadow-sm">
                        這個類別暫時沒有吐司... 探險家們快來投稿吧！
                      </p>
                    )}
                  </section>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
