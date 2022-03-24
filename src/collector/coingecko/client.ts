import axios from "axios";
import { COINGECKO_API_KEY } from "../../constants";

export async function fetchExternalTokenPrice(source: string, address: string, currency: string) {
  const url = "https://pro-api.coingecko.com/api/v3/simple/token_price/" + source;

  const params = {
    contract_addresses: address,
    vs_currencies: currency,
    x_cg_pro_api_key: COINGECKO_API_KEY,
  };

  const data = await axios.get(url, { params }).then((response) => response.data);

  return data[address].usd;
}
