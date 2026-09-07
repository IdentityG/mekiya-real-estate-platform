"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface ImageUploaderProps {
  propertyId?: number;
  existingImages?: string[];
  onImagesChange: (images: string[]) => void;
}

interface UploadedImage {
  url: string;
  fileName: string;
  uploading?: boolean;
}

export function ImageUploader({ propertyId, existingImages = [], onImagesChange }: ImageUploaderProps) {
  const [images, setImages] = useState<UploadedImage[]>(
    existingImages.map((url) => ({ url, fileName: "" }))
  );
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateParent = useCallback((updatedImages: UploadedImage[]) => {
    onImagesChange(updatedImages.map((img) => img.url));
  }, [onImagesChange]);

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    if (propertyId) {
      formData.append("propertyId", String(propertyId));
    }

    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Upload failed");
    }

    return await response.json();
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);

    const fileArray = Array.from(files);
    const validFiles = fileArray.filter((file) => {
      const isImage = file.type.startsWith("image/");
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      return isImage && isValidSize;
    });

    if (validFiles.length === 0) {
      alert("Please select valid image files (max 5MB each)");
      setUploading(false);
      return;
    }

    // Add placeholders for uploading images
    const placeholders: UploadedImage[] = validFiles.map(() => ({
      url: "",
      fileName: "",
      uploading: true,
    }));
    
    setImages((prev) => [...prev, ...placeholders]);

    try {
      const uploadPromises = validFiles.map((file) => uploadFile(file));
      const results = await Promise.all(uploadPromises);

      setImages((prev) => {
        const nonUploadingImages = prev.filter((img) => !img.uploading);
        const newImages = results.map((result) => ({
          url: result.url,
          fileName: result.fileName,
        }));
        const updated = [...nonUploadingImages, ...newImages];
        updateParent(updated);
        return updated;
      });
    } catch (error) {
      console.error("Upload error:", error);
      alert(error instanceof Error ? error.message : "Failed to upload images");
      
      // Remove placeholder images
      setImages((prev) => {
        const filtered = prev.filter((img) => !img.uploading);
        updateParent(filtered);
        return filtered;
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async (index: number) => {
    const image = images[index];
    
    // Only try to delete if we have a fileName (meaning it was uploaded via our API)
    if (image.fileName) {
      try {
        await fetch(`/api/admin/upload?fileName=${encodeURIComponent(image.fileName)}`, {
          method: "DELETE",
        });
      } catch (error) {
        console.error("Delete error:", error);
      }
    }

    setImages((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      updateParent(updated);
      return updated;
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-200
          ${dragActive 
            ? "border-brass bg-brass/5" 
            : "border-ink/[0.15] hover:border-brass/50 hover:bg-linen/50"
          }
          ${uploading ? "opacity-60 cursor-not-allowed" : ""}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          disabled={uploading}
        />
        
        <div className="flex flex-col items-center gap-3">
          {uploading ? (
            <Loader2 className="w-10 h-10 text-brass animate-spin" strokeWidth={1.5} />
          ) : (
            <Upload className="w-10 h-10 text-stone-400" strokeWidth={1.5} />
          )}
          
          <div>
            <p className="text-[14px] font-body font-semibold text-ink mb-1">
              {uploading ? "Uploading images..." : "Drop images here or click to browse"}
            </p>
            <p className="text-[12px] font-body text-stone-400">
              Supports JPEG, PNG, WebP · Max 5MB per file
            </p>
          </div>
        </div>
      </div>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative aspect-square bg-linen border border-ink/[0.08] rounded-lg overflow-hidden group"
            >
              {image.uploading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-brass animate-spin" strokeWidth={1.5} />
                </div>
              ) : image.url ? (
                <>
                  <Image
                    src={image.url}
                    alt={`Property image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 w-7 h-7 bg-ink/80 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-ink"
                    aria-label="Remove image"
                  >
                    <X className="w-4 h-4" strokeWidth={2} />
                  </button>
                  {index === 0 && (
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-ink/80 text-white text-[10px] font-body font-bold uppercase tracking-wider rounded">
                      Cover
                    </div>
                  )}
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-stone-300" strokeWidth={1.5} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <p className="text-[11px] font-body text-stone-400">
          {images.length} image{images.length !== 1 ? "s" : ""} · First image will be used as cover
        </p>
      )}
    </div>
  );
}
