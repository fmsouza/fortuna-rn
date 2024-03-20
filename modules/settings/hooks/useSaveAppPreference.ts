import { useMutation, useQueryClient } from '@tanstack/react-query';

import { saveAppPreference } from "../repositories";
import { AppPreferenceInput } from '../types';

export const useSaveAppPreference = () => {
  const client = useQueryClient();
  const {mutate, error, isPending} = useMutation({
    mutationFn: async (input: AppPreferenceInput) => {
      await saveAppPreference(input);
      await client.invalidateQueries({ queryKey: ['appPreference', input.id] });
    }
  });

  return {
    loading: isPending,
    error,
    saveAppPreference: mutate,
  };
};