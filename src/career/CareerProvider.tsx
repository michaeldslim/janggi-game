import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useGameSettings } from '../settings/GameSettingsProvider';
import { applyMatchResult, DEFAULT_CAREER_STATE } from './careerProgress';
import { loadCareerState, saveCareerState } from './careerStorage';
import type { CareerState, MatchResultInput, PromotionResult } from '../types/career';

interface CareerContextValue {
  careerState: CareerState;
  loaded: boolean;
  recordMatchResult: (input: MatchResultInput) => PromotionResult | null;
}

const CareerContext = createContext<CareerContextValue | null>(null);

export function CareerProvider({ children }: { children: ReactNode }) {
  const { careerModeEnabled } = useGameSettings();
  const [careerState, setCareerState] = useState<CareerState>(DEFAULT_CAREER_STATE);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    loadCareerState()
      .then((state) => {
        if (!cancelled) {
          setCareerState(state);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoaded(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const recordMatchResult = useCallback(
    (input: MatchResultInput): PromotionResult | null => {
      if (!careerModeEnabled) {
        return null;
      }

      const result = applyMatchResult(careerState, input);
      setCareerState(result.nextState);
      void saveCareerState(result.nextState);
      return result;
    },
    [careerModeEnabled, careerState],
  );

  const value = useMemo(
    () => ({
      careerState,
      loaded,
      recordMatchResult,
    }),
    [careerState, loaded, recordMatchResult],
  );

  return <CareerContext.Provider value={value}>{children}</CareerContext.Provider>;
}

export function useCareer(): CareerContextValue {
  const context = useContext(CareerContext);
  if (!context) {
    throw new Error('useCareer must be used within CareerProvider');
  }
  return context;
}
