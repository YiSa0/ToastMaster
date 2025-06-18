import type { Ingredient, MenuItem, AdventurousToastReview, AdventurousToastCategory, HallOfFameEntry } from './types';
import { Beef, Drumstick, Fish, Droplets, Carrot, EggFried, LeafyGreen, Grape, Wheat, Utensils, Sandwich, Coffee, GlassWater, IceCream, Sprout, Sparkles, Flame, Dices, List, Citrus, Leaf, Apple, Nut, Cookie } from 'lucide-react';

export const BREADS: Ingredient[] = [
  { id: 'white-toast', name: '白吐司', category: 'bread', icon: Wheat, price: 10.00, image: 'https://placehold.co/100x67.png', dataAiHint: 'white toast', slug: 'white-toast'},
  { id: 'thick-cut-toast', name: '厚片吐司', category: 'bread', icon: Wheat, price: 15.00, image: 'https://placehold.co/100x67.png', dataAiHint: 'thick cut toast', slug: 'thick-cut-toast' },
  { id: 'whole-wheat-toast', name: '全麥吐司', category: 'bread', icon: Wheat, price: 12.00, image: 'https://placehold.co/100x67.png', dataAiHint: 'whole wheat toast', slug: 'whole-wheat-toast' },
  { id: 'wheat-germ-toast', name: '胚芽吐司', category: 'bread', icon: Wheat, price: 13.00, image: 'https://placehold.co/100x67.png', dataAiHint: 'wheat germ toast', slug: 'wheat-germ-toast' },
  { id: 'rye-toast', name: '裸麥吐司', category: 'bread', icon: Wheat, price: 15.00, image: 'https://placehold.co/100x67.png', dataAiHint: 'rye toast', slug: 'rye-toast' },
  { id: 'sourdough-toast', name: '酸種吐司', category: 'bread', icon: Wheat, price: 16.00, image: 'https://placehold.co/100x67.png', dataAiHint: 'sourdough toast', slug: 'sourdough-toast' },
];

export const MEATS: Ingredient[] = [
  // Fish
  { id: 'tuna', name: '鮪魚', category: 'meat', icon: Fish, price: 15.00, image: 'https://placehold.co/80x53.png', dataAiHint: 'tuna fish', slug: 'tuna' },
  { id: 'smoked-salmon', name: '煙燻鮭魚', category: 'meat', icon: Fish, price: 35.00, image: 'https://placehold.co/80x53.png', dataAiHint: 'smoked salmon', slug: 'smoked-salmon' },
  // Chicken
  { id: 'lemon-chicken', name: '檸檬雞', category: 'meat', icon: Drumstick, price: 15.00, image: 'https://placehold.co/80x53.png', dataAiHint: 'lemon chicken', slug: 'lemon-chicken' },
  { id: 'smoked-chicken', name: '燻雞', category: 'meat', icon: Drumstick, price: 15.00, image: 'https://placehold.co/80x53.png', dataAiHint: 'smoked chicken', slug: 'smoked-chicken' },
  { id: 'teriyaki-chicken', name: '照燒雞', category: 'meat', icon: Drumstick, price: 15.00, image: 'https://placehold.co/80x53.png', dataAiHint: 'teriyaki chicken', slug: 'teriyaki-chicken' },
  { id: 'black-pepper-chicken', name: '黑胡椒雞', category: 'meat', icon: Drumstick, price: 15.00, image: 'https://placehold.co/80x53.png', dataAiHint: 'pepper chicken', slug: 'black-pepper-chicken' },
  { id: 'fried-chicken', name: '卡拉雞', category: 'meat', icon: Flame, price: 20.00, image: 'https://placehold.co/80x53.png', dataAiHint: 'fried chicken', slug: 'fried-chicken' },
  // Pork
  { id: 'meat-slices', name: '肉片', category: 'meat', icon: Beef, price: 15.00, image: 'https://placehold.co/80x53.png', dataAiHint: 'meat slices', slug: 'meat-slices' },
  { id: 'roasted-pork', name: '燒肉', category: 'meat', icon: Beef, price: 15.00, image: 'https://placehold.co/80x53.png', dataAiHint: 'roasted pork', slug: 'roasted-pork' },
  { id: 'black-pepper-pork', name: '黑胡椒豬', category: 'meat', icon: Beef, price: 15.00, image: 'https://placehold.co/80x53.png', dataAiHint: 'pepper pork', slug: 'black-pepper-pork' },
  { id: 'korean-bbq-meat', name: '韓式烤肉', category: 'meat', icon: Flame, price: 18.00, image: 'https://placehold.co/80x53.png', dataAiHint: 'korean bbq', slug: 'korean-bbq-meat' },
  // Beef
  { id: 'beef-slices', name: '牛肉片', category: 'meat', icon: Beef, price: 18.00, image: 'https://placehold.co/80x53.png', dataAiHint: 'beef slices', slug: 'beef-slices' },
  // Sausages / Processed
  { id: 'german-sausage', name: '德式香腸', category: 'meat', icon: Beef, price: 15.00, image: 'https://placehold.co/80x53.png', dataAiHint: 'german sausage', slug: 'german-sausage' },
  { id: 'italian-salami', name: '義式臘腸', category: 'meat', icon: Beef, price: 15.00, image: 'https://placehold.co/80x53.png', dataAiHint: 'salami pepperoni', slug: 'italian-salami' },
  // Specially Priced
  { id: 'ham', name: '火腿', category: 'meat', icon: Beef, price: 10.00, image: 'https://placehold.co/80x53.png', dataAiHint: 'sliced ham', slug: 'ham' },
  { id: 'bacon', name: '培根', category: 'meat', icon: Beef, price: 12.00, image: 'https://placehold.co/80x53.png', dataAiHint: 'crispy bacon', slug: 'bacon' },
  { id: 'pork-floss', name: '肉鬆', category: 'meat', icon: Beef, price: 12.00, image: 'https://placehold.co/80x53.png', dataAiHint: 'pork floss', slug: 'pork-floss' },
];


