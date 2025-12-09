import type { UploadResult } from './types';

// Background service worker for handling extension lifecycle
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Initialize default settings
    chrome.storage.sync.set({
      settings: {
        defaultExpires: '24h',
        defaultMaxDownloads: 10,
        autoClipboard: true,
        notifications: true,
      },
      recentUploads: [],
    });

    // Open welcome page
    chrome.tabs.create({ url: 'https://kwik.gg/extension/welcome' });
  }
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'UPLOAD_COMPLETE') {
    const result: UploadResult = message.payload;
    
    // Save to recent uploads
    chrome.storage.sync.get(['recentUploads'], (data) => {
      const recent = data.recentUploads || [];
      recent.unshift(result);
      
      // Keep only last 20 uploads
      const trimmed = recent.slice(0, 20);
      chrome.storage.sync.set({ recentUploads: trimmed });
    });

    // Show notification if enabled
    chrome.storage.sync.get(['settings'], (data) => {
      if (data.settings?.notifications) {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icons/icon-128.png',
          title: 'Upload Complete',
          message: `Your file is ready: ${result.url}`,
        });
      }

      // Auto-copy if enabled
      if (data.settings?.autoClipboard) {
        copyToClipboard(result.url);
      }
    });

    sendResponse({ success: true });
  }

  return true; // Keep channel open for async response
});

// Context menu for right-click upload (optional future feature)
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'kwik-upload',
    title: 'Share with Kwik',
    contexts: ['page', 'selection', 'link'],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'kwik-upload') {
    // Open popup or inject content script
    chrome.action.openPopup();
  }
});

// Helper to copy to clipboard
function copyToClipboard(text: string) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: 'COPY_TO_CLIPBOARD',
        text,
      });
    }
  });
}

// Keep service worker alive (Chrome-specific workaround)
const keepAlive = () => setInterval(chrome.runtime.getPlatformInfo, 20000);
chrome.runtime.onStartup.addListener(keepAlive);
keepAlive();
