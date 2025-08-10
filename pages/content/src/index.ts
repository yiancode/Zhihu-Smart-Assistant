import { sampleFunction } from '@src/sampleFunction';

console.log('content script loaded');

// Shows how to call a function defined in another module
sampleFunction();

// 定义回答数据接口
interface AnswerData {
  content: string;
  author: string;
  authorAvatar?: string;
  authorBio?: string;
  upvotes: string;
  timestamp: string;
  commentCount?: string;
  url?: string;
}

// 提取回答数据的函数
function extractAnswerData(answerElement: Element, index: number): AnswerData {
  // 提取内容
  const content = answerElement.querySelector('.RichText')?.textContent?.trim() || '';

  // 提取作者信息
  const authorElement = answerElement.querySelector('.AuthorInfo-name a, .UserLink-link');
  const author = authorElement?.textContent?.trim() || `匿名用户${index + 1}`;

  // 提取作者头像
  const avatarElement = answerElement.querySelector('.AuthorInfo-avatar img, .Avatar img');
  const authorAvatar = avatarElement?.getAttribute('src') || '';

  // 提取作者简介
  const bioElement = answerElement.querySelector('.AuthorInfo-badge, .AuthorInfo-detail');
  const authorBio = bioElement?.textContent?.trim() || '';

  // 提取点赞数
  const voteElement = answerElement.querySelector('.VoteButton--up .VoteButton-count, .VoteButton--up');
  let upvotes = '0';
  if (voteElement) {
    const voteText = voteElement.textContent?.trim() || '0';
    // 处理知乎的点赞数格式（如 1.2k, 2.3w 等）
    upvotes = voteText === '' ? '0' : voteText;
  }

  // 提取时间信息
  const timeElement = answerElement.querySelector(
    '.ContentItem-time, .AnswerItem-time, [data-tooltip*="发布"], [data-tooltip*="编辑"]',
  );
  let timestamp = new Date().toLocaleDateString();
  if (timeElement) {
    const timeText = timeElement.textContent?.trim();
    const tooltipTime = timeElement.getAttribute('data-tooltip');
    timestamp = tooltipTime || timeText || timestamp;
  }

  // 提取评论数
  const commentElement = answerElement.querySelector(
    '.Button--plain:has(.Icon-comment), .ContentItem-actions .Button[data-za-detail-view-element_name="Comment"]',
  );
  let commentCount = '0';
  if (commentElement) {
    const commentText = commentElement.textContent?.trim() || '0';
    commentCount = commentText.replace(/[^\d]/g, '') || '0';
  }

  // 提取回答链接
  const linkElement = answerElement.querySelector('.ContentItem-title a, .AnswerItem-title a');
  const url = linkElement?.getAttribute('href') || window.location.href;

  return {
    content,
    author,
    authorAvatar,
    authorBio,
    upvotes,
    timestamp,
    commentCount,
    url: url.startsWith('http') ? url : `https://www.zhihu.com${url}`,
  };
}

// 生成组合文本的函数
function generateCombinedText(answersData: AnswerData[]): string {
  return answersData
    .map((answer, index) => {
      return `回答 ${index + 1}:
作者: ${answer.author}${answer.authorBio ? ` (${answer.authorBio})` : ''}
点赞数: ${answer.upvotes}
发布时间: ${answer.timestamp}
${answer.commentCount ? `评论数: ${answer.commentCount}` : ''}

${answer.content}

${'='.repeat(50)}

`;
    })
    .join('');
}

