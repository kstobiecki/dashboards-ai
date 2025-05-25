'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { createTradingViewCard } from '../mocks/TradingViewCard';
import { createTeslaStockDashboardCard } from '../mocks/TeslaStockDashboardCard';
import { createFinancialNewsCard } from '../mocks/FinancialNewsCard';
import { createWeatherCard } from '../mocks/WeatherCard';
import { createWorldClockCard } from '../mocks/WorldClockCard';
import { createToDoCard } from '../mocks/ToDoCard';

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

const initialCards = [
  createTradingViewCard(),
  createTeslaStockDashboardCard(),
  createFinancialNewsCard(),
  createWeatherCard(),
  createWorldClockCard(),
  createToDoCard(),
];

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