// Reorganized SAUCES
export const SAUCES: Ingredient[] = [
  // Sweet Sauces
  { id: 'chocolate', name: '巧克力醬', category: 'sauce', icon: Droplets, price: 10.00, image: 'https://placehold.co/60x40.png', dataAiHint: 'chocolate sauce', slug: 'chocolate' },
  { id: 'strawberry-jam', name: '草莓醬', category: 'sauce', icon: Apple, price: 10.00, image: 'https://placehold.co/60x40.png', dataAiHint: 'strawberry jam', slug: 'strawberry-jam' },
  { id: 'blueberry-jam', name: '藍莓醬', category: 'sauce', icon: Grape, price: 10.00, image: 'https://placehold.co/60x40.png', dataAiHint: 'blueberry jam', slug: 'blueberry-jam' },
  { id: 'orange-jam', name: '柳橙醬', category: 'sauce', icon: Citrus, price: 10.00, image: 'https://placehold.co/60x40.png', dataAiHint: 'orange jam', slug: 'orange-jam' },
  { id: 'peanut-butter', name: '花生醬', category: 'sauce', icon: Nut, price: 10.00, image: 'https://placehold.co/60x40.png', dataAiHint: 'peanut butter', slug: 'peanut-butter' },
  { id: 'milk-crisp', name: '奶酥', category: 'sauce', icon: Cookie, price: 15.00, image: 'https://placehold.co/60x40.png', dataAiHint: 'milk crisp spread', slug: 'milk-crisp' },
  { id: 'matcha', name: '抹茶醬', category: 'sauce', icon: Leaf, price: 15.00, image: 'https://placehold.co/60x40.png', dataAiHint: 'matcha sauce', slug: 'matcha' },
  { id: 'honey', name: '蜂蜜', category: 'sauce', icon: Droplets, price: 15.00, image: 'https://placehold.co/60x40.png', dataAiHint: 'honey', slug: 'honey' },
  { id: 'maple-syrup', name: '楓糖醬', category: 'sauce', icon: Droplets, price: 15.00, image: 'https://placehold.co/60x40.png', dataAiHint: 'maple syrup', slug: 'maple-syrup' },
  { id: 'caramel', name: '焦糖醬', category: 'sauce', icon: Droplets, price: 15.00, image: 'https://placehold.co/60x40.png', dataAiHint: 'caramel sauce', slug: 'caramel' },
  { id: 'lemon-curd', name: '檸檬醬', category: 'sauce', icon: Citrus, price: 12.00, image: 'https://placehold.co/60x40.png', dataAiHint: 'lemon curd', slug: 'lemon-curd' },
  // Savory Sauces
  { id: 'garlic', name: '蒜（蒜泥）', category: 'sauce', icon: Droplets, price: 5.00, image: 'https://placehold.co/60x40.png', dataAiHint: 'garlic paste sauce', slug: 'garlic' },
  { id: 'roasted-garlic', name: '香蒜醬（熟蒜泥風味）', category: 'sauce', icon: Droplets, price: 10.00, image: 'https://placehold.co/60x40.png', dataAiHint: 'roasted garlic sauce', slug: 'roasted-garlic' },
  { id: 'pepper-sauce', name: '胡椒醬', category: 'sauce', icon: Sparkles, price: 5.00, image: 'https://placehold.co/60x40.png', dataAiHint: 'pepper sauce', slug: 'pepper-sauce' },
  { id: 'honey-mustard', name: '蜂蜜芥末醬', category: 'sauce', icon: Droplets, price: 10.00, image: 'https://placehold.co/60x40.png', dataAiHint: 'honey mustard sauce', slug: 'honey-mustard' },
  { id: 'thousand-island', name: '千島醬', category: 'sauce', icon: Droplets, price: 10.00, image: 'https://placehold.co/60x40.png', dataAiHint: 'thousand island sauce', slug: 'thousand-island' },
  { id: 'caesar', name: '凱薩醬', category: 'sauce', icon: Droplets, price: 10.00, image: 'https://placehold.co/60x40.png', dataAiHint: 'caesar dressing', slug: 'caesar' },
  { id: 'cheese-sauce', name: '起司醬', category: 'sauce', icon: Droplets, price: 15.00, image: 'https://placehold.co/60x40.png', dataAiHint: 'cheese sauce', slug: 'cheese-sauce' },
  { id: 'chili-sauce', name: '辣椒醬', category: 'sauce', icon: Flame, price: 5.00, image: 'https://placehold.co/60x40.png', dataAiHint: 'chili sauce', slug: 'chili-sauce' },
  { id: 'mayo', name: '美乃滋', category: 'sauce', icon: Droplets, price: 5.00, image: 'https://placehold.co/60x40.png', dataAiHint: 'mayonnaise sauce', slug: 'mayo' },
  { id: 'mustard', name: '黃芥末醬', category: 'sauce', icon: Droplets, price: 5.00, image: 'https://placehold.co/60x40.png', dataAiHint: 'mustard sauce', slug: 'mustard' },
  { id: 'hollandaise', name: '荷蘭醬', category: 'sauce', icon: EggFried, price: 10.00, image: 'https://placehold.co/60x40.png', dataAiHint: 'hollandaise sauce', slug: 'hollandaise' },
  { id: 'pesto', name: '青醬', category: 'sauce', icon: Leaf, price: 8.00, image: 'https://placehold.co/60x40.png', dataAiHint: 'pesto sauce', slug: 'pesto' },
  { id: 'ketchup', name: '番茄醬', category: 'sauce', icon: Apple, price: 5.00, image: 'https://placehold.co/60x40.png', dataAiHint: 'ketchup sauce', slug: 'ketchup' },
  { id: 'sesame-paste', name: '芝麻醬', category: 'sauce', icon: Sprout, price: 15.00, image: 'https://placehold.co/60x40.png', dataAiHint: 'sesame paste sauce', slug: 'sesame-paste' },
];

