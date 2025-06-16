
"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from '@/hooks/use-toast';
import type { Ingredient, MenuItem, CustomToast, Order, OrderItem, MoodOption, WeatherOption } from '@/lib/types';
import { MENU_ITEMS, BREADS, MEATS, SAUCES, TOPPINGS } from '@/lib/data';
import { moodOptions, weatherOptionsManual } from '@/lib/types';
import { suggestToastPairing, type SuggestToastPairingInput, type SuggestToastPairingOutput } from '@/ai/flows/suggest-toast-pairing';
import { getCurrentWeather } from '@/lib/actions/weatherActions';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';


import SectionWrapper from '@/components/SectionWrapper';
import MenuItemCard from '@/components/MenuItemCard';
import IngredientPicker from '@/components/IngredientPicker';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

import { Utensils, Sandwich, Sparkles, Shuffle, Clock, ShoppingCart, NotebookText, AlertTriangle, Coffee, PlusCircle, Wheat, MapPin, Info, UserCircle, Home, Flame, ShoppingBasket, UtensilsCrossed, Apple, Zap, ChefHat, MinusCircle, XCircle, PartyPopper, BatteryLow, Brain, Paintbrush, Lightbulb, Wand2, MountainSnow, BedDouble, Heart, HeartCrack, Droplets, Drumstick as DrumstickIcon, Smile, Meh, Frown, SunMedium, Cloud, CloudRain, CloudSnow, Wind } from 'lucide-react';
import { nanoid } from 'nanoid';

const initialCustomToastState: Omit<CustomToast, 'id'> = {
  bread: BREADS[0],
  meats: [],
  sauces: [],
  toppings: [],
  basePrice: BREADS[0]?.price || 0,
};

const CLEAR_MANUAL_WEATHER_VALUE = "__clear_manual_weather__";

