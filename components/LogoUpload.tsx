'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

interface LogoUploadProps {
  currentLogoUrl?: string;
  onLogoChange: (url: string | null | undefined) => void;
}

export default function LogoUpload({ currentLogoUrl, onLogoChange }: LogoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentLogoUrl || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione uma imagem válida');
      return;
    }

    // Validar tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Imagem muito grande. Máximo 5MB');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      // Criar preview local
      const localPreview = URL.createObjectURL(file);
      setPreviewUrl(localPreview);

      // Redimensionar imagem
      const resizedBlob = await resizeImage(file, 400, 400);
      
      // Gerar nome único
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      // Upload para Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('torneios')
        .upload(filePath, resizedBlob, {
          contentType: file.type,
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('torneios')
        .getPublicUrl(filePath);

      setPreviewUrl(publicUrl);
      onLogoChange(publicUrl);
    } catch (err: any) {
      console.error('Erro ao fazer upload:', err);
      setError(err.message || 'Erro ao fazer upload da imagem');
      setPreviewUrl(null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (previewUrl && previewUrl.includes('supabase')) {
      try {
        // Extrair caminho do arquivo da URL
        const urlParts = previewUrl.split('/');
        const filePath = `logos/${urlParts[urlParts.length - 1]}`;
        
        // Deletar do storage
        await supabase.storage
          .from('torneios')
          .remove([filePath]);
      } catch (err) {
        console.error('Erro ao remover imagem:', err);
      }
    }

    setPreviewUrl(null);
    onLogoChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const resizeImage = (file: File, maxWidth: number, maxHeight: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = document.createElement('img');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calcular dimensões mantendo aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Erro ao processar imagem'));
          }
        }, file.type);
      };

      img.onerror = () => reject(new Error('Erro ao carregar imagem'));
      img.src = URL.createObjectURL(file);
    });
  };

  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
        <ImageIcon className="w-4 h-4" />
        Logo do Torneio (opcional)
      </label>

      {/* Preview ou Upload Area */}
      {previewUrl ? (
        <div className="relative group">
          <div className="relative w-full aspect-video bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200">
            <Image
              src={previewUrl}
              alt="Logo do torneio"
              fill
              className="object-contain p-4"
              unoptimized
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors shadow-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="relative cursor-pointer border-2 border-dashed border-gray-300 hover:border-primary-500 rounded-xl p-8 transition-colors bg-gray-50 hover:bg-gray-100"
        >
          <div className="text-center">
            {uploading ? (
              <>
                <Loader2 className="w-12 h-12 text-primary-600 mx-auto mb-4 animate-spin" />
                <p className="text-sm font-bold text-gray-700">Fazendo upload...</p>
              </>
            ) : (
              <>
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm font-bold text-gray-700 mb-1">
                  Clique para fazer upload
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG ou WEBP (máx. 5MB)
                </p>
              </>
            )}
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <p className="text-xs text-gray-500">
        Recomendado: imagem quadrada (400x400px) com fundo transparente
      </p>
    </div>
  );
}