import { GraphQLClient, gql } from "graphql-request";

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

export async function getLunaExchangeRate(denom: string): Promise<number> {
  const response = await hive.request(
    gql`
      query($denom: String!) {
        oracle {
          exchangeRate(denom: $denom) {
            amount
          }
        }
      }
    `,
    {
      denom: denom
    }
  )

  return response?.oracle?.exchangeRate?.amount;
}

// return pair liquiditiy in UST for a pair
// just have to get one side of the pool and multiply by 2
export async function getPairLiquidity(address: string, query: JSON): Promise<number> {
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

  if(response?.wasm?.contractQuery?.assets[0]?.info?.native_token?.denom == "uusd") {
    return 2 * response?.wasm?.contractQuery?.assets[0]?.amount

  } else if (response?.wasm?.contractQuery?.assets[1]?.info?.native_token?.denom == "uluna") {

    const lunaPrice = await getLunaExchangeRate("uusd");
    return 2 * response?.wasm?.contractQuery?.assets[1]?.amount * lunaPrice

  } else {
    console.log("Error getting pair liquidity for contract: " + address)
    return 0
  }


}