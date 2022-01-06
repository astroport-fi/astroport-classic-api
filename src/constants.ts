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