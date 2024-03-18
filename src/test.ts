import {
  LIQUIDITY_STATE_LAYOUT_V4,
  MARKET_STATE_LAYOUT_V3,
} from "@raydium-io/raydium-sdk";
import {
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

// Define a function to fetch and decode OpenBook accounts
export async function fetchOpenBookAccounts(connection, baseMint, quoteMint, commitment) {
  const accounts = await connection.getProgramAccounts(
    TOKEN_PROGRAM_ID,
    {
      commitment,
      filters: [
        { dataSize: MARKET_STATE_LAYOUT_V3.span },
        {
          memcmp: {
            offset: MARKET_STATE_LAYOUT_V3.offsetOf("baseMint"),
            bytes: baseMint.toBase58(),
          },
        },
        {
          memcmp: {
            offset: MARKET_STATE_LAYOUT_V3.offsetOf("quoteMint"),
            bytes: quoteMint.toBase58(),
          },
        },
      ],
    }
  );

  return accounts.map(({ account }) => MARKET_STATE_LAYOUT_V3.decode(account.data));
}

// Define a function to fetch and decode Market accounts
export async function fetchMarketAccounts(connection, base, quote, commitment) {
  const accounts = await connection.getProgramAccounts(
    TOKEN_PROGRAM_ID,
    {
      commitment,
      filters: [
        { dataSize: LIQUIDITY_STATE_LAYOUT_V4.span },
        {
          memcmp: {
            offset: LIQUIDITY_STATE_LAYOUT_V4.offsetOf("baseMint"),
            bytes: base.toBase58(),
          },
        },
        {
          memcmp: {
            offset: LIQUIDITY_STATE_LAYOUT_V4.offsetOf("quoteMint"),
            bytes: quote.toBase58(),
          },
        },
      ],
    }
  );

  return accounts.map(({ pubkey, account }) => ({
    id: pubkey.toString(),
    ...LIQUIDITY_STATE_LAYOUT_V4.decode(account.data),
  }));
}