export const DECIMALS = 6;
export const TERRA_LCD = process.env.TERRA_LCD as string;
export const TERRA_HIVE = process.env.TERRA_HIVE as string;
export const TERRA_MANTLE = process.env.TERRA_MANTLE as string;
export const TERRA_CHAIN_ID = process.env.TERRA_CHAIN_ID as string;
export const START_BLOCK_HEIGHT = Number(process.env.START_BLOCK_HEIGHT);
export const MONGODB_URL = process.env.MONGODB_URL as string;

// seed for wallet that calls maker contract
export const MAKER_FEE_COLLECTOR_SEED = process.env.TRIGGER_SEED as string
// trigger collect on this address
export const MAKER_CONTRACT = process.env.MAKER_CONTRACT as string

// governance
// seed for wallet that triggers governance state transitions
export const GOVERNANCE_TRIGGER_BOT_SEED = process.env.GOVERNANCE_TRIGGER_BOT_SEED as string
// trigger messages on this address
export const GOVERNANCE_ASSEMBLY = "terra1ujc6hpxcnq9kcq4e5qttf0z5cz2zykhwff2zm7" as string // TODO this is testnet, switch for prod gov deploy

// TODO delete these for prod once gov is shipped
export const GOV_XASTRO = "terra1yufp7cv85qrxrx56ulpfgstt2gxz905fgmysq0" as string
export const GOV_BUILDER_UNLOCK = "terra1hccg0cfrcu0nr4zgt5urmcgam9v88peg9s7h6j" as string
export const GOV_VXASTRO = "terra1pqr02fx4ulc2mzws7xlqh8hpwqx2ls5m4fk62j" as string

export const ASTRO_TOKEN = "terra1xj49zyqrwpv5k928jwfpfy2ha668nwdgkwlrg3" as string
export const XASTRO_TOKEN = "terra1cw7znqh9w5f2ryyskq76fmxhj9hdl06uv0j0cd"
export const BUILDER_UNLOCK = "terra1fh27l8h4s0tfx9ykqxq5efq4xx88f06x6clwmr"
export const MULTISIG = "terra1c7m6j8ya58a2fkkptn8fgudx8sqjqvc8azq0ex"
export const ASTRO_UST_PAIR = "terra1l7xu2rl3c7qmtx3r5sd2tz25glf6jh8ul7aag7"
export const VESTING_ADDRESS = "terra1hncazf652xa0gpcwupxfj6k4kl4k4qg64yzjyf"
export const GENERATOR_ADDRESS = "terra1zgrx9jjqrfye8swykfgmd6hpde60j0nszzupp9"
export const FACTORY_ADDRESS = "terra1fnywlw4edny3vw44x04xd67uzkdqluymgreu7g"
export const MAKER_ADDRESS = "terra12u7hcmpltazmmnq0fvyl225usn3fy6qqlp05w0" as string
export const XASTRO_STAKING_ADDRESS = "terra1nq4aszdm82wujstxwpjxtvckg7ghu63mqkey33" as string

export const BLOCKS_PER_YEAR = 4656810
export const BLOCKS_PER_DAY = BLOCKS_PER_YEAR / 365
export const SECONDS_PER_YEAR = 60*60*24*365

// maximum amount of blocks to collect during an indexer invocation
export const CHAIN_COLLECT_BATCH_SIZE = 150

export const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY as string;

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
  ["terra1edurrzv6hhd8u48engmydwhvz8qzmhhuakhwj3", "LDO"],
  ["terra19wauh79y42u5vt62c5adt2g5h4exgh26t3rpds", "MARS"]
])

