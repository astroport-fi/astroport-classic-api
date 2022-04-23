import { CoingeckoValues } from "../types/coingecko_values.type";

/**
 * DevelopmentEnvironment defines constants to be used as the base setup,
 * specifically for development
 */
export class DevelopmentEnvironment {
  /**
   * From .env
   */
  COINGECKO_API_KEY = process.env.COINGECKO_API_KEY as string;
  MONGODB_URL = process.env.MONGODB_URL as string;
  MONGODB_URL_R = process.env.MONGODB_URL_R as string;
  MONGODB_URL_RW = process.env.MONGODB_URL_RW as string;

  // Seed for wallet that calls maker contract
  MAKER_FEE_COLLECTOR_SEED = process.env.MAKER_FEE_COLLECTOR_SEED as string;
  // Seed for wallet that triggers governance state transitions
  GOVERNANCE_TRIGGER_BOT_SEED = process.env.GOVERNANCE_TRIGGER_BOT_SEED as string;

  /**
   * Operational constants
   */

  // Indexer start
  START_BLOCK_HEIGHT = 5968589;

  // Chain config
  TERRA_CHAIN_ID = "columbus-5";
  TERRA_LCD_ENDPOINT = "https://lcd-terra.everstake.one/";
  TERRA_HIVE_ENDPOINT = "https://hive-terra.everstake.one/graphql";
  // Maximum amount of blocks to collect during an indexer invocation
  CHAIN_COLLECT_BATCH_SIZE = 150;
  // Whether to notify Slack when a fee swap happens
  ENABLE_FEE_SWAP_NOTIFICATION = "false";
  ENABLE_DEBUG: boolean = true;
  ENABLE_GRAPHQL_INTROSPECTION: boolean = true;

  /**
   * Time constants
   */
  BLOCKS_PER_YEAR = 5256000; // assumes 6s block times
  BLOCKS_PER_DAY = this.BLOCKS_PER_YEAR / 365;
  SECONDS_PER_YEAR = 60 * 60 * 24 * 365;

  /**
   * Astroport specific
   */

  // TODO get from pair registration
  // fees basis points.  30 = 0.3%, 5 = 0.05%
  FEES = new Map<string, number>([
    ["xyk", 20],
    ["stable", 2.5],
  ]);

  // trigger collect on this address
  MAKER_CONTRACT = "terra14906rw2kyu50cdw25x0uymkrlqtgqxjemdfd0n";

  // Governance
  // Trigger messages on this address
  GOVERNANCE_ASSEMBLY = "terra109039nj38vnzyryqvcjctdh33r4qlq5dmrzqn0";

  // Governance addresses
  GOV_XASTRO = "terra1yufp7cv85qrxrx56ulpfgstt2gxz905fgmysq0" as string;
  GOV_BUILDER_UNLOCK = "terra1hccg0cfrcu0nr4zgt5urmcgam9v88peg9s7h6j" as string;
  GOV_VXASTRO = "terra1pqr02fx4ulc2mzws7xlqh8hpwqx2ls5m4fk62j" as string;

  // Astroport tokens
  ASTRO_TOKEN = "terra1xj49zyqrwpv5k928jwfpfy2ha668nwdgkwlrg3" as string;
  XASTRO_TOKEN = "terra14lpnyzc9z4g3ugr4lhm8s4nle0tq8vcltkhzh7" as string;
  VXASTRO_TOKEN = null;

  // Astroport contracts
  BUILDER_UNLOCK = "terra1fh27l8h4s0tfx9ykqxq5efq4xx88f06x6clwmr" as string;
  MULTISIG = "terra1c7m6j8ya58a2fkkptn8fgudx8sqjqvc8azq0ex" as string;
  ASSEMBLY_TREASURY = "terra16m3runusa9csfev7ymj62e8lnswu8um29k5zky" as string;
  ASTRO_UST_PAIR = "terra1l7xu2rl3c7qmtx3r5sd2tz25glf6jh8ul7aag7" as string;
  VESTING_ADDRESS = "terra1hncazf652xa0gpcwupxfj6k4kl4k4qg64yzjyf" as string;

  FACTORY_ADDRESS = "terra1fnywlw4edny3vw44x04xd67uzkdqluymgreu7g" as string;
  MAKER_ADDRESS = "terra12u7hcmpltazmmnq0fvyl225usn3fy6qqlp05w0" as string;
  XASTRO_STAKING_ADDRESS = "terra1f68wt2ch3cx2g62dxtc8v68mkdh5wchdgdjwz7" as string;

  GENERATOR_ADDRESS = "terra1zgrx9jjqrfye8swykfgmd6hpde60j0nszzupp9" as string;
  BLUNA_PAIR_CONTRACT = "terra1esle9h9cjeavul53dqqws047fpwdhj6tynj5u4" as string;
  LOCKDROP_CONTRACT = "terra1dd9kewme9pwhurvlzuvvljq5ukecft9axyej42" as string;
  BLUNA_TERRASWAP_LP_CONTRACT = "terra1tj4pavqjqjfm0wh73sh7yy9m4uq3m2cpmgva6n" as string;

