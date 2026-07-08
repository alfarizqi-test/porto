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
    const systemInfo = state.systemInfo;
    if (!systemInfo) return `<div class="p-4 text-[#928374]">// Loading system info...</div>`; 
    return `
    <div class="flex flex-col md:flex-row gap-8 p-4 font-mono text-sm fade-in items-center md:items-start">
        
        <!-- Left Section: Image Rendering -->
        <!-- Ganti src "./assets/waifu.png" dengan path gambar aslimu -->
        <div class="flex-shrink-0 drop-shadow-lg">
            <img 
                src="./assets/waifu.png" 
                alt="Avatar" 
                class="w-52 h-auto object-contain rounded-md"
            />
        </div>

        <!-- Right Section: Fastfetch System Info -->
        <div class="flex flex-col text-[#ebdbb2] leading-relaxed">
            
            <div class="flex flex-col text-[#ebdbb2] leading-relaxed">
            
            <!-- Software Information -->
            <div class="text-[#a89984] mb-1">╭──────── <span class="text-[#ebdbb2] font-bold">Software Information</span> ────────╮</div>
            <div class="flex"><span class="text-[#8ec07c] w-28 ml-2">User:</span> <span>Architect@Architect</span></div>
            <div class="flex"><span class="text-[#8ec07c] w-28 ml-2">OS:</span> <span>${systemInfo.os}</span></div>
            <div class="flex"><span class="text-[#8ec07c] w-28 ml-2">Kernel:</span> <span>${systemInfo.kernel}</span></div>
            <div class="flex"><span class="text-[#8ec07c] w-28 ml-2">Packages:</span> <span>${systemInfo.packages}</span></div>
            <div class="flex"><span class="text-[#8ec07c] w-28 ml-2">WM:</span> <span>${systemInfo.wm}</span></div>
            <div class="flex"><span class="text-[#8ec07c] w-28 ml-2">Terminal:</span> <span>${systemInfo.terminal}</span></div>
            
            <!-- Hardware Information -->
            <div class="text-[#a89984] mt-2 mb-1">├──────── <span class="text-[#ebdbb2] font-bold">Hardware Information</span> ────────┤</div>
            <div class="flex"><span class="text-[#8ec07c] w-28 ml-2">CPU:</span> <span>${systemInfo.cpu}</span></div>
            <div class="flex"><span class="text-[#8ec07c] w-28 ml-2">GPU:</span> <span>${systemInfo.gpu}</span></div>
            <div class="flex"><span class="text-[#8ec07c] w-28 ml-2">GPU:</span> <span>${systemInfo.gpu1}</span></div>
            <div class="flex"><span class="text-[#8ec07c] w-28 ml-2">Memory:</span> <span>${systemInfo.memory}</span></div>
            <div class="flex"><span class="text-[#8ec07c] w-28 ml-2">Root:</span> <span>${systemInfo.root}</span></div>
            <div class="flex"><span class="text-[#8ec07c] w-28 ml-2">Uptime:</span> <span>${systemInfo.uptime}</span></div>

            <!-- Contact Information -->
            <div class="text-[#a89984] mt-2 mb-1">├──────── <span class="text-[#ebdbb2] font-bold">Contact Information</span> ─────────┤</div>
            <div class="flex hover:text-[#fb4934] transition-colors"><span class="text-[#8ec07c] w-28 ml-2">Email:</span> <a href="mailto:${systemInfo.email}">${systemInfo.email}</a></div>
            <div class="flex hover:text-[#fb4934] transition-colors"><span class="text-[#8ec07c] w-28 ml-2">Github:</span> <a href="${systemInfo.github}" target="_blank">${systemInfo.github.replace('https://github.com/', '')}</a></div>
            <div class="flex hover:text-[#fb4934] transition-colors"><span class="text-[#8ec07c] w-28 ml-2">LinkedIn:</span> <a href="${systemInfo.linkedin}" target="_blank">${systemInfo.linkedin.replace('https://www.linkedin.com/in/', '')}</a></div>
            <div class="text-[#a89984]">╰──────────────────────────────────────╯</div>
            
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

    if (file.language === 'rust') {
        const stackList = (file.stack || []).map(s => `        String::from("${s}"),`).join('\n');
        const featureList = (file.features || []).map(f => `        String::from("${f}"),`).join('\n');
        const varName = file.filename.split('.')[0].replace(/[^a-z0-9]/gi, '_').toLowerCase();

        code = `#[derive(Debug, Serialize)]\npub struct Project {\n    pub name: String,\n    pub description: String,\n    pub stack: Vec<String>,\n    pub features: Vec<String>,\n    pub github: Option<String>,\n}\n\nfn get_${varName}_info() -> Project {\n    Project {\n        name: String::from("${file.title}"),\n        description: String::from("${file.description}"),\n        stack: vec![\n${stackList}\n        ],\n        features: vec![\n${featureList}\n        ],\n        github: Some(String::from("${file.github || ''}")),\n    }\n}`;
    } else if (file.language === 'php') {
        const phpStack = (file.stack || []).map(s => `        '${s}',`).join('\n');
        const phpFeatures = (file.features || []).map(f => `        '${f}',`).join('\n');

        code = `<?php\n\nnamespace App\\Models;\n\nuse Illuminate\\Database\\Eloquent\\Model;\n\nclass Project extends Model\n{\n    protected $fillable = [\n        'name',\n        'description',\n        'stack',\n        'features',\n        'github_url'\n    ];\n\n    public function getProjectDetails(): array\n    {\n        return [\n            'name' => '${file.title}',\n            'description' => '${file.description}',\n            'stack' => [\n${phpStack}\n            ],\n            'features' => [\n${phpFeatures}\n            ],\n            'github_url' => '${file.github || ''}'\n        ];\n    }\n}`;
    } else if (file.language === 'javascript') {
        const jsStack = (file.stack || []).map(s => `        '${s}',`).join('\n');
        const jsFeatures = (file.features || []).map(f => `        '${f}',`).join('\n');

        code = `/**\n * Defines the ${file.title} project configuration.\n * @module config/projects\n */\n\nexport const projectConfig = {\n    name: '${file.title}',\n    description: '${file.description}',\n    stack: [\n${jsStack}\n    ],\n    features: [\n${jsFeatures}\n    ],\n    repository: '${file.github || ''}',\n    \n    init() {\n        console.log(\`Initializing \${this.name}...\`);\n        return this.stack.length > 0;\n    }\n};\n\nexport default projectConfig;`;
    } else {
        code = `Project: ${file.title}\nDescription: ${file.description}\nStack: ${(file.stack || []).join(', ')}`;
    }
    return applySyntax(file.language, code);
};

export const url = (file) => {
    return `<div class="p-4 flex flex-col items-center justify-center h-full text-[#ebdbb2]">
        <div class="text-6xl mb-4">${file.icon}</div>
        <div class="text-[#83a598] mb-4">${file.filename}</div>
        <a href="${file.url}" target="_blank" class="text-xl font-bold hover:underline text-[#fabd2f]">${file.url}</a>
        <div class="mt-8 text-xs text-[#504945]">Press 'o' or Enter to open in new tab</div>
    </div>`;
};

export const resume = (file) => {
    const exp = (file.content.experience || []).map(e => `- ${e}`).join('\n');
    const edu = (file.content.education || []).map(e => `- ${e}`).join('\n');
    const ach = (file.content.achievements || []).map(e => `- ${e}`).join('\n');
    
    const rawText = `RESUME\n\nEXPERIENCE\n${exp}\n\nEDUCATION\n${edu}\n\nACHIEVEMENTS\n${ach}`;
    return applySyntax(file.language || 'text', rawText);
};

export const file = (node) => {
    const rawText = node.content || '';
    return applySyntax(node.language || 'text', rawText);
};

export const renderers = {
    root,
    profile,
    skills,
    project,
    url,
    resume,
    file
};
