import React, { useRef, useState, useEffect } from 'react';
import { User } from 'lucide-react';

interface AvatarUploadProps {
    avatarValue: File | null;
    setAvatarValue: (file: File | null) => void;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ avatarValue, setAvatarValue }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (avatarValue) {
            const url = URL.createObjectURL(avatarValue);
            setImageUrl(url);
            return () => URL.revokeObjectURL(url); 
        } else {
            setImageUrl(null);
        }
    }, [avatarValue]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;

        if (file && file.type.startsWith('image/')) {
            setAvatarValue(file);
        } else {
            setAvatarValue(null);
        }
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.currentTarget.classList.remove('border-indigo-500', 'bg-indigo-50');
        const file = e.dataTransfer.files ? e.dataTransfer.files[0] : null;

        if (file) {
            handleFileChange({ target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>);
        }
    }

    const openFileDialog = () => {
        fileInputRef.current?.click();
    };

    const dragOverClass = (e: React.DragEvent<HTMLDivElement>, add: boolean) => {
        e.preventDefault();
        if (add) {
            e.currentTarget.classList.add('border-indigo-500', 'bg-indigo-50');
        } else {
            e.currentTarget.classList.remove('border-indigo-500', 'bg-indigo-50');
        }
    };


  return (
    <div
        className={`w-20 h-20 rounded-full flex flex-col justify-center items-center ${imageUrl ? 'border-2 border-blue-200' : ''}`}
        onClick={openFileDialog}
        onDragOver={(e) => dragOverClass(e, true)}
        onDragLeave={(e) => dragOverClass(e, false)}
        onDrop={handleDrop}
    >
        {/* Tampilkan Placeholder atau Pratinjau Gambar */}
        {!imageUrl ? (
            <div className="bg-slate-200 w-full h-full rounded-full flex justify-center items-center">
                <User size={30} />
            </div>
        ) : (
            <img
                src={imageUrl}
                alt="Avatar Preview"
                className="w-full h-full rounded-full object-cover"
            />
        )}

        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            name="avatar"
            className="hidden"
        />
    </div>
  )
}

export default AvatarUpload;