  /**
   * Currency constants
   */
  DECIMALS = 6;

  // TODO - switch to table
  // map pair address to token abbreviation
  // used for protocol rewards
  TOKEN_ADDRESS_MAP = new Map<string, string>([
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
    ["terra1repcset8dt8z9wm5s6x77n3sjg8hduem9tntd6", "LDO"],
    ["terra19wauh79y42u5vt62c5adt2g5h4exgh26t3rpds", "MARS"],
    ["terra13yftwgefkggq3u627gphq98s6ufwh9u85h5kmg", "ORNE"],
    ["terra1k8lvj3w7dxzd6zlyptcj086gfwms422xkqjmzx", "SAYVE"],
  ]);

  // tokens that have 8 digits
  // TODO this should be picked up from create_pair
  TOKENS_WITH_8_DIGITS = new Set<string>([
    "terra1mddcdx0ujx89f38gu7zspk2r2ffdl5enyz2u03", // orion
    "terra1hj8de24c3yqvcsv9r8chr03fzwsak3hgd8gv3m", // wavax
    "terra1cetg5wruw2wsdjp7j46rj44xdel00z006e9yg8", // wbnb
    "terra14tl83xcwqjy0ken9peu4pjjuu755lrry2uy25r", // weth
    "terra190tqwgqx7s8qrknz6kckct7v607cu068gfujpk", // sol
    "terra1dtqlfecglk47yplfrtwjzyagkgcqqngd5lgjp8", // wmatic
    "terra169edevav3pdrtjcx35j6pvzuv54aevewar4nlh", // xdefi
    "terra1skjr69exm6v8zellgjpaa2emhwutrk5a6dz7dd", // busd
    "terra1t9ul45l7m6jw6sxgvnp8e5hj8xzkjsg82g84ap", // stsol
    "terra133chr09wu8sakfte5v7vd8qzq9vghtkv4tn0ur", // wsteth
    "terra1fpfn2kkr8mv390wx4dtpfk3vkjx9ch3thvykl3", // gohm
    "terra1jxypgnfa07j6w92wazzyskhreq2ey2a5crgt6z", // wLDO
    "terra1z3e2e4jpk4n0xzzwlkgcfvc95pc5ldq0xcny58", // wasAVAX
  ]);

  // map CW20 address -> coingecko attributes
  EXTERNAL_TOKENS = new Map<string, CoingeckoValues>([
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
  ]);

  /**
   * PoolCollect constants
   */

  // orion, wormhole
  POOLS_WITH_8_DIGIT_REWARD_TOKENS = new Set<string>([
    "terra1mxyp5z27xxgmv70xpqjk7jvfq54as9dfzug74m", // orion ust
    "terra1gxjjrer8mywt4020xdl5e5x7n6ncn6w38gjzae", // stLUNA luna
    "terra18dq84qfpz267xuu0k47066svuaez9hr4xvwlex", // stSOL ust
    "terra1edurrzv6hhd8u48engmydwhvz8qzmhhuakhwj3", // stETH ust
    "terra16jaryra6dgfvkd3gqr5tcpy3p2s37stpa9sk7s", // wAVAX luna
    "terra1tehmd65kyleuwuf3a362mhnupkpza29vd86sml", // wbWBNB luna
    "terra1m32zs8725j9jzvva7zmytzasj392wpss63j2v0", // weWETH luna
    "terra16e5tgdxre44gvmjuu3ulsa64kc6eku4972yjp3", // wsSOL luna
    "terra1wr07qcmfqz2vxhcfr6k8xv8eh5es7u9mv2z07x", // wMATIC luna
    // 'terra1cevdyd0gvta3h79uh5t47kk235rvn42gzf0450', // whUSDC UST
    "terra1szt6cq52akhmzcqw5jhkw3tvdjtl4kvyk3zkhx", // whBUSD UST
    // 'terra1qmxkqcgcgq8ch72k6kwu3ztz6fh8tx2xd76ws7', // avUSDC UST
    // 'terra1cc6kqk0yl25hdpr5llxmx62mlyfdl7n0rwl3hq', // soUSDC UST
    // 'terra1x0ulpvp6m46c5j7t40nj24mjp900954ys2jsnu', // weUSDC UST
    "terra1mv04l9m4xc6fntxnty265rsqpnn0nk8aq0c9ge", // wgOHM UST
    "terra1476fucrvu5tuga2nx28r3fctd34xhksc2gckgf",
    "terra1repcset8dt8z9wm5s6x77n3sjg8hduem9tntd6", // wLDO stLUNA
  ]);