// Reorganized TOPPINGS
export const TOPPINGS: Ingredient[] = [
  // Fruits
  { id: 'strawberry', name: '新鮮草莓', category: 'topping', icon: Apple, price: 20.00, image: 'https://placehold.co/70x47.png', dataAiHint: 'fresh strawberries', slug: 'strawberry' },
  { id: 'avocado', name: '酪梨', category: 'topping', icon: Leaf, price: 25.00, image: 'https://placehold.co/70x47.png', dataAiHint: 'avocado', slug: 'avocado' },
  { id: 'banana-slices', name: '香蕉片', category: 'topping', icon: Apple, price: 15.00, image: 'https://placehold.co/70x47.png', dataAiHint: 'banana slices', slug: 'banana-slices' },
  { id: 'kiwi', name: '奇異果', category: 'topping', icon: Apple, price: 20.00, image: 'https://placehold.co/70x47.png', dataAiHint: 'kiwi slices', slug: 'kiwi' },
  { id: 'mango-cubes', name: '芒果丁', category: 'topping', icon: Apple, price: 25.00, image: 'https://placehold.co/70x47.png', dataAiHint: 'mango cubes', slug: 'mango-cubes' },
  { id: 'pineapple-slices', name: '鳳梨片', category: 'topping', icon: Apple, price: 15.00, image: 'https://placehold.co/70x47.png', dataAiHint: 'pineapple slices', slug: 'pineapple-slices' },
  { id: 'apple-slices', name: '蘋果片', category: 'topping', icon: Apple, price: 15.00, image: 'https://placehold.co/70x47.png', dataAiHint: 'apple slices', slug: 'apple-slices' },
  { id: 'blueberry', name: '藍莓', category: 'topping', icon: Grape, price: 20.00, image: 'https://placehold.co/70x47.png', dataAiHint: 'blueberries', slug: 'blueberry' },
  { id: 'cherry-tomatoes', name: '小番茄', category: 'topping', icon: Apple, price: 15.00, image: 'https://placehold.co/70x47.png', dataAiHint: 'cherry tomatoes', slug: 'cherry-tomatoes' },
  // Cheese
  { id: 'cheese-slice', name: '起司片', category: 'topping', icon: Cookie, price: 10.00, image: 'https://placehold.co/70x47.png', dataAiHint: 'cheese slice', slug: 'cheese-slice' },
  { id: 'shredded-cheese', name: '乳酪絲', category: 'topping', icon: Cookie, price: 10.00, image: 'https://placehold.co/70x47.png', dataAiHint: 'shredded cheese', slug: 'shredded-cheese' },
  // Sweet/Dessert Toppings
  { id: 'marshmallows', name: '棉花糖', category: 'topping', icon: IceCream, price: 5.00, image: 'https://placehold.co/70x47.png', dataAiHint: 'marshmallows', slug: 'marshmallows' },
  { id: 'chocolate-chips', name: '巧克力片', category: 'topping', icon: Cookie, price: 15.00, image: 'https://placehold.co/70x47.png', dataAiHint: 'chocolate chips', slug: 'chocolate-chips' },
  { id: 'colorful-chocolate-beans', name: '彩色巧克力豆', category: 'topping', icon: Sparkles, price: 12.00, image: 'https://placehold.co/70x47.png', dataAiHint: 'colorful chocolate beans', slug: 'colorful-chocolate-beans' },
  { id: 'oreo-crumbs', name: '奧利奧餅乾碎', category: 'topping', icon: Cookie, price: 15.00, image: 'https://placehold.co/70x47.png', dataAiHint: 'oreo cookie crumbs', slug: 'oreo-crumbs' },
  { id: 'coconut-flakes', name: '椰子絲', category: 'topping', icon: Sprout, price: 15.00, image: 'https://placehold.co/70x47.png', dataAiHint: 'coconut flakes', slug: 'coconut-flakes' },
  // Savory/Vegetable/Other Toppings
  { id: 'corn', name: '玉米', category: 'topping', icon: Sparkles, price: 5.00, image: 'https://placehold.co/70x47.png', dataAiHint: 'corn kernels', slug: 'corn' },
  { id: 'hashbrown', name: '薯餅', category: 'topping', icon: Flame, price: 15.00, image: 'https://placehold.co/70x47.png', dataAiHint: 'hash brown', slug: 'hashbrown' },
  { id: 'hotdog-egg', name: '熱狗蛋', category: 'topping', icon: EggFried, price: 20.00, image: 'https://placehold.co/70x47.png', dataAiHint: 'hot dog egg', slug: 'hotdog-egg' },
  { id: 'egg', name: '煎蛋', category: 'topping', icon: EggFried, price: 10.00, image: 'https://placehold.co/70x47.png', dataAiHint: 'fried egg', slug: 'egg' },
  { id: 'mixed-nuts', name: '堅果碎（綜合）', category: 'topping', icon: Nut, price: 20.00, image: 'https://placehold.co/70x47.png', dataAiHint: 'mixed nuts', slug: 'mixed-nuts' },
  { id: 'almond-slices', name: '杏仁片', category: 'topping', icon: Nut, price: 18.00, image: 'https://placehold.co/70x47.png', dataAiHint: 'almond slices', slug: 'almond-slices' },
  { id: 'walnut-pieces', name: '核桃碎', category: 'topping', icon: Nut, price: 20.00, image: 'https://placehold.co/70x47.png', dataAiHint: 'walnut pieces', slug: 'walnut-pieces' },
  { id: 'peanut-pieces', name: '花生碎', category: 'topping', icon: Nut, price: 12.00, image: 'https://placehold.co/70x47.png', dataAiHint: 'peanut pieces', slug: 'peanut-pieces' },
  { id: 'oatmeal', name: '燕麥片', category: 'topping', icon: Wheat, price: 10.00, image: 'https://placehold.co/70x47.png', dataAiHint: 'oatmeal flakes', slug: 'oatmeal' },
  { id: 'cucumber-slices', name: '小黃瓜片', category: 'topping', icon: Leaf, price: 10.00, image: 'https://placehold.co/70x47.png', dataAiHint: 'cucumber slices', slug: 'cucumber-slices' },
  { id: 'onion-rings', name: '洋蔥圈', category: 'topping', icon: Carrot, price: 10.00, image: 'https://placehold.co/70x47.png', dataAiHint: 'onion rings', slug: 'onion-rings' },
  { id: 'green-pepper-strips', name: '青椒絲', category: 'topping', icon: Leaf, price: 10.00, image: 'https://placehold.co/70x47.png', dataAiHint: 'green pepper strips', slug: 'green-pepper-strips' },
  { id: 'shredded-lettuce', name: '生菜絲', category: 'topping', icon: LeafyGreen, price: 8.00, image: 'https://placehold.co/70x47.png', dataAiHint: 'shredded lettuce', slug: 'shredded-lettuce' },
  { id: 'shredded-purple-cabbage', name: '紫高麗菜絲', category: 'topping', icon: LeafyGreen, price: 10.00, image: 'https://placehold.co/70x47.png', dataAiHint: 'shredded purple cabbage', slug: 'shredded-purple-cabbage' },
  { id: 'shredded-carrot', name: '胡蘿蔔絲', category: 'topping', icon: Carrot, price: 8.00, image: 'https://placehold.co/70x47.png', dataAiHint: 'shredded carrot', slug: 'shredded-carrot' },
];


