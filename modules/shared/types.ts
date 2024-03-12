export type Maybe<T> = T | null | undefined;

export type ID = string;

export type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T;