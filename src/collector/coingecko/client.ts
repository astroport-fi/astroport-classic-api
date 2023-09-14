import axios from "axios";
import constants from "../../environment/constants";

export async function fetchExternalTokenPrice(source: string, address: string, currency: string) {
  const url = "https://pro-api.coingecko.com/api/v3/simple/token_price/" + source;

  if (!constants.COINGECKO_API_KEY || constants.COINGECKO_API_KEY === "injected-via-secrets") {
    return;
  }

  const params = {
    contract_addresses: address,
    vs_currencies: currency,
    x_cg_pro_api_key: constants.COINGECKO_API_KEY,
  };

  const data = await axios.get(url, { params }).then((response) => response.data);

  return data[address].usd;
}