export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'classic-toast',
    name: '經典奶油吐司',
    description: '兩片您選擇的麵包，完美烘烤並塗上奶油。',
    price: 30.00,
    image: '/MENU_ITEMS/toast_specialty/classic-toast.jpeg',
    dataAiHint: 'buttered toast',
    category: 'toast_specialty',
  },
  {
    id: 'avo-egg-toast',
    name: '酪梨蛋蛋吐司',
    description: '裸麥吐司搭配新鮮酪梨和一顆太陽蛋。',
    price: 50.00,
    image: '/MENU_ITEMS/toast_specialty/avo-egg-toast.jpeg',
    dataAiHint: 'avocado egg',
    category: 'toast_specialty',
  },
  {
    id: 'fruit-bowl',
    name: '季節水果碗',
    description: '一份清爽的當季新鮮水果組合。',
    price: 60.00,
    image: '/MENU_ITEMS/snack_side/fruit-bowl.jpeg',
    dataAiHint: 'fruit bowl',
    category: 'snack_side',
  },
  {
    id: 'onion-rings-menu',
    name: '香酥洋蔥圈',
    description: '金黃酥脆的洋蔥圈，佐以特製沾醬。',
    price: 50.00,
    image: '/MENU_ITEMS/fried_snack/onion-rings.jpeg',
    dataAiHint: 'onion rings',
    category: 'fried_snack',
  },
  {
    id: 'mozzarella-sticks',
    name: '起司條',
    description: '濃郁的莫札瑞拉起司條，搭配瑪茲瑞拉沾醬。',
    price: 70.00,
    image: '/MENU_ITEMS/fried_snack/mozzarella-sticks.jpeg',
    dataAiHint: 'mozzarella sticks',
    category: 'fried_snack',
  },
  {
    id: 'jalapeno-poppers',
    name: '墨西哥辣椒爆漿起司球',
    description: '辣味墨西哥辣椒填滿奶油起司，裹粉油炸。',
    price: 75.00,
    image: '/MENU_ITEMS/fried_snack/jalapeno-poppers.jpeg',
    dataAiHint: 'jalapeno poppers',
    category: 'fried_snack',
  },
  {
    id: 'french-fries-menu',
    name: '經典薯條',
    description: '完美酥炸、恰到好處的鹽味薯條。',
    price: 45.00,
    image: '/MENU_ITEMS/fried_snack/french-fries.jpeg',
    dataAiHint: 'french fries',
    category: 'fried_snack',
  },
  {
    id: 'coffee',
    name: '現煮咖啡',
    description: '香醇濃郁，提供每日精選咖啡豆。',
    price: 50.00,
    image: '/MENU_ITEMS/drinks/coffee.jpeg',
    dataAiHint: 'coffee cup',
    category: 'drink',
  },
  {
    id: 'orange-juice',
    name: '新鮮柳橙汁',
    description: '100% 現榨柳橙汁。',
    price: 55.00,
    image: '/MENU_ITEMS/drinks/orange-juice.jpeg',
    dataAiHint: 'orange juice glass',
    category: 'drink',
  },
  {
    id: 'bottled-water',
    name: '瓶裝水',
    description: '冰涼的礦泉水。',
    price: 25.00,
    image: '/MENU_ITEMS/drinks/bottled-water.jpeg',
    dataAiHint: 'water bottle',
    category: 'drink',
  },
];

