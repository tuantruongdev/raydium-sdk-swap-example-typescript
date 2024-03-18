import RaydiumSwap from './RaydiumSwap';
import { Transaction, VersionedTransaction } from '@solana/web3.js';
import { swapConfig } from './swapConfig'; // Import the configuration
import { fetchMarketAccounts ,fetchOpenBookAccounts } from './test';
import web3 from '@solana/web3.js';
/**
 * Performs a token swap on the Raydium protocol.
 * Depending on the configuration, it can execute the swap or simulate it.
 */
const connection = new web3.Connection(process.env.RPC_URL);
const swap = async () => {
  /**
   * The RaydiumSwap instance for handling swaps.
   */
  
  const tokenAddress = new web3.PublicKey(swapConfig.tokenBAddress);
  const raydiumSwap = new RaydiumSwap(process.env.RPC_URL, process.env.WALLET_PRIVATE_KEY);
  console.log(`Raydium swap initialized`);
  console.log(`Swapping ${swapConfig.tokenAAmount} of ${swapConfig.tokenAAddress} for ${swapConfig.tokenBAddress}...`)
  //const marketAccount = fetchMarketAccounts(connection,tokenAddress,);
  //console.log('marketAccount : '+ JSON.stringify(marketAccount));

  return;
  /**
   * Load pool keys from the Raydium API to enable finding pool information.
   */
  await raydiumSwap.loadPoolKeys();
  console.log(`Loaded pool keys`);

  /**
   * Find pool information for the given token pair.
   */
  const poolInfo = raydiumSwap.findPoolInfoForTokens(swapConfig.tokenAAddress, swapConfig.tokenBAddress);
  console.log('Found pool info'+ JSON.stringify(poolInfo));
  
  /**
   * Prepare the swap transaction with the given parameters.
   */
  const tx = await raydiumSwap.getSwapTransaction(
    swapConfig.tokenBAddress,
    swapConfig.tokenAAmount,
    poolInfo,
    swapConfig.maxLamports, 
    swapConfig.useVersionedTransaction,
    swapConfig.direction
  );

  /**
   * Depending on the configuration, execute or simulate the swap.
   */
  if (swapConfig.executeSwap) {
    /**
     * Send the transaction to the network and log the transaction ID.
     */
    const startTime = performance.now();
    
    const txid = swapConfig.useVersionedTransaction
      ? await raydiumSwap.sendVersionedTransaction(tx as VersionedTransaction)
      : await raydiumSwap.sendLegacyTransaction(tx as Transaction);

    console.log(`https://solscan.io/tx/${txid}`);

    const endTime = performance.now();

    // Calculate the time taken
    const timeTaken = endTime - startTime;
    console.log(`Time taken: ${timeTaken} milliseconds`);
  } else {
    /**
     * Simulate the transaction and log the result.
     */
    const simRes = swapConfig.useVersionedTransaction
      ? await raydiumSwap.simulateVersionedTransaction(tx as VersionedTransaction)
      : await raydiumSwap.simulateLegacyTransaction(tx as Transaction);

    console.log(simRes);
  }
};

swap();
