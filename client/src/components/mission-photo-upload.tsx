import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Upload, X, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MissionPhotoUploadProps {
  missionId: number;
  photos: string[];
  onPhotosUpdate: (photos: string[]) => void;
}

export default function MissionPhotoUpload({ missionId, photos, onPhotosUpdate }: MissionPhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsUploading(true);
    const newPhotos: string[] = [];

    for (const file of Array.from(files)) {
      if (file.type.startsWith('image/')) {
        try {
          const base64 = await convertToBase64(file);
          newPhotos.push(base64);
        } catch (error) {
          console.error('Error converting file to base64:', error);
          toast({
            title: "Upload Error",
            description: `Failed to process ${file.name}`,
            variant: "destructive",
          });
        }
      }
    }

    if (newPhotos.length > 0) {
      const updatedPhotos = [...photos, ...newPhotos];
      onPhotosUpdate(updatedPhotos);
      toast({
        title: "Photos Uploaded",
        description: `${newPhotos.length} photo(s) added to mission log`,
      });
    }

    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const removePhoto = (index: number) => {
    const updatedPhotos = photos.filter((_, i) => i !== index);
    onPhotosUpdate(updatedPhotos);
    toast({
      title: "Photo Removed",
      description: "Photo deleted from mission log",
    });
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Mission Photos ({photos.length})
        </h3>
        <Button
          onClick={triggerFileSelect}
          disabled={isUploading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Upload className="h-4 w-4 mr-2" />
          {isUploading ? "Uploading..." : "Add Photos"}
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {photos.length === 0 ? (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-8 text-center">
            <Camera className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-400 mb-4">No photos uploaded yet</p>
            <Button
              onClick={triggerFileSelect}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Mission Photos
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-700 relative group">
              <CardContent className="p-2">
                <div className="relative">
                  <img
                    src={photo}
                    alt={`Mission photo ${index + 1}`}
                    className="w-full h-32 object-cover rounded"
                  />
                  <Button
                    onClick={() => removePhoto(index)}
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-slate-400 mt-2 text-center">
                  Photo {index + 1}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {photos.length > 0 && (
        <p className="text-xs text-slate-500 text-center">
          Tip: Click on photos to view them larger, hover to remove
        </p>
      )}
    </div>
  );
}