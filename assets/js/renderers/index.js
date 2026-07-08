import { syntax } from '../syntax/index.js';
import { state } from '../state.js';

const applySyntax = (language, rawText) => {
    const highlighter = syntax[language] || syntax.text;
    const highlighted = highlighter(rawText);
    if (language === 'markdown') {
        return `<div class="p-4 font-mono text-[#a89984]">${highlighted}</div>`;
    }
    return `<div class="p-4 whitespace-pre-wrap font-mono">${highlighted}</div>`;
};

export const root = () => {
    // Kamu bisa menghubungkan variabel ini dengan API dinamis jika ada,
    // atau biarkan static seperti ini untuk performa TUI yang instan.
    return `
    <div class="flex flex-col md:flex-row gap-8 p-4 font-mono text-sm fade-in items-center md:items-start">
        
        <!-- Left Section: Image Rendering -->
        <!-- Ganti src "./assets/waifu.png" dengan path gambar aslimu -->
        <div class="flex-shrink-0 drop-shadow-lg">
            
        </div>

        <!-- Right Section: Fastfetch System Info -->
        <div class="flex flex-col text-[#ebdbb2] leading-relaxed">
            
            <!-- Software Information -->
            <div class="text-[#a89984] mb-1">╭──────── <span class="text-[#ebdbb2] font-bold">Software Information</span> ────────╮</div>
            <div class="flex"><span class="text-[#8ec07c] w-28 ml-2"> User:</span> <span>Architect@Architect</span></div>
            <div class="flex"><span class="text-[#8ec07c] w-28 ml-2">󰣇 OS:</span> <span>Arch Linux</span></div>
            <div class="flex"><span class="text-[#8ec07c] w-28 ml-2"> Kernel:</span> <span>Linux 7.1.2-arch3-1</span></div>
            <div class="flex"><span class="text-[#8ec07c] w-28 ml-2">󰏖 Packages:</span> <span>1344 (pacman)</span></div>
            <div class="flex"><span class="text-[#8ec07c] w-28 ml-2"> WM:</span> <span>Hyprland 0.55.4 (Wayland)</span></div>
            <div class="flex"><span class="text-[#8ec07c] w-28 ml-2"> Terminal:</span> <span>kitty 0.47.4</span></div>
            
            <!-- Hardware Information -->
            <div class="text-[#a89984] mt-2 mb-1">├──────── <span class="text-[#ebdbb2] font-bold">Hardware Information</span> ────────┤</div>
            <div class="flex"><span class="text-[#8ec07c] w-28 ml-2"> CPU:</span> <span>Intel(R) Core(TM) i5-7200U (4) @ 3.10 GHz</span></div>
            <div class="flex"><span class="text-[#8ec07c] w-28 ml-2">󰢮 GPU:</span> <span>NVIDIA GeForce 920MX</span></div>
            <div class="flex"><span class="text-[#8ec07c] w-28 ml-2">󰢮 GPU:</span> <span>Intel HD Graphics 620</span></div>
            <div class="flex"><span class="text-[#8ec07c] w-28 ml-2"> Memory:</span> <span>6.61 GiB / 11.58 GiB (57%)</span></div>
            <div class="flex"><span class="text-[#8ec07c] w-28 ml-2"> Root:</span> <span>75.51 GiB / 100.62 GiB (75%)</span></div>
            <div class="flex"><span class="text-[#8ec07c] w-28 ml-2">󰔚 Uptime:</span> <span>2 hours, 13 mins</span></div>

            <!-- Contact Information -->
            <div class="text-[#a89984] mt-2 mb-1">├──────── <span class="text-[#ebdbb2] font-bold">Contact Information</span> ─────────┤</div>
            <div class="flex hover:text-[#fb4934] transition-colors"><span class="text-[#8ec07c] w-28 ml-2"> Email:</span> <a href="mailto:alfarizqi.stura@gmail.com">alfarizqi.stura@gmail.com</a></div>
            <div class="flex hover:text-[#fb4934] transition-colors"><span class="text-[#8ec07c] w-28 ml-2">󰊤 Github:</span> <a href="https://github.com/architect" target="_blank">github.com/architect</a></div>
            <div class="flex hover:text-[#fb4934] transition-colors"><span class="text-[#8ec07c] w-28 ml-2"> LinkedIn:</span> <a href="https://linkedin.com/in/alfarizqihimam" target="_blank">in/alfarizqihimam</a></div>
            <div class="text-[#a89984]">╰────────────────────────────────────────╯</div>
            
            <!-- Color Palette Blocks -->
            <div class="mt-3 ml-2 flex gap-2">
                <span class="w-3 h-3 bg-[#ebdbb2] inline-block rounded-full"></span>
                <span class="w-3 h-3 bg-[#d5c4a1] inline-block rounded-full"></span>
                <span class="w-3 h-3 bg-[#b8bb26] inline-block rounded-full"></span>
                <span class="w-3 h-3 bg-[#fabd2f] inline-block rounded-full"></span>
                <span class="w-3 h-3 bg-[#8ec07c] inline-block rounded-full"></span>
                <span class="w-3 h-3 bg-[#d3869b] inline-block rounded-full"></span>
            </div>

        </div>
    </div>
    `;
};

