import { TransactionCategory } from "~/modules/transactions/types";
import { StandardTransactionCategory } from "~/modules/transactions/constants";

import { BaseAgent } from "./base";

export class CategorizationAgent extends BaseAgent {
  public constructor(private transactionCategories: TransactionCategory[]) {
    const categoryTitles = transactionCategories.map((trxnCategory) =>
      trxnCategory.title.toLowerCase(),
    );
    super([
      {
        role: "system",
        content:
          "You are an intelligent assistant. When given transaction details you will classify it and respond with a category according with this list of potential values.",
      },
      {
        role: "system",
        content: `Categories: ${categoryTitles.join(", ")}`,
      },
    ]);
  }

  public async categorize(content: string): Promise<TransactionCategory> {
    const [response] = await this.ask([
      {
        role: "system",
        content: `
        Transaction details: ${content}
        Category:
        `,
      },
    ]);

    const matchingTransactionCategory = this.transactionCategories.find(
      (trxnCategory) => trxnCategory.title.toLowerCase() === response,
    );

    const unknownCategory = this.transactionCategories.find(
      (trxnCategory) => trxnCategory.id === StandardTransactionCategory.UNKNOWN,
    )!;

    return matchingTransactionCategory ?? unknownCategory;
  }
}
