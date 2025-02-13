import { sampleFunction } from '@src/sampleFunction';

console.log('content script loaded');

// Shows how to call a function defined in another module
sampleFunction();

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
  `;

  // 添加悬停效果
  button.addEventListener('mouseover', () => {
    button.style.backgroundColor = '#40a9ff';
  });
  button.addEventListener('mouseout', () => {
    button.style.backgroundColor = '#1890ff';
  });

  // 点击事件处理
  button.addEventListener('click', async () => {
    // 获取所有回答内容
    const answers = document.querySelectorAll('.AnswerItem');
    let combinedText = '';
    const answerTexts: string[] = [];

    answers.forEach((answer, index) => {
      // 获取回答文本内容
      const content = answer.querySelector('.RichText')?.textContent || '';
      combinedText += `回答 ${index + 1}:\n${content}\n\n`;
      answerTexts.push(content);
    });

    try {
      // 复制到剪贴板
      await navigator.clipboard.writeText(combinedText);

      // 发送答案内容到侧边栏
      chrome.runtime.sendMessage({
        type: 'zhihuAnswers',
        answers: answerTexts,
      });

      // 显示成功提示
      const toast = document.createElement('div');
      toast.textContent = '已复制所有回答内容到剪贴板';
      toast.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 10px 20px;
        border-radius: 4px;
        z-index: 10000;
      `;
      document.body.appendChild(toast);

      // 2秒后移除提示
      setTimeout(() => {
        toast.remove();
      }, 2000);
    } catch (err) {
      console.error('复制失败:', err);
      alert('复制失败，请重试');
    }
  });

  document.body.appendChild(button);
}

// 页面加载完成后创建按钮
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createFloatingButton);
} else {
  createFloatingButton();
}
