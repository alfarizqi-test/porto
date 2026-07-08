import { escapeHtml } from './utils.js';
import { text } from './text.js';

export const json = (file, content) => {
    try {
        const obj = JSON.parse(content);
        const formatted = JSON.stringify(obj, null, 2);
        return `<div class="p-4 whitespace-pre-wrap font-mono text-[#83a598]">${escapeHtml(formatted)}</div>`;
    } catch {
        return text(file, content);
    }
};
