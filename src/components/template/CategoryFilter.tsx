
import { Button } from "@/components/ui/button";
import { Sparkles, Crown, Zap, Star } from "lucide-react";

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const CategoryFilter = ({ selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  const categories: Category[] = [
    { id: "all", name: "All Templates", icon: <Sparkles className="h-4 w-4" /> },
    { id: "business", name: "Business", icon: <Crown className="h-4 w-4" /> },
    { id: "creative", name: "Creative", icon: <Zap className="h-4 w-4" /> },
    { id: "minimal", name: "Minimal", icon: <Star className="h-4 w-4" /> }
  ];

  return (
    <div className="flex flex-wrap justify-center gap-3 mb-12">
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category.id)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
            selectedCategory === category.id
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
              : "border-slate-300 text-slate-600 hover:border-slate-400 hover:bg-slate-50"
          }`}
        >
          {category.icon}
          <span>{category.name}</span>
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;
