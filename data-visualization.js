/**
 * 數據視覺化系統 - 濬瑒房產生活平台
 * 功能：房價趨勢圖、統計圖表、分析報告
 */

class DataVisualization {
  constructor() {
    this.charts = {};
    this.data = {};
    this.init();
  }

  // 初始化數據視覺化系統
  init() {
    this.loadData();
    this.setupCharts();
    this.setupEventListeners();
  }

  // 載入數據
  loadData() {
    // 模擬房價數據
    this.data.housePrices = {
      labels: ['2023-01', '2023-02', '2023-03', '2023-04', '2023-05', '2023-06', 
               '2023-07', '2023-08', '2023-09', '2023-10', '2023-11', '2023-12'],
      datasets: [{
        label: '平均房價 (萬元)',
        data: [1200, 1220, 1250, 1280, 1300, 1320, 1350, 1380, 1400, 1420, 1450, 1480],
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        tension: 0.4
      }]
    };

    // 模擬區域房價數據
    this.data.areaPrices = {
      labels: ['信義區', '大安區', '中山區', '松山區', '中正區', '萬華區'],
      datasets: [{
        label: '平均房價 (萬元)',
        data: [2500, 2200, 1800, 1600, 2000, 1200],
        backgroundColor: [
          'rgba(102, 126, 234, 0.8)',
          'rgba(79, 172, 254, 0.8)',
          'rgba(67, 233, 123, 0.8)',
          'rgba(56, 249, 215, 0.8)',
          'rgba(250, 112, 154, 0.8)',
          'rgba(254, 225, 64, 0.8)'
        ],
        borderColor: [
          '#667eea',
          '#4facfe',
          '#43e97b',
          '#38f9d7',
          '#fa709a',
          '#fee140'
        ],
        borderWidth: 2
      }]
    };

    // 模擬房型分布數據
    this.data.houseTypes = {
      labels: ['1房', '2房', '3房', '4房', '5房以上'],
      datasets: [{
        data: [15, 35, 30, 15, 5],
        backgroundColor: [
          '#667eea',
          '#4facfe',
          '#43e97b',
          '#38f9d7',
          '#fa709a'
        ],
        borderWidth: 0
      }]
    };

    // 模擬投資回報率數據
    this.data.investmentReturns = {
      labels: ['2023-01', '2023-02', '2023-03', '2023-04', '2023-05', '2023-06'],
      datasets: [{
        label: '租金報酬率 (%)',
        data: [2.8, 2.9, 3.0, 3.1, 3.2, 3.3],
        borderColor: '#43e97b',
        backgroundColor: 'rgba(67, 233, 123, 0.1)',
        tension: 0.4
      }, {
        label: '資本增值率 (%)',
        data: [1.5, 1.8, 2.0, 2.2, 2.5, 2.8],
        borderColor: '#fa709a',
        backgroundColor: 'rgba(250, 112, 154, 0.1)',
        tension: 0.4
      }]
    };

    // 模擬市場統計數據
    this.data.marketStats = {
      totalProperties: 1250,
      averagePrice: 1450,
      priceChange: 8.5,
      rentalYield: 3.2,
      transactionVolume: 850,
      marketActivity: 78
    };
  }

  // 設置圖表
  setupCharts() {
    // 等待 Chart.js 載入
    if (typeof Chart === 'undefined') {
      setTimeout(() => this.setupCharts(), 100);
      return;
    }

    this.createHousePriceChart();
    this.createAreaPriceChart();
    this.createHouseTypeChart();
    this.createInvestmentChart();
    this.updateMarketStats();
  }

  // 創建房價趨勢圖
  createHousePriceChart() {
    const ctx = document.getElementById('housePriceChart');
    if (!ctx) return;

    this.charts.housePrice = new Chart(ctx, {
      type: 'line',
      data: this.data.housePrices,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: '房價趨勢圖',
            font: {
              size: 16,
              weight: 'bold'
            }
          },
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            title: {
              display: true,
              text: '房價 (萬元)'
            }
          },
          x: {
            title: {
              display: true,
              text: '月份'
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    });
  }

