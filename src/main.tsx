import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// 设置viewport元标签（防止移动端缩放）
const viewport = document.querySelector('meta[name=viewport]');
if (viewport) {
  viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no');
}

// 防止移动端双击缩放
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
  const now = (new Date()).getTime();
  if (now - lastTouchEnd <= 300) {
    e.preventDefault();
  }
  lastTouchEnd = now;
}, false);

// 防止iOS橡皮筋效果
document.addEventListener('touchmove', (e) => {
  if ((e.target as Element).closest('.overflow-y-auto, .overflow-auto')) {
    return;
  }
  e.preventDefault();
}, { passive: false });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)