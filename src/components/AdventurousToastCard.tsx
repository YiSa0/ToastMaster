
import Image from 'next/image';
import type { AdventurousToastReview } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MessageSquareQuote, Sparkles, Sprout, Flame, Dices, List } from 'lucide-react';

interface AdventurousToastCardProps {
  review: AdventurousToastReview;
}

const renderStars = (rating: number, maxStars: number = 5) => {
  const stars = [];
  for (let i = 1; i <= maxStars; i++) {
    stars.push(
      <Star
        key={i}
        className={`w-5 h-5 ${i <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'}`}
      />
    );
  }
  return <div className="flex items-center gap-0.5">{stars}</div>;
};

const getCategoryIcon = (category: AdventurousToastReview['category']) => {
  switch (category) {
    case '新手入門':
      return <Sprout className="w-4 h-4 mr-1.5" />;
    case '勇者挑戰':
      return <Flame className="w-4 h-4 mr-1.5" />;
    case '命運轉盤':
      return <Dices className="w-4 h-4 mr-1.5" />;
    case '私房推薦':
      return <Sparkles className="w-4 h-4 mr-1.5" />;
    case '普通款':
      return <List className="w-4 h-4 mr-1.5" />;
    default:
      return null;
  }
};

export default function AdventurousToastCard({ review }: AdventurousToastCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden h-full shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card border border-border/50 rounded-xl">
      <CardHeader className="p-0 relative">
        <Image
          src={review.image}
          alt={review.name}
          width={400}
          height={225}
          className="w-full h-auto object-cover rounded-t-xl"
          style={{aspectRatio: "16 / 9"}}
          data-ai-hint={review.dataAiHint || review.name.toLowerCase().split(' ').slice(0,2).join(' ')}
        />
        <Badge
          variant="outline"
          className="absolute top-3 left-3 text-xs py-1 px-2 shadow-md bg-background/80 backdrop-blur-sm border-primary/50 text-primary font-medium"
        >
          {getCategoryIcon(review.category)}
          {review.category}
        </Badge>
      </CardHeader>
      <CardContent className="p-5 flex-grow space-y-4">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-xl font-bold text-foreground">{review.name}</CardTitle>
          <span className="text-xl font-bold text-primary shrink-0 ml-2">NT${review.price.toFixed(2)}</span>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-foreground/80 uppercase tracking-wider mb-1.5">推薦星等</h4>
          {renderStars(review.rating)}
        </div>

        <div>
          <h4 className="text-xs font-semibold text-foreground/80 uppercase tracking-wider mb-1.5">品項描述</h4>
          <CardDescription className="text-sm text-foreground/90 leading-relaxed">
            {review.description}
          </CardDescription>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-foreground/80 uppercase tracking-wider mb-1.5">主要配料</h4>
          <p className="text-sm text-foreground/90 border border-border/70 rounded-md p-2.5 bg-secondary/50">
            {review.ingredients.join('、')}
          </p>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-foreground/80 uppercase tracking-wider mb-1.5 flex items-center">
            <MessageSquareQuote className="w-4 h-4 mr-1.5 text-primary" />
            試吃心得
          </h4>
          <div className="mt-1 border-l-4 border-primary bg-background rounded-r-md p-3 shadow-sm">
            <p className="text-sm text-foreground/90 italic leading-relaxed">"{review.reviewText}"</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-5 pt-2 border-t border-border/50">
        {review.reviewerName && (
          <p className="text-xs text-muted-foreground">
            品嚐者: <span className="font-medium text-foreground/80">{review.reviewerName}</span>
          </p>
        )}
      </CardFooter>
    </Card>
  );
}
