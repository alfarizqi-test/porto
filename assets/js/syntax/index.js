import { escapeHtml } from '../renderers/utils.js';

const renderTokens = (text) => {
    return text
        .replace(/__RED__/g, '<span class="text-[#fb4934]">')
        .replace(/__GRN__/g, '<span class="text-[#b8bb26]">')
        .replace(/__AQU__/g, '<span class="text-[#8ec07c]">')
        .replace(/__PUR__/g, '<span class="text-[#d3869b]">')
        .replace(/__BLU__/g, '<span class="text-[#83a598]">')
        .replace(/__GRY__/g, '<span class="text-[#928374]">')
        .replace(/__END__/g, '</span>');
};

export const rust = (content) => {
    let formatted = escapeHtml(content);
    formatted = formatted.replace(/"(.*?)"/g, '__GRN__"$1"__END__');
    const keywords = ['struct', 'fn', 'let', 'mut', 'impl', 'pub', 'return', 'String', 'Vec', 'Option', 'Some', 'None'];
    keywords.forEach(kw => {
        const regex = new RegExp(`\\b${kw}\\b`, 'g');
        formatted = formatted.replace(regex, `__RED__${kw}__END__`);
    });
    formatted = formatted.replace(/\b([a-z_]+!)/g, '__AQU__$1__END__');
    formatted = formatted.replace(/#\[(.*?)\]/g, '__PUR__#[$1]__END__');
    return renderTokens(formatted); 
};

export const javascript = (content) => {
    let formatted = escapeHtml(content);
    formatted = formatted.replace(/"(.*?)"/g, '__GRN__"$1"__END__');
    formatted = formatted.replace(/'(.*?)'/g, '__GRN__\'$1\'__END__');
    formatted = formatted.replace(/`(.*?)`/g, '__GRN__`$1`__END__');
    formatted = formatted.replace(/(\/\*\*[\s\S]*?\*\/)/g, '__GRY__$1__END__');
    const keywords = ['const', 'let', 'var', 'function', 'return', 'import', 'export', 'class', 'default', 'this'];
    keywords.forEach(kw => {
        const regex = new RegExp(`\\b${kw}\\b`, 'g');
        formatted = formatted.replace(regex, `__RED__${kw}__END__`);
    });
    formatted = formatted.replace(/\b([a-zA-Z_0-9]+)(?=\()/g, '__AQU__$1__END__');
    return renderTokens(formatted);
};

export const php = (content) => {
    let formatted = escapeHtml(content);
    formatted = formatted.replace(/"(.*?)"/g, '__GRN__"$1"__END__');
    formatted = formatted.replace(/'(.*?)'/g, '__GRN__\'$1\'__END__');
    formatted = formatted.replace(/(\/\*\*[\s\S]*?\*\/)/g, '__GRY__$1__END__');
    formatted = formatted.replace(/(&lt;\?php)/g, '__RED__$1__END__');
    formatted = formatted.replace(/(\$[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*)/g, '__AQU__$1__END__');
    const keywords = ['class', 'function', 'public', 'private', 'protected', 'return', 'namespace', 'use', 'array', 'string'];
    keywords.forEach(kw => {
        const regex = new RegExp(`\\b${kw}\\b`, 'g');
        formatted = formatted.replace(regex, `__RED__${kw}__END__`);
    });
    return renderTokens(formatted); 
};

export const json = (content) => {
    let formatted = escapeHtml(content);
    formatted = formatted.replace(/"(.*?)":/g, '__BLU__"$1"__END__:');
    formatted = formatted.replace(/: "(.*?)"/g, ': __GRN__"$1"__END__');
    return renderTokens(formatted);
};

export const yaml = (content) => {
    let formatted = escapeHtml(content);
    formatted = formatted.replace(/^([\s-]*)([\w-]+):/gm, '$1__BLU__$2__END__:');
    return renderTokens(formatted);
};

export const toml = (content) => {
    let formatted = escapeHtml(content);
    formatted = formatted.replace(/"(.*?)"/g, '__GRN__"$1"__END__');
    formatted = formatted.replace(/^\[(.*?)\]/gm, '__AQU__[$1]__END__');
    formatted = formatted.replace(/^([\w-]+)\s*=/gm, '__BLU__$1__END__ =');
    return renderTokens(formatted);
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