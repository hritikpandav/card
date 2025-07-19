
import { Template } from "@/types/template";

interface TemplatePreviewProps {
  template: Template;
}

const TemplatePreview = ({ template }: TemplatePreviewProps) => {
  const previewComponents = {
    "modern-geo": (
      <div className="w-full h-48 relative bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 rounded-lg overflow-hidden">
        {/* Geometric Patterns */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full transform translate-x-8 -translate-y-8"></div>
          <div className="absolute bottom-0 left-0 w-32 h-16 bg-white/15 rounded-tr-full"></div>
          <div className="absolute top-1/2 right-4 w-12 h-12 bg-white/25 rotate-45 rounded-lg"></div>
          <div className="absolute top-4 left-4 w-8 h-8 bg-white/30 rounded-full"></div>
          <div className="absolute bottom-4 right-16 w-6 h-6 bg-white/20 rotate-12 rounded-sm"></div>
        </div>
        
        {/* Content */}
        <div className="p-6 text-white relative z-10">
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-3 shadow-lg">
            <span className="text-lg font-bold text-amber-600">AG</span>
          </div>
          <h3 className="text-xl font-bold mb-1">Alex Garcia</h3>
          <p className="text-sm opacity-90 mb-1">Creative Director</p>
          <p className="text-xs opacity-80">Design Studio Pro</p>
        </div>
      </div>
    ),
    "prof-navy": (
      <div className="w-full h-48 bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 rounded-lg relative overflow-hidden">
        {/* Professional Patterns */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full transform translate-x-10 -translate-y-10"></div>
          <div className="absolute bottom-0 left-0 w-40 h-20 bg-gradient-to-tr from-slate-700/30 to-transparent rounded-tr-full"></div>
          <div className="absolute bottom-6 right-6 w-20 h-3 bg-blue-400/40 rounded-full"></div>
          <div className="absolute bottom-4 right-6 w-16 h-2 bg-blue-300/30 rounded-full"></div>
          <div className="absolute top-1/3 left-1/2 w-2 h-2 bg-blue-400/50 rounded-full"></div>
        </div>
        
        {/* Content */}
        <div className="p-6 text-white relative z-10">
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-3 shadow-lg">
            <span className="text-lg font-bold text-slate-800">SM</span>
          </div>
          <h3 className="text-xl font-bold mb-1">Sarah Miller</h3>
          <p className="text-sm opacity-90 mb-1">Senior Manager</p>
          <p className="text-xs opacity-80">Tech Corp Solutions</p>
        </div>
      </div>
    ),
    "vibrant-coral": (
      <div className="w-full h-48 bg-gradient-to-br from-pink-500 via-red-500 to-orange-500 rounded-lg relative overflow-hidden">
        {/* Vibrant Patterns */}
        <div className="absolute inset-0">
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-yellow-300/40 rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-28 h-28 bg-white/25 rounded-tr-full"></div>
          <div className="absolute top-1/4 right-8 w-8 h-8 bg-white/30 rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/4 left-8 w-6 h-6 bg-yellow-300/50 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-white/20 rotate-45 rounded-sm"></div>
        </div>
        
        {/* Content */}
        <div className="p-6 text-white relative z-10">
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-3 shadow-lg">
            <span className="text-lg font-bold text-red-500">AL</span>
          </div>
          <h3 className="text-xl font-bold mb-1">Alex Lee</h3>
          <p className="text-sm opacity-90 mb-1">Brand Designer</p>
          <p className="text-xs opacity-80">Creative Agency</p>
        </div>
      </div>
    ),
    "minimal-teal": (
      <div className="w-full h-48 bg-white border-2 border-teal-200 rounded-lg relative overflow-hidden">
        {/* Minimal Patterns */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-400 via-emerald-500 to-teal-600"></div>
        <div className="absolute bottom-8 left-6 right-6">
          <div className="w-24 h-1 bg-teal-300 mb-3 rounded-full"></div>
          <div className="w-20 h-0.5 bg-teal-200 mb-2 rounded-full"></div>
          <div className="w-16 h-0.5 bg-teal-100 rounded-full"></div>
        </div>
        <div className="absolute top-1/3 right-6 w-16 h-16 border-2 border-teal-200 rounded-full opacity-30"></div>
        <div className="absolute bottom-1/4 right-12 w-8 h-8 border border-teal-300 rounded-full opacity-20"></div>
        
        {/* Content */}
        <div className="p-6 relative z-10">
          <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center mb-3 border-2 border-teal-200">
            <span className="text-lg font-bold text-teal-600">MJ</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-1">Maya Johnson</h3>
          <p className="text-sm text-gray-600 mb-1">UX Designer</p>
          <p className="text-xs text-gray-500">Design Team Lead</p>
        </div>
      </div>
    ),
    "gradient-purple": (
      <div className="w-full h-48 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 rounded-lg relative overflow-hidden">
        {/* Gradient Patterns */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20"></div>
          <div className="absolute top-4 right-4 w-20 h-20 bg-white/15 rounded-full"></div>
          <div className="absolute bottom-6 left-8 w-12 h-12 bg-white/20 rounded-lg rotate-12"></div>
          <div className="absolute top-1/2 right-8 w-8 h-8 bg-white/25 rounded-full"></div>
          <div className="absolute bottom-1/3 right-1/3 w-6 h-6 bg-purple-300/40 rounded-full"></div>
        </div>
        
        {/* Content */}
        <div className="p-6 text-white relative z-10">
          <div className="w-14 h-14 bg-white/95 rounded-full flex items-center justify-center mb-3 shadow-lg">
            <span className="text-lg font-bold text-purple-600">DR</span>
          </div>
          <h3 className="text-xl font-bold mb-1">David Rodriguez</h3>
          <p className="text-sm opacity-90 mb-1">Art Director</p>
          <p className="text-xs opacity-80">Media House Inc</p>
        </div>
      </div>
    ),
    "corporate-blue": (
      <div className="w-full h-48 bg-gradient-to-b from-blue-700 via-blue-800 to-blue-900 rounded-lg relative overflow-hidden">
        {/* Corporate Patterns */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-20 h-20 border-2 border-white/20 rounded-full transform translate-x-6 -translate-y-6"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 border border-white/10 rounded-tr-full"></div>
          <div className="absolute bottom-6 right-8 w-16 h-2 bg-blue-300/60 rounded-full"></div>
          <div className="absolute bottom-4 right-8 w-12 h-1.5 bg-blue-400/50 rounded-full"></div>
          <div className="absolute bottom-2 right-8 w-8 h-1 bg-blue-200/40 rounded-full"></div>
          <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-blue-300/30 rounded-full"></div>
        </div>
        
        {/* Content */}
        <div className="p-6 text-white relative z-10">
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-3 shadow-lg">
            <span className="text-lg font-bold text-blue-700">LW</span>
          </div>
          <h3 className="text-xl font-bold mb-1">Lisa Wang</h3>
          <p className="text-sm opacity-90 mb-1">VP Operations</p>
          <p className="text-xs opacity-80">Global Corp Ltd</p>
        </div>
      </div>
    )
  };

  return previewComponents[template.preview as keyof typeof previewComponents] || previewComponents["modern-geo"];
};

export default TemplatePreview;
