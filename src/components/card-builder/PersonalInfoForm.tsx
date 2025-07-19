
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface PersonalInfoFormProps {
  cardData: any;
  onInputChange: (field: string, value: string) => void;
}

const PersonalInfoForm = ({ cardData, onInputChange }: PersonalInfoFormProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900">Personal Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={cardData.name}
            onChange={(e) => onInputChange('name', e.target.value)}
            placeholder="Your full name"
          />
        </div>
        <div>
          <Label htmlFor="title">Job Title</Label>
          <Input
            id="title"
            value={cardData.title}
            onChange={(e) => onInputChange('title', e.target.value)}
            placeholder="Your job title"
          />
        </div>
        <div>
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            value={cardData.company}
            onChange={(e) => onInputChange('company', e.target.value)}
            placeholder="Your company"
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={cardData.email}
            onChange={(e) => onInputChange('email', e.target.value)}
            placeholder="your@email.com"
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={cardData.phone}
            onChange={(e) => onInputChange('phone', e.target.value)}
            placeholder="+1 (555) 123-4567"
          />
        </div>
        <div>
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            value={cardData.website}
            onChange={(e) => onInputChange('website', e.target.value)}
            placeholder="www.yourwebsite.com"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="bio">Bio / Description</Label>
        <Textarea
          id="bio"
          value={cardData.bio}
          onChange={(e) => onInputChange('bio', e.target.value)}
          placeholder="Tell people about yourself..."
          rows={3}
        />
      </div>
    </div>
  );
};

export default PersonalInfoForm;
