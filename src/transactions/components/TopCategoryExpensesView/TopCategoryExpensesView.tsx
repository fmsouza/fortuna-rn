import { IonCard, IonCardContent, IonCardHeader, IonCardTitle } from "@ionic/react";
import { ChartData } from "chart.js";
import { useMemo } from "react";
import { Bar } from "react-chartjs-2";

import { Account } from "~/accounts/types";
import { TransactionType } from "~/transactions/constants";
import { useTransactionCategories } from "~/transactions/hooks";
import { Transaction } from "~/transactions/types";
import { aggregateByCategory } from "~/transactions/utils";

const OPTIONS = {
  responsive: true,
  animation: false as const,
  indexAxis: 'y' as const,
  plugins: {
    legend: {
      position: 'bottom' as const,
    }
  },
  scales: {
    y: {
      ticks: {
        display: false,
      },
      grid: {
        display: false,
      },
      border: {
        display: false,
      }
    }
  }
};

type TopCategoryExpensesViewProps = {
  account: Account;
  limit?: number;
  transactions: Transaction[];
};

export const TopCategoryExpensesView: React.FC<TopCategoryExpensesViewProps> = ({ limit = 3, transactions }) => {
  const { transactionCategories } = useTransactionCategories();

  const mostExpensiveCategories: Array<{ title: string, amount: number }> = useMemo(() => {
    const expenseTransactions = transactions.filter((trx) => trx.type === TransactionType.EXPENSE);
    const byCategory = aggregateByCategory(expenseTransactions);
    const categories = Object.keys(byCategory).map(category => ({
      title: transactionCategories.find(transactionCategory => transactionCategory.id === category)?.title ?? category,
      amount: byCategory[category],
    }));
    return categories.sort((a, b) => b.amount - a.amount).slice(0, limit);
  }, [transactionCategories, transactions]);

  const data: ChartData<"bar", number[], string> = {
    labels: mostExpensiveCategories.map(category => category.title),
    datasets: mostExpensiveCategories.map(category => ({
      label: category.title,
      data: [category.amount],
      borderRadius: 2,
    })),
  };
  
  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Top category expenses</IonCardTitle>
      </IonCardHeader>

      <IonCardContent className="ion-center">
        <Bar options={OPTIONS} data={data} />
      </IonCardContent>
    </IonCard>
  );
};
