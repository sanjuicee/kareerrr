import { useContext } from 'react';
import { CareerPilotContext } from './CareerPilotContextTypes';

export const useCareerPilot = () => {
  const context = useContext(CareerPilotContext);
  if (!context) {
    throw new Error('useCareerPilot must be used within a CareerPilotProvider');
  }
  return context;
};
