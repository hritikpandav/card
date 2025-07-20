
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ColorCustomizationProps {
  cardData: any;
  selectedTemplate: any;
  onColorChange: (colorType: string, color: string) => void;
  onApplyColorPreset: (preset: { name: string; colors: string[] }) => void;
}

const ColorCustomization = ({ 
  cardData, 
  selectedTemplate, 
  onColorChange, 
  onApplyColorPreset 
}: ColorCustomizationProps) => {
  const colorPresets = {
    "modern-geometric": [
      { name: "Original", colors: ["#F59E0B", "#10B981", "#3B82F6", "#EF4444"] },
      { name: "Sunset", colors: ["#F97316", "#EF4444", "#EC4899", "#8B5CF6"] },
      { name: "Ocean", colors: ["#0EA5E9", "#06B6D4", "#10B981", "#3B82F6"] }
    ],
    "professional-navy": [
      { name: "Original", colors: ["#1E293B", "#0F172A", "#64748B", "#CBD5E1"] },
      { name: "Royal", colors: ["#1E40AF", "#3730A3", "#6366F1", "#8B5CF6"] },
      { name: "Emerald", colors: ["#065F46", "#047857", "#059669", "#10B981"] }
    ],
    "vibrant-coral": [
      { name: "Original", colors: ["#EF4444", "#F97316", "#FEF3C7", "#FFFFFF"] },
      { name: "Tropical", colors: ["#EC4899", "#F59E0B", "#10B981", "#06B6D4"] },
      { name: "Sunset", colors: ["#DC2626", "#EA580C", "#F59E0B", "#FDE047"] }
    ],
    "minimalist-teal": [
      { name: "Original", colors: ["#0D9488", "#14B8A6", "#F0FDFA", "#FFFFFF"] },
      { name: "Forest", colors: ["#065F46", "#047857", "#ECFDF5", "#F7FEF8"] },
      { name: "Sky", colors: ["#0C4A6E", "#0284C7", "#E0F2FE", "#F0F9FF"] }
    ],
    "gradient-purple": [
      { name: "Original", colors: ["#8B5CF6", "#A855F7", "#DDD6FE", "#FFFFFF"] },
      { name: "Galaxy", colors: ["#6366F1", "#8B5CF6", "#C4B5FD", "#EDE9FE"] },
      { name: "Berry", colors: ["#BE185D", "#EC4899", "#FBCFE8", "#FDF2F8"] }
    ],
    "corporate-blue": [
      { name: "Original", colors: ["#1E40AF", "#3B82F6", "#DBEAFE", "#FFFFFF"] },
      { name: "Steel", colors: ["#374151", "#6B7280", "#F3F4F6", "#FFFFFF"] },
      { name: "Navy", colors: ["#1E3A8A", "#3B82F6", "#DBEAFE", "#EFF6FF"] }
    ]
  };

  const currentPresets = colorPresets[selectedTemplate?.id as keyof typeof colorPresets] || colorPresets["professional-navy"];

  const handleApplyPreset = (preset: { name: string; colors: string[] }) => {
    onApplyColorPreset(preset);
    toast.success(`${preset.name} color scheme applied!`);
  };

  return (
    <div className="space-y-6">
      {/* Color Presets */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Color Presets</h3>
        <div className="grid grid-cols-1 gap-3">
          {currentPresets.map((preset, index) => (
            <Button
              key={index}
              variant="outline"
              onClick={() => handleApplyPreset(preset)}
              className="flex items-center justify-between p-4 h-auto"
            >
              <span className="font-medium">{preset.name}</span>
              <div className="flex space-x-1">
                {preset.colors.map((color, colorIndex) => (
                  <div
                    key={colorIndex}
                    className="w-6 h-6 rounded-full border border-slate-200"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Custom Color Scheme */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Custom Color Scheme</h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(cardData.colors).map(([colorType, color]) => (
            <div key={colorType}>
              <Label htmlFor={colorType} className="capitalize">{colorType} Color</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Input
                  id={colorType}
                  type="color"
                  value={color as string}
                  onChange={(e) => onColorChange(colorType, e.target.value)}
                  className="w-16 h-10 p-1 rounded cursor-pointer"
                />
                <Input
                  value={color as string}
                  onChange={(e) => onColorChange(colorType, e.target.value)}
                  placeholder="#000000"
                  className="flex-1"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColorCustomization;