export const ADVENTUROUS_TOAST_REVIEWS: AdventurousToastReview[] = [
  {
    id: 'orange-cheese-fried-chicken-toast-newbie',
    name: '柳橙起司卡拉雞',
    category: '新手入門',
    ingredients: ["白吐司", "柳橙醬", "起司片", "卡拉雞", "胡椒醬"],
    description: '香酥卡拉雞與融化起司的經典搭配，佐以柳橙醬提味，夾入鬆軟吐司。',
    image: '/Adventurous_Toast/Newbie Start/orange-cheese-fried-chicken-toast-newbie.jpeg',
    dataAiHint: 'orange chicken cheese',
    rating: 2.5,
    reviewText: "味道還可，只是柳橙醬不夠多，味道幾乎被雞蓋過，只有在沒有卡拉雞的地方才出來刷一下存在感，像極了做報告時的雷組員，靠卡ラ雞和胡椒凱瑞。不過若說柳橙醬是雷組員，那起司就是掛名的幽靈組員了",
    price: 55.00, // Recalculated: 10(bread)+10(orange-jam)+10(cheese-slice)+20(fried-chicken)+5(pepper-sauce) = 55
    reviewerName: '新手探險家',
  },
  {
    id: 'chocolate-bacon-strawberry-toast-newbie',
    name: '巧克力培根佐真.草莓',
    category: '新手入門',
    ingredients: ["白吐司", "巧克力醬", "培根", "新鮮草莓", "生菜絲"],
    description: '鹹甜交織的特殊風味，黑巧克力醬搭配香煎培根，並佐以新鮮草莓切片與生菜。',
    image: '/Adventurous_Toast/Newbie Start/chocolate-bacon-strawberry-toast-newbie.jpeg',
    dataAiHint: 'chocolate bacon strawberry',
    rating: 2,
    reviewText: "培根和巧克力蠻搭的，但草莓和培根就不是很融洽了，培根的煙燻味和草莓的酸很衝突。另外草莓軟爛生菜脆，一起吃就感覺在吃一坨意義不明的東西，而且酸酸的生菜一整個就很莫名其妙。",
    price: 60.00, // Recalculated: 10(bread)+10(chocolate)+12(bacon)+20(strawberry)+8(lettuce) = 60
    reviewerName: '味蕾挑戰者',
  },
  {
    id: 'milk-crisp-lemon-chicken-toast-newbie',
    name: '奶酥檸檬雞',
    category: '新手入門',
    ingredients: ["白吐司", "奶酥", "檸檬雞"],
    description: '香甜奶酥醬與清爽檸檬雞的奇妙組合，吐司邊緣烤至焦脆，中間濕軟。',
    image: '/Adventurous_Toast/Newbie Start/milk-crisp-lemon-chicken-toast-newbie.jpeg',
    dataAiHint: 'milkcrisp lemon chicken',
    rating: 3,
    reviewText: "中間檸檬雞較密集的區域幾乎吃不到奶酥的味道，但其實兩者搭在一起不會突兀。吐司邊邊的地方烤過之後會焦焦脆脆的，很讚。中間是濕軟的檸檬雞，整體吃起來口感有變化。",
    price: 40.00, // Recalculated: 10(bread)+15(milk-crisp)+15(lemon-chicken) = 40
    reviewerName: '小試牛刀客',
  },
  {
    id: 'matcha-marshmallow-shredded-cheese-toast-newbie',
    name: '抹茶棉花糖乳酪絲',
    category: '新手入門',
    ingredients: ["白吐司", "抹茶醬", "棉花糖", "乳酪絲"],
    description: '抹茶的微苦茶香，搭配融化的甜棉花糖與乳酪絲，口感豐富。',
    image: '/Adventurous_Toast/Newbie Start/matcha-marshmallow-shredded-cheese-toast-newbie.jpeg',
    dataAiHint: 'matcha marshmallow cheese',
    rating: 2,
    reviewText: "茶香配綿綿甜甜的口感加烤得酥酥的吐司，很好吃，但是完全吃不到乳酪絲的味道，所以沒有任何味道衝突，感覺乳酪絲的作用只有加厚吐司(？)，如果想點的話建議不用加乳酪絲，省錢💸",
    price: 40.00, // Recalculated: 10(bread)+15(matcha)+5(marshmallows)+10(shredded-cheese) = 40
    reviewerName: '甜點研究生',
  },

  {
    id: 'strawberry-peanutbutter-toast',
    name: '草莓花生醬甜蜜吐司',
    category: '普通款',
    ingredients: ["白吐司", "新鮮草莓", "花生醬", "蜂蜜"],
    description: '經典的花生醬吐司升級版，加上新鮮草莓片和一點蜂蜜，甜而不膩。',
    image: '/Adventurous_Toast/Regular Version/strawberry-peanutbutter-toast.jpeg',
    dataAiHint: 'strawberry peanutbutter',
    rating: 4,
    reviewText: "很安全牌的美味！草莓的酸甜跟花生醬的濃郁很搭，蜂蜜增添了一絲清香，小朋友也會喜歡。",
    price: 55.00, // Recalculated: 10(bread)+20(strawberry)+10(peanut-butter)+15(honey) = 55
    reviewerName: '甜食控小美',
  },
  {
    id: 'banana-nutella-toast',
    name: '香蕉榛果巧克力醬吐司',
    category: '普通款',
    ingredients: ["胚芽吐司", "香蕉片", "巧克力醬", "杏仁片"],
    description: '鬆軟的胚芽吐司，抹上濃郁的榛果巧克力醬，鋪上香蕉片，再撒上香脆杏仁片，多層次的享受。',
    image: '/Adventurous_Toast/Regular Version/banana-nutella-toast.jpeg',
    dataAiHint: 'banana nutella',
    rating: 5,
    reviewText: "無法抗拒的組合！香蕉跟巧克力就是絕配，胚芽吐司的奶香和杏仁片的口感更是加分。",
    price: 56.00, // Recalculated: 13(wheat-germ-toast)+15(banana-slices)+10(chocolate)+18(almond-slices) = 56
    reviewerName: '巧克力愛好者',
  },
   {
    id: 'maple-bacon-crunch',
    name: '楓糖培根脆片吐司',
    category: '普通款',
    ingredients: ["白吐司", "培根", "楓糖醬", "核桃碎"],
    description: '鹹甜交織的美味，酥脆的培根淋上香甜楓糖漿，搭配核桃碎增加口感。',
    image: '/Adventurous_Toast/Regular Version/maple-bacon-crunch.jpeg',
    dataAiHint: 'maple bacon',
    rating: 4,
    reviewText: "培根的鹹香和楓糖的甜意外地搭！核桃碎很加分，是很棒的早午餐選擇。",
    price: 57.00, // Recalculated: 10(bread)+12(bacon)+15(maple-syrup)+20(walnut-pieces) = 57
    reviewerName: '美式風味愛好者',
  },
  {
    id: 'classic-cheese-tomato-melt',
    name: '經典起司番茄融化吐司',
    category: '普通款',
    ingredients: ["白吐司", "起司片", "小番茄", "美乃滋"],
    description: '經典不敗的美味，融化的切達起司覆蓋在多汁的番茄片上，簡單卻令人滿足。',
    image: '/Adventurous_Toast/Regular Version/classic-cheese-tomato-melt.jpeg',
    dataAiHint: 'cheese tomato melt',
    rating: 4,
    reviewText: "這個絕對不會出錯。簡單、滿足，總能恰到好處。起司融化得非常完美。",
    price: 40.00, // Recalculated: 10(bread)+10(cheese-slice)+15(cherry-tomatoes)+5(mayo) = 40
    reviewerName: '懷舊美食家',
  },
  {
    id: 'garlic-butter-toast',
    name: '香蒜奶油吐司條',
    category: '普通款',
    ingredients: ["白吐司", "香蒜醬（熟蒜泥風味）"],
    description: '烤得金黃酥脆的厚片吐司，塗上香濃的大蒜奶油醬，撒上新鮮巴西里碎。',
    image: '/Adventurous_Toast/Regular Version/garlic-butter-toast.jpeg',
    dataAiHint: 'garlic butter',
    rating: 5,
    reviewText: "蒜味超香！奶油味也很足，吐司烤得剛剛好，簡單又美味。",
    price: 20.00, // Recalculated: 10(bread)+10(roasted-garlic) = 20
    reviewerName: '大蒜控',
  },

  {
    id: 'strawberry-hashbrown-corn-toast-challenge',
    name: '草莓醬抹薯餅佐玉米粒',
    category: '勇者挑戰',
    ingredients: ["白吐司", "薯餅", "玉米", "草莓醬", "生菜絲"],
    description: '薯餅的酥脆、玉米的清甜與草莓醬的酸甜衝撞，佐以生菜絲。一次挑戰多種口感與風味的搭配。',
    image: '/Adventurous_Toast/Braveheart Challenge/strawberry-hashbrown-corn-toast-challenge.jpeg',
    dataAiHint: 'strawberry hashbrown corn',
    rating: 1.5,
    reviewText: "就像個路人一樣，普通。玉米和高麗菜絲可以解薯餅的膩，草莓醬的酸甜跟他們不搭，像一般的三明治莫名的多了一股甜味，不會很衝突或很難吃，但也沒有可取之處。",
    price: 48.00, // Recalculated: 10(bread)+15(hashbrown)+5(corn)+10(strawberry-jam)+8(lettuce) = 48
    reviewerName: '勇者鑑定團員A',
  },
  {
    id: 'milkcrisp-hotdog-egg-toast-challenge',
    name: '奶酥熱狗蛋',
    category: '勇者挑戰',
    ingredients: ["白吐司", "奶酥", "熱狗蛋", "番茄醬"],
    description: '香甜奶酥與鹹香熱狗蛋的意外組合，淋上番茄醬，挑戰你對甜鹹搭配的想像力。',
    image: '/Adventurous_Toast/Braveheart Challenge/milkcrisp-hotdog-egg-toast-challenge.jpeg',
    dataAiHint: 'milkcrisp hotdog egg',
    rating: 4.5,
    reviewText: "奶酥提供了很濃的奶香和一點甜味，混合在熱狗蛋和番茄醬裡不僅不突兀，還增加不同層次的風味，甜和鹹的很協調不膩，首個超出預期的美味。",
    price: 50.00, // Recalculated: 10(bread)+15(milk-crisp)+20(hotdog-egg)+5(ketchup) = 50
    reviewerName: '勇者鑑定團員B',
  },
  {
    id: 'doublechicken-strawberry-marshmallow-toast-challenge',
    name: '照燒雞夾卡拉雞佐草莓棉花糖生菜',
    category: '勇者挑戰',
    ingredients: ["白吐司", "照燒雞", "卡拉雞", "草莓醬", "棉花糖", "生菜絲"],
    description: '雙重雞肉衝擊！照燒雞的醬香與卡拉雞的酥脆，搭配草莓醬的酸甜、棉花糖的柔軟和生菜的清爽。',
    image: '/Adventurous_Toast/Braveheart Challenge/doublechicken-strawberry-marshmallow-toast-challenge.jpeg',
    dataAiHint: 'double chicken strawberry',
    rating: 3,
    reviewText: "卡拉雞存在感依舊強勢，就像美女中的帥哥一樣搶鏡。草莓醬犧牲小我和棉花糖混合成甜香，新奇但不錯吃。照燒雞就顯得多餘，因為卡拉雞的肉已經很厚了，再加一層照燒雞，頗膩。",
    price: 68.00, // Recalculated: 10(bread)+15(teriyaki-chicken)+20(fried-chicken)+10(strawberry-jam)+5(marshmallows)+8(lettuce) = 68
    reviewerName: '勇者鑑定團員C',
  },
  {
    id: 'chocolate-friedchicken-ketchup-marshmallow-toast-challenge',
    name: '巧克力卡拉雞加番茄醬棉花糖',
    category: '勇者挑戰',
    ingredients: ["白吐司", "巧克力醬", "卡拉雞", "番茄醬", "棉花糖"],
    description: '甜、鹹、酸的多重味覺冒險。巧克力醬的甜、卡拉雞的鹹、番茄醬的酸，再加上棉花糖的柔軟焦香。',
    image: '/Adventurous_Toast/Braveheart Challenge/chocolate-friedchicken-ketchup-marshmallow-toast-challenge.jpeg',
    dataAiHint: 'chocolate chicken ketchup',
    rating: 4,
    reviewText: "酸鹹甜三味雜陳，挑戰味蕾極限，但意外有搭，整體不會過於甜膩。另外棉花糖烤過之後會散發特殊焦香，和脆脆的卡拉雞皮蠻搭的，有種在吃餅乾的錯覺（？）",
    price: 50.00, // Recalculated: 10(bread)+10(chocolate)+20(fried-chicken)+5(ketchup)+5(marshmallows) = 50
    reviewerName: '勇者鑑定團員D',
  },

  {
    id: 'peanut-smoked-chicken-egg-toast-staffpick',
    name: '花生燻雞夾煎蛋',
    category: '私房推薦',
    ingredients: ["白吐司", "花生醬", "燻雞", "煎蛋"],
    description: '香氣十足的燻雞與濃郁花生醬的完美融合，搭配滑嫩煎蛋，帶來多層次的鹹香風味。',
    image: '/Adventurous_Toast/Exclusive Pick/peanut-smoked-chicken-egg-toast-staffpick.jpeg',
    dataAiHint: 'peanut smoked chicken egg',
    rating: 3.5,
    reviewText: "試吃報告：燻雞和花生醬的香氣十足，彼此相輔相成，也將所有配料融合的很好，很順口ᕕ( ᐛ )ᕗ。",
    price: 45.00, // Recalculated: 10(bread)+10(peanut-butter)+15(smoked-chicken)+10(egg) = 45
    reviewerName: '店長私藏',
  },
  {
    id: 'chocolate-strawberry-cheese-marshmallow-toast-staffpick',
    name: '巧克力草莓起司夾棉花糖',
    category: '私房推薦',
    ingredients: ["白吐司", "巧克力醬", "新鮮草莓", "乳酪絲", "棉花糖"],
    description: '濃郁巧克力醬與澎湃棉花糖的甜蜜組合，搭配酸甜草莓與鹹香乳酪絲，口感豐富，甜而不膩。',
    image: '/Adventurous_Toast/Exclusive Pick/chocolate-strawberry-cheese-marshmallow-toast-staffpick.jpeg',
    dataAiHint: 'chocolate strawberry cheese marshmallow',
    rating: 3,
    reviewText: "巧克力醬塗好塗滿，棉花糖很澎湃，夾在烤得酥酥的吐司中口感很好，只是太台南了，還好草莓酸酸甜甜帶有果香很解膩，乳酪絲提供一點點鹹味，更襯托了其他配料的風味。",
    price: 55.00, // Recalculated: 10(bread)+10(chocolate)+20(strawberry)+10(shredded-cheese)+5(marshmallows) = 55
    reviewerName: '甜點愛好者',
  },
  {
    id: 'chocolate-friedchicken-egg-ketchup-toast-staffpick',
    name: '巧克力卡拉雞',
    category: '私房推薦',
    ingredients: ["白吐司", "巧克力醬", "卡拉雞", "煎蛋", "番茄醬"],
    description: '巧克力醬的濃郁甜味與酥脆卡拉雞的鹹香交織，搭配香煎蛋與番茄醬，帶來意想不到的美味衝擊。',
    image: '/Adventurous_Toast/Exclusive Pick/chocolate-friedchicken-egg-ketchup-toast-staffpick.jpeg',
    dataAiHint: 'chocolate fried chicken egg ketchup',
    rating: 4.5,
    reviewText: "巧克力很夠味，在眾多鹹味配角中還是很閃亮，蛋煎的很乾很香，卡拉雞外皮酥脆，很juicy。巧克力跟番茄醬算速配，但整體有點大雜燴，反而蓋過卡拉雞原來的味道......\nps.但還是很好吃啦~",
    price: 55.00, // Recalculated: 10(bread)+10(chocolate)+20(fried-chicken)+10(egg)+5(ketchup) = 55
    reviewerName: '創意料理家',
  },
  {
    id: 'chocolate-marshmallow-toast-staffpick',
    name: '巧克力棉花糖',
    category: '私房推薦',
    ingredients: ["白吐司", "巧克力醬", "棉花糖"],
    description: '融化的棉花糖與濃郁巧克力醬的完美結合，每一口都能拉絲，帶來極致的甜蜜享受。',
    image: '/Adventurous_Toast/Exclusive Pick/chocolate-marshmallow-toast-staffpick.jpeg',
    dataAiHint: 'chocolate marshmallow',
    rating: 3,
    reviewText: "棉花糖溶在巧克力間，每口咬下都會拉絲，巧克力醬很夠，能讓棉花糖吃起來像超厚的巧克力醬，但棉花糖就很台南，尤其是棉花糖烤焦的地方，燒焦味就跟個小三一樣，破壞和諧。",
    price: 25.00, // Recalculated: 10(bread)+10(chocolate)+5(marshmallows) = 25
    reviewerName: '螞蟻人',
  },

  {
    id: 'orange-pepper-chicken-cheese-toast-destiny',
    name: '柳橙黑胡椒雞乳酪絲',
    category: '命運轉盤',
    ingredients: ["白吐司", "柳橙醬", "黑胡椒雞", "乳酪絲"],
    description: '清新的柳橙醬搭配鹹香的黑胡椒雞，還有牽絲的乳酪絲，帶來多層次的味覺體驗。',
    image: '/Adventurous_Toast/Fortune Spinne/orange-pepper-chicken-cheese-toast-destiny.jpeg',
    dataAiHint: 'orange pepper chicken cheese',
    rating: 3.5,
    reviewText: "柳橙醬跟我印象中不太一樣，比較像蜂蜜柚子醬，單吃或加其他甜的料一定會膩。但有鹹的黑胡椒雞就平衡了，味道有漸入佳境。乳酪絲快被柳橙淹沒了，剩一點點奶味在苟延殘喘。",
    price: 45.00, // Recalculated: 10(bread)+10(orange-jam)+15(black-pepper-chicken)+10(shredded-cheese) = 45
    reviewerName: '轉盤探險家A',
  },
  {
    id: 'garlic-ham-hotdog-egg-toast-destiny',
    name: '蒜味火腿熱狗蛋',
    category: '命運轉盤',
    ingredients: ["白吐司", "香蒜醬（熟蒜泥風味）", "火腿", "熱狗蛋"],
    description: '濃郁的蒜香醬，搭配經典的火腿與特製熱狗蛋，帶來豐富的鹹香風味。',
    image: '/Adventurous_Toast/Fortune Spinne/garlic-ham-hotdog-egg-toast-destiny.jpeg',
    dataAiHint: 'garlic ham hotdog egg',
    rating: 4.5,
    reviewText: "蒜味濃郁，和熱狗很搭。火腿和熱狗口感太相似，幾乎吃不出來有加火腿，下次可以省點錢。熱狗蛋的做法和之前吃到的不太一樣，是熱狗外包一層薄薄的蛋皮，之前半熟荷包蛋可能更好吃。",
    price: 50.00, // Recalculated: 10(bread)+10(roasted-garlic)+10(ham)+20(hotdog-egg) = 50
    reviewerName: '轉盤探險家B',
  },
  {
    id: 'peanut-cheese-fried-chicken-toast-destiny',
    name: '花生起司卡拉雞',
    category: '命運轉盤',
    ingredients: ["白吐司", "花生醬", "起司片", "卡拉雞"],
    description: '香濃花生醬與酥脆卡拉雞的絕妙組合，加上融化的起司片，甜鹹交織，口感豐富。',
    image: '/Adventurous_Toast/Fortune Spinne/peanut-cheese-fried-chicken-toast-destiny.jpeg',
    dataAiHint: 'peanut cheese chicken',
    rating: 4,
    reviewText: "剛開始只吃到花生醬和卡拉雞，甜鹹交織出衝突美，但吃到中間起司後，幾乎只嚐到鹹，不膩但無聊。整份雖然有點小貴，但雞很厚實，很有飽足感，當午餐挺好。",
    price: 50.00, // Recalculated: 10(bread)+10(peanut-butter)+10(cheese-slice)+20(fried-chicken) = 50
    reviewerName: '轉盤探險家C',
  },
  {
    id: 'milkcrisp-roastedpork-cheese-toast-destiny',
    name: '奶酥燒肉起司',
    category: '命運轉盤',
    ingredients: ["白吐司", "奶酥", "燒肉", "起司片"],
    description: '香甜奶酥搭配鹹香燒肉和融化起司，創造出類似沙威瑪的獨特風味，令人驚艷。',
    image: '/Adventurous_Toast/Fortune Spinne/milkcrisp-roastedpork-cheese-toast-destin.jpeg',
    dataAiHint: 'milkcrisp pork cheese',
    rating: 4,
    reviewText: "吃起來完全就是沙威瑪的味道，加了高麗菜絲和番茄醬更像了。奶酥提升了香氣，但吃不出甜，起司更是吃到一半得掀開來檢查在不在的程度，初步猜測是跟奶酥水乳交融去了。",
    price: 50.00, // Recalculated: 10(bread)+15(milk-crisp)+15(roasted-pork)+10(cheese-slice) = 50
    reviewerName: '轉盤探險家D',
  },
];

