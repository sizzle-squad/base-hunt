import { createContext, useState, useContext, ReactNode } from 'react';

interface GameInfoContextProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const GameInfoContext = createContext<GameInfoContextProps | undefined>(
  undefined
);

export const GameInfoProvider = ({ children }: { children: ReactNode }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <GameInfoContext.Provider value={{ showModal, setShowModal }}>
      {children}
    </GameInfoContext.Provider>
  );
};

export const useGameInfoContext = (): GameInfoContextProps => {
  const context = useContext(GameInfoContext);
  if (!context) {
    throw new Error(
      'useGameInfoContext must be used within a GameInfoProvider'
    );
  }
  return context;
};
