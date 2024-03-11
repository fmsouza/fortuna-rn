import { ChartData, ChartOptions } from "chart.js";
import React, { useMemo } from "react";
import { Pie } from 'react-chartjs-2';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle } from "@ionic/react";

import { Account } from "accounts/types";
import { CURRENCY_SYMBOLS } from "accounts/constants";
import { Transaction, TransactionCategoryType } from "transactions/types";
import { useTransactionCategories } from "transactions/hooks";
import { aggregateByCategory } from "transactions/utils";

import './CategoryPieView.css';

const CHART_OPTIONS: ChartOptions = {
  responsive: true,
  animation: false,
  plugins: {
    legend: {
      position: 'right',
    }
  },
};

type CategoryPieViewProps = {
  account: Account;
  transactions: Transaction[];
};
export const CategoryPieView: React.FC<CategoryPieViewProps> = ({ account, transactions }) => {
  const {transactionCategories} = useTransactionCategories();

  const expenseTransactionCategories = useMemo(() => transactionCategories.filter((category) => category.type === TransactionCategoryType.EXPENSE), [transactionCategories]);

  const labels = useMemo(() => expenseTransactionCategories.map((category) => category.title), [transactionCategories]);

  const aggregatedTransactionValues = useMemo(() => aggregateByCategory(transactions), [transactions]);

  const data: ChartData = useMemo(() => ({
    labels,
    datasets: [
      {
        label: CURRENCY_SYMBOLS[account.currency],
        data: transactionCategories.map((category) => aggregatedTransactionValues[category.id]),
      },
    ],
  }), [labels, aggregatedTransactionValues]);

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Expenses by category</IonCardTitle>
      </IonCardHeader>

      <IonCardContent>
        <Pie options={CHART_OPTIONS as any} data={data as any} />
      </IonCardContent>
    </IonCard>
  );
};
