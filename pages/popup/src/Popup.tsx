import '@src/Popup.css';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';

const Popup = () => {
  const theme = useStorage(exampleThemeStorage);
  const isLight = theme === 'light';

  const modifyZhihuStyle = async () => {
    const [tab] = await chrome.tabs.query({ currentWindow: true, active: true });

    if (!tab.url?.includes('zhihu.com')) {
      chrome.notifications.create('zhihu-error', {
        type: 'basic',
        iconUrl: chrome.runtime.getURL('icon-34.png'),
        title: '无法修改样式',
        message: '请在知乎网站上使用此功能！',
      });
      return;
    }

    await chrome.scripting.executeScript({
      target: { tabId: tab.id! },
      func: () => {
        // 修改CSS变量
        document.documentElement.style.setProperty('--GBL01A', '#000000');

        // 查找知乎logo元素
        const logoSelector = '#root > div > div:nth-child(2) > header > div.AppHeader-inner.css-11p8nt5 > a';
        const logoContainer = document.querySelector(logoSelector);

        if (logoContainer) {
          // 替换SVG logo
          logoContainer.innerHTML = `
            <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-icon="LarkLogoColorful">
              <path d="m12.924 12.803.056-.054c.038-.034.076-.072.11-.11l.077-.076.23-.227 1.334-1.319.335-.331c.063-.063.13-.123.195-.183a7.777 7.777 0 0 1 1.823-1.24 7.607 7.607 0 0 1 1.014-.4 13.177 13.177 0 0 0-2.5-5.013 1.203 1.203 0 0 0-.94-.448h-9.65c-.173 0-.246.224-.107.325a28.23 28.23 0 0 1 8 9.098c.007-.006.016-.013.023-.022Z" fill="#00D6B9"></path>
              <path d="M9.097 21.299a13.258 13.258 0 0 0 11.82-7.247 5.576 5.576 0 0 1-.731 1.076 5.315 5.315 0 0 1-.745.7 5.117 5.117 0 0 1-.615.404 4.626 4.626 0 0 1-.726.331 5.312 5.312 0 0 1-1.883.312 5.892 5.892 0 0 1-.524-.031 6.509 6.509 0 0 1-.729-.126c-.06-.016-.12-.029-.18-.044-.166-.044-.33-.092-.494-.14-.082-.024-.164-.046-.246-.072-.123-.038-.247-.072-.366-.11l-.3-.095-.284-.094-.192-.067c-.08-.025-.155-.053-.234-.082a3.49 3.49 0 0 1-.167-.06c-.11-.04-.221-.079-.328-.12-.063-.025-.126-.047-.19-.072l-.252-.098c-.088-.035-.18-.07-.268-.107l-.174-.07c-.072-.028-.141-.06-.214-.088l-.164-.07c-.057-.024-.114-.05-.17-.075l-.149-.066-.135-.06-.14-.063a90.183 90.183 0 0 1-.141-.066 4.808 4.808 0 0 0-.18-.083c-.063-.028-.123-.06-.186-.088a5.697 5.697 0 0 1-.199-.098 27.762 27.762 0 0 1-8.067-5.969.18.18 0 0 0-.312.123l.006 9.21c0 .4.199.779.533 1a13.177 13.177 0 0 0 7.326 2.205Z" fill="#3370FF"></path>
              <path d="M23.732 9.295a7.55 7.55 0 0 0-3.35-.776 7.521 7.521 0 0 0-2.284.35c-.054.016-.107.035-.158.05a8.297 8.297 0 0 0-.855.35 7.14 7.14 0 0 0-.552.297 6.716 6.716 0 0 0-.533.347c-.123.089-.243.18-.363.275-.13.104-.252.211-.375.321-.067.06-.13.123-.196.184l-.334.328-1.338 1.321-.23.228-.076.075c-.038.038-.076.073-.11.11l-.057.054a1.914 1.914 0 0 1-.085.08c-.032.028-.063.06-.095.088a13.286 13.286 0 0 1-2.748 1.946c.06.028.12.057.18.082l.142.066c.044.022.091.041.139.063l.135.06.149.067.17.075.164.07c.073.031.142.06.215.088.056.025.116.047.173.07.088.034.177.072.268.107.085.031.168.066.253.098l.189.072c.11.041.218.082.328.12.057.019.11.041.167.06.08.028.155.053.234.082l.192.066.284.095.3.095c.123.037.243.075.366.11l.246.072c.164.048.331.095.495.14.06.015.12.03.18.043.114.029.227.05.34.07.13.022.26.04.389.057a5.815 5.815 0 0 0 .994.019 5.172 5.172 0 0 0 1.413-.3 5.405 5.405 0 0 0 .726-.334c.06-.035.122-.07.182-.108a7.96 7.96 0 0 0 .432-.297 5.362 5.362 0 0 0 .577-.517 5.285 5.285 0 0 0 .37-.429 5.797 5.797 0 0 0 .527-.827l.13-.258 1.166-2.325-.003.006a7.391 7.391 0 0 1 1.527-2.186Z" fill="#133C9A"></path>
            </svg>
            <span style="margin-left: 8px; font-size: 16px; color: #333;">飞书云文档</span>
          `;

          // 调整容器样式以适应新的内容
          logoContainer.style.display = 'flex';
          logoContainer.style.alignItems = 'center';
          logoContainer.querySelector('svg').style.width = '24px';
          logoContainer.querySelector('svg').style.height = '24px';
        }

        // 保留原始标题，不修改QuestionHeader-title元素的文本

        // 移除侧边栏元素
        const sideElements = document.querySelectorAll('.QuestionHeader-side, .Question-sideColumn');
        sideElements.forEach(element => {
          element.remove();
        });

        // 修改主内容区域宽度
        const mainColumn = document.querySelector('.Question-mainColumn');
        if (mainColumn instanceof HTMLElement) {
          mainColumn.style.width = '100%';
        }

        // 定义隐藏媒体内容的函数
        const hideMediaContent = () => {
          const answerItems = document.querySelectorAll('.AnswerItem');
          answerItems.forEach(answer => {
            // 隐藏视频
            const videos = answer.querySelectorAll('video, .VideoPlayer');
            videos.forEach(video => {
              if (video instanceof HTMLElement) {
                video.style.display = 'none';
              }
            });

            // 隐藏图片
            const images = answer.querySelectorAll('img, .origin_image, .RichContent-ZVideoItem');
            images.forEach(image => {
              if (image instanceof HTMLElement) {
                image.style.display = 'none';
              }
            });
          });
        };

        // 立即执行一次
        hideMediaContent();

        // 设置轮询，每秒执行一次
        const intervalId = setInterval(hideMediaContent, 1000);

        // 将intervalId存储在window对象上，以便需要时可以清除
        // @ts-ignore
        window.__zhihuHideMediaInterval = intervalId;
      },
    });
  };

  return (
    <div className={`App ${isLight ? 'bg-slate-50' : 'bg-gray-800'} p-4 min-w-[200px]`}>
      <div className="flex flex-col items-center space-y-4">
        <img src={chrome.runtime.getURL('icon-128.png')} alt="Logo" className="w-16 h-16 mt-10" />
        <button
          className={
            'w-full font-bold py-2 px-4 rounded shadow hover:scale-105 transition-transform ' +
            (isLight ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-blue-600 text-white hover:bg-blue-700')
          }
          onClick={modifyZhihuStyle}>
          修改知乎样式
        </button>
      </div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
