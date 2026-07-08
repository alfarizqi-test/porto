import { escapeHtml } from '../renderers/utils.js';

export const rust = (content) => {
    let formatted = escapeHtml(content);
    formatted = formatted.replace(/"(.*?)"/g, '<span class="text-[#b8bb26]">"$1"</span>');
    const keywords = ['struct', 'fn', 'let', 'mut', 'impl', 'pub', 'return', 'String', 'Vec', 'Option', 'Some', 'None'];
    keywords.forEach(kw => {
        const regex = new RegExp(`\\b${kw}\\b`, 'g');
        formatted = formatted.replace(regex, `<span class="text-[#fb4934]">${kw}</span>`);
    });
    formatted = formatted.replace(/\b([a-z_]+!)/g, '<span class="text-[#8ec07c]">$1</span>');
    formatted = formatted.replace(/#\[(.*?)\]/g, '<span class="text-[#d3869b]">#[$1]</span>');
    
    return formatted;
};

export const javascript = (content) => {
    let formatted = escapeHtml(content);
    formatted = formatted.replace(/"(.*?)"/g, '<span class="text-[#b8bb26]">"$1"</span>');
    formatted = formatted.replace(/'(.*?)'/g, '<span class="text-[#b8bb26]">\'$1\'</span>');
    formatted = formatted.replace(/`(.*?)`/g, '<span class="text-[#b8bb26]">\`$1\`</span>');
    formatted = formatted.replace(/(\/\*\*[\s\S]*?\*\/)/g, '<span class="text-[#928374]">$1</span>');
    const keywords = ['const', 'let', 'var', 'function', 'return', 'import', 'export', 'class', 'default', 'this'];
    keywords.forEach(kw => {
        const regex = new RegExp(`\\b${kw}\\b`, 'g');
        formatted = formatted.replace(regex, `<span class="text-[#fb4934]">${kw}</span>`);
    });
    formatted = formatted.replace(/\b([a-zA-Z_0-9]+)(?=\()/g, '<span class="text-[#8ec07c]">$1</span>');
    
    return formatted;
};

export const php = (content) => {
    let formatted = escapeHtml(content);
    formatted = formatted.replace(/"(.*?)"/g, '<span class="text-[#b8bb26]">"$1"</span>');
    formatted = formatted.replace(/'(.*?)'/g, '<span class="text-[#b8bb26]">\'$1\'</span>');
    formatted = formatted.replace(/(&lt;\?php)/g, '<span class="text-[#fb4934]">$1</span>');
    formatted = formatted.replace(/(\/\*\*[\s\S]*?\*\/)/g, '<span class="text-[#928374]">$1</span>');
    formatted = formatted.replace(/(\$[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*)/g, '<span class="text-[#8ec07c]">$1</span>');
    const keywords = ['class', 'function', 'public', 'private', 'protected', 'return', 'namespace', 'use', 'array', 'string'];
    keywords.forEach(kw => {
        const regex = new RegExp(`\\b${kw}\\b`, 'g');
        formatted = formatted.replace(regex, `<span class="text-[#fb4934]">${kw}</span>`);
    });
    
    return formatted;
};

export const json = (content) => {
    let formatted = escapeHtml(content);
    formatted = formatted.replace(/"(.*?)":/g, '<span class="text-[#83a598]">"$1"</span>:');
    formatted = formatted.replace(/: "(.*?)"/g, ': <span class="text-[#b8bb26]">"$1"</span>');
    return formatted;
};

export const yaml = (content) => {
    let formatted = escapeHtml(content);
    formatted = formatted.replace(/^([\s-]*)([\w-]+):/gm, '$1<span class="text-[#83a598]">$2</span>:');
    return formatted;
};

export const toml = (content) => {
    let formatted = escapeHtml(content);
    // Strings didahulukan di TOML
    formatted = formatted.replace(/"(.*?)"/g, '<span class="text-[#b8bb26]">"$1"</span>');
    formatted = formatted.replace(/^\[(.*?)\]/gm, '<span class="text-[#8ec07c]">[$1]</span>');
    formatted = formatted.replace(/^([\w-]+)\s*=/gm, '<span class="text-[#83a598]">$1</span> =');
    return formatted;
};

export const markdown = (content) => {
    let html = escapeHtml(content);
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-[#fabd2f] mt-4 mb-2">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-[#b8bb26] mt-4 mb-2">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-[#fb4934] mt-4 mb-4">$1</h1>');
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong class="font-bold text-[#ebdbb2]">$1</strong>');
    html = html.replace(/`(.*?)`/gim, '<code class="bg-[#3c3836] px-1 rounded text-[#d3869b]">$1</code>');
    html = html.replace(/^\- (.*$)/gim, '<li class="ml-4 list-disc">$1</li>');
    html = html.replace(/```([\s\S]*?)```/gim, '<pre class="bg-[#282828] p-4 rounded mt-2 mb-2 text-[#83a598] border border-[#504945]"><code>$1</code></pre>');
    return html;
};

export const text = (content) => {
    return escapeHtml(content);
};

export const syntax = {
    rust,
    javascript,
    php,
    json,
    yaml,
    markdown,
    toml,
    text
};