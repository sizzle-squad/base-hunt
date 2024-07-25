export enum BadgeType {
  online = "online",
  irl = "irl",
  level = "level"
}

export enum BoostIcon {
  WALLET = "WALLET",
  COFFEE = "COFFEE",
  BAG = "BAG",
  GRID = "GRID",
  CIRCLE = "CIRCLE",
  LINK = "LINK",
  USERS = "USERS"
}

export enum BoostType {
  TRANSFER_NFT = "TRANSFER_NFT",
  NFT = "NFT",
  NFT_PER_MINT = "NFT_PER_MINT",
  TOKEN = "TOKEN",
  DEFAULT = "DEFAULT",
  TRANSACTION = "TRANSACTION",
  SOCIAL = "SOCIAL"
}

export enum ChallengeStatus {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETE = "COMPLETE"
}

export enum ChallengeType {
  ERC_TRANSFER = "ERC_TRANSFER",
  BALANCE_CHECK = "BALANCE_CHECK",
  CONTRACT_INTERACTION = "CONTRACT_INTERACTION",
  TRIVIA = "TRIVIA",
  SOCIAL = "SOCIAL",
  EVENT_TYPE_TRANSFER_ERC1155 = "EVENT_TYPE_TRANSFER_ERC1155",
  EVENT_TYPE_TRANSFER_ERC20 = "EVENT_TYPE_TRANSFER_ERC20",
  EVENT_TYPE_TRANSFER_ERC721 = "EVENT_TYPE_TRANSFER_ERC721",
  EVENT_TYPE_CONTRACT_EXECUTION = "EVENT_TYPE_CONTRACT_EXECUTION",
  GUILD = "GUILD"
}

export enum CheckFunctionType {
  checkMint = "checkMint",
  checkTrivia = "checkTrivia",
  checkFunctionExecution = "checkFunctionExecution",
  checkBalance = "checkBalance",
  checkTokenIdBalance = "checkTokenIdBalance",
  checkTxCountBatch = "checkTxCountBatch",
  checkJoinGuild = "checkJoinGuild",
  checkCoinbaseOne = "checkCoinbaseOne",
  checkTokensCount = "checkTokensCount",
  checkNftTokensCount = "checkNftTokensCount",
  checkBypass = "checkBypass"
}

export enum Networks {
  networks_base_mainnet = "networks/base-mainnet",
  networks_eth_mainnet = "networks/eth-mainnet"
}

export enum SpinType {
  POINTS = "POINTS",
  USDC = "USDC"
}