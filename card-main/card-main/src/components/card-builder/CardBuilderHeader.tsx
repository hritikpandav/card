
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Share2, QrCode, Save } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface CardBuilderHeaderProps {
  onNavigate: (section: string) => void;
  onShowQRCode: () => void;
  onDownload: () => void;
  onShare: () => void;
  onSave: () => void;
  saving: boolean;
  savedCardSlug: string | null;
}

const CardBuilderHeader = ({
  onNavigate,
  onShowQRCode,
  onDownload,
  onShare,
  onSave,
  saving,
  savedCardSlug
}: CardBuilderHeaderProps) => {
  const isMobile = useIsMobile();

  return (
    <>
      <div className={`flex ${isMobile ? 'flex-col space-y-4' : 'items-center justify-between'} mb-6 md:mb-8`}>
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size={isMobile ? "sm" : "sm"}
            onClick={() => onNavigate("templates")}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className={isMobile ? 'text-xs' : ''}>Back to Templates</span>
          </Button>
          <div>
            <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-slate-900`}>Card Builder</h1>
            <p className={`text-slate-600 ${isMobile ? 'text-sm' : ''}`}>Customize your digital business card</p>
          </div>
        </div>
        
        <div className={`flex items-center ${isMobile ? 'flex-wrap gap-2' : 'space-x-3'}`}>
          <Button variant="outline" size="sm" onClick={onShowQRCode}>
            <QrCode className="h-4 w-4 mr-2" />
            <span className={isMobile ? 'text-xs' : ''}>QR Code</span>
          </Button>
          <Button variant="outline" size="sm" onClick={onDownload}>
            <Download className="h-4 w-4 mr-2" />
            <span className={isMobile ? 'text-xs' : ''}>Download</span>
          </Button>
          <Button variant="outline" size="sm" onClick={onShare}>
            <Share2 className="h-4 w-4 mr-2" />
            <span className={isMobile ? 'text-xs' : ''}>Share</span>
          </Button>
          <Button 
            size="sm" 
            onClick={onSave} 
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Save className="h-4 w-4 mr-2" />
            <span className={isMobile ? 'text-xs' : ''}>{saving ? "Saving..." : "Save Card"}</span>
          </Button>
        </div>
      </div>

      {savedCardSlug && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className={`text-green-800 ${isMobile ? 'text-sm' : ''}`}>
            🎉 Your card is live! Share it with others: 
            <span className={`font-mono ml-2 bg-green-100 px-2 py-1 rounded ${isMobile ? 'text-xs block mt-2' : ''}`}>
              {window.location.origin}/card/{savedCardSlug}
            </span>
          </p>
        </div>
      )}
    </>
  );
};

export default CardBuilderHeader;