// 创建悬浮按钮
function createFloatingButton() {
  const button = document.createElement('button');
  button.textContent = '复制答案';
  button.style.cssText = `
    position: fixed;
    right: 20px;
    bottom: 20px;
    z-index: 9999;
    padding: 10px 20px;
    background-color: #1890ff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    font-size: 14px;
    transition: all 0.2s ease;
  `;

  // 添加悬停效果
  button.addEventListener('mouseover', () => {
    button.style.backgroundColor = '#40a9ff';
    button.style.transform = 'translateY(-1px)';
  });
  button.addEventListener('mouseout', () => {
    button.style.backgroundColor = '#1890ff';
    button.style.transform = 'translateY(0)';
  });

  // 点击事件处理
  button.addEventListener('click', async () => {
    try {
      // 更新按钮状态
      button.textContent = '提取中...';
      button.style.backgroundColor = '#ffa500';

      // 获取所有回答元素
      const answerElements = document.querySelectorAll('.AnswerItem, .List-item .AnswerItem');

      if (answerElements.length === 0) {
        throw new Error('未找到任何回答，请确认您在知乎问题页面');
      }

      // 提取所有回答数据
      const answersData: AnswerData[] = [];
      answerElements.forEach((element, index) => {
        try {
          const answerData = extractAnswerData(element, index);
          if (answerData.content.trim()) {
            // 只添加有内容的回答
            answersData.push(answerData);
          }
        } catch (err) {
          console.warn(`提取第 ${index + 1} 个回答失败:`, err);
        }
      });

      if (answersData.length === 0) {
        throw new Error('未能提取到有效的回答内容');
      }

      // 生成组合文本
      const combinedText = generateCombinedText(answersData);

      // 复制到剪贴板
      await navigator.clipboard.writeText(combinedText);

      // 发送数据到侧边栏（保持原有格式兼容性）
      chrome.runtime.sendMessage({
        type: 'zhihuAnswers',
        answers: answersData.map(data => data.content), // 发送内容数组保持兼容
        answersData: answersData, // 发送完整数据
        metadata: {
          totalAnswers: answersData.length,
          extractTime: new Date().toISOString(),
          pageUrl: window.location.href,
          questionTitle:
            document.querySelector('.QuestionHeader-title, .ContentItem-title')?.textContent?.trim() || '未知问题',
        },
      });

      // 显示成功提示
      showToast(`已复制 ${answersData.length} 条回答到剪贴板`, 'success');

      // 恢复按钮状态
      button.textContent = '复制答案';
      button.style.backgroundColor = '#1890ff';
    } catch (err) {
      console.error('复制失败:', err);
      showToast(err instanceof Error ? err.message : '复制失败，请重试', 'error');

      // 恢复按钮状态
      button.textContent = '复制答案';
      button.style.backgroundColor = '#1890ff';
    }
  });

  document.body.appendChild(button);
}

// 显示提示的函数
function showToast(message: string, type: 'success' | 'error' = 'success') {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: ${type === 'success' ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)'};
    color: white;
    padding: 12px 24px;
    border-radius: 6px;
    z-index: 10000;
    font-size: 14px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    max-width: 300px;
    text-align: center;
    animation: toastFadeIn 0.3s ease-out;
  `;

  // 添加动画样式
  const style = document.createElement('style');
  style.textContent = `
    @keyframes toastFadeIn {
      from { opacity: 0; transform: translate(-50%, -60%); }
      to { opacity: 1; transform: translate(-50%, -50%); }
    }
  `;
  document.head.appendChild(style);

  document.body.appendChild(toast);

  // 自动移除提示
  setTimeout(
    () => {
      toast.style.animation = 'toastFadeIn 0.3s ease-out reverse';
      setTimeout(() => {
        toast.remove();
        style.remove();
      }, 300);
    },
    type === 'success' ? 2000 : 3000,
  );
}

// 监听页面变化，重新创建按钮（适应SPA页面）
let lastUrl = location.href;
function checkForUrlChange() {
  const currentUrl = location.href;
  if (currentUrl !== lastUrl) {
    lastUrl = currentUrl;
    // URL变化时，移除旧按钮并创建新按钮
    const existingButton = document.querySelector('button[style*="position: fixed"][style*="right: 20px"]');
    if (existingButton) {
      existingButton.remove();
    }
    setTimeout(createFloatingButton, 1000); // 延迟创建，等待页面加载
  }
}

// 页面加载完成后创建按钮
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createFloatingButton);
} else {
  createFloatingButton();
}

// 监听页面变化
setInterval(checkForUrlChange, 1000);
