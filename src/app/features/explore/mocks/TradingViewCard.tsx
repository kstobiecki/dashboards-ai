'use client';

import { ExploreCard } from '../context/ExploreContext';
import { nanoid } from 'nanoid';

export const createTradingViewCard = (): ExploreCard => ({
  id: `trading-view-${nanoid(10)}`,
  conversationHistory: {
    prompts: 'Create a TradingView chart widget',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>TradingView Widget</title>
  <link href="https://www.unpkg.com/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <style>
    body, html {
      background: #18181b;
      color: #fafafa;
      width: 100vw;
      height: 100vh;
      margin: 0;
      padding: 0;
    }
    #tradingview-widget-container {
      width: 100vw;
      height: 100vh;
      min-height: 400px;
    }
  </style>
</head>
<body>
  <div id="tradingview-widget-container" class="w-full h-full flex items-center justify-center">
    <!-- TradingView Widget BEGIN -->
    <div class="tradingview-widget-container w-full h-full">
      <div id="tradingview_advanced_chart" class="w-full h-full"></div>
      <script type="text/javascript" src="https://s3.tradingview.com/tv.js"></script>
      <script type="text/javascript">
        new TradingView.widget({
          "width": "100%",
          "height": "100%",
          "symbol": "NASDAQ:AAPL",
          "interval": "D",
          "timezone": "Etc/UTC",
          "theme": "dark",
          "style": "1",
          "locale": "en",
          "toolbar_bg": "#18181b",
          "backgroundColor": "#18181b",
          "hide_top_toolbar": false,
          "hide_side_toolbar": false,
          "container_id": "tradingview_advanced_chart"
        });
      </script>
    </div>
    <!-- TradingView Widget END -->
  </div>
</body>
</html>`,
  },
  intervalSettings: {
    isEnabled: false,
    interval: 5,
    prompt: 'Update TradingView chart data',
  },
});
