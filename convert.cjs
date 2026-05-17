const fs = require('fs');
const path = require('path');

const inputDir = 'c:\\Users\\user\\Desktop\\mahendi';
const outputDir = path.join(__dirname, 'src', 'pages');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

function kebabToCamel(str) {
    return str.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
}

const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.html') && f !== 'index.html' && f !== 'stitch_landing.html');

// For login_refined, we already downloaded it. 
if (!files.includes('login_refined.html') && fs.existsSync(path.join(inputDir, 'login_refined.html'))) {
    files.push('login_refined.html');
}

files.forEach(file => {
    let content = fs.readFileSync(path.join(inputDir, file), 'utf8');

    // Extract main content between body tags or main tags
    let mainContent = content;
    const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch) {
        mainContent = bodyMatch[1];
    }
    
    // Remove scripts and styles
    mainContent = mainContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    mainContent = mainContent.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

    // Convert class to className
    mainContent = mainContent.replace(/class=/g, 'className=');
    mainContent = mainContent.replace(/for=/g, 'htmlFor=');
    mainContent = mainContent.replace(/tabindex=/g, 'tabIndex=');
    mainContent = mainContent.replace(/onclick=/g, 'onClick=');

    // SVG attributes
    const svgAttrs = ['stroke-width', 'stroke-linecap', 'stroke-linejoin', 'fill-rule', 'clip-rule', 'stroke-dasharray', 'stroke-dashoffset'];
    svgAttrs.forEach(attr => {
        const regex = new RegExp(attr + '=', 'g');
        mainContent = mainContent.replace(regex, kebabToCamel(attr) + '=');
    });

    // Close self-closing tags (input, img, br, hr, path, circle)
    mainContent = mainContent.replace(/<(input|img|br|hr|path|circle)([^>]*?)(?<!\/)>/g, '<$1$2 />');

    // Remove comments
    mainContent = mainContent.replace(/<!--[\s\S]*?-->/g, '');

    // Replace invalid inline styles (simplistic approach: remove them or keep them if they are simple)
    // Most stitch outputs don't use inline styles heavily except for maybe some height/width.
    mainContent = mainContent.replace(/style="([^"]*)"/g, (match, p1) => {
        // Very basic inline style to object converter
        const styles = p1.split(';').filter(s => s.trim() !== '');
        const styleObj = {};
        styles.forEach(s => {
            const parts = s.split(':');
            if (parts.length === 2) {
                const key = kebabToCamel(parts[0].trim());
                let value = parts[1].trim();
                styleObj[key] = value;
            }
        });
        return `style={${JSON.stringify(styleObj)}}`;
    });

    const componentName = file.replace('.html', '').split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');

    const jsxComponent = `
import React from 'react';

export default function ${componentName}() {
    return (
        <React.Fragment>
            ${mainContent}
        </React.Fragment>
    );
}
`;

    fs.writeFileSync(path.join(outputDir, componentName + '.jsx'), jsxComponent);
    console.log(`Converted ${file} to ${componentName}.jsx`);
});
