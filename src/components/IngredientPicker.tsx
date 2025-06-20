import { Card, CardContent } from "@/components/ui/card";
import type { Ingredient } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ReactElement } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface IngredientPickerProps {
  title: string;
  icon?: ReactElement;
  ingredients: Ingredient[];
  selectedIngredients: Ingredient[];
  onSelectIngredient: (ingredient: Ingredient) => void;
  selectionType?: 'single' | 'multiple';
  maxSelection?: number;
}

export default function IngredientPicker({
  title,
  icon,
  ingredients,
  selectedIngredients,
  onSelectIngredient,
  selectionType = 'multiple',
  maxSelection,
}: IngredientPickerProps) {
  const handleSelect = (ingredient: Ingredient) => {
    if (selectionType === 'single') {
      onSelectIngredient(ingredient);
      return;
    }

    const isSelected = selectedIngredients.some(si => si.id === ingredient.id);
    if (isSelected) {
      onSelectIngredient(ingredient); // This will typically remove it
    } else if (!maxSelection || selectedIngredients.length < maxSelection) {
      onSelectIngredient(ingredient); // This will typically add it
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        {icon && <span className="text-primary">{icon}</span>}
        <h3 className="text-xl font-semibold">{title}</h3>
        {maxSelection && selectionType === 'multiple' && (
          <span className="text-sm text-muted-foreground">
            (最多選擇 {maxSelection} 項，已選: {selectedIngredients.length}/{maxSelection})
          </span>
        )}
      </div>
      <ScrollArea className="w-full whitespace-nowrap rounded-md">
        <div className="flex space-x-4 pb-4">
        {ingredients.map((ingredient) => {
          const isSelected = selectedIngredients.some(si => si.id === ingredient.id);
          const isDisabled = selectionType === 'multiple' && !isSelected && maxSelection !== undefined && selectedIngredients.length >= maxSelection;
            const IngredientIcon = ingredient.icon;
          return (
            <Card
              key={ingredient.id}
                onClick={() => !isDisabled && handleSelect(ingredient)}
              className={cn(
                  "w-36 h-auto min-h-32 flex-shrink-0 cursor-pointer border-2 transition-all duration-200 ease-in-out hover:shadow-lg flex flex-col justify-center items-center p-2",
                  isSelected ? "border-primary ring-2 ring-primary shadow-md" : "border-border",
                  isDisabled ? "opacity-50 cursor-not-allowed" : ""
              )}
                aria-pressed={isSelected}
                aria-disabled={isDisabled}
            >
                <CardContent className="p-2 text-center flex flex-col items-center justify-center">
                  {IngredientIcon && <IngredientIcon className="h-7 w-7 text-muted-foreground mx-auto mb-2" />}
                  <p className="text-sm font-medium truncate">{ingredient.name}</p>
                  <p className="text-xs text-muted-foreground">NT${ingredient.price.toFixed(2)}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}

    