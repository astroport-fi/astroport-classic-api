export enum Pools {
  MINE_UST = "terra134m8n2epp0n40qr08qsvvrzycn2zq4zcpmue48",
  ANC_USDT = "terra1qr2k6yjjd5p2kaewqvg93ag74k6gyjr7re37fs",
  STLUNA_LUNA = "terra1gxjjrer8mywt4020xdl5e5x7n6ncn6w38gjzae",
  MIR_UST = "terra143xxfw5xf62d5m32k3t4eu9s82ccw80lcprzl9",
  MARS_UST = "terra19wauh79y42u5vt62c5adt2g5h4exgh26t3rpds",
  STT_UST = "terra1m95udvvdame93kl6j2mk8d03kc982wqgr75jsr",
  PSI_UST = "terra1v5ct2tuhfqd0tf8z0wwengh4fg77kaczgf6gtx",
  VKR_UST = "terra15s2wgdeqhuc4gfg7sfjyaep5cch38mwtzmwqrx",
  PSI_NLUNA = "terra1v5ct2tuhfqd0tf8z0wwengh4fg77kaczgf6gtx",
}

export enum StakingContract {
  ANC_UST = "terra1h3mf22jm68ddueryuv2yxwfmqxxadvjceuaqz6",
  APOLLO_UST = "terra1g7jjjkt5uvkjeyhp8ecdz4e4hvtn83sud3tmh2",
  MIR_UST = "terra17f7zu97865jmknk7p2glqvxzhduk78772ezac5",
  ORION_UST = "terra1cw00274wlje5z8vtlrpaqx5cwj29c5a5ku2zhv",
  VKR_UST = "terra1wjc6zd6ue5sqmyucdu8erxj5cdf783tqle6dja",
  STT_UST = "terra15p807wnm9q3dyw4rvfqsaukxqt6lkuqe62q3mp",
  XDEFI_UST = "terra12vu0rxec60rwg82hlkwdjnqwxrladt00rpllzl",
  PSI_nLUNA = "terra1sxzggeujnxrd7hsx7uf2l6axh2uuv4zz5jadyg",
  PSI_nETH = "terra13n2sqaj25ugkt79k3evhvua30ut9qt8q0268zc",
  PSI_UST = "terra1fmu29xhg5nk8jr0p603y5qugpk2r0ywcyxyv7k",
  MINE_UST = "terra19nek85kaqrvzlxygw20jhy08h3ryjf5kg4ep3l",
  stLUNA_LUNA = "terra1r2ucpn7j8qcgvsvkzxr3x0698megrn2kn9nfwq",
  stSOL_UST = "terra188xjhn8h39ert7ezs0m2dlgsqd4vf6k6hmv4jw",
  stETH_UST = "terra1za0ltkcxjpvfw8wnwhetj5mr5r05pl6dgy936g",
  MARS_UST = "terra1gmggdadphqxua2kewcgn2l57xxteafpne50je0",
  ORNE_UST = "terra1z5uvpz8ny5tz2lng30ff0aqnm5uuvxaat6lwxm",
  wLDO_stLUNA = "terra10t8rn7swtkmkfm56mmxwmk2v9xrv78fljsd3ez",
  SAYVE_UST = "terra1tyjfrx40kgpmf6mq2kyv6njgg59fxpv7pk8dhd",
}

export enum ScheduleType {
  UnixTime = "unix",
  Block = "block",
}

export type Schedules = {
  type: ScheduleType;
  values: [number, number, string][];
};
