import '@src/SidePanel.css';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import type { ComponentPropsWithoutRef } from 'react';
import { useEffect, useState } from 'react';

const SidePanel = () => {
  const theme = useStorage(exampleThemeStorage);
  const isLight = theme === 'light';
  const [answers, setAnswers] = useState<string[]>([]);
  const [visibleAnswers, setVisibleAnswers] = useState<string[]>([]);

  useEffect(() => {
    // 监听来自content script的消息
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'zhihuAnswers') {
        const newAnswers = message.answers as string[];
        setAnswers(newAnswers);

        // 重置可见答案
        setVisibleAnswers([]);

        // 逐条显示答案
        newAnswers.forEach((answer, index) => {
          setTimeout(() => {
            setVisibleAnswers(prev => [...prev, answer]);
          }, index * 500); // 每500ms显示一条
        });
      }
    });
  }, []);

  return (
    <div className={`App ${isLight ? 'bg-slate-50' : 'bg-gray-800'} h-full`}>
      <div className={`p-4 ${isLight ? 'text-gray-900' : 'text-gray-100'}`}>
        <h1 className="text-xl font-bold mb-4">知乎回答内容</h1>
        <div className="space-y-4 overflow-auto max-h-[90vh]">
          {visibleAnswers.map((answer, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                isLight ? 'bg-white shadow-md' : 'bg-gray-700'
              } transition-opacity duration-500 ease-in-out`}>
              <h2 className="font-bold mb-2">回答 {index + 1}</h2>
              <div className="whitespace-pre-wrap">{answer}</div>
            </div>
          ))}
        </div>
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
