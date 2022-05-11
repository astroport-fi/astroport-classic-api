import { LogFinderRule } from "@terra-money/log-finder";
import constants from "../../environment/constants";

export function createPairRule(factoryAddress: string): LogFinderRule {
  return {
    type: "wasm",
    attributes: [
      ["contract_address", factoryAddress],
      ["action", "create_pair"],
      ["pair"],
      ["contract_address"],
      ["liquidity_token_addr"],
    ],
  };
}

// match swaps
export function swapRule(): LogFinderRule {
  return {
    type: "wasm",
    attributes: [["contract_address"], ["action", (value) => value === "swap"]],
    matchUntil: "contract_address",
  };
}

// match cw20 token fees sent to maker
export function xAstroCW20FeeRule(): LogFinderRule {
  return {
    type: "wasm",
    attributes: [
      ["contract_address"],
      ["action", "transfer"],
      ["from"],
      ["to", constants.MAKER_ADDRESS],
      ["amount"],
    ],
  };
}

// match native terra asset fees sent to maker
export function xAstroNativeFeeRule(): LogFinderRule {
  return {
    type: "wasm",
    attributes: [
      ["ask_asset"],
      ["offer_amount"],
      ["return_amount"],
      ["tax_amount"],
      ["spread_amount"],
      ["commission_amount"],
      ["maker_fee_amount"],
    ],
  };
}

// match proxy generator claims from protocol token factory
export function generatorProxyClaimRule(
  token: string,
  proxy: string,
  factory: string
): LogFinderRule {
  return {
    type: "wasm",
    attributes: [
      ["contract_address", token],
      ["action", "transfer"],
      ["from", factory],
      ["to", proxy],
      ["amount"],
    ],
  };
}

// match a governance proposal vote
export function governanceVoteRule(): LogFinderRule {
  return {
    type: "wasm",
    attributes: [
      ["contract_address", constants.GOVERNANCE_ASSEMBLY],
      ["action", "cast_vote"],
      ["proposal_id"],
      ["voter"],
      ["vote"],
      ["voting_power"],
    ],
  };
}

// Match xAstro mint interactions, specifically when a user enters an Astro -> xAstro
// staking position
export function xAstroMintRule(xAstroContractAddress: string): LogFinderRule {
  return {
    type: "wasm",
    attributes: [
      ["contract_address", xAstroContractAddress],
      ["action", "mint"],
      ["to"],
      ["amount"],
    ],
  };
}

// Match xAstro create_lock interactions, specifically when a user creates a
// new vxAstro lock
export function vxAstroCreateLockRule(vxAstroContractAddress: string): LogFinderRule {
  return {
    type: "wasm",
    attributes: [
      ["from"],
      ["to", vxAstroContractAddress],
      ["amount"],
      ["contract_address", vxAstroContractAddress],
      ["action", "create_lock"],
    ],
  };
}
