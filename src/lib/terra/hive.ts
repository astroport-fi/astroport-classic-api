import { gql, GraphQLClient } from "graphql-request";
import { PriceV2 } from "../../types/priceV2.type";
import { GOVERNANCE_ASSEMBLY, TOKENS_WITH_8_DIGITS, GENERATOR_ADDRESS } from "../../constants";
import { PoolInfo, TokenInfo } from "../../types/hive.type";

export let hive: GraphQLClient;

export function initHive(URL: string): GraphQLClient {
  hive = new GraphQLClient(URL, {
    timeout: 60000,
    keepalive: true,
  });

  return hive;
}

export const getPool = async (contract: string, height: number): Promise<any> => {
  if (contract == null || height == null) {
    return null;
  }

  try {
    const response = await hive.request(
      gql`
        query ($height: Float!, $blockHeight: Int!, $contract: String!) {
          wasm {
            contractQuery(height: $height, contractAddress: $contract, query: { pool: {} })
          }

          tendermint {
            blockInfo(height: $blockHeight) {
              block {
                header {
                  height
                  time
                }
              }
            }
          }
        }
      `,
      { height, blockHeight: height, contract }
    );

    return {
      pool: response.wasm.contractQuery,
      time: response.tendermint.blockInfo.block.header.time,
    };
  } catch (e) {
    return null;
  }
};

export const getProposals = async (contract: string, limit = 100, offset = 0): Promise<any> => {
  try {
    const response = await hive.request(
      gql`
        query ($limit: Int!, $offset: Int!, $contract: String!) {
          wasm {
            contractQuery(
              contractAddress: $contract
              query: { proposals: { limit: $limit, start: $offset } }
            )
          }
        }
      `,
      { contract: contract, limit: limit, offset: offset }
    );

    return response?.wasm?.contractQuery?.proposal_list;
  } catch (e) {
    return [];
  }
};

export async function getTokenInfo(tokenAddr: string): Promise<TokenInfo | null> {
  try {
    const response = await hive.request(
      gql`
        query ($tokenAddr: String!) {
          wasm {
            contractQuery(contractAddress: $tokenAddr, query: { token_info: {} })
          }
        }
      `,
      { tokenAddr }
    );

    return { ...response.wasm.contractQuery, address: tokenAddr };
  } catch (e) {
    return null;
  }
}

export async function getTxBlock(height: number) {
  try {
    const response = await hive.request(
      gql`
        query ($height: Float!) {
          tx {
            byHeight(height: $height) {
              timestamp
              height
              txhash
              logs {
                msg_index
                events {
                  type
                  attributes {
                    key
                    value
                  }
                }
              }
            }
          }
        }
      `,
      { height }
    );

    return response?.tx?.byHeight;
  } catch (e) {
    return null;
  }
}

export async function getLatestBlock(): Promise<{
  height: number;
  time: string;
}> {
  const response = await hive.request(
    gql`
      {
        tendermint {
          blockInfo {
            block {
              header {
                height
                time
              }
            }
          }
        }
      }
    `
  );

  return {
    height: +response?.tendermint?.blockInfo?.block?.header?.height,
    time: response?.tendermint?.blockInfo?.block?.header?.time,
  };
}

export async function getChainBlock(height: number): Promise<{
  height: number;
  time: string;
}> {
  const response = await hive.request(
    gql`
      query ($height: Int!) {
        tendermint {
          blockInfo(height: $height) {
            block {
              header {
                height
                time
              }
            }
          }
        }
      }
    `,
    { height }
  );

  return {
    height: +response?.tendermint?.blockInfo?.block?.header?.height,
    time: response?.tendermint?.blockInfo?.block?.header?.time,
  };
}

export async function getContractStore<T>(address: string, query: JSON): Promise<T | null> {
  try {
    const response = await hive.request(
      gql`
        query ($address: String!, $query: JSON!) {
          wasm {
            contractQuery(contractAddress: $address, query: $query)
          }
        }
      `,
      {
        address,
        query,
      }
    );

    return response.wasm.contractQuery;
  } catch (e) {
    return null;
  }
}

// return pair liquidity in UST for a pair
export async function getPairLiquidity(
  address: string,
  query: JSON,
  priceMap: Map<string, PriceV2>
): Promise<number> {
  const response = await hive.request(
    gql`
      query ($address: String!, $query: JSON!) {
        wasm {
          contractQuery(contractAddress: $address, query: $query)
        }
      }
    `,
    {
      address: address,
      query: query,
    }
  );

  let liquidity = 0;

  for (const asset of response?.wasm?.contractQuery?.assets) {
    if (asset?.info?.native_token) {
      const address = asset?.info?.native_token?.denom;
      const amount = asset?.amount / 1000000;
      if (priceMap.has(address)) {
        // @ts-ignore
        liquidity += priceMap.get(address).price_ust * amount;
      } else {
        // fetch external price TODO
      }
    } else {
      const address = asset?.info?.token?.contract_addr;
      let amount = asset?.amount / 1000000;

      if (TOKENS_WITH_8_DIGITS.has(address)) {
        amount = amount / 100;
      }

      if (priceMap.has(address)) {
        // @ts-ignore
        liquidity += priceMap.get(address).price_ust * amount;
      } else {
        // fetch external price TODO
      }
    }
  }

  return liquidity;
}

/**
 * Given a pool, find the relative price of the given token to the other token in the pair
 *
 * @param poolAddress
 * @param token - token to simulate the swap
 * @param amount - amount of token to simulate the swap
 */
