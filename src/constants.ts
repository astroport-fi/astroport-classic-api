export const DECIMALS = 6;
export const TERRA_LCD = process.env.TERRA_LCD as string;
export const TERRA_HIVE = process.env.TERRA_HIVE as string;
export const TERRA_MANTLE = process.env.TERRA_MANTLE as string;
export const TERRA_CHAIN_ID = process.env.TERRA_CHAIN_ID as string;
export const START_BLOCK_HEIGHT = Number(process.env.START_BLOCK_HEIGHT);
export const MONGODB_URL = process.env.MONGODB_URL;

export const ASTRO_TOKEN = process.env.ASTRO_TOKEN as string;
export const XASTRO_TOKEN = process.env.XASTRO_TOKEN as string;

export const BUILDER_UNLOCK = process.env.ASTRO_BUILDER_UNLOCK_CONTRACT as string;
export const MULTISIG = process.env.ASTRO_MULTISIG as string;
export const ASTRO_UST_PAIR = process.env.ASTRO_UST_PAIR as string;
export const VESTING_ADDRESS = process.env.ASTRO_VESTING_ADDRESS as string;
export const GENERATOR_ADDRESS = process.env.ASTRO_GENERATOR_ADDRESS as string;

export const BLOCKS_PER_YEAR = 4656810
export const BLOCKS_PER_DAY = BLOCKS_PER_YEAR / 365

// TODO - switch to table
// map pair address to token abbreviation
// used for protocol rewards
export const TOKEN_ADDRESS_MAP = new Map<string, string>([
  ["terra1qr2k6yjjd5p2kaewqvg93ag74k6gyjr7re37fs", "ANC"],
  ["terra1zpnhtf9h5s7ze2ewlqyer83sr4043qcq64zfc4", "APOLLO"],
  ["terra143xxfw5xf62d5m32k3t4eu9s82ccw80lcprzl9", "MIR"],
  ["terra1mxyp5z27xxgmv70xpqjk7jvfq54as9dfzug74m", "ORION"],
  ["terra15s2wgdeqhuc4gfg7sfjyaep5cch38mwtzmwqrx", "VKR"],
  ["terra1m95udvvdame93kl6j2mk8d03kc982wqgr75jsr", "STT"],
  ["terra1476fucrvu5tuga2nx28r3fctd34xhksc2gckgf", "XDEFI"],
  ["terra10lv5wz84kpwxys7jeqkfxx299drs3vnw0lj8mz", "PSI"],
  ["terra18hjdxnnkv8ewqlaqj3zpn0vsfpzdt3d0y2ufdz", "PSI"],
  ["terra1v5ct2tuhfqd0tf8z0wwengh4fg77kaczgf6gtx", "PSI"],
  ["terra134m8n2epp0n40qr08qsvvrzycn2zq4zcpmue48", "MINE"],
  ["terra1gxjjrer8mywt4020xdl5e5x7n6ncn6w38gjzae", "LDO"],
  ["terra18dq84qfpz267xuu0k47066svuaez9hr4xvwlex", "LDO"],
  ["terra1edurrzv6hhd8u48engmydwhvz8qzmhhuakhwj3", "LDO"]
])

