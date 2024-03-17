import { useMemo } from "react";

import { Dropdown, DropdownProps } from "~/modules/shared/components";

import { useTransactionCategories } from "../hooks";

export type CategorySelectProps = Omit<DropdownProps, 'onChange' | 'options'> & {
  onChange: (categoryId: number) => void;
  categoryId?: number;
};

export function CategorySelect({ onChange, categoryId, ...props }: CategorySelectProps) {
  const { transactionCategories } = useTransactionCategories();

  const options = useMemo(() => transactionCategories.map((trxCategory) => ({
    label: trxCategory.title,
    value: trxCategory.id.toString(),
  })), [transactionCategories]);

  return (
    <Dropdown
      {...props}
      options={options}
      value={String(categoryId)}
      onChange={(newValue) => onChange(Number(newValue))}
    />
  );
}