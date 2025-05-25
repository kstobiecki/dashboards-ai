'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { nanoid } from 'nanoid';

export interface ExploreCard {
  id: string;
  conversationHistory: {
    prompts: string;
    html: string;
  };
  intervalSettings: {
    isEnabled: boolean;
    interval: number;
    prompt: string;
  };
}

interface ExploreContextType {
  cards: ExploreCard[];
  setCards: (cards: ExploreCard[]) => void;
}

const createEmptyCard = (): ExploreCard => ({
  id: `explore-${nanoid(10)}`,
  conversationHistory: {
    prompts: '',
    html: '',
  },
  intervalSettings: {
    isEnabled: false,
    interval: 5,
    prompt: '',
  },
});

const initialCards = Array(6).fill(null).map(() => createEmptyCard());

const ExploreContext = createContext<ExploreContextType | undefined>(undefined);

export const ExploreProvider = ({ children }: { children: ReactNode }) => {
  const [cards, setCards] = useState<ExploreCard[]>(initialCards);

  return (
    <ExploreContext.Provider
      value={{
        cards,
        setCards,
      }}
    >
      {children}
    </ExploreContext.Provider>
  );
};

export const useExplore = () => {
  const context = useContext(ExploreContext);
  if (context === undefined) {
    throw new Error('useExplore must be used within an ExploreProvider');
  }
  return context;
}; 