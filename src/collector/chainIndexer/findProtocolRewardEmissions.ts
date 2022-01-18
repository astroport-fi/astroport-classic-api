import { createWithdrawLogFinder } from "../logFinder";
import { PoolProtocolReward } from "../../models/pool_protocol_reward.model";

const GENERATOR_PROXY_CONTRACTS = new Map<string, any>([
  ["terra1v2wez00fyy8ajxgkh2jcx82haqfudvxcs5sdzr", {
    tokenName: "ANC",
    factory: "terra1h3mf22jm68ddueryuv2yxwfmqxxadvjceuaqz6",
    proxy: "terra1v2wez00fyy8ajxgkh2jcx82haqfudvxcs5sdzr",
    pool: "terra1qr2k6yjjd5p2kaewqvg93ag74k6gyjr7re37fs",
    token: "terra14z56l0fp2lsf86zy3hty2z47ezkhnthtr9yq76",
  }],
  ["terra1e5zw6ujvzcmmgh8rxlttddlk2t62j2lh5jtwe8", {
    tokenName: "APOLLO",
    factory: "terra1g7jjjkt5uvkjeyhp8ecdz4e4hvtn83sud3tmh2",
    proxy: "terra1e5zw6ujvzcmmgh8rxlttddlk2t62j2lh5jtwe8",
    pool: "terra1zpnhtf9h5s7ze2ewlqyer83sr4043qcq64zfc4",
    token: "terra100yeqvww74h4yaejj6h733thgcafdaukjtw397",
  }],
  ["terra15g9we4hs03zv5lkmkpm3gk6vr5tfq8c6egxss6", {
    tokenName: "MIR",
    factory: "terra17f7zu97865jmknk7p2glqvxzhduk78772ezac5",
    proxy: "terra15g9we4hs03zv5lkmkpm3gk6vr5tfq8c6egxss6",
    pool: "terra143xxfw5xf62d5m32k3t4eu9s82ccw80lcprzl9",
    token: "terra15gwkyepfc6xgca5t5zefzwy42uts8l2m4g40k6",
  }],
  ["terra12z0q65r2y3y56g970fghfderncf4a2nurta0sc", {
    tokenName: "ORION",
    factory: "terra1cw00274wlje5z8vtlrpaqx5cwj29c5a5ku2zhv",
    proxy: "terra12z0q65r2y3y56g970fghfderncf4a2nurta0sc",
    pool: "terra1mxyp5z27xxgmv70xpqjk7jvfq54as9dfzug74m",
    token: "terra1mddcdx0ujx89f38gu7zspk2r2ffdl5enyz2u03"
  }],
  ["terra1px6vx9uegszfycw9z75dfpmzqtwjtrpm20qck2", {
    tokenName: "VKR",
    factory: "terra1wjc6zd6ue5sqmyucdu8erxj5cdf783tqle6dja",
    proxy: "terra1px6vx9uegszfycw9z75dfpmzqtwjtrpm20qck2",
    pool: "terra15s2wgdeqhuc4gfg7sfjyaep5cch38mwtzmwqrx",
    token: "terra1dy9kmlm4anr92e42mrkjwzyvfqwz66un00rwr5"
  }],
  ["terra16pnm59kxmgnp9kv6ye3ejnpevfmzdlllx0pake", {
    tokenName: "STT",
    factory: "terra15p807wnm9q3dyw4rvfqsaukxqt6lkuqe62q3mp",
    proxy: "terra16pnm59kxmgnp9kv6ye3ejnpevfmzdlllx0pake",
    pool: "terra1m95udvvdame93kl6j2mk8d03kc982wqgr75jsr",
    token: "terra13xujxcrc9dqft4p9a8ls0w3j0xnzm6y2uvve8n",
  }],
  ["terra1wranc9ta64f0nwdyv842d7kdm7ae80kdl5tvne", {
    tokenName: "XDEFI",
    factory: "terra12vu0rxec60rwg82hlkwdjnqwxrladt00rpllzl",
    proxy: "terra1wranc9ta64f0nwdyv842d7kdm7ae80kdl5tvne",
    pool: "terra1476fucrvu5tuga2nx28r3fctd34xhksc2gckgf",
    token: "terra169edevav3pdrtjcx35j6pvzuv54aevewar4nlh"
  }]
])


export async function findProtocolRewardEmissions(
  event: any,
  height: number
): Promise<void> {

  const poolTotal = new Map<string, any>();

  for(const [key, value] of GENERATOR_PROXY_CONTRACTS.entries()) {
    const withdrawLogFinder = createWithdrawLogFinder(
      GENERATOR_PROXY_CONTRACTS,
      value.token,
      value.proxy,
      value.factory);

    const withdrawLogFound = withdrawLogFinder(event);

    if (withdrawLogFound) {
      console.log("withdraw log found")
      for (const found of withdrawLogFound) {
        const transformed = found.transformed

        if (transformed != null) {
          const rewardEntry = value
          rewardEntry.block = height
          if (poolTotal.has(key)) {
            rewardEntry.value = poolTotal.get(key) + transformed?.amount
            poolTotal.set(key, rewardEntry)
          } else {
            rewardEntry.value = transformed?.amount
            poolTotal.set(key, rewardEntry)
          }
        }
      }
    }
  }

  // save to db
  for (const [key, value] of poolTotal) {
    await PoolProtocolReward.create({
      pool: value.pool,
      factory: value.factory,
      proxy: value.proxy,
      token: value.token,
      tokenName: value.tokenName,
      block: height,
      volume: value.value
    })
  }
}
