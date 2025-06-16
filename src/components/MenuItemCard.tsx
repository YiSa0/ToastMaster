
import Image from 'next/image';
import type { MenuItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlusCircle, Zap, Apple, Coffee, UtensilsCrossed, Flame } from 'lucide-react'; // Added Flame

interface MenuItemCardProps {
  item: MenuItem;
  onAddItem: (item: MenuItem) => void;
}

const categoryIcons: Record<MenuItem['category'], React.ElementType> = {
  toast_specialty: UtensilsCrossed,
  snack_side: Apple,
  fried_snack: Flame,
  drink: Coffee,
};


export default function MenuItemCard({ item, onAddItem }: MenuItemCardProps) {
  const Icon = categoryIcons[item.category] || UtensilsCrossed;

  return (
    <Card className="flex flex-col overflow-hidden h-full shadow-md hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0 relative">
        <Image
          src={item.image}
          alt={item.name}
          width={300}
          height={200}
          className="w-full h-48 object-cover"
          data-ai-hint={item.dataAiHint || item.name.toLowerCase().split(' ').slice(0,2).join(' ')}
        />
        <div className="absolute top-2 right-2 bg-background/80 p-1.5 rounded-full shadow">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-semibold mb-1">{item.name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground mb-2 h-10 overflow-hidden text-ellipsis">
          {item.description}
        </CardDescription>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <p className="text-lg font-bold text-primary">NT${item.price.toFixed(2)}</p>
        <Button size="sm" onClick={() => onAddItem(item)} aria-label={`Add ${item.name} to order`}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add
        </Button>
      </CardFooter>
    </Card>
  );
}


    