export default function HomePage() {
  const router = useRouter();
  const { toast: showToast } = useToast();
  const { user, loading: authLoading } = useAuth();

  const [currentCustomToast, setCurrentCustomToast] = useState<Omit<CustomToast, 'id'>>(() => {
    const initialBread = BREADS[0];
    return {
      bread: initialBread,
      meats: [],
      sauces: [],
      toppings: [],
      basePrice: initialBread?.price || 0,
    };
  });
  const [order, setOrder] = useState<Order>({ items: [], pickupTime: '', specialRequests: '', totalPrice: 0 });

  const [currentWeather, setCurrentWeather] = useState<string | null>("正在獲取天氣...");
  const [isWeatherLoading, setIsWeatherLoading] = useState(true);
  const [aiMood, setAiMood] = useState<MoodOption>("開心");
  const [customMood, setCustomMood] = useState<string>('');
  const [aiSuggestion, setAiSuggestion] = useState<SuggestToastPairingOutput | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [manualWeatherOverride, setManualWeatherOverride] = useState<WeatherOption | ''>('');
  const [dislikedFromAISuggestion, setDislikedFromAISuggestion] = useState<{
    bread: string[];
    meats: string[];
    toppings: string[];
    sauces: string[];
  }>({ bread: [], meats: [], toppings: [], sauces: [] });


  const [randomToast, setRandomToast] = useState<Omit<CustomToast, 'id'> | null>(null);

  useEffect(() => {
    const fetchUserWeather = async (latitude: number, longitude: number) => {
      setIsWeatherLoading(true);
      const weatherString = await getCurrentWeather(latitude, longitude);
      setCurrentWeather(weatherString || "無法獲取天氣，請手動選擇。");
      setIsWeatherLoading(false);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchUserWeather(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("獲取天氣位置時出錯:", error);
          setCurrentWeather("位置存取被拒，請手動選擇天氣。");
          setIsWeatherLoading(false);
          showToast({ title: "位置存取", description: "無法獲取您的位置以自動顯示天氣。請手動選擇或檢查權限。", variant: "destructive" });
        }
      );
    } else {
      setCurrentWeather("瀏覽器不支援地理位置。請手動選擇天氣。");
      setIsWeatherLoading(false);
    }
  }, [showToast]);


  const calculateCustomToastPrice = (toastConfig: Omit<CustomToast, 'id'>): number => {
    let price = toastConfig.bread?.price || 0;
    [...toastConfig.meats, ...toastConfig.sauces, ...toastConfig.toppings].forEach(ing => price += ing.price);
    return price;
  };

  const currentCustomToastPrice = useMemo(() => calculateCustomToastPrice(currentCustomToast), [currentCustomToast]);

  useEffect(() => {
    const newTotalPrice = order.items.reduce((sum, item) => sum + (item.itemPrice * item.quantity), 0);
    setOrder(prev => ({ ...prev, totalPrice: newTotalPrice }));
  }, [order.items]);

  const addPredefinedItemToOrder = (menuItem: MenuItem) => {
    setOrder(prevOrder => {
      const existingItemIndex = prevOrder.items.findIndex(item => item.type === 'predefined' && item.id === menuItem.id);
      let newItems;
      if (existingItemIndex > -1) {
        newItems = prevOrder.items.map((item, index) =>
          index === existingItemIndex ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        newItems = [...prevOrder.items, {
          id: menuItem.id,
          type: 'predefined',
          name: menuItem.name,
          itemPrice: menuItem.price,
          quantity: 1,
          image: menuItem.image,
        }];
      }
      return { ...prevOrder, items: newItems };
    });
    showToast({ title: "已加入訂單", description: `${menuItem.name} 已加入您的訂單。` });
  };

  const addCustomToastToOrder = (toastConfig: Omit<CustomToast, 'id'>, namePrefix: string = "客製化吐司") => {
    const price = calculateCustomToastPrice(toastConfig);
    const toastId = nanoid(8);
    const ingredientsList = [
      toastConfig.bread?.name,
      ...toastConfig.meats.map(m => m.name),
      ...toastConfig.sauces.map(s => s.name),
      ...toastConfig.toppings.map(t => t.name),
    ].filter(Boolean).join('、');

    const newOrderItem: OrderItem = {
      id: `custom-${toastId}`,
      type: 'custom',
      name: `${namePrefix} (${toastId})`,
      itemPrice: price,
      quantity: 1,
      details: ingredientsList,
      image: 'https://placehold.co/75x50.png?text=Custom+Toast', // Updated placeholder
    };
    setOrder(prev => ({ ...prev, items: [...prev.items, newOrderItem] }));
    showToast({ title: "客製化吐司已加入", description: "您獨一無二的創作已在訂單中。" });
    setCurrentCustomToast(initialCustomToastState);
  };

  const decreaseOrderItemQuantity = (itemId: string) => {
    setOrder(prevOrder => {
      const newItems = prevOrder.items.map(item => {
        if (item.id === itemId) {
          return { ...item, quantity: Math.max(0, item.quantity - 1) };
        }
        return item;
      }).filter(item => item.quantity > 0);

      if (!newItems.find(item => item.id === itemId && item.quantity > 0)) {
        const removedItem = prevOrder.items.find(item => item.id === itemId);
        if (removedItem) {
          showToast({ title: "品項已移除", description: `${removedItem.name} 已從訂單中移除。`, variant: "destructive" });
        }
      } else {
         showToast({ title: "數量已更新", description: `品項數量已減少。` });
      }
      return { ...prevOrder, items: newItems };
    });
  };

  const removeOrderItem = (itemId: string) => {
    setOrder(prevOrder => {
      const removedItem = prevOrder.items.find(item => item.id === itemId);
      const newItems = prevOrder.items.filter(item => item.id !== itemId);
      if (removedItem) {
          showToast({ title: "品項已移除", description: `${removedItem.name} 已從訂單中移除。`, variant: "destructive" });
      }
      return { ...prevOrder, items: newItems };
    });
  };


  const handleBreadSelect = (bread: Ingredient) => {
    setCurrentCustomToast(prev => ({ ...prev, bread, basePrice: bread.price }));
  };

  const handleIngredientSelect = (ingredient: Ingredient, category: 'meats' | 'sauces' | 'toppings', maxSelection?: number) => {
    const currentCategorySelection = currentCustomToast[category] as Ingredient[];
    const isSelected = currentCategorySelection.some(i => i.id === ingredient.id);

    if (!isSelected && maxSelection && currentCategorySelection.length >= maxSelection) {
      showToast({
        title: "已達選擇上限",
        description: `您最多只能選擇 ${maxSelection} 種${category === 'meats' ? '肉類' : category === 'sauces' ? '醬料' : '配料'}。`,
        variant: "destructive"
      });
      return; 
    }

    setCurrentCustomToast(prev => {
      // This updater function should be pure.
      const currentSelectionInUpdater = prev[category] as Ingredient[];
      const isAlreadySelectedInPrev = currentSelectionInUpdater.some(i => i.id === ingredient.id);
      let newSelection;

      if (isAlreadySelectedInPrev) {
        newSelection = currentSelectionInUpdater.filter(i => i.id !== ingredient.id);
      } else {
        // The max selection check for *adding* an item is now done outside this updater.
        newSelection = [...currentSelectionInUpdater, ingredient];
      }
      return { ...prev, [category]: newSelection };
    });
  };

  const baseFetchAiSuggestion = async (feedback?: {
    dislikedBread?: string[];
    dislikedMeats?: string[];
    dislikedToppings?: string[];
    dislikedSauces?: string[];
  }) => {
    setIsAiLoading(true);
    
    const weatherForApi = manualWeatherOverride || currentWeather;
    if (!weatherForApi || weatherForApi.startsWith("正在獲取天氣") || weatherForApi.startsWith("無法獲取") || weatherForApi.startsWith("位置存取被拒")) {
        showToast({ title: "需要天氣資訊", description: "請手動選擇天氣以獲得 AI 建議。", variant: "destructive" });
        setIsAiLoading(false);
        return;
    }

    const availableIngredientsData = {
      breads: BREADS.map(b => b.name),
      meats: MEATS.map(m => m.name),
      sauces: SAUCES.map(s => s.name),
      toppings: TOPPINGS.map(t => t.name),
    };
    
    const inputForAI: SuggestToastPairingInput = {
      weather: weatherForApi,
      mood: aiMood,
      customMoodDescription: customMood || undefined,
      availableIngredients: availableIngredientsData,
      dislikedSuggestedBread: feedback?.dislikedBread?.length ? feedback.dislikedBread : undefined,
      dislikedSuggestedMeats: feedback?.dislikedMeats?.length ? feedback.dislikedMeats : undefined,
      dislikedSuggestedToppings: feedback?.dislikedToppings?.length ? feedback.dislikedToppings : undefined,
      dislikedSuggestedSauces: feedback?.dislikedSauces?.length ? feedback.dislikedSauces : undefined,
    };

    try {
      const suggestion = await suggestToastPairing(inputForAI);
      setAiSuggestion(suggestion);
      setDislikedFromAISuggestion({ bread: [], meats: [], toppings: [], sauces: [] }); 
      showToast({ title: feedback ? "AI 建議已更新！" : "AI 建議已準備好！", description: "快來看看 AI 為您搭配了什麼。" });
    } catch (error) {
      console.error(`AI 建議${feedback ? " (含回饋)" : ""}錯誤:`, error);
      showToast({ title: "AI 錯誤", description: "無法獲取 AI 建議，請再試一次。", variant: "destructive" });
    }
    setIsAiLoading(false);
  };

  const fetchAiSuggestion = () => baseFetchAiSuggestion();
  
  const fetchAiSuggestionWithFeedback = () => {
    baseFetchAiSuggestion({
      dislikedBread: dislikedFromAISuggestion.bread,
      dislikedMeats: dislikedFromAISuggestion.meats,
      dislikedToppings: dislikedFromAISuggestion.toppings,
      dislikedSauces: dislikedFromAISuggestion.sauces,
    });
  };

  const handleDislikeChange = (
    category: 'bread' | 'meats' | 'toppings' | 'sauces',
    item: string,
    isDisliked: boolean
  ) => {
    setDislikedFromAISuggestion(prev => {
      const currentCategoryDislikes = prev[category];
      let newCategoryDislikes;
      if (isDisliked) {
        newCategoryDislikes = [...currentCategoryDislikes, item];
      } else {
        newCategoryDislikes = currentCategoryDislikes.filter(dislikedItem => dislikedItem !== item);
      }
      if (category === 'bread' && newCategoryDislikes.length > 1) {
        newCategoryDislikes = [item]; 
      }
      return { ...prev, [category]: newCategoryDislikes };
    });
  };


  const applyAiSuggestionToBuilder = (suggestion: SuggestToastPairingOutput | null) => {
    if (!suggestion) return;

    const suggestedBread = BREADS.find(b => b.name === suggestion.suggestedBread) || currentCustomToast.bread || BREADS[0];
    const suggestedMeats = suggestion.suggestedMeats ? MEATS.filter(m => suggestion.suggestedMeats!.includes(m.name)).slice(0, 2) : [];
    const suggestedSauces = suggestion.suggestedSauces ? SAUCES.filter(s => suggestion.suggestedSauces.includes(s.name)).slice(0, 2) : [];
    const suggestedToppings = suggestion.suggestedToppings ? TOPPINGS.filter(t => suggestion.suggestedToppings.includes(t.name)).slice(0, 3) : [];

    setCurrentCustomToast(prev => ({
      ...prev,
      bread: suggestedBread,
      meats: suggestedMeats,
      sauces: suggestedSauces,
      toppings: suggestedToppings,
    }));
    showToast({ title: "AI 建議已套用", description: "吐司製作器已更新為 AI 推薦選項。" });
  };

  const generateRandomToast = () => {
    const randomBread = BREADS[Math.floor(Math.random() * BREADS.length)];

    const pickRandomIngredients = (source: Ingredient[], maxCount: number): Ingredient[] => {
      const shuffled = [...source].sort(() => 0.5 - Math.random());
      const count = Math.min(shuffled.length, Math.floor(Math.random() * (maxCount + 1)));
      return shuffled.slice(0, count);
    };

    const randomMeats = pickRandomIngredients(MEATS, 1);
    const randomSauces = pickRandomIngredients(SAUCES, 2);
    const randomToppings = pickRandomIngredients(TOPPINGS, 3);

    const generatedToast: Omit<CustomToast, 'id'> = {
      bread: randomBread,
      meats: randomMeats,
      sauces: randomSauces,
      toppings: randomToppings,
      basePrice: randomBread.price,
    };
    setRandomToast(generatedToast);
    showToast({ title: "隨機吐司已產生！", description: "想試試手氣嗎？看看這個組合！" });
  };

  const applyRandomToastToBuilder = () => {
    if (!randomToast) return;
    setCurrentCustomToast(randomToast);
    showToast({ title: "隨機吐司已套用", description: "吐司製作器已更新為隨機選項。" });
  };

  const placeOrder = async () => {
    if (order.items.length === 0) {
      showToast({ title: "訂單是空的", description: "請先將一些美味的品項加入您的訂單。", variant: "destructive" });
      return;
    }
    if (!order.pickupTime) {
       showToast({ title: "缺少取餐時間", description: "請選擇您的預計取餐時間。", variant: "destructive" });
       return;
    }

    const orderToSave: Order = {
      ...order,
      userId: user ? user.uid : null,
      createdAt: serverTimestamp(), 
      status: 'confirmed',
    };

    try {
      if (user && db) {
        const docRef = await addDoc(collection(db, "orders"), orderToSave);
        console.log("訂單已儲存至 Firestore，ID: ", docRef.id);
        localStorage.setItem('toastMasterOrder', JSON.stringify({...orderToSave, id: docRef.id, createdAt: new Date().toISOString() }));
      } else {
        localStorage.setItem('toastMasterOrder', JSON.stringify({...orderToSave, createdAt: new Date().toISOString()}));
        showToast({ title: "訂單已下訂 (訪客)", description: "您的訂單已成功送出。登入以將未來訂單儲存至您的帳戶。" });
      }
      router.push('/confirmation');
    } catch (e) {
      console.error("新增文件時出錯: ", e);
      showToast({ title: "訂單錯誤", description: "無法下訂您的訂單，請再試一次。", variant: "destructive" });
    }
  };

  const getCategoryIcon = (category: Ingredient['category']) => {
    switch (category) {
      case 'bread': return <Wheat className="w-6 h-6" />;
      case 'meat': return <DrumstickIcon className="w-6 h-6" />;
      case 'sauce': return <Droplets className="w-6 h-6" />;
      case 'topping': return <Sparkles className="w-6 h-6" />;
      default: return <Utensils className="w-6 h-6" />;
    }
  };

  const getWeatherIcon = (weather: WeatherOption | string | null) => {
    if (!weather) return null;
    const normalizedWeather = typeof weather === 'string' ? weather.toLowerCase() : "";
    if (normalizedWeather.includes("晴")) return <SunMedium className="inline-block mr-1 h-4 w-4" />;
    if (normalizedWeather.includes("雲") || normalizedWeather.includes("多雲")) return <Cloud className="inline-block mr-1 h-4 w-4" />;
    if (normalizedWeather.includes("雨") || normalizedWeather.includes("毛毛雨")) return <CloudRain className="inline-block mr-1 h-4 w-4" />;
    if (normalizedWeather.includes("雪")) return <CloudSnow className="inline-block mr-1 h-4 w-4" />;
    if (normalizedWeather.includes("風")) return <Wind className="inline-block mr-1 h-4 w-4" />;
    if (normalizedWeather.includes("雷")) return <Zap className="inline-block mr-1 h-4 w-4" />;
    if (normalizedWeather.includes("霧") || normalizedWeather.includes("霾")) return <Cloud className="inline-block mr-1 h-4 w-4 opacity-70" />;
    return null;
  };

  const getMoodIcon = (mood: MoodOption) => {
     switch(mood) {
      case "開心": return <Smile className="inline-block mr-1 h-4 w-4" />;
      case "還好": return <Meh className="inline-block mr-1 h-4 w-4" />;
      case "難過": return <Frown className="inline-block mr-1 h-4 w-4" />;
      case "想冒險": return <MountainSnow className="inline-block mr-1 h-4 w-4" />;
      case "想放鬆": return <BedDouble className="inline-block mr-1 h-4 w-4" />;
      case "興奮": return <PartyPopper className="inline-block mr-1 h-4 w-4" />;
      case "疲倦": return <BatteryLow className="inline-block mr-1 h-4 w-4" />;
      case "沉思": return <Brain className="inline-block mr-1 h-4 w-4" />;
      case "需要靈感": return <Lightbulb className="inline-block mr-1 h-4 w-4" />;
      case "想戀愛": return <Heart className="inline-block mr-1 h-4 w-4 text-red-500 fill-red-300" />;
      case "失戀": return <HeartCrack className="inline-block mr-1 h-4 w-4 text-muted-foreground" />;
      default: return null;
    }
  };


  return (
    <div className="container mx-auto px-6 py-8 space-y-12">

      <SectionWrapper
        title="歡迎來到 Toast Master！"
        description="您尋找絕妙吐司創作與美味點心的一站式商店。"
        icon={<ChefHat className="w-10 h-10" />}
        className="text-center bg-gradient-to-r from-primary/10 via-background to-accent/10"
        contentClassName="!pt-2"
      >
        {/* 
          Detailed AI Image Generation Prompt (800x450 Banner):
          "Create an 800x450 banner image for 'Toast Master,' a modern, friendly, and creative toast shop.
          Subject: A visually appealing flat lay or slightly angled close-up of 3-4 distinct, artisanal toasts.
          Toast Variety:
          *   One toast should feature savory elements like perfectly ripe avocado slices, a runny-yolk fried or poached egg, and a sprinkle of microgreens or sesame seeds.
          *   Another toast should showcase sweet toppings, such as fresh berries (strawberries, blueberries), a drizzle of honey or maple syrup, and perhaps a dollop of cream or yogurt.
          *   A third toast could be more unique, hinting at the shop's creative offerings – maybe something with an interesting spread and unexpected but delicious toppings.
          Background & Props:
          *   The toasts should be arranged on a clean, bright surface, ideally a light-colored wooden table, a marble slab, or a textured linen that complements a light gray (approx HSL 0, 0%, 94%) or off-white overall background.
          *   Subtly incorporate your brand's accent colors: hints of dusty rose (approx HSL 300, 26%, 80%) and soft lavender (approx HSL 240, 60%, 92%) through minimal props like a folded napkin, a small ceramic dish, or a delicate flower in a small vase, ensuring these accents are not overpowering.
          Lighting & Style:
          *   Achieve a bright, airy, and welcoming atmosphere using soft, natural daylight or well-diffused studio lighting.
          *   The style should be modern food photography – clean, crisp, with an emphasis on fresh ingredients, appealing textures, and vibrant (but natural) colors of the food itself.
          Overall Mood:
          *   The image should evoke feelings of warmth, creativity, deliciousness, and high quality. It should be inviting and make viewers want to try your toasts. Avoid overly dark, rustic, or cluttered compositions. The feeling should be fresh and delightful."
        */}
        <Image src="/Decorative_Img/Homepage.jpeg" alt="Toast Master 橫幅" width={800} height={450} className="rounded-lg shadow-lg mx-auto my-6 object-cover w-full" data-ai-hint="artisanal toasts banner" priority />
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          探索我們的招牌吐司菜單、打造您專屬的客製化創作，或讓我們的 AI 大廚給您靈感。別忘了嚐嚐我們美味的配菜和清爽的飲品！
        </p>
      </SectionWrapper>

      <SectionWrapper title="完整菜單" description="從我們熱門的吐司、點心、炸物和飲品中選擇。" icon={<ShoppingBasket className="w-8 h-8" />}>
        <h3 className="text-xl font-semibold mt-2 mb-4 flex items-center gap-2"><UtensilsCrossed className="w-6 h-6 text-primary"/> 招牌吐司</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MENU_ITEMS.filter(item => item.category === 'toast_specialty').map(item => (
            <MenuItemCard key={item.id} item={item} onAddItem={addPredefinedItemToOrder} />
          ))}
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4 flex items-center gap-2"><Flame className="w-6 h-6 text-primary"/> 炸物點心</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {MENU_ITEMS.filter(item => item.category === 'fried_snack').map(item => (
            <MenuItemCard key={item.id} item={item} onAddItem={addPredefinedItemToOrder} />
          ))}
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4 flex items-center gap-2"><Apple className="w-6 h-6 text-primary"/> 其他點心與配菜</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {MENU_ITEMS.filter(item => item.category === 'snack_side').map(item => (
            <MenuItemCard key={item.id} item={item} onAddItem={addPredefinedItemToOrder} />
          ))}
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4 flex items-center gap-2"><Coffee className="w-6 h-6 text-primary"/> 飲品</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MENU_ITEMS.filter(item => item.category === 'drink').map(item => (
            <MenuItemCard key={item.id} item={item} onAddItem={addPredefinedItemToOrder} />
          ))}
        </div>
      </SectionWrapper>

      <Separator />

      <SectionWrapper title="客製您的吐司" description="選擇您最愛的麵包、肉類、醬料和配料。" icon={<Sandwich className="w-8 h-8" />}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <IngredientPicker
              title="選擇您的麵包"
              icon={getCategoryIcon('bread')}
              ingredients={BREADS}
              selectedIngredients={currentCustomToast.bread ? [currentCustomToast.bread] : []}
              onSelectIngredient={handleBreadSelect}
              selectionType="single"
            />
            <IngredientPicker
              title="選擇肉類 (最多2種)"
              icon={getCategoryIcon('meat')}
              ingredients={MEATS}
              selectedIngredients={currentCustomToast.meats}
              onSelectIngredient={(ing) => handleIngredientSelect(ing, 'meats', 2)}
              maxSelection={2}
            />
            <IngredientPicker
              title="添加醬料 (最多2種)"
              icon={getCategoryIcon('sauce')}
              ingredients={SAUCES}
              selectedIngredients={currentCustomToast.sauces}
              onSelectIngredient={(ing) => handleIngredientSelect(ing, 'sauces', 2)}
              maxSelection={2}
            />
            <IngredientPicker
              title="鋪上配料 (最多3種)"
              icon={getCategoryIcon('topping')}
              ingredients={TOPPINGS}
              selectedIngredients={currentCustomToast.toppings}
              onSelectIngredient={(ing) => handleIngredientSelect(ing, 'toppings', 3)}
              maxSelection={3}
            />
          </div>

          <Card className="lg:col-span-1 sticky top-24 h-fit shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">您的傑作</CardTitle>
              <Image src="https://placehold.co/300x200.png" alt="客製吐司" width={300} height={200} className="rounded-md mt-2 w-full object-cover" data-ai-hint="custom toast"/>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>麵包:</strong> {currentCustomToast.bread?.name || '未選擇'}</p>
              {currentCustomToast.meats.length > 0 && <p><strong>肉類:</strong> {currentCustomToast.meats.map(m => m.name).join('、')}</p>}
              {currentCustomToast.sauces.length > 0 && <p><strong>醬料:</strong> {currentCustomToast.sauces.map(s => s.name).join('、')}</p>}
              {currentCustomToast.toppings.length > 0 && <p><strong>配料:</strong> {currentCustomToast.toppings.map(t => t.name).join('、')}</p>}
              <Separator className="my-3"/>
              <p className="text-lg font-semibold">價格: NT${currentCustomToastPrice.toFixed(2)}</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => addCustomToastToOrder(currentCustomToast)} disabled={!currentCustomToast.bread}>
                <PlusCircle className="mr-2 h-4 w-4" /> 加入客製吐司至訂單
              </Button>
            </CardFooter>
          </Card>
        </div>
      </SectionWrapper>

      <Separator />

      <SectionWrapper title="AI 吐司搭配助手" description="讓我們的 AI 根據您的心情和天氣推薦吐司！" icon={<Sparkles className="w-8 h-8" />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <Label htmlFor="mood" className="block text-sm font-medium mb-1">您的心情</Label>
            <Select value={aiMood} onValueChange={(value: MoodOption) => setAiMood(value)}>
              <SelectTrigger id="mood">
                <SelectValue placeholder="選擇心情" />
              </SelectTrigger>
              <SelectContent>
                {moodOptions.map(opt => <SelectItem key={opt} value={opt}>{getMoodIcon(opt)} {opt}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="customMood" className="block text-sm font-medium mb-1">或詳細描述您的心情/情境</Label>
            <Textarea
              id="customMood"
              placeholder="例如：剛運動完，超級餓！或是今天天氣很好，想吃點清爽的..."
              value={customMood}
              onChange={(e) => setCustomMood(e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="md:col-span-2">
            <Label className="block text-sm font-medium mb-1">目前天氣</Label>
            <div className="p-2 border rounded-md bg-secondary/50 min-h-[40px] flex items-center">
              {isWeatherLoading && <span className="text-sm text-muted-foreground">正在載入天氣...</span>}
              {!isWeatherLoading && currentWeather && (
                <span className="text-sm flex items-center">
                  {getWeatherIcon(currentWeather)} {currentWeather}
                  <Button variant="link" size="sm" className="ml-2 h-auto p-0" onClick={() => {
                     setIsWeatherLoading(true);
                     navigator.geolocation.getCurrentPosition(
                        async (position) => {
                          const weatherString = await getCurrentWeather(position.coords.latitude, position.coords.longitude);
                          setCurrentWeather(weatherString || "無法獲取天氣，請手動選擇。");
                          setIsWeatherLoading(false);
                          setManualWeatherOverride('');
                        },
                        () => {
                          setCurrentWeather("位置存取被拒，請手動選擇天氣。");
                          setIsWeatherLoading(false);
                        }
                      );
                  }}>刷新</Button>
                </span>
              )}
            </div>
             {(!isWeatherLoading && (currentWeather?.includes("無法") || currentWeather?.includes("被拒") || currentWeather?.includes("Could not fetch weather."))) && (
              <div className="mt-2">
                <Label htmlFor="manualWeather" className="text-xs text-muted-foreground">或手動選擇：</Label>
                 <Select
                  value={manualWeatherOverride || CLEAR_MANUAL_WEATHER_VALUE}
                  onValueChange={(value: string) => {
                    if (value === CLEAR_MANUAL_WEATHER_VALUE) {
                      setManualWeatherOverride('');
                    } else {
                      setManualWeatherOverride(value as WeatherOption | '');
                    }
                  }}
                >
                  <SelectTrigger id="manualWeather" className="mt-1">
                    <SelectValue placeholder="手動選擇天氣" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={CLEAR_MANUAL_WEATHER_VALUE}>清除手動選擇</SelectItem>
                    {weatherOptionsManual.map(opt => <SelectItem key={opt} value={opt}>{getWeatherIcon(opt)} {opt}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>

        <Button onClick={fetchAiSuggestion} disabled={isAiLoading || isWeatherLoading} className="mb-4">
          {isAiLoading ? "思考中..." : (isWeatherLoading ? "等待天氣資訊..." : "獲取 AI 建議")}
        </Button>

        {aiSuggestion && (
          <Card className="bg-accent/30 mt-4">
            <CardHeader>
              <CardTitle>AI 建議</CardTitle>
              <CardDescription className="text-lg !text-foreground whitespace-pre-wrap">{aiSuggestion.reasoning}</CardDescription>
            </CardHeader>
            <CardContent>
              {aiSuggestion.suggestedBread && <p><strong>建議麵包:</strong> {aiSuggestion.suggestedBread}</p>}
              {aiSuggestion.suggestedMeats && aiSuggestion.suggestedMeats.length > 0 && <p><strong>建議肉類:</strong> {aiSuggestion.suggestedMeats.join('、') || "無"}</p>}
              {aiSuggestion.suggestedToppings && aiSuggestion.suggestedToppings.length > 0 && <p><strong>建議配料:</strong> {aiSuggestion.suggestedToppings.join('、') || "無"}</p>}
              {aiSuggestion.suggestedSauces && aiSuggestion.suggestedSauces.length > 0 && <p><strong>建議醬料:</strong> {aiSuggestion.suggestedSauces.join('、') || "無"}</p>}
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-4">
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => applyAiSuggestionToBuilder(aiSuggestion)}>套用至目前組合</Button>
                <Button onClick={() => {
                   if (!aiSuggestion) return;
                   const breadForNewToast = BREADS.find(b => b.name === aiSuggestion.suggestedBread) || BREADS[0];
                   const meatsForNewToast = aiSuggestion.suggestedMeats ? MEATS.filter(m => aiSuggestion.suggestedMeats!.includes(m.name)).slice(0, 2) : [];
                   const saucesForNewToast = aiSuggestion.suggestedSauces ? SAUCES.filter(s => aiSuggestion.suggestedSauces.includes(s.name)).slice(0, 2) : [];
                   const toppingsForNewToast = aiSuggestion.suggestedToppings ? TOPPINGS.filter(t => aiSuggestion.suggestedToppings.includes(t.name)).slice(0, 3) : [];

                   const suggestedToastConfig: Omit<CustomToast, 'id'> = {
                     bread: breadForNewToast,
                     meats: meatsForNewToast,
                     sauces: saucesForNewToast,
                     toppings: toppingsForNewToast,
                     basePrice: breadForNewToast.price,
                   };
                   addCustomToastToOrder(suggestedToastConfig, "AI 推薦吐司");
                }}>新增為新吐司</Button>
              </div>

              <Separator className="my-2" />
              
              <div>
                <h4 className="text-md font-semibold mb-2">這個組合不太滿意嗎？告訴 AI 哪些部分不喜歡：</h4>
                <div className="space-y-3">
                  {aiSuggestion.suggestedBread && (
                    <div>
                      <Label className="font-medium text-sm">建議麵包：{aiSuggestion.suggestedBread}</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Checkbox
                          id={`dislike-bread-${aiSuggestion.suggestedBread.replace(/\s+/g, '-')}`}
                          checked={dislikedFromAISuggestion.bread.includes(aiSuggestion.suggestedBread)}
                          onCheckedChange={(checked) => handleDislikeChange('bread', aiSuggestion.suggestedBread, !!checked)}
                        />
                        <Label htmlFor={`dislike-bread-${aiSuggestion.suggestedBread.replace(/\s+/g, '-')}`} className="text-xs font-normal">
                          我不喜歡這個麵包
                        </Label>
                      </div>
                    </div>
                  )}
                  {aiSuggestion.suggestedMeats && aiSuggestion.suggestedMeats.length > 0 && (
                    <div>
                      <Label className="font-medium text-sm">建議肉類：</Label>
                      <div className="space-y-1 mt-1">
                      {aiSuggestion.suggestedMeats.map(meat => (
                        <div key={`dislike-meat-${meat.replace(/\s+/g, '-')}`} className="flex items-center space-x-2">
                          <Checkbox
                            id={`dislike-meat-${meat.replace(/\s+/g, '-')}`}
                            checked={dislikedFromAISuggestion.meats.includes(meat)}
                            onCheckedChange={(checked) => handleDislikeChange('meats', meat, !!checked)}
                          />
                          <Label htmlFor={`dislike-meat-${meat.replace(/\s+/g, '-')}`} className="text-xs font-normal">
                            我不喜歡 {meat}
                          </Label>
                        </div>
                      ))}
                      </div>
                    </div>
                  )}
                  {aiSuggestion.suggestedToppings && aiSuggestion.suggestedToppings.length > 0 && (
                    <div>
                      <Label className="font-medium text-sm">建議配料：</Label>
                       <div className="space-y-1 mt-1">
                      {aiSuggestion.suggestedToppings.map(topping => (
                        <div key={`dislike-topping-${topping.replace(/\s+/g, '-')}`} className="flex items-center space-x-2">
                          <Checkbox
                            id={`dislike-topping-${topping.replace(/\s+/g, '-')}`}
                            checked={dislikedFromAISuggestion.toppings.includes(topping)}
                            onCheckedChange={(checked) => handleDislikeChange('toppings', topping, !!checked)}
                          />
                          <Label htmlFor={`dislike-topping-${topping.replace(/\s+/g, '-')}`} className="text-xs font-normal">
                            我不喜歡 {topping}
                          </Label>
                        </div>
                      ))}
                      </div>
                    </div>
                  )}
                  {aiSuggestion.suggestedSauces && aiSuggestion.suggestedSauces.length > 0 && (
                    <div>
                      <Label className="font-medium text-sm">建議醬料：</Label>
                      <div className="space-y-1 mt-1">
                      {aiSuggestion.suggestedSauces.map(sauce => (
                        <div key={`dislike-sauce-${sauce.replace(/\s+/g, '-')}`} className="flex items-center space-x-2">
                          <Checkbox
                            id={`dislike-sauce-${sauce.replace(/\s+/g, '-')}`}
                            checked={dislikedFromAISuggestion.sauces.includes(sauce)}
                            onCheckedChange={(checked) => handleDislikeChange('sauces', sauce, !!checked)}
                          />
                          <Label htmlFor={`dislike-sauce-${sauce.replace(/\s+/g, '-')}`} className="text-xs font-normal">
                            我不喜歡 {sauce}
                          </Label>
                        </div>
                      ))}
                      </div>
                    </div>
                  )}
                </div>
                <Button onClick={fetchAiSuggestionWithFeedback} disabled={isAiLoading} className="mt-4">
                  <Wand2 className="mr-2 h-4 w-4" /> 根據回饋重新產生建議
                </Button>
              </div>
            </CardFooter>
          </Card>
        )}
      </SectionWrapper>

      <Separator />

      <SectionWrapper title="隨機吐司產生器" description="想來點冒險嗎？讓我們給您驚喜！" icon={<Shuffle className="w-8 h-8" />}>
        <Button onClick={generateRandomToast} className="mb-4">給我驚喜！</Button>
        {randomToast && (
          <Card className="bg-accent/30 mt-4">
            <CardHeader>
              <CardTitle>您的隨機組合！</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>麵包:</strong> {randomToast.bread.name}</p>
              <p><strong>肉類:</strong> {randomToast.meats.map(m => m.name).join('、') || "無"}</p>
              <p><strong>醬料:</strong> {randomToast.sauces.map(s => s.name).join('、') || "無"}</p>
              <p><strong>配料:</strong> {randomToast.toppings.map(t => t.name).join('、') || "無"}</p>
              <p className="font-semibold mt-2">價格: NT${calculateCustomToastPrice(randomToast).toFixed(2)}</p>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button variant="outline" onClick={applyRandomToastToBuilder}>套用至目前組合</Button>
              <Button onClick={() => randomToast && addCustomToastToOrder(randomToast, "隨機產生吐司")}>新增為新吐司</Button>
            </CardFooter>
          </Card>
        )}
      </SectionWrapper>

      <Separator />

      <SectionWrapper title="訂單偏好設定" description="告訴我們您希望的取餐時間以及任何特殊需求。" icon={<Clock className="w-8 h-8" />}>
        <div className="space-y-4">
          <div>
            <label htmlFor="pickupTime" className="block text-sm font-medium mb-1">預計取餐時間</label>
            <Input
              id="pickupTime"
              type="time"
              value={order.pickupTime}
              onChange={(e) => setOrder(prev => ({ ...prev, pickupTime: e.target.value }))}
            />
          </div>
          <div>
            <label htmlFor="specialRequests" className="block text-sm font-medium mb-1">特殊需求/備註</label>
            <Textarea
              id="specialRequests"
              placeholder="例如：不要洋蔥，培根要特別酥脆"
              value={order.specialRequests}
              onChange={(e) => setOrder(prev => ({ ...prev, specialRequests: e.target.value }))}
            />
          </div>
        </div>
      </SectionWrapper>

      <Separator />

      <SectionWrapper title="您的訂單" description="在下訂單前再次確認您的品項。" icon={<ShoppingCart className="w-8 h-8" />}>
        {order.items.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="mx-auto h-12 w-12 mb-4" />
            <p className="text-lg">您的購物車是空的。</p>
            <p>開始新增一些美味的品項吧！</p>
          </div>
        ) : (
          <div className="space-y-4">
            {order.items.map((orderItem, index) => (
              <Card key={orderItem.id || index} className="flex items-center p-3 gap-3 shadow-sm">
                {orderItem.image && <Image src={orderItem.image} alt={orderItem.name} width={75} height={50} className="rounded-md object-cover" data-ai-hint={orderItem.name.split(" ")[0].toLowerCase()} />}
                <div className="flex-grow">
                  <h4 className="font-semibold">{orderItem.name} <span className="text-sm text-muted-foreground">x{orderItem.quantity}</span></h4>
                  {orderItem.type === 'custom' && orderItem.details && <p className="text-xs text-muted-foreground truncate max-w-xs sm:max-w-sm md:max-w-md">{orderItem.details}</p>}
                </div>
                <p className="font-semibold text-base mr-2">NT${(orderItem.itemPrice * orderItem.quantity).toFixed(2)}</p>
                <div className="flex flex-col sm:flex-row gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => decreaseOrderItemQuantity(orderItem.id)}
                    aria-label={`減少 ${orderItem.name} 的數量`}
                  >
                    <MinusCircle className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => removeOrderItem(orderItem.id)}
                    aria-label={`從訂單中移除 ${orderItem.name}`}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
            <Separator />
            <div className="text-right">
              <p className="text-xl font-bold">總計: NT${order.totalPrice.toFixed(2)}</p>
            </div>
            <Button className="w-full text-lg py-6" size="lg" onClick={placeOrder} disabled={authLoading}>
              {authLoading ? '載入中...' : <><ShoppingCart className="mr-2 h-5 w-5" /> 確認下單</> }
            </Button>
          </div>
        )}
      </SectionWrapper>
    </div>
  );
}

    
