
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Download, Share2, Copy } from "lucide-react";
import { toast } from "sonner";

interface QRCodeGeneratorProps {
  cardData: any;
  onClose: () => void;
  cardUrl: string;
}

const QRCodeGenerator = ({ cardData, onClose, cardUrl }: QRCodeGeneratorProps) => {
  const [qrSize, setQrSize] = useState(200);
  
  // Use passed cardUrl prop
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(cardUrl)}`;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `${cardData.name}-qr-code.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("QR Code downloaded!");
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(cardUrl);
    toast.success("Card URL copied to clipboard!");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${cardData.name}'s Digital Card`,
        text: `Connect with ${cardData.name}`,
        url: cardUrl
      });
    } else {
      handleCopyUrl();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2">
      <Card className="w-full max-w-xs bg-white shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between p-3 pb-2">
          <CardTitle className="text-lg">QR Code</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="p-1">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-3 p-3 pt-0">
          {/* QR Code Display */}
          <div className="text-center">
            <div className="inline-block p-2 bg-white rounded-xl shadow border">
              <img 
                src={qrCodeUrl} 
                alt="QR Code"
                className="w-32 h-32 mx-auto"
              />
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Scan to view {cardData.name}'s card
            </p>
          </div>

          {/* Card URL */}
          <div>
            <label className="text-xs font-medium text-slate-700 mb-1 block">
              Share Link
            </label>
            <div className="flex items-center space-x-1">
              <div className="flex-1 p-1 bg-slate-50 rounded border text-xs text-slate-600 truncate">
                {cardUrl}
              </div>
              <Button variant="outline" size="sm" onClick={handleCopyUrl} className="p-1">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Size Options */}
          <div>
            <label className="text-xs font-medium text-slate-700 mb-1 block">
              QR Code Size
            </label>
            <div className="flex space-x-1">
              {[100, 150, 200].map((size) => (
                <Button
                  key={size}
                  variant={qrSize === size ? "default" : "outline"}
                  size="sm"
                  onClick={() => setQrSize(size)}
                  className="text-xs px-2 py-1"
                >
                  {size}px
                </Button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 p-2 bg-slate-50 rounded">
            <div className="text-center">
              <div className="text-base font-bold text-slate-900">247</div>
              <div className="text-xs text-slate-600">Scans</div>
            </div>
            <div className="text-center">
              <div className="text-base font-bold text-slate-900">89</div>
              <div className="text-xs text-slate-600">Contacts</div>
            </div>
            <div className="text-center">
              <div className="text-base font-bold text-slate-900">156</div>
              <div className="text-xs text-slate-600">Views</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-1">
            <Button 
              onClick={handleDownload}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-xs px-2 py-1"
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
            <Button 
              onClick={handleShare}
              variant="outline"
              className="flex-1 text-xs px-2 py-1"
            >
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>

          {/* Tips */}
          <div className="text-center">
            <Badge variant="secondary" className="text-xs">
              💡 Print this QR on cards or flyers
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRCodeGenerator;
