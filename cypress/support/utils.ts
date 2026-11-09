/** Converts a price label such as "$29.99" or "Item total: $29.99" into 29.99. */
export const parsePrice = (text: string): number => {
  const match = text.match(/\$(\d+(?:\.\d+)?)/);
  if (!match) {
    throw new Error(`No price found in "${text}"`);
  }
  return Number(match[1]);
};

/** Returns the trimmed text of every element in a jQuery collection. */
export const textsOf = ($elements: JQuery<HTMLElement>): string[] =>
  Cypress._.map($elements, (el) => el.innerText.trim());

/** Rounds a monetary amount to 2 decimals to avoid floating point noise. */
export const roundMoney = (amount: number): number => Math.round(amount * 100) / 100;
