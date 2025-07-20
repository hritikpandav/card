
import { useState } from "react";
import { Template, TemplateGalleryProps } from "@/types/template";
import { templates } from "@/data/templates";
import CategoryFilter from "@/components/template/CategoryFilter";
import TemplateCard from "@/components/template/TemplateCard";

const TemplateGallery = ({ onTemplateSelect, onNavigate }: TemplateGalleryProps) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [favorites, setFavorites] = useState<string[]>([]);

  const filteredTemplates = selectedCategory === "all" 
    ? templates 
    : templates.filter(template => template.category === selectedCategory);

  const toggleFavorite = (templateId: string) => {
    setFavorites(prev => 
      prev.includes(templateId) 
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    );
  };

  return (
    <div className="pt-20 pb-16 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4">
            Choose Your Template
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Start with a professionally designed template and make it yours. 
            All templates are fully customizable and mobile-optimized.
          </p>
        </div>

        {/* Category Filter */}
        <CategoryFilter 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              isFavorite={favorites.includes(template.id)}
              onTemplateSelect={onTemplateSelect}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemplateGallery;
