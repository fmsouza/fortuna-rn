import { IonButton, IonCard, IonCardContent, IonText } from "@ionic/react";

import './UncategorizedTransacionsReviewCard.css';

type UncategorizedTransacionsReviewCardProps = {
  onPressReview: () => void;
  uncategorizedTransactionGroupsCount: number;
  transactionsCount: number;
};

export const UncategorizedTransacionsReviewCard: React.FC<UncategorizedTransacionsReviewCardProps> = ({ onPressReview, uncategorizedTransactionGroupsCount, transactionsCount }) => {
  return (
    <IonCard color="warning" className="UncategorizedTransacionsReviewCard">
      <IonCardContent>
        <div className="column">
          <IonText>
            We've identified {transactionsCount} transactions in {uncategorizedTransactionGroupsCount} different groups which still doesn't have a category.
          </IonText>
          <br/>
          <IonText>
            Do you want to review them?
          </IonText>
        </div>
        <IonButton type="button" fill="clear" color="light" onClick={onPressReview}>
          Review
        </IonButton>
      </IonCardContent>
    </IonCard>
  );
};