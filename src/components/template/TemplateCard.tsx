
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Eye, Heart, Crown } from "lucide-react";
import { Template } from "@/types/template";
import TemplatePreview from "./TemplatePreview";

interface TemplateCardProps {
  template: Template;
  isFavorite: boolean;
  onTemplateSelect: (template: Template) => void;
  onToggleFavorite: (templateId: string) => void;
}

const TemplateCard = ({ template, isFavorite, onTemplateSelect, onToggleFavorite }: TemplateCardProps) => {
  return (
    <Card className="group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm overflow-hidden">
      <CardContent className="p-0">
        {/* Template Preview */}
        <div className="relative">
          <TemplatePreview template={template} />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
            <Button
              onClick={() => onTemplateSelect(template)}
              className="opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 bg-white text-slate-900 hover:bg-slate-100 shadow-lg"
            >
              Use This Template
            </Button>
          </div>

          {/* Premium Badge */}
          {template.isPremium && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 font-medium">
                <Crown className="h-3 w-3 mr-1" />
                Pro
              </Badge>
            </div>
          )}

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(template.id);
            }}
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200"
          >
            <Heart 
              className={`h-4 w-4 transition-colors duration-200 ${
                isFavorite 
                  ? "text-red-500 fill-current" 
                  : "text-slate-400"
              }`} 
            />
          </button>
        </div>

        {/* Template Info */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-slate-900">{template.name}</h3>
            <div className="flex items-center space-x-1 text-sm text-slate-500">
              <Star className="h-4 w-4 fill-current text-yellow-400" />
              <span>{template.rating}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <Badge variant="secondary" className="capitalize text-xs">
              {template.category}
            </Badge>
            <div className="flex items-center space-x-1 text-sm text-slate-500">
              <Eye className="h-4 w-4" />
              <span>{template.views.toLocaleString()}</span>
            </div>
          </div>

          {/* Color Palette */}
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-xs text-slate-500">Colors:</span>
            <div className="flex space-x-1">
              {template.colors.map((color, index) => (
                <div
                  key={index}
                  className="w-4 h-4 rounded-full border border-slate-200"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <Button 
            onClick={() => onTemplateSelect(template)}
            className="w-full bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white"
          >
            Customize Template
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplateCard;
