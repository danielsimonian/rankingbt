import Image from 'next/image';
import { Trophy } from 'lucide-react';

interface TorneioLogoProps {
  logoUrl?: string | null;
  nome: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export default function TorneioLogo({ 
  logoUrl, 
  nome, 
  size = 'medium',
  className = '' 
}: TorneioLogoProps) {
  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-24 h-24',
    large: 'w-32 h-32',
  };

  const iconSizes = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
  };

  const dimensions = {
    small: 48,
    medium: 96,
    large: 128,
  };

  if (logoUrl) {
    return (
      <div className={`${sizeClasses[size]} ${className} flex items-center justify-center overflow-hidden rounded-xl bg-white border-2 border-gray-200 shadow-md`}>
        <Image
          src={logoUrl}
          alt={`Logo ${nome}`}
          width={dimensions[size]}
          height={dimensions[size]}
          className="w-full h-full object-contain p-2"
          unoptimized
        />
      </div>
    );
  }

  // Fallback - Ícone Trophy
  return (
    <div className={`${sizeClasses[size]} ${className} flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl shadow-md border-2 border-primary-300`}>
      <Trophy className={`${iconSizes[size]} text-primary-600`} />
    </div>
  );
}