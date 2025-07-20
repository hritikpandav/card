
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface ImageUploadProps {
  currentImage: string | null;
  onImageUpload: (imageUrl: string) => void;
}

const ImageUpload = ({ currentImage, onImageUpload }: ImageUploadProps) => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(fileName);

      onImageUpload(publicUrl);
      toast.success("Profile image uploaded successfully!");
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
      // Reset the input
      event.target.value = '';
    }
  };

  const handleRemoveImage = () => {
    onImageUpload('');
    toast.success("Profile image removed");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ImageIcon className="h-5 w-5" />
          <span>Profile Image</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentImage ? (
          <div className="space-y-4">
            <div className="relative inline-block">
              <img
                src={currentImage}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
              />
              <Button
                size="sm"
                variant="destructive"
                className="absolute -top-2 -right-2 rounded-full w-6 h-6 p-0"
                onClick={handleRemoveImage}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <p className="text-sm text-gray-600">Click the X to remove the current image</p>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-sm text-gray-600 mb-4">Upload a profile image to replace the initials</p>
          </div>
        )}

        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="image-upload"
            disabled={uploading}
          />
          <label htmlFor="image-upload">
            <Button
              variant="outline"
              className="w-full cursor-pointer"
              disabled={uploading}
              asChild
            >
              <span>
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? "Uploading..." : currentImage ? "Change Image" : "Upload Image"}
              </span>
            </Button>
          </label>
        </div>

        <p className="text-xs text-gray-500">
          Supported formats: JPG, PNG, GIF. Max size: 5MB
        </p>
      </CardContent>
    </Card>
  );
};

export default ImageUpload;
