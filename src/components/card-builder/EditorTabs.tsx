
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Type, Palette, Layout } from "lucide-react";
import PersonalInfoForm from "./PersonalInfoForm";
import SocialMediaForm from "./SocialMediaForm";
import ColorCustomization from "./ColorCustomization";
import ImageUpload from "./ImageUpload";

interface EditorTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  cardData: any;
  selectedTemplate: any;
  onInputChange: (field: string, value: string) => void;
  onImageUpload: (imageUrl: string) => void;
  onColorChange: (colorType: string, color: string) => void;
  onApplyColorPreset: (preset: { name: string; colors: string[] }) => void;
}

const EditorTabs = ({
  activeTab,
  onTabChange,
  cardData,
  selectedTemplate,
  onInputChange,
  onImageUpload,
  onColorChange,
  onApplyColorPreset
}: EditorTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="content" className="flex items-center space-x-2">
          <Type className="h-4 w-4" />
          <span className="hidden sm:inline">Content</span>
        </TabsTrigger>
        <TabsTrigger value="design" className="flex items-center space-x-2">
          <Palette className="h-4 w-4" />
          <span className="hidden sm:inline">Design</span>
        </TabsTrigger>
        <TabsTrigger value="layout" className="flex items-center space-x-2">
          <Layout className="h-4 w-4" />
          <span className="hidden sm:inline">Layout</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="content" className="space-y-6 mt-6">
        <ImageUpload 
          currentImage={cardData.profileImage}
          onImageUpload={onImageUpload}
        />
        <PersonalInfoForm cardData={cardData} onInputChange={onInputChange} />
        <SocialMediaForm cardData={cardData} onInputChange={onInputChange} />
      </TabsContent>

      <TabsContent value="design" className="space-y-6 mt-6">
        <ColorCustomization
          cardData={cardData}
          selectedTemplate={selectedTemplate}
          onColorChange={onColorChange}
          onApplyColorPreset={onApplyColorPreset}
        />
      </TabsContent>

      <TabsContent value="layout" className="space-y-6 mt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Layout Options</h3>
          <p className="text-slate-600">More layout customization options coming soon!</p>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default EditorTabs;
