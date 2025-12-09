import type { UploadOptions, UploadProgress, UploadResult, StorageData } from './types';

const API_URL = 'https://kwik.gg/api';

// State
let currentFile: File | null = null;
let settings: StorageData['settings'] = {
  defaultExpires: '24h',
  defaultMaxDownloads: 10,
  autoClipboard: true,
  notifications: true,
};

// DOM Elements
const dropzone = document.getElementById('dropzone') as HTMLDivElement;
const fileInput = document.getElementById('fileInput') as HTMLInputElement;
const uploadSection = document.getElementById('uploadSection') as HTMLDivElement;
const progressSection = document.getElementById('progressSection') as HTMLDivElement;
const resultSection = document.getElementById('resultSection') as HTMLDivElement;
const progressBar = document.getElementById('progressBar') as HTMLDivElement;
const progressText = document.getElementById('progressText') as HTMLSpanElement;
const progressDetails = document.getElementById('progressDetails') as HTMLSpanElement;
const resultUrl = document.getElementById('resultUrl') as HTMLInputElement;
const copyBtn = document.getElementById('copyBtn') as HTMLButtonElement;
const newUploadBtn = document.getElementById('newUploadBtn') as HTMLButtonElement;
const settingsBtn = document.getElementById('settingsBtn') as HTMLButtonElement;
const expiresSelect = document.getElementById('expires') as HTMLSelectElement;
const maxDownloadsInput = document.getElementById('maxDownloads') as HTMLInputElement;

// Initialize
loadSettings();

// Event Listeners
dropzone.addEventListener('click', () => fileInput.click());
dropzone.addEventListener('dragover', handleDragOver);
dropzone.addEventListener('dragleave', handleDragLeave);
dropzone.addEventListener('drop', handleDrop);
fileInput.addEventListener('change', handleFileSelect);
copyBtn.addEventListener('click', handleCopy);
newUploadBtn.addEventListener('click', reset);
settingsBtn.addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});
expiresSelect.addEventListener('change', saveSettings);
maxDownloadsInput.addEventListener('change', saveSettings);

// Load settings from storage
function loadSettings() {
  chrome.storage.sync.get(['settings'], (data) => {
    if (data.settings) {
      settings = data.settings;
      expiresSelect.value = settings.defaultExpires;
      maxDownloadsInput.value = String(settings.defaultMaxDownloads);
    }
  });
}

// Save settings to storage
function saveSettings() {
  settings.defaultExpires = expiresSelect.value;
  settings.defaultMaxDownloads = parseInt(maxDownloadsInput.value, 10);
  
  chrome.storage.sync.set({
    settings,
  });
}

// Drag & Drop handlers
function handleDragOver(e: DragEvent) {
  e.preventDefault();
  e.stopPropagation();
  dropzone.classList.add('dragging');
}

function handleDragLeave() {
  dropzone.classList.remove('dragging');
}

function handleDrop(e: DragEvent) {
  e.preventDefault();
  e.stopPropagation();
  dropzone.classList.remove('dragging');

  if (e.dataTransfer?.files.length) {
    handleFile(e.dataTransfer.files[0]);
  }
}

function handleFileSelect() {
  if (fileInput.files && fileInput.files.length > 0) {
    handleFile(fileInput.files[0]);
  }
}

async function handleFile(file: File) {
  currentFile = file;
  
  // Show progress section
  uploadSection.classList.add('hidden');
  progressSection.classList.remove('hidden');

  try {
    const result = await uploadFile(file, {
      expires: expiresSelect.value,
      maxDownloads: parseInt(maxDownloadsInput.value, 10),
    });

    showResult(result);
    
    // Notify background script
    chrome.runtime.sendMessage({
      type: 'UPLOAD_COMPLETE',
      payload: result,
    });
  } catch (error) {
    showError((error as Error).message);
  }
}

async function uploadFile(file: File, options: UploadOptions): Promise<UploadResult> {
  const chunkSize = 5 * 1024 * 1024; // 5MB
  const totalChunks = Math.ceil(file.size / chunkSize);

  // Simulate encryption progress
  for (let i = 0; i < totalChunks; i++) {
    const percentage = Math.round(((i + 1) / totalChunks) * 50);
    updateProgress({
      stage: 'encrypting',
      percentage,
      bytesProcessed: (i + 1) * chunkSize,
      totalBytes: file.size,
    });
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Upload
  const formData = new FormData();
  formData.append('file', file);
  formData.append('expires', options.expires || '24h');
  formData.append('maxDownloads', String(options.maxDownloads || 10));

  const response = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }

  const result: UploadResult = await response.json();

  updateProgress({
    stage: 'complete',
    percentage: 100,
    bytesProcessed: file.size,
    totalBytes: file.size,
  });

  return result;
}

function updateProgress(progress: UploadProgress) {
  progressBar.style.width = `${progress.percentage}%`;
  
  const stage = progress.stage === 'encrypting' ? 'Encrypting' : 'Uploading';
  progressText.textContent = `${stage} ${progress.percentage}%`;
  
  if (progress.speed && progress.eta) {
    progressDetails.textContent = `${formatBytes(progress.speed)}/s • ${Math.round(progress.eta)}s remaining`;
  }
}

function showResult(result: UploadResult) {
  progressSection.classList.add('hidden');
  resultSection.classList.remove('hidden');
  resultUrl.value = result.url;
}

function showError(message: string) {
  progressSection.classList.add('hidden');
  uploadSection.classList.remove('hidden');
  alert(`Error: ${message}`);
}

async function handleCopy() {
  try {
    await navigator.clipboard.writeText(resultUrl.value);
    copyBtn.textContent = '✓ Copied';
    copyBtn.classList.add('success');
    setTimeout(() => {
      copyBtn.textContent = 'Copy';
      copyBtn.classList.remove('success');
    }, 2000);
  } catch (err) {
    console.error('Failed to copy:', err);
  }
}

function reset() {
  currentFile = null;
  fileInput.value = '';
  uploadSection.classList.remove('hidden');
  progressSection.classList.add('hidden');
  resultSection.classList.add('hidden');
  progressBar.style.width = '0%';
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
