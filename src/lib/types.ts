import type { Timestamp } from 'firebase/firestore';

// Ingredients 表接口
export interface Ingredient {
  id: number;
  slug: string;
  name: string;
  category: string;
  price: number;
  image: string;
  dataAiHint: string;
}

// MenuItems 表接口
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  dataAiHint: string;
}

// AdventurousToasts 表接口
export interface AdventurousToast {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  dataAiHint: string;
  price: number;
  rating: number;
  reviewText: string;
  reviewerName: string;
}

// AdventurousIngredients 表接口
export interface AdventurousIngredient {
  id: number;
  toastId: string;
  quantity: number;
}

// HallOfFame 表接口
export interface HallOfFame {
  id: string;
  userName: string;
  toastId: string;
  dateAchieved: Date;
  achievementQuote: string;
  userImage: string;
}

// 数据库表名枚举
export enum TableNames {
  Ingredients = 'Ingredients',
  MenuItems = 'MenuItems',
  AdventurousToasts = 'AdventurousToasts',
  AdventurousIngredients = 'AdventurousIngredients',
  HallOfFame = 'HallOfFame'
}

// 数据库字段映射
export const TableFieldMappings = {
  [TableNames.Ingredients]: {
    id: 'id',
    slug: 'slug',
    name: 'name',
    category: 'category',
    price: 'price',
    image: 'image',
    dataAiHint: 'dataAiHint'
  },
  [TableNames.MenuItems]: {
    id: 'id',
    name: 'name',
    description: 'description',
    price: 'price',
    image: 'image',
    category: 'category',
    dataAiHint: 'dataAiHint'
  },
  [TableNames.AdventurousToasts]: {
    id: 'id',
    name: 'name',
    category: 'category',
    description: 'description',
    image: 'image',
    dataAiHint: 'dataAiHint',
    price: 'price',
    rating: 'rating',
    reviewText: 'reviewText',
    reviewerName: 'reviewerName'
  },
  [TableNames.AdventurousIngredients]: {
    id: 'id',
    toastId: 'toastId',
    quantity: 'quantity'
  },
  [TableNames.HallOfFame]: {
    id: 'id',
    userName: 'userName',
    toastId: 'toastId',
    dateAchieved: 'dateAchieved',
    achievementQuote: 'achievementQuote',
    userImage: 'userImage'
  }
};

export interface CustomToast {
  id: string; // Unique ID for this custom toast instance in an order
  bread: Ingredient;
  meats: Ingredient[];
  sauces: Ingredient[];
  toppings: Ingredient[];
  basePrice: number; // Price of the bread
}

export interface OrderItem {
  id: string; // Unique ID for this line item in the order
  type: 'predefined' | 'custom';
  name: string;
  itemPrice: number; // Price of a single item (predefined or calculated custom)
  quantity: number;
  details?: string; // For custom toast, list of ingredients
  image?: string; // For predefined items or a generic toast image
}

export interface Order {
  id?: string; // Firestore document ID, optional here, assigned by Firestore
  userId?: string | null; // ID of the user who placed the order, null if anonymous
  items: OrderItem[];
  pickupTime: string;
  specialRequests: string;
  totalPrice: number;
  createdAt?: Timestamp; // Timestamp of when the order was placed
  status?: 'pending' | 'confirmed' | 'ready' | 'completed' | 'cancelled'; // Optional order status
}

export type WeatherOption = "晴朗" | "多雲" | "小雨" | "下雪" | "有風" | "晴" | "雲" | "毛毛雨" | "雷雨" | "有霧" | "煙霧" | "霾" | "沙塵" | "霧" | "沙" | "火山灰" | "颮" | "龍捲風" | "未知";
// Original English options for OpenWeatherMap mapping if needed:
// export type WeatherOption = "Sunny" | "Cloudy" | "Rainy" | "Snowy" | "Windy" | "Clear" | "Clouds" | "Drizzle" | "Thunderstorm" | "Mist" | "Smoke" | "Haze" | "Dust" | "Fog" | "Sand" | "Ash" | "Squall" | "Tornado" | "Unknown";

export type MoodOption = "開心" | "還好" | "難過" | "想戀愛" | "失戀" | "興奮" | "疲倦" | "需要靈感" | "沉思" | "想冒險" | "想放鬆";


export const weatherOptionsManual: WeatherOption[] = ["晴朗", "多雲", "小雨", "下雪", "有風"];
export const moodOptions: MoodOption[] = ["開心", "還好", "難過", "想戀愛", "失戀", "興奮", "疲倦", "需要靈感", "沉思", "想冒險", "想放鬆"];


// For OpenWeatherMap responses
export interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: {
    id: number;
    main: string; // Maps to our WeatherOption after translation/mapping
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
    deg: number;
  };
  name: string; // City name
}

export type AdventurousToastCategory = '普通款' | '私房推薦' | '新手入門' | '勇者挑戰' | '命運轉盤';

export interface AdventurousToastReview {
  id: string;
  name: string;
  description: string; // 品項描述
  image: string;
  dataAiHint?: string;
  rating: number; // 推薦星等 (1-5 stars)
  reviewText: string; // 試吃心得
  reviewerName?: string;
  price: number;
  category: AdventurousToastCategory;
  ingredients: string[]; // 配料
}

export interface HallOfFameEntry {
  id: string;
  userName: string;
  userImage?: string; // Optional: URL to user's avatar/image
  toastId: string; // ID of the "勇者挑戰" toast they completed
  toastName?: string; // Optional: name of the toast for easier display
  toastImage?: string; // Optional: image of the toast for display
  dateAchieved: string; // e.g., "2024-07-15"
  achievementQuote?: string; // Optional quote from the user
}

// For user profile information
export interface UserProfileData {
  name: string;
  email: string;
  phone?: string;
  birthday?: string; // YYYY-MM-DD
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say' | ''; 
  updatedAt?: Timestamp | null; // Timestamp of when the profile was last updated
}

export type GenderOption = 'male' | 'female' | 'other' | 'prefer_not_to_say' | '';

export const genderOptions: { value: GenderOption; label: string }[] = [
  { value: 'male', label: '男性' },
  { value: 'female', label: '女性' },
  { value: 'other', label: '其他' },
  { value: 'prefer_not_to_say', label: '不願透漏' },
];
