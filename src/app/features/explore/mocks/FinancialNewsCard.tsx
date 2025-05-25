'use client';

import { ExploreCard } from '../context/ExploreContext';
import { nanoid } from 'nanoid';

export const createFinancialNewsCard = (): ExploreCard => ({
  id: `financial-news-${nanoid(10)}`,
  conversationHistory: {
    prompts: 'Create a dashboard that displays the latest financial news and updates.',
    html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Financial News Dashboard</title>
            <link href="https://www.unpkg.com/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
            <link href="https://www.unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet">
            <script src="https://www.unpkg.com/lightweight-charts@4.1.0/dist/lightweight-charts.standalone.production.js"></script>
            <style>
                body {
                    background-color: #18181b;
                    color: #fafafa;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                }
                .glass-card {
                    background: rgba(30, 30, 35, 0.7);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
                }
                .news-card {
                    cursor: pointer;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }
                .news-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 12px 20px -5px rgba(0, 0, 0, 0.4);
                }
                .news-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 4px;
                    height: 100%;
                    background: #3B82F6;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                .news-card:hover::before {
                    opacity: 1;
                }
                .animate-pulse {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.7;
                    }
                }
                .chart-container {
                    height: 180px;
                    width: 100%;
                }
                .gradient-text {
                    background: linear-gradient(90deg, #3B82F6, #8B5CF6);
                    -webkit-background-clip: text;
                    background-clip: text;
                    color: transparent;
                }
            </style>
        </head>
        <body>
            <div class="container mx-auto px-4 py-6 w-full h-full">
                <!-- Header -->
                <div class="flex justify-between items-center mb-8">
                    <div class="flex items-center space-x-2">
                        <div class="h-8 w-1 bg-blue-500 rounded"></div>
                        <h1 class="text-2xl font-bold gradient-text">Financial Pulse</h1>
                    </div>
                    <div class="flex items-center space-x-4">
                        <div class="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-full">
                            <i class='bx bx-calendar text-blue-400'></i>
                            <div class="text-sm text-gray-300">May 25, 2025</div>
                        </div>
                    </div>
                </div>

                <!-- Alert Section -->
                <div class="glass-card p-5 rounded-xl mb-8 flex items-start space-x-4">
                    <div class="flex-shrink-0 mt-1">
                        <div class="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    </div>
                    <div>
                        <div class="flex items-center mb-2">
                            <h2 class="text-lg font-semibold">Market Alert</h2>
                            <span class="ml-2 px-2 py-1 text-xs bg-red-500 bg-opacity-20 text-red-400 rounded-full">FED Update</span>
                        </div>
                        <p class="text-gray-300 leading-relaxed">
                            Federal Reserve holds rates steady at 4.25%–4.50%. Chair Jerome Powell warns of potential "more frequent, and potentially more persistent, supply shocks" impacting the economy. The Fed remains cautious amid continued uncertainty, focusing on controlling inflation and supporting employment. The next FOMC meeting is scheduled for mid-June, with expectations that rates will be maintained.<br>
                            <span class="text-xs text-gray-400">Source: FOMC Statement, May 2025</span>
                        </p>
                    </div>
                </div>

                <!-- Chart Section -->
                <div class="glass-card p-5 rounded-xl mb-8">
                    <h2 class="font-bold mb-4 text-lg">Market Overview - S&P 500 Index (May 2025 daily closing prices)</h2>
                    <div class="chart-container" id="chart"></div>
                </div>

                <!-- News Grid -->
                <h2 class="font-bold mb-4 text-lg">Latest Updates</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                    <div class="glass-card rounded-xl p-5 news-card">
                        <div class="flex justify-between items-start mb-3">
                            <span class="px-2 py-1 text-xs bg-blue-500 bg-opacity-20 text-blue-400 rounded-full">S&P 500</span>
                            <span class="text-xs text-gray-400">May 25, 2025</span>
                        </div>
                        <h3 class="text-white font-bold mb-3 text-lg">S&P 500 Falls For First Time in Seven Days</h3>
                        <p class="text-gray-300 mb-4 leading-relaxed">The S&P 500 closed at 5,542.18 after falling for the first time in seven days. Major stock indexes closed slightly lower, with futures pointing to a slightly lower open for major U.S. indexes. Despite recent declines, the S&P 500 and Dow have nudged back into positive territory for 2025.</p>
                    </div>

                    <div class="glass-card rounded-xl p-5 news-card">
                        <div class="flex justify-between items-start mb-3">
                            <span class="px-2 py-1 text-xs bg-yellow-500 bg-opacity-20 text-yellow-400 rounded-full">Tariffs</span>
                            <span class="text-xs text-gray-400">May 25, 2025</span>
                        </div>
                        <h3 class="text-white font-bold mb-3 text-lg">Tariff Concerns Subsiding as Markets Rally</h3>
                        <p class="text-gray-300 mb-4 leading-relaxed">Stocks have rallied in recent weeks as concerns about tariffs and their potential impact on the economy have subsided. After falling sharply early last month following President Donald Trump's announcement of massive tariffs on leading trade partners, markets have rebounded with corporate earnings showing strength.</p>
                    </div>

                    <div class="glass-card rounded-xl p-5 news-card">
                        <div class="flex justify-between items-start mb-3">
                            <span class="px-2 py-1 text-xs bg-green-500 bg-opacity-20 text-green-400 rounded-full">Commodities</span>
                            <span class="text-xs text-gray-400">May 25, 2025</span>
                        </div>
                        <h3 class="text-white font-bold mb-3 text-lg">Gold and Oil See Modest Gains</h3>
                        <p class="text-gray-300 mb-4 leading-relaxed">Gold futures were recently up 0.1% at $3,235 an ounce, adding to the previous session's gains. West Texas Intermediate futures, the U.S. crude oil benchmark, rose 0.2% to $62.80 per barrel. These modest gains come amid continued market uncertainty and recent ratings adjustments to U.S. government debt.</p>
                    </div>

                    <div class="glass-card rounded-xl p-5 news-card">
                        <div class="flex justify-between items-start mb-3">
                            <span class="px-2 py-1 text-xs bg-purple-500 bg-opacity-20 text-purple-400 rounded-full">Trump Admin</span>
                            <span class="text-xs text-gray-400">May 25, 2025</span>
                        </div>
                        <h3 class="text-white font-bold mb-3 text-lg">Trump Administration's Tariff Plans Impact Markets</h3>
                        <p class="text-gray-300 mb-4 leading-relaxed">President Donald Trump's recent announcement of massive tariffs on leading trade partners initially caused stocks to fall sharply early last month. The S&P 500 and Dow have since recovered and returned to positive territory for 2025, with the Nasdaq approaching positive territory as well, as tariff concerns have begun to subside.</p>
                    </div>
                </div>

                <!-- Market Stats -->
                <div class="glass-card rounded-xl p-5">
                    <h3 class="font-bold mb-5 text-lg">Market Summary</h3>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div class="bg-gray-800 bg-opacity-50 p-4 rounded-lg border border-gray-700">
                            <div class="flex items-center justify-between mb-2">
                                <div class="text-gray-400">Dow Jones</div>
                                <i class='bx bx-trending-up text-green-400'></i>
                            </div>
                            <div class="text-xl font-bold">39,875.32</div>
                            <div class="flex items-center mt-1 text-green-400 text-sm">
                                <i class='bx bx-up-arrow-alt mr-1'></i>
                                0.38%
                            </div>
                        </div>
                        <div class="bg-gray-800 bg-opacity-50 p-4 rounded-lg border border-gray-700">
                            <div class="flex items-center justify-between mb-2">
                                <div class="text-gray-400">S&P 500</div>
                                <i class='bx bx-trending-down text-red-400'></i>
                            </div>
                            <div class="text-xl font-bold">5,542.18</div>
                            <div class="flex items-center mt-1 text-red-400 text-sm">
                                <i class='bx bx-down-arrow-alt mr-1'></i>
                                0.12%
                            </div>
                        </div>
                        <div class="bg-gray-800 bg-opacity-50 p-4 rounded-lg border border-gray-700">
                            <div class="flex items-center justify-between mb-2">
                                <div class="text-gray-400">Nasdaq</div>
                                <i class='bx bx-trending-down text-red-400'></i>
                            </div>
                            <div class="text-xl font-bold">17,893.65</div>
                            <div class="flex items-center mt-1 text-red-400 text-sm">
                                <i class='bx bx-down-arrow-alt mr-1'></i>
                                0.23%
                            </div>
                        </div>
                        <div class="bg-gray-800 bg-opacity-50 p-4 rounded-lg border border-gray-700">
                            <div class="flex items-center justify-between mb-2">
                                <div class="text-gray-400">10-Yr Treasury</div>
                                <i class='bx bx-trending-up text-green-400'></i>
                            </div>
                            <div class="text-xl font-bold">5.04%</div>
                            <div class="flex items-center mt-1 text-green-400 text-sm">
                                <i class='bx bx-up-arrow-alt mr-1'></i>
                                0.02%
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <script>
                document.addEventListener('DOMContentLoaded', function() {
                    const chartContainer = document.getElementById('chart');
                    const chart = LightweightCharts.createChart(chartContainer, {
                        layout: {
                            background: { color: 'transparent' },
                            textColor: '#d1d5db',
                        },
                        grid: {
                            vertLines: { color: 'rgba(42, 46, 57, 0.5)' },
                            horzLines: { color: 'rgba(42, 46, 57, 0.5)' },
                        },
                        timeScale: {
                            timeVisible: true,
                            borderColor: 'rgba(197, 203, 206, 0.3)',
                        },
                        rightPriceScale: {
                            borderColor: 'rgba(197, 203, 206, 0.3)',
                        },
                        crosshair: {
                            mode: LightweightCharts.CrosshairMode.Normal,
                            vertLine: {
                                color: '#758696',
                                width: 1,
                                style: LightweightCharts.LineStyle.Dashed,
                            },
                            horzLine: {
                                color: '#758696',
                                width: 1,
                                style: LightweightCharts.LineStyle.Dashed,
                            },
                        },
                    });

                    const areaSeries = chart.addAreaSeries({
                        topColor: 'rgba(59, 130, 246, 0.56)',
                        bottomColor: 'rgba(59, 130, 246, 0.04)',
                        lineColor: 'rgba(59, 130, 246, 1)',
                        lineWidth: 2,
                    });

                    // Sample data for the chart
                    const data = [
                        { time: '2025-05-01', value: 5350 },
                        { time: '2025-05-02', value: 5375 },
                        { time: '2025-05-03', value: 5400 },
                        { time: '2025-05-04', value: 5390 },
                        { time: '2025-05-05', value: 5410 },
                        { time: '2025-05-06', value: 5450 },
                        { time: '2025-05-07', value: 5420 },
                        { time: '2025-05-08', value: 5460 },
                        { time: '2025-05-09', value: 5465 },
                        { time: '2025-05-10', value: 5470 },
                        { time: '2025-05-11', value: 5490 },
                        { time: '2025-05-12', value: 5495 },
                        { time: '2025-05-13', value: 5480 },
                        { time: '2025-05-14', value: 5510 },
                        { time: '2025-05-15', value: 5520 },
                        { time: '2025-05-16', value: 5525 },
                        { time: '2025-05-17', value: 5530 },
                        { time: '2025-05-18', value: 5535 },
                        { time: '2025-05-19', value: 5525 },
                        { time: '2025-05-20', value: 5530 },
                        { time: '2025-05-21', value: 5540 },
                        { time: '2025-05-22', value: 5545 },
                        { time: '2025-05-23', value: 5550 },
                        { time: '2025-05-24', value: 5542 },
                        { time: '2025-05-25', value: 5545 },
                    ];

                    areaSeries.setData(data);
                    chart.timeScale().fitContent();
                });
            </script>
        </body>
        </html>
    `,},
    intervalSettings: {
        isEnabled: true,
        interval: 1440,
        prompt: 'Update the HTML file with the latest financial news data. Do not change the structure of the HTML file. Market Alert should be updated with the latest most important news like FED Update, Tariff Concerns, Commodities, Trump Admin, etc. Latest Updates should be updated with the latest news like S&P 500, Tariffs, Gold, Trump Admin, Tesla, etc.',
  },
});