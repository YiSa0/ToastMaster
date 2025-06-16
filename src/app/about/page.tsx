
import SectionWrapper from '@/components/SectionWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UtensilsCrossed, Smile, Users } from 'lucide-react';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <SectionWrapper
        title="關於 Toast Master"
        description="用心製作您的完美吐司，一次一片。"
        icon={<UtensilsCrossed className="w-10 h-10" />}
        className="max-w-3xl mx-auto"
      >
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Smile className="text-primary" /> 我們的理念
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-3">
              <p>
                在 Toast Master，我們相信美好的一天從美味的吐司開始。它如此簡單，卻又如此多變且充滿慰藉。
                我們的使命是提供您最優質的食材與無盡的可能性，讓您創造屬於自己的吐司傑作，或從我們精心設計的招牌吐司中挑選。
              </p>
              <p>
                我們的麵包來自本地烘焙坊，配料新鮮，而我們對吐司的熱情更是無與倫比！
              </p>
            </CardContent>
          </Card>

          {/* 
            Detailed AI Image Generation Prompt for About Us Page (600x338):
            "A warm and inviting 600x338 image for the 'About Us' page of 'Toast Master,' a friendly toast shop.
            Scene: Capture a cozy, slightly rustic yet modern cafe interior or a close-up of hands lovingly preparing artisanal toast.
            Elements (if cafe interior): Perhaps a glimpse of a friendly barista (optional, can be out of focus or just hands), a display of fresh bread, some simple, tasteful decor with natural elements (wood, plants). The lighting should be soft and welcoming.
            Elements (if food preparation): Hands carefully arranging fresh ingredients (like ripe berries, avocado, or microgreens) on a slice of artisanal bread. The focus should be on the quality of ingredients and the care in preparation.
            Color Palette: Align with the brand's soft and welcoming tones. Consider natural wood, warm whites, and subtle hints of dusty rose or lavender through small details (e.g., a napkin, a ceramic mug, or flowers in the background), but keep it natural and not overly branded.
            Overall Mood: Authentic, passionate, high-quality, community-focused, and trustworthy. The image should make viewers feel connected to the people and philosophy behind Toast Master."
          */}
          <Image
            src="/Decorative_Img/About_us.jpeg"
            alt="各式美味吐司或溫馨的店內場景"
            width={600}
            height={338}
            className="rounded-lg shadow-md object-cover w-full"
            data-ai-hint="cafe interior toast preparation"
          />

          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Users className="text-primary" /> 我們的團隊
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>
                我們是一群對吐司充滿熱情的同好（有些人可能會說是狂熱份子！），致力於為您的早餐、午餐或點心時光帶來喜悅。
                歡迎光臨，體驗 Toast Master 的與眾不同！
              </p>
            </CardContent>
          </Card>

          <div className="text-center">
            <p className="text-lg font-semibold">Toast Master 總部</p>
            <p className="text-muted-foreground">美食市麵包街123號，FC 54321</p>
            <p className="text-muted-foreground">每日營業：早上 7 點 - 晚上 7 點</p>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}
