'use client';

import { ExploreCard } from '../context/ExploreContext';
import { nanoid } from 'nanoid';

export const createTeslaStockDashboardCard = (): ExploreCard => ({
  id: `tesla-stock-dashboard-${nanoid(10)}`,
  conversationHistory: {
    prompts: 'Create the most important indicators and metrics to analyze Tesla (TSLA) stock.',
    html: `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Tesla Stock Dashboard</title>
        <link href="https://www.unpkg.com/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        <script src="https://unpkg.com/lightweight-charts@4.0.0/dist/lightweight-charts.standalone.production.js"></script>
      </head>
      <body class="bg-gray-900 text-gray-100 min-h-screen">
        <div class="w-full h-full min-h-screen flex flex-col items-center px-4 py-8">
          <h1 class="text-3xl font-bold mb-2 text-center">Tesla Stock Dashboard</h1>
          <p class="text-lg text-gray-400 mb-8 text-center">Key financial & stock performance indicators as of May 2025</p>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mb-8">

            <!-- Current Price -->
            <div class="bg-gray-800 p-6 flex flex-col rounded-lg shadow w-full">
              <span class="text-gray-400 text-sm mb-2">Stock Price</span>
              <span class="text-2xl font-semibold text-green-400 mb-1">$339.34</span>
              <span class="text-sm text-gray-400">-0.50% (24h)</span>
            </div>

            <!-- Market Cap -->
            <div class="bg-gray-800 p-6 flex flex-col rounded-lg shadow w-full">
              <span class="text-gray-400 text-sm mb-2">Market Capitalization</span>
              <span class="text-2xl font-semibold">$1.09T</span>
              <span class="text-sm text-gray-400">+20.94% (last week)</span>
            </div>

            <!-- Volatility & Beta -->
            <div class="bg-gray-800 p-6 flex flex-col rounded-lg shadow w-full">
              <span class="text-gray-400 text-sm mb-2">Volatility / Beta</span>
              <span class="text-xl font-semibold mb-1">2.99% / 2.02</span>
              <span class="text-sm text-gray-400">24h Volatility / Beta Coefficient</span>
            </div>

            <!-- Last Quarter Revenue -->
            <div class="bg-gray-800 p-6 flex flex-col rounded-lg shadow w-full">
              <span class="text-gray-400 text-sm mb-2">Last Quarter Revenue</span>
              <span class="text-2xl font-semibold text-blue-400 mb-1">$19.34B</span>
              <span class="text-sm text-gray-400">Est.: $21.27B | Next Est.: $23.63B</span>
            </div>

            <!-- Net Income -->
            <div class="bg-gray-800 p-6 flex flex-col rounded-lg shadow w-full">
              <span class="text-gray-400 text-sm mb-2">Net Income (Last Q)</span>
              <span class="text-2xl font-semibold text-yellow-400 mb-1">$409M</span>
              <span class="text-sm text-gray-400">Prev: $2.31B (−82.32%)</span>
            </div>

            <!-- Earnings per Share (EPS) -->
            <div class="bg-gray-800 p-6 flex flex-col rounded-lg shadow w-full">
              <span class="text-gray-400 text-sm mb-2">Earnings per Share (EPS)</span>
              <span class="text-2xl font-semibold mb-1">0.27 USD</span>
              <span class="text-sm text-gray-400">Est.: 0.41 (<span class="text-red-400">−34.09% surprise</span>)</span>
              <span class="text-sm text-gray-400">Next Est.: 0.46</span>
            </div>

            <!-- Production & Deliveries -->
            <div class="bg-gray-800 p-6 flex flex-col rounded-lg shadow w-full">
              <span class="text-gray-400 text-sm mb-2">Vehicle Production / Deliveries</span>
              <span class="text-xl font-semibold mb-1">+13% / +20%</span>
              <span class="text-sm text-gray-400">Year-over-year change</span>
            </div>

            <!-- Gross Margin -->
            <div class="bg-gray-800 p-6 flex flex-col rounded-lg shadow w-full">
              <span class="text-gray-400 text-sm mb-2">Auto Gross Margin</span>
              <span class="text-2xl font-semibold mb-1">18.9%</span>
              <span class="text-sm text-gray-400">Most recent report</span>
            </div>
          </div>

          <div class="w-full max-w-5xl bg-gray-800 rounded-lg shadow p-4 mb-8">
            <span class="block text-gray-400 mb-2 text-sm">Tesla Stock Price (Recent Trend)</span>
            <div id="tsla-chart" class="w-full" style="height:320px;"></div>
          </div>

          <div class="w-full max-w-5xl bg-gray-800 rounded-lg shadow p-6">
            <h2 class="text-xl font-semibold mb-2 text-gray-200">Summary of Key Indicators</h2>
            <ul class="list-disc list-inside text-gray-300">
              <li><b>Stock Price:</b> $339.34, -0.50% past 24h [5]</li>
              <li><b>Market Cap:</b> $1.09T, +20.94% last week [5]</li>
              <li><b>Volatility/Beta:</b> 2.99% / 2.02 [5]</li>
              <li><b>Quarterly Revenue:</b> $19.34B (down from estimate $21.27B); next est. $23.63B [5]</li>
              <li><b>Net Income (Q):</b> $409M (previous: $2.31B, −82.32%) [5]</li>
              <li><b>EPS (Q):</b> $0.27 (estimate: $0.41, −34.09% surprise); next est. $0.46 [5]</li>
              <li><b>Vehicle Production:</b> +13% YoY; <b>Deliveries:</b> +20% YoY [1]</li>
              <li><b>Auto Gross Margin:</b> 18.9% [1]</li>
            </ul>
          </div>
        </div>

        <script>
          // Simulated Tesla price trend (sampled points over past 30 days)
          const tslaData = [
            { time: '2025-04-25', value: 295 },
            { time: '2025-04-28', value: 304 },
            { time: '2025-05-01', value: 312 },
            { time: '2025-05-05', value: 328 },
            { time: '2025-05-08', value: 317 },
            { time: '2025-05-12', value: 322 },
            { time: '2025-05-15', value: 335 },
            { time: '2025-05-19', value: 348 },
            { time: '2025-05-22', value: 342 },
            { time: '2025-05-25', value: 339.34 }
          ];

          const chart = LightweightCharts.createChart(document.getElementById('tsla-chart'), {
            layout: {
              background: { color: '#27272a' },
              textColor: '#fafafa',
            },
            grid: {
              vertLines: { color: '#383838' },
              horzLines: { color: '#383838' },
            },
            width: document.getElementById('tsla-chart').offsetWidth,
            height: 320,
            rightPriceScale: {
              borderColor: '#555',
            },
            timeScale: {
              borderColor: '#555',
              timeVisible: true,
            },
          });
          const tslaSeries = chart.addLineSeries({
            color: '#22d3ee',
            lineWidth: 2,
          });
          tslaSeries.setData(tslaData);

          window.addEventListener('resize', () => {
            chart.applyOptions({
              width: document.getElementById('tsla-chart').offsetWidth,
            });
          });
        </script>
      </body>
    </html>`,
  },
  intervalSettings: {
    isEnabled: true,
    interval: 1440,
    prompt: 'Update the HTML file with the latest Tesla stock data. Do not change the structure of the HTML file.',
  },
});