export const HALL_OF_FAME_ENTRIES: HallOfFameEntry[] = [
  {
    id: 'hof-gongsun',
    userName: '公孫大娘',
    toastId: 'chocolate-friedchicken-ketchup-marshmallow-toast-challenge',
    dateAchieved: '2024-07-25',
    achievementQuote: '一舞劍器動四方，一嚐此吐司定八荒！滋味之奇，猶勝當年劍舞。',
    userImage: '/User_Img/1.jpeg',
  },
  {
    id: 'hof-xieyanke',
    userName: '謝煙客',
    toastId: 'milkcrisp-hotdog-egg-toast-challenge',
    dateAchieved: '2024-07-26',
    achievementQuote: '老夫玄鐵令，不及此吐司滋味精！今日得嚐，俠客行不虛此行！',
    userImage: '/User_Img/3.jpeg',
  },
  {
    id: 'hof-dongfang',
    userName: '東方朔',
    toastId: 'doublechicken-strawberry-marshmallow-toast-challenge',
    dateAchieved: '2024-07-27',
    achievementQuote: '待詔金馬門，偷桃三千年。此吐司之味，人間能有幾回聞？妙哉！',
    userImage: '/User_Img/4.jpeg',
  },
  {
    id: 'hof-yuji',
    userName: '虞姬',
    toastId: 'strawberry-hashbrown-corn-toast-challenge',
    dateAchieved: '2024-07-28',
    achievementQuote: '力拔山兮氣蓋世，吐司之味兮奈若何！雖有訣別之意，此味難捨。',
    userImage: '/User_Img/5.jpeg',
  },
  {
    id: 'hof-zhulin',
    userName: '嵇康',
    toastId: 'orange-pepper-chicken-cheese-toast-destiny',
    dateAchieved: '2024-07-29',
    achievementQuote: '廣陵散今絕矣，此吐司之味，當與好友共品，方不負此生！',
    userImage: '/User_Img/2.jpeg',
  },
];

