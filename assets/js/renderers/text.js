import { escapeHtml } from './utils.js';

export const text = (file, content) => {
    return `<div class="p-4 whitespace-pre-wrap font-mono">${escapeHtml(content)}</div>`;
};
