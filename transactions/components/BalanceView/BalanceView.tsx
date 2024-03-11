import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon, IonText } from "@ionic/react";
import { trendingDown, trendingUp } from "ionicons/icons";

import { CURRENCY_SYMBOLS } from "accounts/constants";
import { Account } from "accounts/types";
import { Transaction } from "transactions/types";

import './BalanceView.css';
import { aggregateByType } from "transactions/utils";

type BalanceViewProps = {
  account: Account;
  transactions: Transaction[];
};

export const BalanceView: React.FC<BalanceViewProps> = ({ account, transactions }) => {
  const { income: incomeAmount, expense: expenseAmount } = aggregateByType(transactions);

  const balance = incomeAmount - expenseAmount;
  
  return (
    <IonCard className="BalanceView">
      <IonCardHeader>
        <IonCardTitle>
          <IonText>Balance</IonText>
          <IonText color={balance < 0 ? 'danger' : 'success'}>
            {CURRENCY_SYMBOLS[account.currency]} {balance.toFixed(2)}
            <IonIcon icon={balance > 0 ? trendingUp : trendingDown} color={balance < 0 ? 'danger' : 'success'} />
          </IonText>
        </IonCardTitle>
      </IonCardHeader>
    </IonCard>
  );
};