const allToastsForLookup: (MenuItem | AdventurousToastReview)[] = [...MENU_ITEMS, ...ADVENTUROUS_TOAST_REVIEWS];

export const getToastItemById = (id: string): MenuItem | AdventurousToastReview | undefined => {
  return allToastsForLookup.find(toast => toast.id === id);
};


export const STAFF_PICKS_IDS: string[] = [
  'peanut-smoked-chicken-egg-toast-staffpick',
  'chocolate-strawberry-cheese-marshmallow-toast-staffpick',
  'chocolate-friedchicken-egg-ketchup-toast-staffpick',
  'chocolate-marshmallow-toast-staffpick',
  'avo-egg-toast'
];


export const getAdventurousToastById = (id: string): AdventurousToastReview | undefined => {
  return ADVENTUROUS_TOAST_REVIEWS.find(toast => toast.id === id);
};

// Price Recalculation Function
const recalculatePrice = (breadNameFromIngredients: string | undefined, meatNames: string[], sauceNames: string[], toppingNames: string[]): number => {
  const bread = BREADS.find(b => b.name === breadNameFromIngredients);
  let price = bread ? bread.price : (BREADS[0]?.price || 0); // Default to first bread if not found or name is undefined

  meatNames.forEach(name => price += MEATS.find(m => m.name === name)?.price || 0);
  sauceNames.forEach(name => price += SAUCES.find(s => s.name === name)?.price || 0);
  toppingNames.forEach(name => price += TOPPINGS.find(t => t.name === name)?.price || 0);
  return price;
};


