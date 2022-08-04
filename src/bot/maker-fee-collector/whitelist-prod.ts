import { isNative } from "modules/terra";

// pairs to swap and distribute to xastro stakers
// they are split up because the executemsg has a size limi
const limit = "500000000000";
const splitAddressArraySize = 10;

const addresses = [
  "uusd",
  "uluna",
  "terra1xj49zyqrwpv5k928jwfpfy2ha668nwdgkwlrg3",
  "terra14z56l0fp2lsf86zy3hty2z47ezkhnthtr9yq76",
  "terra13xujxcrc9dqft4p9a8ls0w3j0xnzm6y2uvve8n",
  "terra1mddcdx0ujx89f38gu7zspk2r2ffdl5enyz2u03",
  "terra100yeqvww74h4yaejj6h733thgcafdaukjtw397",
  "terra12897djskt9rge8dtmm86w654g7kzckkd698608",
  "terra1dy9kmlm4anr92e42mrkjwzyvfqwz66un00rwr5",
  "terra15gwkyepfc6xgca5t5zefzwy42uts8l2m4g40k6",
  "terra1kcthelkax4j9x8d3ny6sdag0qmxxynl3qtcrpy",
  "terra1kc87mu460fwkqte29rquh4hc20m54fxwtsx7gp",
  "terra1hnezwjqlhzawcrfysczcxs6xqxu2jawn729kkf",
  "terra178v546c407pdnx5rer3hu8s2c0fc924k74ymnn",
  "terra10f2mt82kjnkxqj2gepgwl637u2w4ue2z5nhz5j",
  "terra1yg3j2s986nyp5z7r2lvt0hx3r0lnd7kwvwwtsc",
  // "terra1042wzrwg2uk6jqxjm34ysqquyr9esdgm5qyswz", //max spread
  // "terra1z3e2e4jpk4n0xzzwlkgcfvc95pc5ldq0xcny58",
  // "terra1tlgelulz9pdkhls6uglfn5lmxarx7f2gxtdzh2", //max spread
  // "terra17wkadg0tah554r35x6wvff0y5s7ve8npcjfuhz", //max spread
  //  "terra188w26t95tf4dz77raftme8p75rggatxjxfeknw",
  "terra1xfsdgcemqwxp4hhnyk4rle6wr22sseq7j07dnn",
  //"terra1hj8de24c3yqvcsv9r8chr03fzwsak3hgd8gv3m"
  // "terra1dh9478k2qvqhqeajhn75a2a7dsnf74y5ukregw", //max spread
  "terra12hgwnpupflfpuual532wgrxu2gjp0tcagzgx4n",
  // "terra133chr09wu8sakfte5v7vd8qzq9vghtkv4tn0ur", //max spread
  // "terra1t9ul45l7m6jw6sxgvnp8e5hj8xzkjsg82g84ap", //max spread
  "terra169edevav3pdrtjcx35j6pvzuv54aevewar4nlh",
  // "terra1dtqlfecglk47yplfrtwjzyagkgcqqngd5lgjp8", //max spread
  // "terra14tl83xcwqjy0ken9peu4pjjuu755lrry2uy25r", //max spread
  // "terra190tqwgqx7s8qrknz6kckct7v607cu068gfujpk", //max spread
  // "terra1cetg5wruw2wsdjp7j46rj44xdel00z006e9yg8", //max spread
  "terra17y9qkl8dfkeg4py7n0g5407emqnemc3yqk5rup",
  "terra1szt6cq52akhmzcqw5jhkw3tvdjtl4kvyk3zkhx",
  "terra1x0ulpvp6m46c5j7t40nj24mjp900954ys2jsnu",
  "terra1cevdyd0gvta3h79uh5t47kk235rvn42gzf0450",
  "terra1cc6kqk0yl25hdpr5llxmx62mlyfdl7n0rwl3hq",
  "terra1qmxkqcgcgq8ch72k6kwu3ztz6fh8tx2xd76ws7",
  "terra143az0w2e504n56q7k43qyh2fu69fh3rhup32n3",
  "terra1296jw27cq8svlg4ywm8t84u448p3zs7mcqg9ra",
  "terra1k8lvj3w7dxzd6zlyptcj086gfwms422xkqjmzx",
  "terra1myl709y74vrdcyuxy6g9wv5l2sgah4e9lstnwe",
  "terra1z7634s8kyyvjjuv7lcgkfy49hamxssxq9f9xw6",
  // "terra1fpfn2kkr8mv390wx4dtpfk3vkjx9ch3thvykl3", //ms
];

function sliceIntoChunks<T = any>(arr: T[], chunkSize: number) {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
}

export const generateExecuteMessages = (): any[] => {
  const executeMessages = [];

  const addressesChunks = sliceIntoChunks(addresses, splitAddressArraySize);
  for (const chunk of addressesChunks) {
    const collect: any = {
      assets: [],
    };
    for (const address of chunk) {
      if (isNative(address)) {
        collect.assets.push({
          info: {
            native_token: {
              denom: address,
            },
          },
          limit,
        });
      } else {
        collect.assets.push({
          info: {
            token: {
              contract_addr: address,
            },
          },
          limit,
        });
      }
    }
    executeMessages.push({ collect });
  }
  return executeMessages;
};
