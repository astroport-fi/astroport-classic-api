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

// get 10 at a time for 10x speedup
export async function getTxBlocks(height: number) {

  const height1 = height
  const height2 = height + 1
  const height3 = height + 2
  const height4 = height + 3
  const height5 = height + 4
  const height6 = height + 5
  const height7 = height + 6
  const height8 = height + 7
  const height9 = height + 8
  const height10 = height + 9
  const height11 = height + 10
  const height12 = height + 11
  const height13 = height + 12
  const height14 = height + 13
  const height15 = height + 14
  const height16 = height + 15
  const height17 = height + 16
  const height18 = height + 17
  const height19 = height + 18
  const height20 = height + 19

  try {
    const response = await hive.request(
      gql`
        query(
          $height1: Float!, 
          $height2: Float!,
          $height3: Float!,
          $height4: Float!,
          $height5: Float!,
          $height6: Float!,
          $height7: Float!,
          $height8: Float!,
          $height9: Float!,
          $height10: Float!,
          $height11: Float!,
          $height12: Float!,
          $height13: Float!,
          $height14: Float!,
          $height15: Float!,
          $height16: Float!,
          $height17: Float!,
          $height18: Float!,
          $height19: Float!,
          $height20: Float!) {
          tx_1: tx {
            byHeight(height: $height1) {
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
          tx_2: tx {
            byHeight(height: $height2) {
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
          tx_3: tx {
            byHeight(height: $height3) {
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
          tx_4: tx {
            byHeight(height: $height4) {
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
          tx_5: tx {
            byHeight(height: $height5) {
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
          tx_6: tx {
            byHeight(height: $height6) {
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
          tx_7: tx {
            byHeight(height: $height7) {
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
          tx_8: tx {
            byHeight(height: $height8) {
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
          tx_9: tx {
            byHeight(height: $height9) {
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
          tx_10: tx {
            byHeight(height: $height10) {
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
          tx_11: tx {
            byHeight(height: $height11) {
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
          tx_12: tx {
            byHeight(height: $height12) {
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
          tx_13: tx {
            byHeight(height: $height13) {
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
          tx_14: tx {
            byHeight(height: $height14) {
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
          tx_15: tx {
            byHeight(height: $height15) {
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
          tx_16: tx {
            byHeight(height: $height16) {
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
          tx_17: tx {
            byHeight(height: $height17) {
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
          tx_18: tx {
            byHeight(height: $height18) {
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
          tx_19: tx {
            byHeight(height: $height19) {
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
          tx_20: tx {
            byHeight(height: $height20) {
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
      {
        height1,
        height2,
        height3,
        height4,
        height5,
        height6,
        height7,
        height8,
        height9,
        height10,
        height11,
        height12,
        height13,
        height14,
        height15,
        height16,
        height17,
        height18,
        height19,
        height20
      }
    );

    let result = []
    result.push(response.tx_1.byHeight)
    result.push(response.tx_2.byHeight)
    result.push(response.tx_3.byHeight)
    result.push(response.tx_4.byHeight)
    result.push(response.tx_5.byHeight)
    result.push(response.tx_6.byHeight)
    result.push(response.tx_7.byHeight)
    result.push(response.tx_8.byHeight)
    result.push(response.tx_9.byHeight)
    result.push(response.tx_10.byHeight)
    result.push(response.tx_11.byHeight)
    result.push(response.tx_12.byHeight)
    result.push(response.tx_13.byHeight)
    result.push(response.tx_14.byHeight)
    result.push(response.tx_15.byHeight)
    result.push(response.tx_16.byHeight)
    result.push(response.tx_17.byHeight)
    result.push(response.tx_18.byHeight)
    result.push(response.tx_19.byHeight)
    result.push(response.tx_20.byHeight)


    return result
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
    return 2 * response?.wasm?.contractQuery?.assets[0]?.amount / 1000000

  } else if (response?.wasm?.contractQuery?.assets[1]?.info?.native_token?.denom == "uusd") {
    return 2 * response?.wasm?.contractQuery?.assets[1]?.amount / 1000000

  } else if (response?.wasm?.contractQuery?.assets[0]?.info?.native_token?.denom == "uluna") {
    const lunaPrice = await getLunaExchangeRate("uusd");
    return 2 * response?.wasm?.contractQuery?.assets[0]?.amount * lunaPrice / 1000000

  } else if (response?.wasm?.contractQuery?.assets[1]?.info?.native_token?.denom == "uluna") {
    const lunaPrice = await getLunaExchangeRate("uusd");
    return 2 * response?.wasm?.contractQuery?.assets[1]?.amount * lunaPrice / 1000000

  } else {
    console.log("Error getting pair liquidity for contract: " + address)
    return 0
  }


}