import '@src/SidePanel.css';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import type { ComponentPropsWithoutRef } from 'react';
import { useEffect, useState, useCallback } from 'react';

interface AnswerData {
  content: string;
  author?: string;
  authorAvatar?: string;
  authorBio?: string;
  upvotes?: string;
  timestamp?: string;
  commentCount?: string;
  url?: string;
}

interface MessageData {
  type: string;
  answers: string[]; // 向后兼容
  answersData?: AnswerData[]; // 新的完整数据
  metadata?: {
    totalAnswers: number;
    extractTime: string;
    pageUrl: string;
    questionTitle: string;
  };
}

const PREVIEW_LENGTH = 200; // 预览文本长度

const SidePanel = () => {
  const theme = useStorage(exampleThemeStorage);
  const isLight = theme === 'light';
  const [answers, setAnswers] = useState<AnswerData[]>([]);
  const [visibleAnswers, setVisibleAnswers] = useState<AnswerData[]>([]);
  const [expandedAnswers, setExpandedAnswers] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [metadata, setMetadata] = useState<MessageData['metadata']>();

  // 转换旧格式数据到新格式
  const convertLegacyData = (answers: string[]): AnswerData[] => {
    return answers.map((content, index) => ({
      content,
      author: `用户${index + 1}`,
      upvotes: '未知',
      timestamp: new Date().toLocaleTimeString(),
    }));
  };

  useEffect(() => {
    // 监听来自content script的消息
    chrome.runtime.onMessage.addListener((message: MessageData, sender, sendResponse) => {
      if (message.type === 'zhihuAnswers') {
        // 优先使用新的完整数据，如果没有则转换旧数据
        const newAnswers = message.answersData || convertLegacyData(message.answers);

        setAnswers(newAnswers);
        setMetadata(message.metadata);
        setIsLoading(true);
        setExpandedAnswers(new Set());

        // 重置可见答案
        setVisibleAnswers([]);

        // 逐条显示答案
        newAnswers.forEach((answer, index) => {
          setTimeout(() => {
            setVisibleAnswers(prev => [...prev, answer]);

            // 最后一条答案显示后，结束加载状态
            if (index === newAnswers.length - 1) {
              setTimeout(() => setIsLoading(false), 300);
            }
          }, index * 500); // 每500ms显示一条
        });
      }
    });
  }, []);

  // 切换展开/收起状态
  const toggleExpanded = useCallback((index: number) => {
    setExpandedAnswers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  }, []);

  // 复制单个回答
  const copyAnswer = useCallback(async (answer: AnswerData, index: number) => {
    try {
      const copyText = `回答 ${index + 1}:
作者: ${answer.author || '未知用户'}${answer.authorBio ? ` (${answer.authorBio})` : ''}
点赞数: ${answer.upvotes || '0'}
发布时间: ${answer.timestamp || '未知'}
${answer.commentCount ? `评论数: ${answer.commentCount}` : ''}

${answer.content}`;

      await navigator.clipboard.writeText(copyText);

      // 显示复制成功提示
      const toast = document.createElement('div');
      toast.textContent = `已复制回答 ${index + 1}`;
      toast.className = 'copy-toast';
      document.body.appendChild(toast);

      setTimeout(() => {
        toast.remove();
      }, 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  }, []);

  // 清空所有回答
  const clearAnswers = useCallback(() => {
    setAnswers([]);
    setVisibleAnswers([]);
    setExpandedAnswers(new Set());
    setMetadata(undefined);
  }, []);

  // 复制所有回答
  const copyAllAnswers = useCallback(async () => {
    if (answers.length === 0) return;

    try {
      const allText = answers
        .map(
          (answer, index) => `回答 ${index + 1}:
作者: ${answer.author || '未知用户'}${answer.authorBio ? ` (${answer.authorBio})` : ''}
点赞数: ${answer.upvotes || '0'}
发布时间: ${answer.timestamp || '未知'}
${answer.commentCount ? `评论数: ${answer.commentCount}` : ''}

${answer.content}

${'='.repeat(50)}`,
        )
        .join('\n\n');

      await navigator.clipboard.writeText(allText);

      const toast = document.createElement('div');
      toast.textContent = `已复制所有 ${answers.length} 条回答`;
      toast.className = 'copy-toast';
      document.body.appendChild(toast);

      setTimeout(() => {
        toast.remove();
      }, 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  }, [answers]);

  // 过滤答案
  const filteredAnswers = visibleAnswers.filter(
    answer =>
      searchTerm === '' ||
      answer.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      answer.author?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const themeClass = isLight ? '' : 'dark-theme';

  return (
    <div className={`App ${themeClass}`}>
      <div className="answers-container">
        <div className="panel-header">
          <h1 className="panel-title">知乎回答内容</h1>

          {/* 元数据显示 */}
          {metadata && (
            <div className="metadata-info">
              <div className="question-title">{metadata.questionTitle}</div>
              <div className="extract-info">提取时间: {new Date(metadata.extractTime).toLocaleString()}</div>
            </div>
          )}

          {/* 搜索框和操作按钮 */}
          {answers.length > 0 && (
            <div className="panel-controls">
              <input
                type="text"
                placeholder="搜索回答内容或作者..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <div className="control-buttons">
                <button onClick={copyAllAnswers} className="copy-all-button">
                  全部复制
                </button>
                <button onClick={clearAnswers} className="clear-button">
                  清空
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 空状态 */}
        {answers.length === 0 && !isLoading && (
          <div className="empty-state">
            <div className="empty-state-icon">📝</div>
            <p>暂无内容</p>
            <p style={{ fontSize: '0.85rem', marginTop: '8px' }}>在知乎页面点击"复制答案"按钮来获取内容</p>
          </div>
        )}

        {/* 加载状态 */}
        {isLoading && visibleAnswers.length < answers.length && (
          <div className="loading-state">
            <div className="loading-dots">
              <div></div>
              <div></div>
              <div></div>
            </div>
            <p style={{ marginTop: '16px' }}>正在加载答案...</p>
          </div>
        )}

        {/* 答案统计 */}
        {filteredAnswers.length > 0 && (
          <div className="answers-stats">
            {searchTerm
              ? `搜索结果: ${filteredAnswers.length}/${answers.length}`
              : `共找到 ${filteredAnswers.length} 条回答`}
          </div>
        )}

        {/* 答案列表 */}
        {filteredAnswers.map((answer, index) => {
          const originalIndex = visibleAnswers.findIndex(a => a === answer);
          const isExpanded = expandedAnswers.has(originalIndex);
          const needsTruncation = answer.content.length > PREVIEW_LENGTH;
          const displayContent =
            isExpanded || !needsTruncation ? answer.content : answer.content.substring(0, PREVIEW_LENGTH) + '...';

          return (
            <div key={originalIndex} className="answer-item">
              <div className="answer-header">
                <div className="answer-title">
                  <span className="answer-number">回答 {originalIndex + 1}</span>
                  <div className="answer-meta">
                    <span className="author-info">
                      {answer.author || '未知用户'}
                      {answer.authorBio && <span className="author-bio"> • {answer.authorBio}</span>}
                    </span>
                    <div className="answer-stats">
                      {answer.upvotes && <span className="upvotes">👍 {answer.upvotes}</span>}
                      {answer.commentCount && <span className="comments">💬 {answer.commentCount}</span>}
                      {answer.timestamp && <span className="timestamp">🕒 {answer.timestamp}</span>}
                    </div>
                  </div>
                </div>
                <div className="answer-actions">
                  <button
                    onClick={() => copyAnswer(answer, originalIndex)}
                    className="action-button copy-button"
                    title="复制这条回答">
                    📋
                  </button>
                </div>
              </div>

              <div className="answer-content">{displayContent}</div>

              {needsTruncation && (
                <div className="answer-footer">
                  <button onClick={() => toggleExpanded(originalIndex)} className="expand-button">
                    {isExpanded ? '收起' : '展开全文'}
                    <span className="expand-icon">{isExpanded ? '↑' : '↓'}</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ToggleButton = (props: ComponentPropsWithoutRef<'button'>) => {
  const theme = useStorage(exampleThemeStorage);
  return (
    <button
      className={
        props.className +
        ' ' +
        'font-bold mt-4 py-1 px-4 rounded shadow hover:scale-105 ' +
        (theme === 'light' ? 'bg-white text-black' : 'bg-black text-white')
      }
      onClick={exampleThemeStorage.toggle}>
      {props.children}
    </button>
  );
};

export default withErrorBoundary(withSuspense(SidePanel, <div> Loading ... </div>), <div> Error Occur </div>);