// map pool -> factory/proxy/pool/token attributes
// used for native protocol rewards
export const GENERATOR_PROXY_CONTRACTS = new Map<string, any>([
  ["terra1qr2k6yjjd5p2kaewqvg93ag74k6gyjr7re37fs", {
    tokenName: "ANC",
    factory: "terra1h3mf22jm68ddueryuv2yxwfmqxxadvjceuaqz6",
    proxy: "terra1v2wez00fyy8ajxgkh2jcx82haqfudvxcs5sdzr",
    pool: "terra1qr2k6yjjd5p2kaewqvg93ag74k6gyjr7re37fs",
    token: "terra14z56l0fp2lsf86zy3hty2z47ezkhnthtr9yq76",
  }],
  ["terra1zpnhtf9h5s7ze2ewlqyer83sr4043qcq64zfc4", {
    tokenName: "APOLLO",
    factory: "terra1g7jjjkt5uvkjeyhp8ecdz4e4hvtn83sud3tmh2",
    proxy: "terra1e5zw6ujvzcmmgh8rxlttddlk2t62j2lh5jtwe8",
    pool: "terra1zpnhtf9h5s7ze2ewlqyer83sr4043qcq64zfc4",
    token: "terra100yeqvww74h4yaejj6h733thgcafdaukjtw397",
  }],
  ["terra143xxfw5xf62d5m32k3t4eu9s82ccw80lcprzl9", {
    tokenName: "MIR",
    factory: "terra17f7zu97865jmknk7p2glqvxzhduk78772ezac5",
    proxy: "terra15g9we4hs03zv5lkmkpm3gk6vr5tfq8c6egxss6",
    pool: "terra143xxfw5xf62d5m32k3t4eu9s82ccw80lcprzl9",
    token: "terra15gwkyepfc6xgca5t5zefzwy42uts8l2m4g40k6",
  }],
  ["terra1mxyp5z27xxgmv70xpqjk7jvfq54as9dfzug74m", {
    tokenName: "ORION",
    factory: "terra1cw00274wlje5z8vtlrpaqx5cwj29c5a5ku2zhv",
    proxy: "terra12z0q65r2y3y56g970fghfderncf4a2nurta0sc",
    pool: "terra1mxyp5z27xxgmv70xpqjk7jvfq54as9dfzug74m",
    token: "terra1mddcdx0ujx89f38gu7zspk2r2ffdl5enyz2u03"
  }],
  ["terra15s2wgdeqhuc4gfg7sfjyaep5cch38mwtzmwqrx", {
    tokenName: "VKR",
    factory: "terra1wjc6zd6ue5sqmyucdu8erxj5cdf783tqle6dja",
    proxy: "terra1px6vx9uegszfycw9z75dfpmzqtwjtrpm20qck2",
    pool: "terra15s2wgdeqhuc4gfg7sfjyaep5cch38mwtzmwqrx",
    token: "terra1dy9kmlm4anr92e42mrkjwzyvfqwz66un00rwr5"
  }],
  ["terra1m95udvvdame93kl6j2mk8d03kc982wqgr75jsr", {
    tokenName: "STT",
    factory: "terra15p807wnm9q3dyw4rvfqsaukxqt6lkuqe62q3mp",
    proxy: "terra16pnm59kxmgnp9kv6ye3ejnpevfmzdlllx0pake",
    pool: "terra1m95udvvdame93kl6j2mk8d03kc982wqgr75jsr",
    token: "terra13xujxcrc9dqft4p9a8ls0w3j0xnzm6y2uvve8n",
  }],
  ["terra1476fucrvu5tuga2nx28r3fctd34xhksc2gckgf", {
    tokenName: "XDEFI",
    factory: "terra12vu0rxec60rwg82hlkwdjnqwxrladt00rpllzl",
    proxy: "terra1wranc9ta64f0nwdyv842d7kdm7ae80kdl5tvne",
    pool: "terra1476fucrvu5tuga2nx28r3fctd34xhksc2gckgf",
    token: "terra169edevav3pdrtjcx35j6pvzuv54aevewar4nlh"
  }],
  ["terra10lv5wz84kpwxys7jeqkfxx299drs3vnw0lj8mz", {
    tokenName: "PSI-nLUNA",
    factory: "terra1sxzggeujnxrd7hsx7uf2l6axh2uuv4zz5jadyg",
    proxy: "terra17jm985ql5plu8ytakpfz6kjyag87m9f3l3aqfn",
    pool: "terra10lv5wz84kpwxys7jeqkfxx299drs3vnw0lj8mz",
    token: "terra12897djskt9rge8dtmm86w654g7kzckkd698608"
  }],
  ["terra18hjdxnnkv8ewqlaqj3zpn0vsfpzdt3d0y2ufdz", {
    tokenName: "PSI-nETH",
    factory: "terra13n2sqaj25ugkt79k3evhvua30ut9qt8q0268zc",
    proxy: "terra14fjehqxs03mad28tflkk7lqdru64h9cdsdm923",
    pool: "terra18hjdxnnkv8ewqlaqj3zpn0vsfpzdt3d0y2ufdz",
    token: "terra12897djskt9rge8dtmm86w654g7kzckkd698608"
  }],
  ["terra1v5ct2tuhfqd0tf8z0wwengh4fg77kaczgf6gtx", {
    tokenName: "PSI-UST",
    factory: "terra1fmu29xhg5nk8jr0p603y5qugpk2r0ywcyxyv7k",
    proxy: "terra1vtqv4j5v04x5ka5f84v9zuvt604u2rsqhjnpk8",
    pool: "terra1v5ct2tuhfqd0tf8z0wwengh4fg77kaczgf6gtx",
    token: "terra12897djskt9rge8dtmm86w654g7kzckkd698608"
  }],
  ["terra134m8n2epp0n40qr08qsvvrzycn2zq4zcpmue48", {
    tokenName: "MINE-UST",
    factory: "terra19nek85kaqrvzlxygw20jhy08h3ryjf5kg4ep3l",
    proxy: "terra1gty5d3hmegmrzu7uyrrm6mcksus5cumkrxxg0z",
    pool: "terra134m8n2epp0n40qr08qsvvrzycn2zq4zcpmue48",
    token: "terra1kcthelkax4j9x8d3ny6sdag0qmxxynl3qtcrpy"
  }],
  ["terra1gxjjrer8mywt4020xdl5e5x7n6ncn6w38gjzae", {
    tokenName: "stLUNA-LUNA",
    factory: "terra1r2ucpn7j8qcgvsvkzxr3x0698megrn2kn9nfwq",
    proxy: "terra1hzkn3wr8qhmml6yu575tlz48j2lhgdahvx2ruk",
    pool: "terra1gxjjrer8mywt4020xdl5e5x7n6ncn6w38gjzae",
    token: "terra1jxypgnfa07j6w92wazzyskhreq2ey2a5crgt6z"
  }],
  ["terra18dq84qfpz267xuu0k47066svuaez9hr4xvwlex", {
    tokenName: "stSOL-UST",
    factory: "terra188xjhn8h39ert7ezs0m2dlgsqd4vf6k6hmv4jw",
    proxy: "terra19ganxu5n5xghz0ftp6jfczl5yf38yryctprmd2",
    pool: "terra18dq84qfpz267xuu0k47066svuaez9hr4xvwlex",
    token: "terra1jxypgnfa07j6w92wazzyskhreq2ey2a5crgt6z"
  }],
  ["terra1edurrzv6hhd8u48engmydwhvz8qzmhhuakhwj3", {
    tokenName: "stETH-UST",
    factory: "terra1za0ltkcxjpvfw8wnwhetj5mr5r05pl6dgy936g",
    proxy: "terra15re9z6l28vf4dfeu8zyfe8ax8cvjdxkfnmuwne",
    pool: "terra1edurrzv6hhd8u48engmydwhvz8qzmhhuakhwj3",
    token: "terra1jxypgnfa07j6w92wazzyskhreq2ey2a5crgt6z"
  }]
])


