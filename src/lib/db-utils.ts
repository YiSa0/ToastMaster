import { 
  Ingredient, 
  MenuItem, 
  AdventurousToast, 
  AdventurousIngredient, 
  HallOfFame,
  TableNames,
  TableFieldMappings 
} from './types';

const validCategories = ['bread', 'meat', 'sauce', 'topping'] as const;
type ValidCategory = typeof validCategories[number];

// 数据验证函数
export const validateIngredient = (data: any): Ingredient | null => {
  try {
    const category = String(data.category) as ValidCategory;
    if (!validCategories.includes(category)) {
      throw new Error(`Invalid category: ${category}`);
    }

    const ingredient: Ingredient = {
      id: String(data.id),
      slug: String(data.slug),
      name: String(data.name),
      category,
      price: Number(data.price),
      image: data.image ? String(data.image) : undefined,
      dataAiHint: data.dataAiHint ? String(data.dataAiHint) : undefined,
    };
    return ingredient;
  } catch (error) {
    console.error('Invalid ingredient data:', error);
    return null;
  }
};

export const validateMenuItem = (data: any): MenuItem | null => {
  try {
    const menuItem: MenuItem = {
      id: String(data.id),
      name: String(data.name),
      description: String(data.description),
      price: Number(data.price),
      image: String(data.image),
      category: String(data.category),
      dataAiHint: String(data.dataAiHint)
    };
    return menuItem;
  } catch (error) {
    console.error('Invalid menu item data:', error);
    return null;
  }
};

export const validateAdventurousToast = (data: any): AdventurousToast | null => {
  try {
    const toast: AdventurousToast = {
      id: String(data.id),
      name: String(data.name),
      category: String(data.category),
      description: String(data.description),
      image: String(data.image),
      dataAiHint: String(data.dataAiHint),
      price: Number(data.price),
      rating: Number(data.rating),
      reviewText: String(data.reviewText),
      reviewerName: String(data.reviewerName)
    };
    return toast;
  } catch (error) {
    console.error('Invalid adventurous toast data:', error);
    return null;
  }
};

// 数据转换函数
export const convertToSQLParams = (data: any, tableName: TableNames): Record<string, any> => {
  const fieldMappings = TableFieldMappings[tableName] as Record<string, string>;
  const sqlParams: Record<string, any> = {};

  for (const [key, value] of Object.entries(data)) {
    if (fieldMappings[key]) {
      sqlParams[fieldMappings[key]] = value;
    }
  }

  return sqlParams;
};

// 数据查询构建函数
export const buildSelectQuery = (tableName: TableNames, conditions?: Record<string, any>): string => {
  const fields = Object.values(TableFieldMappings[tableName] as Record<string, string>).join(', ');
  let query = `SELECT ${fields} FROM ${tableName}`;
  
  if (conditions) {
    const whereClause = Object.entries(conditions)
      .map(([key, value]) => `${key} = @${key}`)
      .join(' AND ');
    query += ` WHERE ${whereClause}`;
  }
  
  return query;
};

// 数据插入构建函数
export const buildInsertQuery = (tableName: TableNames, data: Record<string, any>): string => {
  const fields = Object.keys(data).join(', ');
  const params = Object.keys(data).map(key => `@${key}`).join(', ');
  
  return `INSERT INTO ${tableName} (${fields}) VALUES (${params})`;
};

// 数据更新构建函数
export const buildUpdateQuery = (tableName: TableNames, data: Record<string, any>, idField: string): string => {
  const setClause = Object.keys(data)
    .filter(key => key !== idField)
    .map(key => `${key} = @${key}`)
    .join(', ');
  
  return `UPDATE ${tableName} SET ${setClause} WHERE ${idField} = @${idField}`;
};

// 数据删除构建函数
export const buildDeleteQuery = (tableName: TableNames, idField: string): string => {
  return `DELETE FROM ${tableName} WHERE ${idField} = @${idField}`;
};

// 批量数据处理函数
export const processBatchData = async <T>(
  data: any[],
  validator: (item: any) => T | null,
  processor: (item: T) => Promise<void>
): Promise<void> => {
  for (const item of data) {
    const validatedItem = validator(item);
    if (validatedItem) {
      await processor(validatedItem);
    }
  }
};

export function convertToIngredient(data: any): Ingredient {
  try {
    const category = String(data.category) as ValidCategory;
    if (!validCategories.includes(category)) {
      throw new Error(`Invalid category: ${category}`);
    }

    const ingredient: Ingredient = {
      id: String(data.id),
      slug: String(data.slug),
      name: String(data.name),
      category,
      price: Number(data.price),
      image: data.image ? String(data.image) : undefined,
      dataAiHint: data.dataAiHint ? String(data.dataAiHint) : undefined,
    };
    return ingredient;
  } catch (error) {
    console.error('Error converting data to Ingredient:', error);
    throw new Error('Invalid ingredient data');
  }
} 