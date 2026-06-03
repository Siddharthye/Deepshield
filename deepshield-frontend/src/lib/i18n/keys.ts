import { EN } from "./en";
import { EN_MORE } from "./en-more";

export const EN_ALL = { ...EN, ...EN_MORE } as const;
export type I18nKey = keyof typeof EN_ALL;
