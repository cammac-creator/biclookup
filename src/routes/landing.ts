import { Hono } from 'hono';

export const landingRoute = new Hono();

landingRoute.get('/', (c) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>BICLookup API</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:system-ui,-apple-system,sans-serif;background:#0a0a0a;color:#e5e5e5;min-height:100vh;display:flex;align-items:center;justify-content:center}
    .container{max-width:640px;padding:2rem;text-align:center}
    h1{font-size:2.5rem;font-weight:700;background:linear-gradient(135deg,#60a5fa,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:.5rem}
    .sub{color:#a3a3a3;margin-bottom:2rem}
    .endpoint{background:#171717;border:1px solid #262626;border-radius:8px;padding:1rem;margin:1rem 0;text-align:left;font-family:monospace;font-size:.9rem}
    .method{color:#34d399;font-weight:700}
    .path{color:#60a5fa}
    .price{color:#fbbf24;font-size:.8rem}
    .grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin:2rem 0;text-align:left}
    .card{background:#171717;border:1px solid #262626;border-radius:8px;padding:1rem}
    .card h3{color:#a78bfa;font-size:.85rem;margin-bottom:.5rem}
    .card p{color:#a3a3a3;font-size:.8rem;line-height:1.5}
    footer{margin-top:2rem;color:#525252;font-size:.75rem}
    footer a{color:#60a5fa;text-decoration:none}
    footer a:hover{text-decoration:underline}
  </style>
</head>
<body>
  <div class="container">
    <h1>BICLookup API</h1>
    <p class="sub">BIC/SWIFT code lookup with LEI enrichment &middot; x402 micropayments</p>

    <div class="endpoint">
      <span class="method">GET</span> <span class="path">/v1/bic/{code}</span><br>
      <span class="price">$0.001 USDC per lookup &middot; Base L2</span>
    </div>
    <div class="endpoint">
      <span class="method">GET</span> <span class="path">/health</span>
    </div>
    <div class="endpoint">
      <span class="method">GET</span> <span class="path">/stats</span>
    </div>

    <div class="grid">
      <div class="card">
        <h3>Coverage</h3>
        <p>GLEIF-sourced BIC data<br>
        LEI enrichment<br>
        240+ countries</p>
      </div>
      <div class="card">
        <h3>Features</h3>
        <p>ISO 9362 validation<br>
        MCP Server for AI agents<br>
        x402 micropayments on Base L2</p>
      </div>
    </div>

    <footer>
      <a href="https://github.com/cammac-creator/biclookup">GitHub</a> &middot;
      Powered by <a href="https://x402.org">x402</a> &middot;
      Data from <a href="https://www.gleif.org">GLEIF</a>
    </footer>
  </div>
</body>
</html>`;

  return c.html(html);
});
