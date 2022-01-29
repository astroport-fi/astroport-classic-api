import axios from "axios";


export async function getTokenPrice(source: string, address: string, currency: string) {
  const url = "https://api.coingecko.com/api/v3/simple/token_price/" + source + "?contract_addresses=" + address + "&vs_currencies=" + currency
  const data = await axios
    .get(url)
    .then((response) =>  response.data)

  return data[address].usd

}



