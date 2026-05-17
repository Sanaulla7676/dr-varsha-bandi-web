const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src', 'pages');

const mapping = {
    'Dashboard': '/dashboard-appointments',
    'Appointments': '/appointments',
    'Patients': '/dashboard-appointments', // No specific patients page yet
    'Video Consultations': '/video-consultation',
    'Prescriptions': '/prescriptions',
    'Medical Records': '/medical-records',
    'Follow-Ups': '/follow-ups',
    'Reports': '/reports',
    'Calendar': '/calendar',
    'Settings': '#',
    'Help': '#',
    'Logout': '/login'
};

fs.readdirSync(directoryPath).forEach((file) => {
  if (file.endsWith('.jsx')) {
    const filePath = path.join(directoryPath, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Add Link import if not present
    if (!content.includes('import { Link }') && !content.includes('import {Link}') && !content.includes('import { useNavigate }')) {
        content = content.replace(/(import React.*?;)/, "$1\nimport { Link, useNavigate } from 'react-router-dom';");
    } else if (!content.includes('import { useNavigate }')) {
        content = content.replace(/(import { Link } from 'react-router-dom';)/, "$1\nimport { useNavigate } from 'react-router-dom';");
    }

    // Fix Logout logic specifically
    if (content.includes('Logout')) {
      // If it's a Link, change to a button with onClick for logout
      content = content.replace(/<Link([^>]*)to="\/login"([^>]*)>([\s\S]*?)Logout\s*<\/Link>/gi, '<button$1onClick={() => { localStorage.removeItem(\'token\'); window.location.href=\'/login\'; }}$2>$3Logout</button>');
      content = content.replace(/<a([^>]*)href="[^"]*"([^>]*)>([\s\S]*?)Logout\s*<\/a>/gi, '<button$1onClick={() => { localStorage.removeItem(\'token\'); window.location.href=\'/login\'; }}$2>$3Logout</button>');
    }

    const replaceLink = (content, textToMatch, routePath) => {
        // Find all <a> tags that match
        let aTagRegex = /<a([^>]*)href=["'][^"']*["']([^>]*)>([\s\S]*?)<\/a>/gi;
        content = content.replace(aTagRegex, (match, p1, p2, innerHtml) => {
            // Use exact word match to avoid matching "Dashboard" inside "Video Consultations Dashboard"
            if (innerHtml.includes(`>${textToMatch}<`) || innerHtml.endsWith(textToMatch)) {
                return `<Link${p1}to="${routePath}"${p2}>${innerHtml}</Link>`;
            }
            return match;
        });

        // Also find all existing <Link> tags to correct their paths
        let linkTagRegex = /<Link([^>]*)to=["'][^"']*["']([^>]*)>([\s\S]*?)<\/Link>/gi;
        content = content.replace(linkTagRegex, (match, p1, p2, innerHtml) => {
            if (innerHtml.includes(`>${textToMatch}<`) || innerHtml.endsWith(textToMatch) || innerHtml.includes(textToMatch)) {
                // Ensure we don't accidentally match "Video Consultations" when looking for "Consultations" etc.
                // We do a strict include check. For "Dashboard", we ensure it's not matching "Appointments"
                if (textToMatch === 'Dashboard' && innerHtml.includes('Appointments')) return match;
                return `<Link${p1}to="${routePath}"${p2}>${innerHtml}</Link>`;
            }
            return match;
        });

        return content;
    };

    // Apply the mappings in order
    for (const [text, route] of Object.entries(mapping)) {
        if (text !== 'Logout') {
           content = replaceLink(content, text, route);
        }
    }

    // Fix "View Full Schedule" button
    content = content.replace(/<button([^>]*)>\s*View Full Schedule([\s\S]*?)<\/button>/gi, '<Link$1to="/appointments">View Full Schedule$2</Link>');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