// Ensure prices are up-to-date based on current ingredient costs
const ensurePricesAreCorrect = () => {
  ADVENTUROUS_TOAST_REVIEWS.forEach(toast => {
    const breadName = toast.ingredients.find(ingName => BREADS.some(b => b.name === ingName));
    const meatNames = toast.ingredients.filter(ingName => MEATS.some(m => m.name === ingName));
    const sauceNames = toast.ingredients.filter(ingName => SAUCES.some(s => s.name === ingName));
    const toppingNames = toast.ingredients.filter(ingName => TOPPINGS.some(t => t.name === ingName));

    toast.price = recalculatePrice(breadName, meatNames, sauceNames, toppingNames);
  });

  // Specifically recalculate for avo-egg-toast in MENU_ITEMS if it exists
  const avoEggToastItem = MENU_ITEMS.find(item => item.id === 'avo-egg-toast');
  if (avoEggToastItem) {
    // Based on its description: "裸麥吐司搭配新鮮酪梨和一顆太陽蛋。"
    const ryeBread = BREADS.find(b => b.name === '裸麥吐司');
    const avocadoTopping = TOPPINGS.find(t => t.name === '酪梨');
    const eggTopping = TOPPINGS.find(t => t.name === '煎蛋'); // Changed from 太陽蛋 to 煎蛋
    
    let calculatedPrice = 0;
    if (ryeBread) calculatedPrice += ryeBread.price;
    if (avocadoTopping) calculatedPrice += avocadoTopping.price;
    if (eggTopping) calculatedPrice += eggTopping.price;
    
    avoEggToastItem.price = calculatedPrice;
  }
};

ensurePricesAreCorrect(); // Call the function to update prices on module load

