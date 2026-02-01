import { useState, useRef } from "react";
import { useImages, useUploadImage } from "../hooks/use-posts";
import { Loader2, Upload, Copy, Check, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface ImageGalleryProps {
    onSelect?: (url: string) => void;
}

export default function ImageGallery({ onSelect }: ImageGalleryProps) {
    const { data: images, isLoading } = useImages();
    const { mutate: uploadImage, isPending: isUploading } = useUploadImage();
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append("image", file);

            uploadImage(formData, {
                onSuccess: () => {
                    toast({ title: "Success", description: "Image uploaded successfully" });
                    if (fileInputRef.current) fileInputRef.current.value = "";
                },
                onError: () => {
                    toast({ title: "Error", description: "Failed to upload image", variant: "destructive" });
                },
            });
        }
    };

    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(url);
        setCopiedUrl(url);
        toast({ title: "Copied", description: "Image URL copied to clipboard" });
        setTimeout(() => setCopiedUrl(null), 2000);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-secondary/20 p-4 rounded-xl border border-white/5">
                <div>
                    <h3 className="text-lg font-bold text-white mb-1">Media Library</h3>
                    <p className="text-sm text-gray-400">Upload and manage your images.</p>
                </div>
                <div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-cyan-400 transition-colors flex items-center gap-2"
                    >
                        {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload size={16} />}
                        Upload Image
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <AnimatePresence>
                    {images?.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
                            <ImageIcon className="w-12 h-12 mb-4 opacity-20" />
                            <p>No images uploaded yet.</p>
                        </div>
                    )}
                    {images?.map((image: any) => (
                        <motion.div
                            key={image.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="group relative aspect-square bg-black/20 rounded-xl overflow-hidden border border-white/5 hover:border-primary/50 transition-colors"
                        >
                            <img
                                src={image.url}
                                alt={image.altText}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4">
                                {onSelect ? (
                                    <button
                                        onClick={() => onSelect(image.url)}
                                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-cyan-400 w-full"
                                    >
                                        Select
                                    </button>
                                ) : (
                                    null
                                )}
                                <button
                                    onClick={() => copyToClipboard(image.url)}
                                    className="px-4 py-2 bg-white/10 text-white rounded-lg text-sm font-medium hover:bg-white/20 w-full flex items-center justify-center gap-2"
                                >
                                    {copiedUrl === image.url ? <Check size={14} /> : <Copy size={14} />}
                                    {copiedUrl === image.url ? "Copied" : "Copy URL"}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