  // pools that externally fetch rewards, like LDO for wormhole
  EXTERNALLY_FETCHED_REWARDS = new Set<string>([
    "terra1gxjjrer8mywt4020xdl5e5x7n6ncn6w38gjzae", // stluna luna
    "terra18dq84qfpz267xuu0k47066svuaez9hr4xvwlex", // stsol ust
    "terra1edurrzv6hhd8u48engmydwhvz8qzmhhuakhwj3", // steth ust
  ]);

  // temporary pair whitelist for prices/pools until we
  // improve performance
  PAIRS_WHITELIST = new Set<string>([
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
    "terra1repcset8dt8z9wm5s6x77n3sjg8hduem9tntd6", // wLDO stLuna
    "terra1hasy32pvxmgu485x5tujylemqxynsv72lsu7ve", // kuji ust
    "terra10nfk6fcz5nc5uru964qmpels9ctg6j0vczjgl7", // prism ust
    "terra18fl6aywx2c8xlfp5epl40dygqnrvqp9a678a9c", // aust ust
    "terra1hn8d8ldzu2v2td5uj335pz32phanm90a4kjfal", // avax ust
    "terra1c868juk7lk9vuvetf0644qgxscsu4xwag6yaxs", // prism xprism
    "terra1pxexyejamkg856vmspyttcy4sva84qgyaq445z", // avax wasAvax
    "terra102t6psqa45ahfd7wjskk3gcnfev32wdngkcjzd", // cluna luna
    "terra1tkcnky57lthm2w7xce9cj5jeu9hjtq427tpwxr", // cluna ust
    "terra1r6fchdsr8k65082u3cyrdn6x2n8hrpyrp72je0", // pluna luna
    "terra1aa68js6yxavg9zzzle2zaynem9cstvmaj3xyu3", // yluna luna
    "terra1k8lvj3w7dxzd6zlyptcj086gfwms422xkqjmzx", // sayve ust
    "terra1hlq6ye6km5sq2pcnmrvlf784gs9zygt0akwvsu", // kuji skuji
    "terra170x0m3vmc7s5pdvpt5lh9n6wfmsz6wcykcr0vg", // Bro ust
    "terra15rx5ghq4nxrv62fqvdvm78kuasfkl95c6mcmqs", // kUST-UST
    "terra14sal7lg7ny207yz0ue4dc02mdqs03zytegsn2r", // KNTC-UST
    "terra1dawj5mr2qt2nlurge30lfgjg6ly4ls99yeyd25", // mars-xmars
    "terra1ngs0xlmxan6ktqwtcj8c2l2ddp3z00wpxt43vr", // osmo-ust
    "terra12k8d0uzrgcqn4ge4k8ntr4aaycpwunz7pu2umj", // scrt-ust
    "terra14rnschsdlllt00yk8fxvxmcqgzhme3cx06t2x4", // atom-ust
  ]);

  // TODO - This should be queried from each token's native chain in future
  /**
   * IBC_DENOM_MAP maps the IBC denomination values to symbols
   * These values are taken from ibcTransfer.denomTraces from LCD
   */
  IBC_DENOM_MAP = new Map<string, any>([
    ["cusdc", { symbol: "CUSDC", name: "Compound USD Coin" }],
    ["cwbtc", { symbol: "CWBTC", name: "Compound Wrapped BTC" }],
    ["gravity0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", { symbol: "gUSDC", name: "gUSDC" }],
    ["inj", { symbol: "INJ", name: "INJ" }],
    ["orai", { symbol: "ORAI", name: "Oraichain" }],
    ["uakt", { symbol: "AKT", name: "Akash" }],
    ["uatolo", { symbol: "ATOLO", name: "Rizon" }],
    ["uatom", { symbol: "ATOM", name: "Cosmos" }],
    ["uaxl", { symbol: "AXL", name: "AXL" }],
    ["udvpn", { symbol: "DVPN", name: "Sentinel" }],
    ["ugraviton", { symbol: "GRAV", name: "Graviton" }],
    ["uhuahua", { symbol: "HUAHUA", name: "Chihuahu" }],
    ["uiris", { symbol: "IRIS", name: "Iris" }],
    ["ujuno", { symbol: "JUNO", name: "Juno" }],
    ["ukava", { symbol: "KAVA", name: "Kava" }],
    ["uluna", { symbol: "LUNA", name: "Luna" }],
    ["uosmo", { symbol: "OSMO", name: "Osmosis" }],
    ["uregen", { symbol: "REGEN", name: "Regen" }],
    ["uscrt", { symbol: "SCRT", name: "Secret" }],
    ["uumee", { symbol: "UMEE", name: "UMEE" }],
    ["uusd", { symbol: "UST", name: "UST" }],
    ["xrowan", { symbol: "ROWAN", name: "ROWAN" }],
    ["xust", { symbol: "UST", name: "UST" }],
  ]);
}
