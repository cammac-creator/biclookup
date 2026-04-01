import type { MiddlewareHandler } from 'hono';

const USDC_BASE = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

/**
 * x402 payment middleware for BIC lookup API.
 * Dev mode: skip payment with X-Dev-Skip header.
 */
export function createX402Middleware(): MiddlewareHandler {
  return async (c, next) => {
    // Dev bypass
    if (process.env.NODE_ENV === 'development' && c.req.header('X-Dev-Skip')) {
      await next();
      return;
    }

    try {
      const { paymentMiddlewareFromConfig } = await import('@x402/hono');

      const walletAddress = process.env.WALLET_ADDRESS;
      if (!walletAddress) {
        await next();
        return;
      }

      const routes = {
        'GET /v1/bic/:code': {
          accepts: {
            scheme: 'exact',
            network: 'eip155:8453' as const,
            maxTimeoutSeconds: 60,
            payTo: walletAddress,
            price: '$0.001',
          },
          description: 'BIC/SWIFT code lookup with LEI enrichment',
        },
      };

      const middleware = paymentMiddlewareFromConfig(routes);
      return middleware(c, next);
    } catch {
      // x402 not available or misconfigured — pass through
      await next();
    }
  };
}
