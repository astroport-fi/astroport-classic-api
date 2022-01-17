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
  const height21 = height + 20
  const height22 = height + 21
  const height23 = height + 22
  const height24 = height + 23
  const height25 = height + 24
  const height26 = height + 25
  const height27 = height + 26
  const height28 = height + 27
  const height29 = height + 28
  const height30 = height + 29
  const height31 = height + 30
  const height32 = height + 31
  const height33 = height + 32
  const height34 = height + 33
  const height35 = height + 34
  const height36 = height + 35
  const height37 = height + 36
  const height38 = height + 37
  const height39 = height + 38
  const height40 = height + 39

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
          $height20: Float!
          $height21: Float!,
          $height22: Float!,
          $height23: Float!,
          $height24: Float!,
          $height25: Float!,
          $height26: Float!,
          $height27: Float!,
          $height28: Float!,
          $height29: Float!,
          $height30: Float!
          $height31: Float!,
          $height32: Float!,
          $height33: Float!,
          $height34: Float!,
          $height35: Float!,
          $height36: Float!,
          $height37: Float!,
          $height38: Float!,
          $height39: Float!,
          $height40: Float!) {
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
          tx_21: tx {
            byHeight(height: $height21) {
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
          tx_22: tx {
            byHeight(height: $height22) {
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
          tx_23: tx {
            byHeight(height: $height23) {
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
          tx_24: tx {
            byHeight(height: $height24) {
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
          tx_25: tx {
            byHeight(height: $height25) {
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
          tx_26: tx {
            byHeight(height: $height26) {
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
          tx_27: tx {
            byHeight(height: $height27) {
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
          tx_28: tx {
            byHeight(height: $height28) {
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
          tx_29: tx {
            byHeight(height: $height29) {
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
          tx_30: tx {
            byHeight(height: $height30) {
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
          tx_31: tx {
            byHeight(height: $height31) {
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
          tx_32: tx {
            byHeight(height: $height32) {
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
          tx_33: tx {
            byHeight(height: $height33) {
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
          tx_34: tx {
            byHeight(height: $height34) {
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
          tx_35: tx {
            byHeight(height: $height35) {
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
          tx_36: tx {
            byHeight(height: $height36) {
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
          tx_37: tx {
            byHeight(height: $height37) {
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
          tx_38: tx {
            byHeight(height: $height38) {
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
          tx_39: tx {
            byHeight(height: $height39) {
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
          tx_40: tx {
            byHeight(height: $height40) {
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
        height20,
        height21,
        height22,
        height23,
        height24,
        height25,
        height26,
        height27,
        height28,
        height29,
        height30,
        height31,
        height32,
        height33,
        height34,
        height35,
        height36,
        height37,
        height38,
        height39,
        height40
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
    result.push(response.tx_21.byHeight)
    result.push(response.tx_22.byHeight)
    result.push(response.tx_23.byHeight)
    result.push(response.tx_24.byHeight)
    result.push(response.tx_25.byHeight)
    result.push(response.tx_26.byHeight)
    result.push(response.tx_27.byHeight)
    result.push(response.tx_28.byHeight)
    result.push(response.tx_29.byHeight)
    result.push(response.tx_30.byHeight)
    result.push(response.tx_31.byHeight)
    result.push(response.tx_32.byHeight)
    result.push(response.tx_33.byHeight)
    result.push(response.tx_34.byHeight)
    result.push(response.tx_35.byHeight)
    result.push(response.tx_36.byHeight)
    result.push(response.tx_37.byHeight)
    result.push(response.tx_38.byHeight)
    result.push(response.tx_39.byHeight)
    result.push(response.tx_40.byHeight)
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