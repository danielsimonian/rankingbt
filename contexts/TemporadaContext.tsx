// contexts/TemporadaContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Temporada, TemporadaContextType } from '@/types/temporada';
import { getTemporadas, getTemporadaAtiva } from '@/lib/api/temporadas';

const TemporadaContext = createContext<TemporadaContextType>({
  temporadaAtual: null,
  temporadas: [],
  isLoading: true,
  selecionarTemporada: () => {},
  recarregar: async () => {},
});

export function TemporadaProvider({ children }: { children: ReactNode }) {
  const [temporadaAtual, setTemporadaAtual] = useState<Temporada | null>(null);
  const [temporadas, setTemporadas] = useState<Temporada[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    carregarTemporadas();
  }, []);

  const carregarTemporadas = async () => {
    setIsLoading(true);
    
    try {
      // Buscar todas as temporadas
      const todasTemporadas = await getTemporadas();
      setTemporadas(todasTemporadas);

      // Verificar se tem temporada salva no localStorage
      const temporadaSalvaId = localStorage.getItem('temporada_selecionada');
      
      if (temporadaSalvaId) {
        const temporadaSalva = todasTemporadas.find(t => t.id === temporadaSalvaId);
        if (temporadaSalva) {
          setTemporadaAtual(temporadaSalva);
          setIsLoading(false);
          return;
        }
      }

      // Se não tem salva, buscar a ativa
      const ativa = todasTemporadas.find(t => t.ativa);
      if (ativa) {
        setTemporadaAtual(ativa);
        localStorage.setItem('temporada_selecionada', ativa.id);
      }
    } catch (error) {
      console.error('Erro ao carregar temporadas:', error);
    }
    
    setIsLoading(false);
  };

  const selecionarTemporada = (id: string) => {
    const temporada = temporadas.find(t => t.id === id);
    if (temporada) {
      setTemporadaAtual(temporada);
      localStorage.setItem('temporada_selecionada', id);
      
      // Disparar evento customizado para outras partes da aplicação reagirem
      window.dispatchEvent(new CustomEvent('temporadaChanged', { 
        detail: { temporada } 
      }));
    }
  };

  const recarregar = async () => {
    await carregarTemporadas();
  };

  return (
    <TemporadaContext.Provider 
      value={{ 
        temporadaAtual, 
        temporadas, 
        isLoading,
        selecionarTemporada,
        recarregar
      }}
    >
      {children}
    </TemporadaContext.Provider>
  );
}

export const useTemporada = () => {
  const context = useContext(TemporadaContext);
  if (!context) {
    throw new Error('useTemporada deve ser usado dentro de TemporadaProvider');
  }
  return context;
};