export const swapConfig = {
  executeSwap: false, // Send tx when true, simulate tx when false
  useVersionedTransaction: false,
  tokenAAmount: 0.0001, // Swap 0.01 SOL for USDT in this example
  tokenAAddress: "So11111111111111111111111111111111111111112", // Token to swap for the other, SOL in this case
  tokenBAddress: "BN3f1SBTLig2oiM8SS6eZsZ5Lwq4fcJwNtqNz1CPFJT6", // USDC address
  maxLamports: 100000, // Max lamports allowed for fees
  direction: "in" as "in" | "out", // Swap direction: 'in' or 'out'
  liquidityFile: "https://api.raydium.io/v2/sdk/liquidity/mainnet.json",
  maxRetries: 5
};
