import SectionWrapper from '@/components/SectionWrapper';
import AdventurousToastCard from '@/components/AdventurousToastCard';
import { ADVENTUROUS_TOAST_REVIEWS, HALL_OF_FAME_ENTRIES, STAFF_PICKS_IDS, getAdventurousToastById } from '@/lib/data';
import type { AdventurousToastReview, HallOfFameEntry } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Flame, Award, MessageSquareQuote, TrendingUp, Star, Skull, ThumbsUp, Repeat, Trophy, Zap } from 'lucide-react';
import Image from 'next/image';

const MAX_HALL_OF_FAME_ITEMS = 5;
const MAX_OTHER_LIST_ITEMS = 3;

export default function LeaderboardsPage() {

  const popularToasts = [...ADVENTUROUS_TOAST_REVIEWS]
    .sort((a, b) => b.rating - a.rating) 
    .slice(0, MAX_OTHER_LIST_ITEMS);

  const hallOfFameHeroes = HALL_OF_FAME_ENTRIES.map(entry => {
    const toast = getAdventurousToastById(entry.toastId);
    return { ...entry, toastName: toast?.name || '未知挑戰', toastImage: toast?.image };
  }).slice(0, MAX_HALL_OF_FAME_ITEMS);

  const topRatedToasts = [...ADVENTUROUS_TOAST_REVIEWS]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, MAX_OTHER_LIST_ITEMS);

  const infamyToasts = ADVENTUROUS_TOAST_REVIEWS
    .filter(toast => toast.rating <= 2 || toast.category === '勇者挑戰')
    .sort((a,b) => a.rating - b.rating) 
    .slice(0, MAX_OTHER_LIST_ITEMS);

  const staffPicksToasts = STAFF_PICKS_IDS
    .map(id => getAdventurousToastById(id))
    .filter(toast => toast !== undefined)
    .slice(0, MAX_OTHER_LIST_ITEMS) as AdventurousToastReview[];
  
  const weeklyChallengeToasts = ADVENTUROUS_TOAST_REVIEWS
    .filter(toast => toast.category === '命運轉盤' || toast.category === '勇者挑戰')
    .slice(0, MAX_OTHER_LIST_ITEMS);


  return (
    <div className="container mx-auto px-6 py-12 space-y-12">
      <SectionWrapper
        title="Toast Master 排行榜"
        description="探索本店最受歡迎、最受好評、以及最具挑戰性的傳奇吐司！"
        icon={<Flame className="w-10 h-10" />}
        className="text-center"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                最受歡迎吐司
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">敬請期待排行榜功能！</p>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-500" />
                最高評分吐司
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">敬請期待排行榜功能！</p>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-6 h-6 text-yellow-500" />
                最具挑戰性吐司
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">敬請期待排行榜功能！</p>
            </CardContent>
          </Card>
        </div>
      </SectionWrapper>

      <SectionWrapper title="人氣熱銷排行榜" description="本店最常被翻牌的創意吐司！" icon={<TrendingUp className="w-8 h-8" />}>
        {popularToasts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularToasts.map(toast => (
              <AdventurousToastCard key={`popular-${toast.id}`} review={toast} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">目前暫無熱門排行資料。</p>
        )}
      </SectionWrapper>

      <SectionWrapper title="勇者殿堂" description="向這些完成「勇者挑戰」的食客們致敬！" icon={<Award className="w-8 h-8" />}>
        {hallOfFameHeroes.length > 0 ? (
          <div className="space-y-6">
            {hallOfFameHeroes.map(hero => (
              <Card key={hero.id} className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center gap-4">
                  {/* 
                    AI Image Generation Prompt for Leaderboard Avatars (100x100):
                    "Generate a unique and appealing 100x100 avatar image suitable for a user profile on a 'Toast Master' leaderboard.
                    The style should be creative and modern. Consider these themes:
                    1. Abstract Food-Inspired: A stylized, abstract design subtly incorporating elements related to toasts, breakfast, or cafe culture (e.g., patterns resembling bread texture, coffee swirls, fruit colors) without being overly literal.
                    2. Whimsical Characters: A simple, charming character illustration (e.g., a cute animal, a fun food mascot, or a minimalist stylized person) with a friendly or adventurous expression.
                    3. Vibrant Patterns/Icons: A clean geometric pattern, a nature-inspired motif, or a unique icon that feels fresh and energetic.
                    The avatar should be clear and visually distinct at a small 100x100 pixel size.
                    Use a color palette that is either harmonious with dusty rose and soft lavender or uses a set of complementary, vibrant colors. Avoid overly complex details."
                  */}
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={hero.userImage || `https://placehold.co/100x100.png?text=${hero.userName.substring(0,1)}`} alt={hero.userName} data-ai-hint="profile avatar" />
                    <AvatarFallback>{hero.userName.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-xl">{hero.userName}</CardTitle>
                    <CardDescription>於 {hero.dateAchieved} 成功挑戰</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 p-3 bg-secondary/30 rounded-md">
                    {hero.toastImage && 
                      <Image src={hero.toastImage} alt={hero.toastName || 'Adventurous Toast'} width={80} height={45} className="rounded-md object-cover" data-ai-hint="adventurous toast" />
                    }
                    <p className="font-semibold text-primary">{hero.toastName}</p>
                  </div>
                  {hero.achievementQuote && (
                    <blockquote className="mt-3 italic border-l-4 pl-3 py-1 text-sm text-muted-foreground">
                      <MessageSquareQuote className="inline-block w-4 h-4 mr-1 opacity-70" /> "{hero.achievementQuote}"
                    </blockquote>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">勇者殿堂尚待英雄留名！</p>
        )}
      </SectionWrapper>

      <SectionWrapper title="饕客五星好評榜" description="平均評分最高的美味組合！" icon={<Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />}>
         {topRatedToasts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topRatedToasts.map(toast => (
              <AdventurousToastCard key={`toprated-${toast.id}`} review={toast} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">目前暫無評價資料。</p>
        )}
      </SectionWrapper>

      <SectionWrapper title="地獄膽識黑榜" description="最具爭議，但仍勇者不斷的奇葩吐司！" icon={<Skull className="w-8 h-8" />}>
        {infamyToasts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {infamyToasts.map(toast => (
              <AdventurousToastCard key={`infamy-${toast.id}`} review={toast} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">地獄廚房今日公休！</p>
        )}
      </SectionWrapper>

      <SectionWrapper title="店員私藏推薦榜" description="聽聽內部人士最愛的口味！" icon={<ThumbsUp className="w-8 h-8" />}>
        {staffPicksToasts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staffPicksToasts.map(toast => (
               toast ? <AdventurousToastCard key={`staff-${toast.id}`} review={toast} /> : null
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">店員們正在秘密會議中...</p>
        )}
      </SectionWrapper>
      
      <SectionWrapper title="本週熱門挑戰" description="看看大家這週都在挑戰哪些創意吐司！" icon={<Repeat className="w-8 h-8" />}>
        {weeklyChallengeToasts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {weeklyChallengeToasts.map(toast => (
              <AdventurousToastCard key={`weekly-${toast.id}`} review={toast} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">本週挑戰榜單更新中！</p>
        )}
      </SectionWrapper>

    </div>
  );
}
