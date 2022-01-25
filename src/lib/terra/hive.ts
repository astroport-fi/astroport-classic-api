import { GraphQLClient, gql } from "graphql-request";

export let hive: GraphQLClient;

const PSI_TOKEN = "terra12897djskt9rge8dtmm86w654g7kzckkd698608" as string;

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

  // TODO this must change to use prices

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

  } else if (response?.wasm?.contractQuery?.assets[0]?.info?.token?.contract_addr == PSI_TOKEN) {
    const psiPrice = await getPsiExchangeRate();
    return 2 * response?.wasm?.contractQuery?.assets[0]?.amount * psiPrice / 1000000

  } else if (response?.wasm?.contractQuery?.assets[1]?.info?.token?.contract_addr == PSI_TOKEN) {
    const psiPrice = await getPsiExchangeRate();
    return 2 * response?.wasm?.contractQuery?.assets[1]?.amount * psiPrice / 1000000

  } else {
    console.log("Error getting pair liquidity for contract: " + address)
    return 0
  }


}