  // 創建區域房價圖
  createAreaPriceChart() {
    const ctx = document.getElementById('areaPriceChart');
    if (!ctx) return;

    this.charts.areaPrice = new Chart(ctx, {
      type: 'bar',
      data: this.data.areaPrices,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: '各區域平均房價',
            font: {
              size: 16,
              weight: 'bold'
            }
          },
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: '房價 (萬元)'
            }
          },
          x: {
            title: {
              display: true,
              text: '區域'
            }
          }
        }
      }
    });
  }

  // 創建房型分布圖
  createHouseTypeChart() {
    const ctx = document.getElementById('houseTypeChart');
    if (!ctx) return;

    this.charts.houseType = new Chart(ctx, {
      type: 'doughnut',
      data: this.data.houseTypes,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: '房型分布',
            font: {
              size: 16,
              weight: 'bold'
            }
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  // 創建投資回報圖
  createInvestmentChart() {
    const ctx = document.getElementById('investmentChart');
    if (!ctx) return;

    this.charts.investment = new Chart(ctx, {
      type: 'line',
      data: this.data.investmentReturns,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: '投資回報率趨勢',
            font: {
              size: 16,
              weight: 'bold'
            }
          },
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            title: {
              display: true,
              text: '回報率 (%)'
            }
          },
          x: {
            title: {
              display: true,
              text: '月份'
            }
          }
        }
      }
    });
  }

  // 更新市場統計
  updateMarketStats() {
    const stats = this.data.marketStats;
    
    document.getElementById('totalProperties').textContent = stats.totalProperties.toLocaleString();
    document.getElementById('averagePrice').textContent = stats.averagePrice.toLocaleString();
    document.getElementById('priceChange').textContent = `+${stats.priceChange}%`;
    document.getElementById('rentalYield').textContent = `${stats.rentalYield}%`;
    document.getElementById('transactionVolume').textContent = stats.transactionVolume.toLocaleString();
    document.getElementById('marketActivity').textContent = `${stats.marketActivity}%`;
  }

  // 設置事件監聽器
  setupEventListeners() {
    // 時間範圍選擇
    const timeRangeSelect = document.getElementById('timeRange');
    if (timeRangeSelect) {
      timeRangeSelect.addEventListener('change', (e) => {
        this.updateTimeRange(e.target.value);
      });
    }

    // 區域選擇
    const areaSelect = document.getElementById('areaSelect');
    if (areaSelect) {
      areaSelect.addEventListener('change', (e) => {
        this.updateAreaData(e.target.value);
      });
    }

    // 圖表類型切換
    const chartTypeSelect = document.getElementById('chartType');
    if (chartTypeSelect) {
      chartTypeSelect.addEventListener('change', (e) => {
        this.changeChartType(e.target.value);
      });
    }
  }

  // 更新時間範圍
  updateTimeRange(range) {
    // 根據選擇的時間範圍更新數據
    let newData;
    
    switch (range) {
      case '3months':
        newData = this.data.housePrices.datasets[0].data.slice(-3);
        break;
      case '6months':
        newData = this.data.housePrices.datasets[0].data.slice(-6);
        break;
      case '1year':
        newData = this.data.housePrices.datasets[0].data;
        break;
      default:
        newData = this.data.housePrices.datasets[0].data;
    }

    if (this.charts.housePrice) {
      this.charts.housePrice.data.datasets[0].data = newData;
      this.charts.housePrice.update();
    }
  }

  // 更新區域數據
  updateAreaData(area) {
    // 根據選擇的區域更新數據
    const areaData = {
      'all': [2500, 2200, 1800, 1600, 2000, 1200],
      'xinyi': [2500, 2550, 2600, 2650, 2700, 2750],
      'daan': [2200, 2250, 2300, 2350, 2400, 2450],
      'zhongshan': [1800, 1850, 1900, 1950, 2000, 2050]
    };

    if (this.charts.areaPrice && areaData[area]) {
      this.charts.areaPrice.data.datasets[0].data = areaData[area];
      this.charts.areaPrice.update();
    }
  }

  // 改變圖表類型
  changeChartType(type) {
    const chartId = 'housePriceChart';
    const ctx = document.getElementById(chartId);
    if (!ctx || !this.charts.housePrice) return;

    // 銷毀現有圖表
    this.charts.housePrice.destroy();

    // 創建新圖表
    const config = {
      type: type,
      data: this.data.housePrices,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: '房價趨勢圖',
            font: {
              size: 16,
              weight: 'bold'
            }
          }
        }
      }
    };

    this.charts.housePrice = new Chart(ctx, config);
  }

  // 導出圖表
  exportChart(chartId) {
    const chart = this.charts[chartId];
    if (!chart) return;

    const url = chart.toBase64Image();
    const link = document.createElement('a');
    link.download = `${chartId}-${new Date().toISOString().split('T')[0]}.png`;
    link.href = url;
    link.click();
  }

  // 生成報告
  generateReport() {
    const report = {
      title: '房產市場分析報告',
      date: new Date().toLocaleDateString(),
      summary: {
        totalProperties: this.data.marketStats.totalProperties,
        averagePrice: this.data.marketStats.averagePrice,
        priceChange: this.data.marketStats.priceChange,
        rentalYield: this.data.marketStats.rentalYield
      },
      trends: {
        priceTrend: '上升',
        marketActivity: '活躍',
        investmentOpportunity: '良好'
      },
      recommendations: [
        '建議關注信義區和大安區的投資機會',
        '租金報酬率持續上升，適合長期投資',
        '市場活躍度高，交易機會增加'
      ]
    };

    // 創建報告模態框
    this.showReportModal(report);
  }

  // 顯示報告模態框
  showReportModal(report) {
    const modal = document.createElement('div');
    modal.className = 'report-modal';
    modal.innerHTML = `
      <div class="report-modal-content">
        <div class="report-modal-header">
          <h2>📊 ${report.title}</h2>
          <button class="report-modal-close" onclick="this.closest('.report-modal').remove()">×</button>
        </div>
        <div class="report-modal-body">
          <div class="report-summary">
            <h3>📈 市場摘要</h3>
            <div class="summary-grid">
              <div class="summary-item">
                <div class="summary-label">總物件數</div>
                <div class="summary-value">${report.summary.totalProperties.toLocaleString()}</div>
              </div>
              <div class="summary-item">
                <div class="summary-label">平均房價</div>
                <div class="summary-value">${report.summary.averagePrice.toLocaleString()} 萬元</div>
              </div>
              <div class="summary-item">
                <div class="summary-label">價格變動</div>
                <div class="summary-value">+${report.summary.priceChange}%</div>
              </div>
              <div class="summary-item">
                <div class="summary-label">租金報酬率</div>
                <div class="summary-value">${report.summary.rentalYield}%</div>
              </div>
            </div>
          </div>
          
          <div class="report-trends">
            <h3>📊 市場趨勢</h3>
            <div class="trends-list">
              <div class="trend-item">
                <span class="trend-label">價格趨勢：</span>
                <span class="trend-value trend-up">${report.trends.priceTrend}</span>
              </div>
              <div class="trend-item">
                <span class="trend-label">市場活躍度：</span>
                <span class="trend-value trend-active">${report.trends.marketActivity}</span>
              </div>
              <div class="trend-item">
                <span class="trend-label">投資機會：</span>
                <span class="trend-value trend-good">${report.trends.investmentOpportunity}</span>
              </div>
            </div>
          </div>
          
          <div class="report-recommendations">
            <h3>💡 投資建議</h3>
            <ul class="recommendations-list">
              ${report.recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
          </div>
        </div>
        <div class="report-modal-footer">
          <button onclick="dataViz.exportReport()" class="btn-primary">📥 導出報告</button>
          <button onclick="this.closest('.report-modal').remove()" class="btn-secondary">關閉</button>
        </div>
      </div>
      
      <style>
        .report-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          backdrop-filter: blur(5px);
        }
        
        .report-modal-content {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 15px;
          width: 90%;
          max-width: 800px;
          max-height: 80vh;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        
        .report-modal-header {
          padding: 1.5rem;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .report-modal-header h2 {
          margin: 0;
          color: #1f2937;
        }
        
        .report-modal-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          color: #6b7280;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 50%;
          transition: all 0.2s ease;
        }
        
        .report-modal-close:hover {
          background: rgba(0, 0, 0, 0.1);
          color: #374151;
        }
        
        .report-modal-body {
          padding: 1.5rem;
          max-height: 60vh;
          overflow-y: auto;
        }
        
        .report-summary,
        .report-trends,
        .report-recommendations {
          margin-bottom: 2rem;
        }
        
        .report-summary h3,
        .report-trends h3,
        .report-recommendations h3 {
          color: #1f2937;
          margin-bottom: 1rem;
        }
        
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
        }
        
        .summary-item {
          background: rgba(102, 126, 234, 0.05);
          padding: 1rem;
          border-radius: 8px;
          text-align: center;
        }
        
        .summary-label {
          color: #6b7280;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }
        
        .summary-value {
          color: #667eea;
          font-weight: bold;
          font-size: 1.2rem;
        }
        
        .trends-list {
          space-y: 0.5rem;
        }
        
        .trend-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
          border-bottom: 1px solid #f3f4f6;
        }
        
        .trend-label {
          color: #4b5563;
        }
        
        .trend-value {
          font-weight: bold;
          padding: 0.25rem 0.75rem;
          border-radius: 15px;
          font-size: 0.9rem;
        }
        
        .trend-up {
          background: #d1fae5;
          color: #065f46;
        }
        
        .trend-active {
          background: #dbeafe;
          color: #1e40af;
        }
        
        .trend-good {
          background: #fef3c7;
          color: #92400e;
        }
        
        .recommendations-list {
          list-style: none;
          padding: 0;
        }
        
        .recommendations-list li {
          padding: 0.5rem 0;
          border-bottom: 1px solid #f3f4f6;
          color: #4b5563;
        }
        
        .recommendations-list li:before {
          content: "💡 ";
          margin-right: 0.5rem;
        }
        
        .report-modal-footer {
          padding: 1.5rem;
          border-top: 1px solid #e5e7eb;
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
        }
        
        .btn-primary,
        .btn-secondary {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        
        .btn-secondary {
          background: rgba(255, 255, 255, 0.9);
          color: #667eea;
          border: 2px solid #667eea;
        }
        
        .btn-primary:hover,
        .btn-secondary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }
        
        .dark .report-modal-content {
          background: rgba(30, 30, 30, 0.95);
        }
        
        .dark .report-modal-header h2,
        .dark .report-summary h3,
        .dark .report-trends h3,
        .dark .report-recommendations h3 {
          color: #f9fafb;
        }
        
        .dark .summary-item {
          background: rgba(102, 126, 234, 0.1);
        }
        
        .dark .summary-value {
          color: #818cf8;
        }
        
        .dark .trend-item {
          border-bottom-color: #4b5563;
        }
        
        .dark .recommendations-list li {
          border-bottom-color: #4b5563;
          color: #d1d5db;
        }
      </style>
    `;

    document.body.appendChild(modal);

    // 點擊背景關閉
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }

  // 導出報告
  exportReport() {
    const reportData = {
      title: '房產市場分析報告',
      date: new Date().toLocaleDateString(),
      data: this.data,
      statistics: this.data.marketStats
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `market-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // 刷新數據
  refreshData() {
    // 模擬數據更新
    this.data.marketStats.totalProperties += Math.floor(Math.random() * 10);
    this.data.marketStats.averagePrice += Math.floor(Math.random() * 20);
    this.data.marketStats.priceChange = (Math.random() * 2).toFixed(1);
    this.data.marketStats.rentalYield = (2.5 + Math.random() * 1).toFixed(1);
    
    this.updateMarketStats();
    this.showMessage('數據已更新', 'success');
  }

  // 顯示消息
  showMessage(message, type = 'info') {
    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.textContent = message;
    
    messageEl.innerHTML += `
      <style>
        .message {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10001;
          padding: 1rem 2rem;
          border-radius: 8px;
          color: white;
          font-weight: 600;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
          animation: slideDown 0.3s ease;
        }
        
        .message-success { background: #10b981; }
        .message-error { background: #ef4444; }
        .message-warning { background: #f59e0b; }
        .message-info { background: #3b82f6; }
        
        @keyframes slideDown {
          from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
          to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
      </style>
    `;
    
    document.body.appendChild(messageEl);
    
    setTimeout(() => {
      messageEl.style.animation = 'slideUp 0.3s ease';
      setTimeout(() => messageEl.remove(), 300);
    }, 3000);
  }
}

// 創建全局實例
window.dataViz = new DataVisualization();

// 頁面載入完成後初始化
document.addEventListener('DOMContentLoaded', function() {
  // 載入 Chart.js
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
  script.onload = () => {
    dataViz.setupCharts();
  };
  document.head.appendChild(script);
});