export async function getStableswapRelativePrice(
  poolAddress: string,
  token: string,
  amount: string
) {
  let query = {};
  if (token.startsWith("terra")) {
    query = { token: { contract_addr: token } };
  } else {
    // native
    query = { native_token: { denom: token } };
  }

  const response = await hive.request(
    gql`
      query ($address: String!, $query: JSON!, $amount: String!) {
        wasm {
          contractQuery(
            contractAddress: $address
            query: { simulation: { offer_asset: { info: $query, amount: $amount } } }
          )
        }
      }
    `,
    {
      address: poolAddress,
      query: query,
      amount: amount,
    }
  );

  return response?.wasm?.contractQuery?.return_amount;
}

export async function getTotalVotingPowerAt(
  block: number,
  time: number,
  xastro: string = "terra1yufp7cv85qrxrx56ulpfgstt2gxz905fgmysq0", // TODO testnet addresses remove
  builder: string = "terra1hccg0cfrcu0nr4zgt5urmcgam9v88peg9s7h6j",
  vxastro: string = "terra1pqr02fx4ulc2mzws7xlqh8hpwqx2ls5m4fk62j"
) {
  const response = await hive.request(
    gql`
      query ($block: Int!, $time: Int!, $xastro: String!, $builder: String!, $vxastro: String!) {
        x: wasm {
          contractQuery(contractAddress: $xastro, query: { total_supply_at: { block: $block } })
        }
        builder: wasm {
          contractQuery(contractAddress: $builder, query: { state: {} })
        }
        vx: wasm {
          contractQuery(
            contractAddress: $vxastro
            query: { total_voting_power_at: { time: $time } }
          )
        }
      }
    `,
    {
      block: block,
      time: time,
      xastro: xastro,
      builder: builder,
      vxastro: vxastro,
    }
  );

  // TODO double check numbers for prod
  return (
    Number(response?.x?.contractQuery) +
    Number(response?.builder?.contractQuery?.remaining_astro_tokens) +
    Number(response?.vx?.contractQuery?.voting_power) / 1000000
  );
}

export async function getAssemblyConfig() {
  const response = await hive.request(
    gql`
      query ($assembly: String!) {
        wasm {
          contractQuery(contractAddress: $assembly, query: { config: {} })
        }
      }
    `,
    {
      assembly: GOVERNANCE_ASSEMBLY,
    }
  );

  return response?.wasm?.contractQuery;
}

export const getDistributionSchedule = async (contract: string): Promise<any> => {
  try {
    const response = await hive.request(
      gql`
        query ($contract: String!) {
          wasm {
            contractQuery(contractAddress: $contract, query: { config: {} })
          }
        }
      `,
      { contract: contract }
    );

    return response?.wasm?.contractQuery?.distribution_schedule;
  } catch (e) {
    return null;
  }
};

export const getGeneratorPoolInfo = async (contract: string): Promise<PoolInfo | null> => {
  try {
    const response = await hive.request(
      gql`
        query ($contract: String!, $generator: String!) {
          wasm {
            contractQuery(
              contractAddress: $generator
              query: { pool_info: { lp_token: $contract } }
            )
          }
        }
      `,
      { contract: contract, generator: GENERATOR_ADDRESS }
    );
    return response?.wasm?.contractQuery;
  } catch (e) {
    return null;
  }
};

export const getContractConfig = async (contract: string): Promise<any> => {
  try {
    const response = await hive.request(
      gql`
        query ($contract: String!) {
          wasm {
            contractQuery(contractAddress: $contract, query: { config: {} })
          }
        }
      `,
      { contract: contract }
    );
    return response?.wasm?.contractQuery;
  } catch (e) {
    return null;
  }
};

/**
 * Retrieve the current holding of a wallet for the given token
 *
 * @param tokenContract The address of the CW20 token
 * @param walletAddress The address of the wallet
 * @returns The current balance of tokenContract in walletAddress
 */
export const getTokenHolding = async (
  tokenContract: string,
  walletAddress: string
): Promise<number> => {
  try {
    const response = await hive.request(
      gql`
        query ($tokenContract: String!, $walletAddress: String!) {
          wasm {
            contractQuery(
              contractAddress: $tokenContract
              query: { balance: { address: $walletAddress } }
            )
          }
        }
      `,
      { tokenContract, walletAddress }
    );
    return +response?.wasm?.contractQuery.balance;
  } catch (e) {
    return 0;
  }
};

/**
 * Retrieve the current allocation for a given wallet
 *
 * @param walletAddress The address to retrieve the allocation for
 * @returns The allocation information for the address
 */
export const getBuilderAllocationForWallet = async (
  builderUnlockContact: string,
  walletAddress: string
): Promise<any> => {
  try {
    const response = await hive.request(
      gql`
        query ($builderUnlockContact: String!, $walletAddress: String!) {
          wasm {
            contractQuery(
              contractAddress: $builderUnlockContact
              query: { allocation: { account: $walletAddress } }
            )
          }
        }
      `,
      { builderUnlockContact, walletAddress }
    );
    return response?.wasm?.contractQuery;
  } catch (e) {
    return null;
  }
};

/**
 * Retrieve the current voting power from vxAstro for a user
 *
 * @param walletAddress The address to retrieve the voting power for
 * @returns The voting power of the user
 */
export const getvxAstroVotingPower = async (
  vxAstroContact: string,
  walletAddress: string
): Promise<number> => {
  try {
    const response = await hive.request(
      gql`
        query ($vxAstroContact: String!, $walletAddress: String!) {
          wasm {
            contractQuery(
              contractAddress: $vxAstroContact
              query: { user_voting_power: { user: $walletAddress } }
            )
          }
        }
      `,
      { vxAstroContact, walletAddress }
    );
    return +response?.wasm?.contractQuery.voting_power;
  } catch (e) {
    return 0;
  }
};