// map pool -> factory/proxy/pool/token attributes
// used for native protocol rewards
export const GENERATOR_PROXY_CONTRACTS = new Map<string, any>([
  ["terra1qr2k6yjjd5p2kaewqvg93ag74k6gyjr7re37fs", {
    tokenName: "ANC",
    factory: "terra1h3mf22jm68ddueryuv2yxwfmqxxadvjceuaqz6", // from
    proxy: "terra1v2wez00fyy8ajxgkh2jcx82haqfudvxcs5sdzr", // to
    pool: "terra1qr2k6yjjd5p2kaewqvg93ag74k6gyjr7re37fs", // pool
    token: "terra14z56l0fp2lsf86zy3hty2z47ezkhnthtr9yq76", // what is sent
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
  }],
  ["terra19wauh79y42u5vt62c5adt2g5h4exgh26t3rpds", {
    tokenName: "Mars-UST",
    factory: "terra1gmggdadphqxua2kewcgn2l57xxteafpne50je0",
    proxy: "terra1aqehsnrdadp7s8exny69h5vln3llp38wttv0cr",
    pool: "terra19wauh79y42u5vt62c5adt2g5h4exgh26t3rpds",
    token: "terra12hgwnpupflfpuual532wgrxu2gjp0tcagzgx4n"
  }],
  ["terra13yftwgefkggq3u627gphq98s6ufwh9u85h5kmg", {
    tokenName: "Orne-UST",
    factory: "terra1z5uvpz8ny5tz2lng30ff0aqnm5uuvxaat6lwxm",
    proxy: "terra1dyuvfvjpuhqrmjly0xh3fhk207cyx8yrw2n736",
    pool: "terra13yftwgefkggq3u627gphq98s6ufwh9u85h5kmg",
    token: "terra1hnezwjqlhzawcrfysczcxs6xqxu2jawn729kkf"
  }],
  ["terra1repcset8dt8z9wm5s6x77n3sjg8hduem9tntd6", {
    tokenName: "wLDO-stLuna",
    factory: "terra10t8rn7swtkmkfm56mmxwmk2v9xrv78fljsd3ez",
    proxy: "terra1xf6dsqpqap3hczk9jd7938h5n8de8ap9ycxhvu",
    pool: "terra1repcset8dt8z9wm5s6x77n3sjg8hduem9tntd6",
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

/**
 * PoolCollect constants
 */
export const ASTRO_PAIR_ADDRESS = "terra1l7xu2rl3c7qmtx3r5sd2tz25glf6jh8ul7aag7"

// orion, wormhole
export const POOLS_WITH_8_DIGIT_REWARD_TOKENS = new Set<string>(
  [
    'terra1mxyp5z27xxgmv70xpqjk7jvfq54as9dfzug74m', // orion ust
    'terra1gxjjrer8mywt4020xdl5e5x7n6ncn6w38gjzae', // stLUNA luna
    'terra18dq84qfpz267xuu0k47066svuaez9hr4xvwlex', // stSOL ust
    'terra1edurrzv6hhd8u48engmydwhvz8qzmhhuakhwj3', // stETH ust
    'terra16jaryra6dgfvkd3gqr5tcpy3p2s37stpa9sk7s', // wAVAX luna
    'terra1tehmd65kyleuwuf3a362mhnupkpza29vd86sml', // wbWBNB luna
    'terra1m32zs8725j9jzvva7zmytzasj392wpss63j2v0', // weWETH luna
    'terra16e5tgdxre44gvmjuu3ulsa64kc6eku4972yjp3', // wsSOL luna
    'terra1wr07qcmfqz2vxhcfr6k8xv8eh5es7u9mv2z07x', // wMATIC luna
    // 'terra1cevdyd0gvta3h79uh5t47kk235rvn42gzf0450', // whUSDC UST
    'terra1szt6cq52akhmzcqw5jhkw3tvdjtl4kvyk3zkhx', // whBUSD UST
    // 'terra1qmxkqcgcgq8ch72k6kwu3ztz6fh8tx2xd76ws7', // avUSDC UST
    // 'terra1cc6kqk0yl25hdpr5llxmx62mlyfdl7n0rwl3hq', // soUSDC UST
    // 'terra1x0ulpvp6m46c5j7t40nj24mjp900954ys2jsnu', // weUSDC UST
    'terra1mv04l9m4xc6fntxnty265rsqpnn0nk8aq0c9ge', // wgOHM UST
    'terra1476fucrvu5tuga2nx28r3fctd34xhksc2gckgf',
    'terra1repcset8dt8z9wm5s6x77n3sjg8hduem9tntd6', // wLDO stLUNA
  ])

// pools that externally fetch rewards, like LDO for wormhole
export const EXTERNALLY_FETCHED_REWARDS = new Set<string>(
  [
    'terra1gxjjrer8mywt4020xdl5e5x7n6ncn6w38gjzae', // stluna luna
    'terra18dq84qfpz267xuu0k47066svuaez9hr4xvwlex', // stsol ust
    'terra1edurrzv6hhd8u48engmydwhvz8qzmhhuakhwj3'  // steth ust
  ])

// stableswap pools
export const STABLE_SWAP_POOLS = new Set<string>(
  [
    'terra1j66jatn3k50hjtg2xemnjm8s7y8dws9xqa5y8w', // bluna luna
    'terra1gxjjrer8mywt4020xdl5e5x7n6ncn6w38gjzae', // stluna luna
    'terra1cevdyd0gvta3h79uh5t47kk235rvn42gzf0450', // whUSDC UST
    'terra1szt6cq52akhmzcqw5jhkw3tvdjtl4kvyk3zkhx', // whBUSD ust
    'terra1qmxkqcgcgq8ch72k6kwu3ztz6fh8tx2xd76ws7', // avUSDC ust
    'terra1cc6kqk0yl25hdpr5llxmx62mlyfdl7n0rwl3hq', // soUSDC ust
    'terra1x0ulpvp6m46c5j7t40nj24mjp900954ys2jsnu', // weUSDC ust
    'terra1qswfc7hmmsnwf7f2nyyx843sug60urnqgz75zu', // Luna LunaX
  ])

// tokens that have 8 digits
// TODO this should be picked up from create_pair
export const TOKENS_WITH_8_DIGITS = new Set<string>(
  [
    'terra1mddcdx0ujx89f38gu7zspk2r2ffdl5enyz2u03', // orion
    'terra1hj8de24c3yqvcsv9r8chr03fzwsak3hgd8gv3m', // wavax
    'terra1cetg5wruw2wsdjp7j46rj44xdel00z006e9yg8', // wbnb
    'terra14tl83xcwqjy0ken9peu4pjjuu755lrry2uy25r', // weth
    'terra190tqwgqx7s8qrknz6kckct7v607cu068gfujpk', // sol
    'terra1dtqlfecglk47yplfrtwjzyagkgcqqngd5lgjp8', // wmatic
    'terra169edevav3pdrtjcx35j6pvzuv54aevewar4nlh', // xdefi
    'terra1skjr69exm6v8zellgjpaa2emhwutrk5a6dz7dd', // busd
    'terra1t9ul45l7m6jw6sxgvnp8e5hj8xzkjsg82g84ap', // stsol
    'terra133chr09wu8sakfte5v7vd8qzq9vghtkv4tn0ur', // wsteth
    'terra1fpfn2kkr8mv390wx4dtpfk3vkjx9ch3thvykl3', // gohm
    'terra1jxypgnfa07j6w92wazzyskhreq2ey2a5crgt6z'  // wLDO
  ]
)

export interface CoingeckoValues {
  source: string
  address: string
  currency: string
}
// map CW20 address -> coingecko attributes
export const EXTERNAL_TOKENS = new Map<string, CoingeckoValues>([
  [
    "terra1jxypgnfa07j6w92wazzyskhreq2ey2a5crgt6z", // LDO
    {
      source: "ethereum",
      address: "0x5a98fcbea516cf06857215779fd812ca3bef1b32",
      currency: "USD",
    },
  ],
  [
    "terra1xfsdgcemqwxp4hhnyk4rle6wr22sseq7j07dnn", // KUJI
    {
      source: "terra",
      address: "terra1xfsdgcemqwxp4hhnyk4rle6wr22sseq7j07dnn",
      currency: "USD",
    },
  ],
])

// temporary pair whitelist for prices/pools until we
// improve performance
export const PAIRS_WHITELIST = new Set<string>([
  "terra1m6ywlgn6wrjuagcmmezzz2a029gtldhey5k552",
  "terra1qr2k6yjjd5p2kaewqvg93ag74k6gyjr7re37fs",
  "terra143xxfw5xf62d5m32k3t4eu9s82ccw80lcprzl9",
  "terra1mxyp5z27xxgmv70xpqjk7jvfq54as9dfzug74m",
  "terra1m95udvvdame93kl6j2mk8d03kc982wqgr75jsr",
  "terra15s2wgdeqhuc4gfg7sfjyaep5cch38mwtzmwqrx",
  "terra134m8n2epp0n40qr08qsvvrzycn2zq4zcpmue48",
  "terra1v5ct2tuhfqd0tf8z0wwengh4fg77kaczgf6gtx",
  "terra1zpnhtf9h5s7ze2ewlqyer83sr4043qcq64zfc4",
  "terra1j66jatn3k50hjtg2xemnjm8s7y8dws9xqa5y8w",
  "terra1l7xu2rl3c7qmtx3r5sd2tz25glf6jh8ul7aag7",
  "terra1rhk92dvz3tjayymy8pl08gpkmamnud7ttzc03h",
  "terra1nujm9zqa4hpaz9s8wrhrp86h3m9xwprjt9kmf9",
  "terra16jaryra6dgfvkd3gqr5tcpy3p2s37stpa9sk7s",
  "terra1tehmd65kyleuwuf3a362mhnupkpza29vd86sml",
  "terra1m32zs8725j9jzvva7zmytzasj392wpss63j2v0",
  "terra16e5tgdxre44gvmjuu3ulsa64kc6eku4972yjp3",
  "terra1wr07qcmfqz2vxhcfr6k8xv8eh5es7u9mv2z07x",
  "terra1476fucrvu5tuga2nx28r3fctd34xhksc2gckgf",
  "terra18hjdxnnkv8ewqlaqj3zpn0vsfpzdt3d0y2ufdz",
  "terra10lv5wz84kpwxys7jeqkfxx299drs3vnw0lj8mz",
  "terra1x0ulpvp6m46c5j7t40nj24mjp900954ys2jsnu",
  "terra1cc6kqk0yl25hdpr5llxmx62mlyfdl7n0rwl3hq",
  "terra1qmxkqcgcgq8ch72k6kwu3ztz6fh8tx2xd76ws7",
  "terra1szt6cq52akhmzcqw5jhkw3tvdjtl4kvyk3zkhx",
  "terra1cevdyd0gvta3h79uh5t47kk235rvn42gzf0450",
  "terra1gxjjrer8mywt4020xdl5e5x7n6ncn6w38gjzae",
  "terra18dq84qfpz267xuu0k47066svuaez9hr4xvwlex",
  "terra1edurrzv6hhd8u48engmydwhvz8qzmhhuakhwj3",
  "terra1mv04l9m4xc6fntxnty265rsqpnn0nk8aq0c9ge",
  "terra13yftwgefkggq3u627gphq98s6ufwh9u85h5kmg",
  "terra1shgwa4xwdegsxvtr0qaergjq689sakzvn87fvy",
  "terra1qswfc7hmmsnwf7f2nyyx843sug60urnqgz75zu",
  "terra1lnr6aacxfng34m69076s2mdfjzt8nev2p6z5q0",
  "terra1296jw27cq8svlg4ywm8t84u448p3zs7mcqg9ra",
  "terra124yter7w9e5mf6m843erql48xy5szsxd75zjxw",
  "terra1092tamrn3w8j7qp0uu2ltml7sjts7z9hkj2wga",
  "terra143az0w2e504n56q7k43qyh2fu69fh3rhup32n3",
  "terra19wauh79y42u5vt62c5adt2g5h4exgh26t3rpds", // Mars UST
  "terra1z7634s8kyyvjjuv7lcgkfy49hamxssxq9f9xw6", // Lota UST
  "terra1qswfc7hmmsnwf7f2nyyx843sug60urnqgz75zu", // Luna LunaX
  "terra13yftwgefkggq3u627gphq98s6ufwh9u85h5kmg", // Orne UST
  "terra1repcset8dt8z9wm5s6x77n3sjg8hduem9tntd6"  // wLDO stLuna
]);