
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SocialMediaFormProps {
  cardData: any;
  onInputChange: (field: string, value: string) => void;
}

const SocialMediaForm = ({ cardData, onInputChange }: SocialMediaFormProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900">Social Media Links</h3>
      <div className="grid grid-cols-1 gap-4">
        {Object.entries(cardData.social).map(([platform, url]) => (
          <div key={platform}>
            <Label htmlFor={platform} className="capitalize">{platform}</Label>
            <Input
              id={platform}
              value={url as string}
              onChange={(e) => onInputChange(`social.${platform}`, e.target.value)}
              placeholder={`Your ${platform} URL`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialMediaForm;
