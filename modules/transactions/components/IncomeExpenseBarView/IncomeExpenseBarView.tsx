import { IonCard, IonCardContent, IonCardHeader, IonCardTitle } from "@ionic/react";
import { Bar } from "react-chartjs-2";

import { Transaction } from "~/modules/transactions/types";
import { aggregateByType } from "~/modules/transactions/utils";

import './IncomeExpenseBarView.css';

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

type IncomeExpenseBarViewProps = {
  transactions: Transaction[];
};

export const IncomeExpenseBarView: React.FC<IncomeExpenseBarViewProps> = ({ transactions }) => {
  const { income: incomeAmount, expense: expenseAmount } = aggregateByType(transactions);

  const data = {
    labels: [''],
    datasets: [
      {
        label: 'Income',
        data: [incomeAmount],
        borderRadius: 10,
      },
      {
        label: 'Expenses',
        data: [expenseAmount],
        borderRadius: 10,
      },
    ],
  };
  
  return (
    <IonCard className="IncomeExpenseBarView">
      <IonCardHeader>
        <IonCardTitle>Income & Expenses</IonCardTitle>
      </IonCardHeader>

      <IonCardContent className="ion-center">
        <div className="bar-wrapper">
          <Bar options={OPTIONS} data={data} />
        </div>
      </IonCardContent>
    </IonCard>
  );
};