export const profile = (file) => {
    const data = file.content;
    const rawText = `# ${data.name}\n\n${data.role}\n\n---\n\n## About\n\n${data.about}\n\n## Skills\n\n${data.skills}\n\n## Contact\n\n${data.contact}`;
    return applySyntax(file.language || 'markdown', rawText);
};

export const skills = (file) => {
    const rawText = JSON.stringify(file.content, null, 2);
    return applySyntax(file.language || 'json', rawText);
};

export const project = (file) => {
    let code = '';
    const stackList = (file.stack || []).map(s => `        "${s}"`).join(',\n');
    const featureList = (file.features || []).map(f => `        "${f}"`).join(',\n');
    
    if (file.language === 'rust') {
        code = `struct Project {\n    name: "${file.title}",\n    description: "${file.description}",\n    stack: [\n${stackList}\n    ],\n    features: [\n${featureList}\n    ]\n}`;
    } else if (file.language === 'php') {
        const phpStack = (file.stack || []).map(s => `        '${s}'`).join(',\n');
        code = `class Project\n{\n    public string $name = '${file.title}';\n    public string $description = '${file.description}';\n    public array $stack = [\n${phpStack}\n    ];\n}`;
    } else if (file.language === 'javascript') {
        const jsStack = (file.stack || []).map(s => `        '${s}'`).join(',\n');
        code = `const project = {\n    name: '${file.title}',\n    description: '${file.description}',\n    stack: [\n${jsStack}\n    ]\n};`;
    } else {
        code = `Project: ${file.title}\nDescription: ${file.description}\nStack: ${(file.stack||[]).join(', ')}`;
    }
    return applySyntax(file.language, code);
};

export const url = (file) => {
    return `<div class="p-4 flex flex-col items-center justify-center h-full text-[#ebdbb2]">
        <div class="text-[#83a598] mb-4">${file.filename}</div>
        <a href="${file.url}" target="_blank" class="text-xl font-bold hover:underline text-[#fabd2f]">${file.url}</a>
        <div class="mt-8 text-xs text-[#504945]">Press 'o' or Enter to open in new tab</div>
    </div>`;
};

export const resume = (file) => {
    const exp = file.content.experience.map(e => `- ${e}`).join('\n');
    const edu = file.content.education.map(e => `- ${e}`).join('\n');
    const ach = file.content.achievements.map(e => `- ${e}`).join('\n');
    const rawText = `RESUME\n\nEXPERIENCE\n${exp}\n\nEDUCATION\n${edu}\n\nACHIEVEMENTS\n${ach}`;
    return applySyntax(file.language || 'text', rawText);
};

export const renderers = {
    root,
    profile,
    skills,
    project,
    url,
    resume
};
