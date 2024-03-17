import { useMemo } from "react";

import { Dropdown } from "~/modules/shared/components";

import { useTransactionCategories } from "../hooks";

type CategorySelectInputProps = {
  onChange: (categoryId: number) => void;
  categoryId?: number;
};

export function CategorySelectInput({ onChange, categoryId }: CategorySelectInputProps) {
  const { transactionCategories } = useTransactionCategories();

  const options = useMemo(() => transactionCategories.map((trxCategory) => ({
    label: trxCategory.title,
    value: trxCategory.id.toString(),
  })), [transactionCategories]);

  return (
    <Dropdown
      options={options}
      value={String(categoryId)}
      onChange={(newValue) => onChange(Number(newValue))}
    />
  );
}