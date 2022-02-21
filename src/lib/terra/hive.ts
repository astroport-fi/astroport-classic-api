import { gql, GraphQLClient } from "graphql-request";
import { PriceV2 } from "../../types/priceV2.type";

export let hive: GraphQLClient;

export function initHive(URL: string): GraphQLClient {
  hive = new GraphQLClient(URL, {
    timeout: 60000,
    keepalive: true,
  });

  return hive;
}

export const getPool = async (
  contract: string,
  height: number
): Promise<any> => {
  if (contract == null || height == null) {
    return null;
  }

  try {
    const response = await hive.request(
      gql`
        query ($height: Float!, $blockHeight: Int!, $contract: String!) {
          wasm {
            contractQuery(
              height: $height
              contractAddress: $contract
              query: { pool: {} }
            )
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

export async function getTokenInfo(tokenAddr: string) {
  try {
    const response = await hive.request(
      gql`
        query ($tokenAddr: String!) {
          wasm {
            contractQuery(
              contractAddress: $tokenAddr
              query: { token_info: {} }
            )
          }
        }
      `,
      { tokenAddr }
    );

    return response.wasm.contractQuery;
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

export async function getContractStore<T>(address: string, query: JSON): Promise<T | undefined> {

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

  return response.wasm.contractQuery

}

export async function getLunaExchangeRate(): Promise<number> {
  const response = await hive.request(
    gql`
      query {
        oracle {
          exchangeRate(denom: uusd) {
            amount
          }
        }
      }
    `
  )

  return response?.oracle?.exchangeRate?.amount;
}

export async function getPsiExchangeRate(): Promise<number> {

  const response = await hive.request(
    gql`
      query($address: String!, $query: JSON!) {
        wasm {
          contractQuery(
            contractAddress: $address,
            query: $query
          )
        }
      }
    `,
    {
      address: "terra1v5ct2tuhfqd0tf8z0wwengh4fg77kaczgf6gtx",
      query: JSON.parse('{ "pool": {} }')
    }
  )

  let ustAmount, psiAmount
  if(response?.wasm?.contractQuery?.assets[0]?.info?.native_token?.denom == "uusd") {
    ustAmount = response?.wasm?.contractQuery?.assets[0]?.amount
    psiAmount = response?.wasm?.contractQuery?.assets[1]?.amount
  } else {
    ustAmount = response?.wasm?.contractQuery?.assets[1]?.amount
    psiAmount = response?.wasm?.contractQuery?.assets[0]?.amount
  }
  return ustAmount / psiAmount
}

// return pair liquidity in UST for a pair
export async function getPairLiquidity(address: string, query: JSON, priceMap: Map<string, PriceV2>): Promise<number> {
  const response = await hive.request(
    gql`
      query($address: String!, $query: JSON!) {
        wasm {
          contractQuery(
            contractAddress: $address,
            query: $query
          )
        }
      }
    `,
    {
      address: address,
      query: query
    }
  )

  let liquidity = 0

  for(const asset of response?.wasm?.contractQuery?.assets) {
    if (asset?.info?.native_token) {
      const address = asset?.info?.native_token?.denom
      const amount = asset?.amount / 1000000
      if (priceMap.has(address)) {
        // @ts-ignore
        liquidity += priceMap.get(address).price_ust * amount
      } else {
        // fetch external price TODO
      }
    } else {
      const address = asset?.info?.token?.contract_addr
      const amount = asset?.amount / 1000000
      if (priceMap.has(address)) {
        // @ts-ignore
        liquidity += priceMap.get(address).price_ust * amount
      } else {
        // fetch external price TODO
      }
    }
  }

  return liquidity
}

/**
 * Given a pool, find the relative price of the given token to the other token in the pair
 *
 * @param poolAddress
 * @param token - token to simulate the swap
 * @param amount - amount of token to simulate the swap
 */
export async function getStableswapRelativePrice(poolAddress: string, token: string, amount: string) {
  let query = {}
  if(token.startsWith("terra")) {
    query = { token: { contract_addr: token }}
  } else { // native
    query = { native_token: { denom: token }}
  }

  const response = await hive.request(
    gql`
      query($address: String!, $query: JSON!, $amount: String!) {
        wasm {
          contractQuery(
            contractAddress: $address
            query: {
              simulation: {
                offer_asset: { 
                  info: $query,
                  amount: $amount
                }
              }
            }
          )
        }
      }
    `,
    {
      address: poolAddress,
      query: query,
      amount: amount
    }
  )

  return response?.wasm?.contractQuery?.return_amount
}