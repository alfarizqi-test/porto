export const loadJson = async (filepath) => {
    try {
        const response = await fetch(filepath);
        if (!response.ok) return null;
        return await response.json();
    } catch (e) {
        return null;
    }
};

export const loadText = async (filepath) => {
    if (!filepath) return "";
    try {
        const response = await fetch(filepath);
        if (!response.ok) return "";
        return await response.text();
    } catch (e) {
        return "";
    }
};
