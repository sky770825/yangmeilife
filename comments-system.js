/**
 * 評論系統 - 濬瑒房產生活平台
 * 功能：評論管理、評分系統、用戶評價
 */

class CommentsSystem {
  constructor() {
    this.comments = [];
    this.ratings = {};
    this.init();
  }

  // 初始化評論系統
  init() {
    this.loadComments();
    this.setupEventListeners();
    this.renderComments();
    this.updateRatings();
  }

  // 設置事件監聽器
  setupEventListeners() {
    // 評論表單提交
    const commentForm = document.getElementById('commentForm');
    if (commentForm) {
      commentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.submitComment();
      });
    }

    // 評分星星點擊
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('rating-star')) {
        const rating = parseInt(e.target.dataset.rating);
        const category = e.target.dataset.category;
        this.setRating(category, rating);
      }
    });
  }

  // 提交評論
  submitComment() {
    const nameInput = document.getElementById('commentName');
    const emailInput = document.getElementById('commentEmail');
    const ratingInput = document.getElementById('commentRating');
    const contentInput = document.getElementById('commentContent');

    if (!nameInput || !contentInput) return;

    const name = nameInput.value.trim();
    const email = emailInput ? emailInput.value.trim() : '';
    const rating = ratingInput ? parseInt(ratingInput.value) : 5;
    const content = contentInput.value.trim();

    // 驗證輸入
    if (!name || !content) {
      this.showMessage('請填寫姓名和評論內容', 'error');
      return;
    }

    if (content.length < 10) {
      this.showMessage('評論內容至少需要10個字', 'error');
      return;
    }

    // 創建評論對象
    const comment = {
      id: Date.now(),
      name: name,
      email: email,
      rating: rating,
      content: content,
      timestamp: new Date(),
      likes: 0,
      replies: [],
      verified: false
    };

    // 添加到評論列表
    this.comments.unshift(comment);
    this.saveComments();
    this.renderComments();
    this.updateRatings();

    // 清空表單
    nameInput.value = '';
    if (emailInput) emailInput.value = '';
    if (ratingInput) ratingInput.value = '5';
    contentInput.value = '';

    this.showMessage('評論提交成功！', 'success');
  }

  // 設置評分
  setRating(category, rating) {
    this.ratings[category] = rating;
    this.saveRatings();
    this.updateRatingDisplay(category);
    this.showMessage(`已為${this.getCategoryName(category)}評分 ${rating} 星`, 'success');
  }

  // 獲取類別名稱
  getCategoryName(category) {
    const names = {
      service: '服務品質',
      communication: '溝通能力',
      professionalism: '專業程度',
      timeliness: '準時性',
      overall: '整體滿意度'
    };
    return names[category] || category;
  }

  // 更新評分顯示
  updateRatingDisplay(category) {
    const container = document.getElementById(`rating-${category}`);
    if (!container) return;

    const rating = this.ratings[category] || 0;
    const stars = container.querySelectorAll('.rating-star');

    stars.forEach((star, index) => {
      if (index < rating) {
        star.classList.add('active');
      } else {
        star.classList.remove('active');
      }
    });

    // 更新平均評分
    this.updateAverageRating();
  }

  // 更新平均評分
  updateAverageRating() {
    const ratings = Object.values(this.ratings).filter(r => r > 0);
    if (ratings.length === 0) return;

    const average = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
    const averageElement = document.getElementById('averageRating');
    if (averageElement) {
      averageElement.textContent = average.toFixed(1);
    }

    // 更新評分分佈
    this.updateRatingDistribution();
  }

  // 更新評分分佈
  updateRatingDistribution() {
    const distribution = [0, 0, 0, 0, 0];
    this.comments.forEach(comment => {
      if (comment.rating > 0 && comment.rating <= 5) {
        distribution[comment.rating - 1]++;
      }
    });

    const total = distribution.reduce((sum, count) => sum + count, 0);
    if (total === 0) return;

    distribution.forEach((count, index) => {
      const percentage = (count / total) * 100;
      const bar = document.getElementById(`rating-bar-${index + 1}`);
      if (bar) {
        bar.style.width = `${percentage}%`;
      }
    });
  }

  // 渲染評論列表
  renderComments() {
    const container = document.getElementById('commentsList');
    if (!container) return;

    if (this.comments.length === 0) {
      container.innerHTML = '<div class="text-center text-gray-500 py-8">暫無評論</div>';
      return;
    }

    container.innerHTML = this.comments.map(comment => this.renderComment(comment)).join('');
  }

  // 渲染單個評論
  renderComment(comment) {
    const timeAgo = this.getTimeAgo(comment.timestamp);
    const verifiedBadge = comment.verified ? '<span class="verified-badge">✓ 已驗證</span>' : '';
    
    return `
      <div class="comment-item" data-id="${comment.id}">
        <div class="comment-header">
          <div class="comment-author">
            <div class="comment-avatar">
              ${comment.name.charAt(0).toUpperCase()}
            </div>
            <div class="comment-info">
              <div class="comment-name">
                ${comment.name}
                ${verifiedBadge}
              </div>
              <div class="comment-time">${timeAgo}</div>
            </div>
          </div>
          <div class="comment-rating">
            ${this.renderStars(comment.rating, false)}
          </div>
        </div>
        <div class="comment-content">
          ${this.escapeHtml(comment.content)}
        </div>
        <div class="comment-actions">
          <button onclick="commentsSystem.likeComment(${comment.id})" class="comment-action">
            👍 ${comment.likes}
          </button>
          <button onclick="commentsSystem.replyToComment(${comment.id})" class="comment-action">
            💬 回覆
          </button>
          <button onclick="commentsSystem.reportComment(${comment.id})" class="comment-action">
            🚨 檢舉
          </button>
        </div>
        <div class="comment-replies" id="replies-${comment.id}">
          ${comment.replies.map(reply => this.renderReply(reply)).join('')}
        </div>
      </div>
    `;
  }

  // 渲染回覆
  renderReply(reply) {
    const timeAgo = this.getTimeAgo(reply.timestamp);
    
    return `
      <div class="reply-item">
        <div class="reply-author">
          <div class="reply-avatar">
            ${reply.name.charAt(0).toUpperCase()}
          </div>
          <div class="reply-info">
            <div class="reply-name">${reply.name}</div>
            <div class="reply-time">${timeAgo}</div>
          </div>
        </div>
        <div class="reply-content">
          ${this.escapeHtml(reply.content)}
        </div>
      </div>
    `;
  }

  // 渲染星星評分
  renderStars(rating, interactive = true) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
      const activeClass = i <= rating ? 'active' : '';
      const interactiveClass = interactive ? 'rating-star interactive' : 'rating-star';
      stars += `<span class="${interactiveClass} ${activeClass}" data-rating="${i}">⭐</span>`;
    }
    return stars;
  }

  // 點讚評論
  likeComment(commentId) {
    const comment = this.comments.find(c => c.id === commentId);
    if (comment) {
      comment.likes++;
      this.saveComments();
      this.renderComments();
      this.showMessage('已點讚！', 'success');
    }
  }

  // 回覆評論
  replyToComment(commentId) {
    const replyContent = prompt('請輸入回覆內容：');
    if (!replyContent || replyContent.trim().length < 5) {
      this.showMessage('回覆內容至少需要5個字', 'error');
      return;
    }

    const reply = {
      id: Date.now(),
      name: '匿名用戶',
      content: replyContent.trim(),
      timestamp: new Date()
    };

    const comment = this.comments.find(c => c.id === commentId);
    if (comment) {
      comment.replies.push(reply);
      this.saveComments();
      this.renderComments();
      this.showMessage('回覆成功！', 'success');
    }
  }

  // 檢舉評論
  reportComment(commentId) {
    const reason = prompt('請選擇檢舉原因：\n1. 垃圾訊息\n2. 不當內容\n3. 虛假資訊\n4. 其他');
    if (reason) {
      this.showMessage('檢舉已提交，我們會盡快處理', 'success');
      // 這裡可以發送到後端處理
    }
  }

  // 獲取時間差
  getTimeAgo(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now - time;
    
    if (diff < 60000) return '剛剛';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分鐘前`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}小時前`;
    if (diff < 2592000000) return `${Math.floor(diff / 86400000)}天前`;
    return time.toLocaleDateString();
  }

  // HTML 轉義
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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

  // 保存評論到本地存儲
  saveComments() {
    try {
      localStorage.setItem('comments', JSON.stringify(this.comments));
    } catch (error) {
      console.error('保存評論失敗:', error);
    }
  }

  // 從本地存儲載入評論
  loadComments() {
    try {
      const saved = localStorage.getItem('comments');
      if (saved) {
        this.comments = JSON.parse(saved);
      }
    } catch (error) {
      console.error('載入評論失敗:', error);
      this.comments = [];
    }
  }

  // 保存評分到本地存儲
  saveRatings() {
    try {
      localStorage.setItem('ratings', JSON.stringify(this.ratings));
    } catch (error) {
      console.error('保存評分失敗:', error);
    }
  }

  // 從本地存儲載入評分
  loadRatings() {
    try {
      const saved = localStorage.getItem('ratings');
      if (saved) {
        this.ratings = JSON.parse(saved);
      }
    } catch (error) {
      console.error('載入評分失敗:', error);
      this.ratings = {};
    }
  }

  // 更新評分
  updateRatings() {
    this.loadRatings();
    const categories = ['service', 'communication', 'professionalism', 'timeliness', 'overall'];
    categories.forEach(category => {
      this.updateRatingDisplay(category);
    });
  }

  // 獲取統計數據
  getStatistics() {
    const totalComments = this.comments.length;
    const totalLikes = this.comments.reduce((sum, comment) => sum + comment.likes, 0);
    const averageRating = totalComments > 0 ? 
      this.comments.reduce((sum, comment) => sum + comment.rating, 0) / totalComments : 0;
    
    return {
      totalComments,
      totalLikes,
      averageRating: averageRating.toFixed(1)
    };
  }

  // 導出評論數據
  exportComments() {
    const data = {
      comments: this.comments,
      ratings: this.ratings,
      statistics: this.getStatistics(),
      exportDate: new Date()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comments-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    this.showMessage('評論數據已導出', 'success');
  }
}

