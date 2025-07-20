
export interface Template {
  id: string;
  name: string;
  category: string;
  preview: string;
  isPremium: boolean;
  rating: number;
  views: number;
  colors: string[];
}

export interface TemplateGalleryProps {
  onTemplateSelect: (template: Template) => void;
  onNavigate: (section: string) => void;
}
