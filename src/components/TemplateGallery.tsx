
import { useState } from "react";
import { Template, TemplateGalleryProps } from "@/types/template";
import { templates } from "@/data/templates";
import CategoryFilter from "@/components/template/CategoryFilter";
import TemplateCard from "@/components/template/TemplateCard";
import TemplatePreview from "@/components/template/TemplatePreview";

const TemplateGallery = ({ onTemplateSelect, onNavigate }: TemplateGalleryProps) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

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
              onViewTemplate={setPreviewTemplate}
            />
          ))}
        </div>
      </div>
      {/* Modal for full template preview */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative animate-fade-in">
            <button
              className="absolute top-3 right-3 text-slate-500 hover:text-slate-900 text-xl font-bold"
              onClick={() => setPreviewTemplate(null)}
              aria-label="Close preview"
            >
              ×
            </button>
            <div className="mb-4 text-center text-lg font-semibold text-slate-900">
              {previewTemplate.name} Preview
            </div>
            <TemplatePreview template={previewTemplate} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateGallery;