// 創建全局實例
window.commentsSystem = new CommentsSystem();

// 頁面載入完成後初始化
document.addEventListener('DOMContentLoaded', function() {
  // 添加評論系統樣式
  const style = document.createElement('style');
  style.textContent = `
    .comment-item {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 15px;
      padding: 1.5rem;
      margin-bottom: 1rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }
    
    .comment-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    }
    
    .comment-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }
    
    .comment-author {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    
    .comment-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 1.1rem;
    }
    
    .comment-info {
      flex: 1;
    }
    
    .comment-name {
      font-weight: bold;
      color: #1f2937;
      margin-bottom: 0.25rem;
    }
    
    .comment-time {
      color: #6b7280;
      font-size: 0.8rem;
    }
    
    .comment-rating {
      display: flex;
      gap: 0.25rem;
    }
    
    .rating-star {
      font-size: 1.2rem;
      opacity: 0.3;
      transition: all 0.2s ease;
    }
    
    .rating-star.active {
      opacity: 1;
    }
    
    .rating-star.interactive {
      cursor: pointer;
    }
    
    .rating-star.interactive:hover {
      transform: scale(1.2);
    }
    
    .comment-content {
      color: #4b5563;
      line-height: 1.6;
      margin-bottom: 1rem;
    }
    
    .comment-actions {
      display: flex;
      gap: 1rem;
    }
    
    .comment-action {
      background: none;
      border: none;
      color: #6b7280;
      cursor: pointer;
      font-size: 0.9rem;
      padding: 0.25rem 0.5rem;
      border-radius: 5px;
      transition: all 0.2s ease;
    }
    
    .comment-action:hover {
      background: rgba(102, 126, 234, 0.1);
      color: #667eea;
    }
    
    .comment-replies {
      margin-top: 1rem;
      padding-left: 1rem;
      border-left: 2px solid #e5e7eb;
    }
    
    .reply-item {
      background: rgba(255, 255, 255, 0.5);
      border-radius: 10px;
      padding: 1rem;
      margin-bottom: 0.5rem;
    }
    
    .reply-author {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }
    
    .reply-avatar {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 0.9rem;
    }
    
    .reply-name {
      font-weight: bold;
      color: #1f2937;
      font-size: 0.9rem;
    }
    
    .reply-time {
      color: #6b7280;
      font-size: 0.8rem;
    }
    
    .reply-content {
      color: #4b5563;
      font-size: 0.9rem;
      line-height: 1.4;
    }
    
    .verified-badge {
      background: #10b981;
      color: white;
      padding: 0.125rem 0.5rem;
      border-radius: 10px;
      font-size: 0.7rem;
      margin-left: 0.5rem;
    }
    
    .dark .comment-item,
    .dark .reply-item {
      background: rgba(30, 30, 30, 0.95);
    }
    
    .dark .comment-name,
    .dark .reply-name {
      color: #f9fafb;
    }
    
    .dark .comment-content,
    .dark .reply-content {
      color: #d1d5db;
    }
    
    .dark .comment-replies {
      border-left-color: #4b5563;
    }
  `;
  document.head.appendChild(style);
});
