import { useMutation } from '@tanstack/react-query';

import { classifyTransactionDescriptionAsCategory } from '../repositories';

export const useClassifyTransactions = () => {
  const {mutate, isPending, ...others} = useMutation({
    mutationFn: async (transactionDescriptions: string[]) => {
      const response = await Promise.all(
        transactionDescriptions.map(async item => {
          const category = await classifyTransactionDescriptionAsCategory(item);
          return { description: item, categoryId: category.id };
        })
      );

      return response.reduce((acc, item) => {
        acc[item.description] = item.categoryId;
        return acc;
      }
      , {} as Record<string, number>);
    },
  });

  return {
    ...others,
    loading: isPending,
    classifyTransactions: mutate,
  };
};