// TODO get from pair registration
// fees basis points.  30 = 0.3%, 5 = 0.05%
export const FEES = new Map<string, number>([
  ["xyk", 20],
  ["stable", 2.5]
]);

// TODO get from contract
// map pair address to yearly emissions for year 1
export const ASTRO_YEARLY_EMISSIONS = new Map<string, number>([
  ["terra1j66jatn3k50hjtg2xemnjm8s7y8dws9xqa5y8w", 25000000], // bluna luna
  ["terra1l7xu2rl3c7qmtx3r5sd2tz25glf6jh8ul7aag7", 15000000], // astro ust
  ["terra1m6ywlgn6wrjuagcmmezzz2a029gtldhey5k552", 13000000], // luna ust
  ["terra1qr2k6yjjd5p2kaewqvg93ag74k6gyjr7re37fs", 10444444], // anc ust
  ["terra1gxjjrer8mywt4020xdl5e5x7n6ncn6w38gjzae", 9400000], // stluna luna
  ["terra134m8n2epp0n40qr08qsvvrzycn2zq4zcpmue48", 3655556], // mine ust
  ["terra143xxfw5xf62d5m32k3t4eu9s82ccw80lcprzl9", 3394444], // mir ust
  ["terra1m95udvvdame93kl6j2mk8d03kc982wqgr75jsr", 3394444], // stt ust
  ["terra1mxyp5z27xxgmv70xpqjk7jvfq54as9dfzug74m", 2611111], // orion ust
  ["terra1v5ct2tuhfqd0tf8z0wwengh4fg77kaczgf6gtx", 2350000], // psi ust
  ["terra1zpnhtf9h5s7ze2ewlqyer83sr4043qcq64zfc4", 1827778], // apollo ust
  ["terra15s2wgdeqhuc4gfg7sfjyaep5cch38mwtzmwqrx", 1827778], // vkr ust
  ["terra1476fucrvu5tuga2nx28r3fctd34xhksc2gckgf", 1566667], // xdefi ust
  ["terra10lv5wz84kpwxys7jeqkfxx299drs3vnw0lj8mz", 1827778], // nluna psi
  ["terra18hjdxnnkv8ewqlaqj3zpn0vsfpzdt3d0y2ufdz", 1566667], // neth psi
  ["terra1edurrzv6hhd8u48engmydwhvz8qzmhhuakhwj3", 1566667], // steth ust
  ["terra18dq84qfpz267xuu0k47066svuaez9hr4xvwlex", 1566667], // stsol ust
]);