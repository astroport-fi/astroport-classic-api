import { Token } from "./token.type";

/**
 * Type UserTokenHolding holds the token values held by the user.
 */
export type UserTokenHolding = {
  token: Token;
  // The amount of token held
  amount: number;
  // The value of amount of token in UST
  valueUST: number;
};
