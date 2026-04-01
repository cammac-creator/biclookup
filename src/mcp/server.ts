import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { validateBIC } from '../lib/bic.js';
import { lookup } from '../lib/db.js';

const server = new McpServer({
  name: 'bic-lookup',
  version: '1.0.0',
});

server.tool(
  'lookup_bic',
  `Look up a BIC/SWIFT code and return institution details, country, city, and LEI data.
Returns: validity, institution name, country, city, branch info, LEI identifier.
Supports BIC8 (UBSWCHZH) and BIC11 (UBSWCHZH80A) formats.
Cost: $0.001 USDC per call via x402 micropayment on Base L2.`,
  {
    bic: z.string().describe(
      "BIC/SWIFT code to look up. 8 or 11 characters. Example: 'UBSWCHZH' or 'BNPAFRPPXXX'"
    ),
  },
  async ({ bic }) => {
    const validation = validateBIC(bic);

    if (!validation.valid) {
      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({ bic: validation.bic, valid: false, error: validation.error }, null, 2),
        }],
      };
    }

    const row = lookup(validation.bic11!);

    const result = {
      bic: validation.bic,
      bic8: validation.bic8,
      bic11: validation.bic11,
      valid_format: true,
      found: row !== null,
      institution: row?.institution ?? null,
      country_code: validation.country_code,
      country_name: row?.country_name ?? null,
      city: row?.city ?? null,
      branch_code: validation.branch_code,
      branch_info: row?.branch_info ?? null,
      lei: row?.lei ?? null,
      lei_status: row?.lei_status ?? null,
      is_test_bic: validation.is_test_bic,
    };

    return {
      content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('BIC Lookup MCP Server running on stdio');
}

main().catch(console.error);
