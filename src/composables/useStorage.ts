import {
  dbSaveRoutineProgress,
  dbLoadRoutineProgress,
  dbLoadAllRoutineProgress,
  dbClearRoutineProgress,
} from '../services/database';

export function useStorage() {
  const saveRoutineProgress = async (period: string, index: number, completed: boolean): Promise<void> => {
    await dbSaveRoutineProgress(period, index, completed);
  };

  const loadRoutineProgress = async (period: string, index: number): Promise<boolean> => {
    return await dbLoadRoutineProgress(period, index);
  };

  const loadAllRoutineProgress = async (period: string): Promise<boolean[]> => {
    return await dbLoadAllRoutineProgress(period);
  };

  const clearRoutineProgress = async (period: string): Promise<void> => {
    await dbClearRoutineProgress(period);
  };

  const clearAllRoutineProgress = async (): Promise<void> => {
    const periods = ['morning', 'afternoon', 'night'];
    for (const period of periods) {
      await dbClearRoutineProgress(period);
    }
  };

  return {
    saveRoutineProgress,
    loadRoutineProgress,
    loadAllRoutineProgress,
    clearRoutineProgress,
    clearAllRoutineProgress,
  };
}
