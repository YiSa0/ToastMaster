
'use server';

/**
 * @fileOverview Suggests toast pairings based on weather, mood, and available ingredients,
 * and allows for feedback on disliked suggestions to regenerate.
 *
 * - suggestToastPairing - A function that suggests toast pairings.
 * - SuggestToastPairingInput - The input type for the suggestToastPairing function.
 * - SuggestToastPairingOutput - The return type for the suggestToastPairing function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AvailableIngredientsSchema = z.object({
  breads: z.array(z.string()).describe('List of available bread types.'),
  meats: z.array(z.string()).describe('List of available meat types.'),
  sauces: z.array(z.string()).describe('List of available sauce types.'),
  toppings: z.array(z.string()).describe('List of available topping types.'),
});

const SuggestToastPairingInputSchema = z.object({
  weather: z.string().describe('The current weather conditions.'),
  mood: z.string().describe('The user\'s selected general mood from the dropdown.'),
  customMoodDescription: z.string().optional().describe('A more detailed, user-provided description of their mood or situation. This might provide more specific context than the general mood.'),
  availableIngredients: AvailableIngredientsSchema.describe('The ingredients currently available on the menu.'),
  dislikedSuggestedBread: z.array(z.string()).optional().describe('Bread types from a previous AI suggestion that the user disliked. The AI should suggest a different bread.'),
  dislikedSuggestedMeats: z.array(z.string()).optional().describe('Meat types from a previous AI suggestion that the user disliked. The AI should avoid these meats.'),
  dislikedSuggestedToppings: z.array(z.string()).optional().describe('Topping types from a previous AI suggestion that the user disliked. The AI should avoid these toppings.'),
  dislikedSuggestedSauces: z.array(z.string()).optional().describe('Sauce types from a previous AI suggestion that the user disliked. The AI should avoid these sauces.'),
});
export type SuggestToastPairingInput = z.infer<typeof SuggestToastPairingInputSchema>;

const SuggestToastPairingOutputSchema = z.object({
  suggestedBread: z.string().describe('The suggested bread type, chosen from available breads.'),
  suggestedMeats: z
    .array(z.string())
    .max(2)
    .optional()
    .describe('A list of suggested meats, chosen from available meats. Can be empty.'),
  suggestedToppings: z
    .array(z.string())
    .max(3)
    .describe('A list of suggested toppings for the toast, chosen from the available toppings.'),
  suggestedSauces: z
    .array(z.string())
    .max(2)
    .describe('A list of suggested sauces for the toast, chosen from the available sauces.'),
  reasoning: z.string().describe("The AI's reasoning for the suggested pairing, in a very natural, conversational, humorous, and creative Chinese style, as if a witty foodie friend is making a personal recommendation."),
});

export type SuggestToastPairingOutput = z.infer<typeof SuggestToastPairingOutputSchema>;

export async function suggestToastPairing(input: SuggestToastPairingInput): Promise<SuggestToastPairingOutput> {
  return suggestToastPairingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestToastPairingPrompt',
  input: {schema: SuggestToastPairingInputSchema},
  output: {schema: SuggestToastPairingOutputSchema},
  prompt: `請根據以下資訊，用繁體中文推薦一個吐司搭配。
天氣狀況: "{{weather}}"
使用者選擇的心情: "{{mood}}"
{{#if customMoodDescription}}
使用者詳細心情描述: "{{customMoodDescription}}"
請優先參考「使用者詳細心情描述」（如果提供的話）來做推薦。如果「使用者詳細心情描述」與「使用者選擇的心情」有衝突或能提供更精確的指引，請以「使用者詳細心情描述」為主。如果沒有提供詳細描述，則主要參考「使用者選擇的心情」。
{{/if}}

本店目前提供的食材選項如下：
可選麵包 (availableIngredients.breads): {{#each availableIngredients.breads}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
可選肉類 (availableIngredients.meats): {{#each availableIngredients.meats}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
可選醬料 (availableIngredients.sauces): {{#each availableIngredients.sauces}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
可選配料 (availableIngredients.toppings): {{#each availableIngredients.toppings}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

{{#if dislikedSuggestedBread}}
使用者回饋：不喜歡上次建議的麵包 "{{#each dislikedSuggestedBread}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}"。請從「可選麵包」中選擇一個不同的麵包。
{{/if}}
{{#if dislikedSuggestedMeats}}
使用者回饋：不喜歡上次建議的肉類 "{{#each dislikedSuggestedMeats}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}"。請避免這些肉類，如果還有其他「可選肉類」，請推薦其他的，或者如果合適也可以不推薦肉類。
{{/if}}
{{#if dislikedSuggestedToppings}}
使用者回饋：不喜歡上次建議的配料 "{{#each dislikedSuggestedToppings}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}"。請避免這些配料，並從「可選配料」中選擇不同的配料。
{{/if}}
{{#if dislikedSuggestedSauces}}
使用者回饋：不喜歡上次建議的醬料 "{{#each dislikedSuggestedSauces}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}"。請避免這些醬料，並從「可選醬料」中選擇不同的醬料。
{{/if}}

{{#if dislikedSuggestedBread}}
基於使用者的回饋，請務必產生一個與先前建議顯著不同的新組合，同時仍須符合所有其他限制與使用者的心情偏好。
{{else if dislikedSuggestedMeats}}
基於使用者的回饋，請務必產生一個與先前建議顯著不同的新組合，同時仍須符合所有其他限制與使用者的心情偏好。
{{else if dislikedSuggestedToppings}}
基於使用者的回饋，請務必產生一個與先前建議顯著不同的新組合，同時仍須符合所有其他限制與使用者的心情偏好。
{{else if dislikedSuggestedSauces}}
基於使用者的回饋，請務必產生一個與先前建議顯著不同的新組合，同時仍須符合所有其他限制與使用者的心情偏好。
{{/if}}

您的推薦應包含：
1. 一種麵包 (必須從上述「可選麵包」中選擇一項)。
2. 最多兩種肉類 (必須從上述「可選肉類」中選擇，可不選，若不選則此欄位為空陣列)。
3. 最多兩種醬料 (必須從上述「可選醬料」中選擇)。
4. 最多三種配料 (必須從上述「可選配料」中選擇)。

請確保您推薦的所有食材（麵包、肉類、醬料、配料）都**嚴格來自**於上面提供的可選用食材列表，並且**避開使用者明確表示不喜歡的項目**。

關於推薦理由 (reasoning)，請務必用非常自然、口語化、像跟好朋友聊天一樣的風格來寫。可以活潑、俏皮，帶點幽默感，就像一位懂吃又超會講幹話的美食家老饕在跟你熱情推薦他的私房菜單一樣！避免任何聽起來像機器人或官方說明的文字。盡情發揮你的創意吧！

請以 JSON 格式輸出，並確保包含以下欄位：
"suggestedBread": (字串，從可選麵包中選擇的一項)
"suggestedMeats": (字串陣列，從可選肉類中選擇，最多兩項，若無則為空陣列 [])
"suggestedToppings": (字串陣列，從可選配料中選擇，最多三項)
"suggestedSauces": (字串陣列，從可選醬料中選擇，最多兩項)
"reasoning": (字串，您的中文推薦理由，風格要非常自然口語、活潑俏皮、幽默風趣)
`,
});

const suggestToastPairingFlow = ai.defineFlow(
  {
    name: 'suggestToastPairingFlow',
    inputSchema: SuggestToastPairingInputSchema,
    outputSchema: SuggestToastPairingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

