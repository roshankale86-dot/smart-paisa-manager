const fs = require('fs');
const path = require('path');
const dir = '.';

fs.readdirSync(dir).forEach(file => {
    if (file.endsWith('.html')) {
        let content = fs.readFileSync(path.join(dir, file), 'utf-8');

        // 1. Force Home Tab to exactly "index.html" in ALL bottom navigations
        content = content.replace(/(<a [^>]*class="nav-item[^"]*">\s*<i class="fa-solid fa-house"><\/i>\s*<span[^>]*>[^<]*<\/span>\s*<\/a>)/gi, (match) => {
            // Replace any existing href inside the match
            match = match.replace(/href="[^"]*"/, 'href="index.html"');
            if (!match.includes('href="')) match = match.replace('class="', 'href="index.html" class="');
            return match;
        });

        // 2. Make sure profile icon links to profile.html
        content = content.replace(/window\.location\.href='profile'/g, "window.location.href='profile.html'");

        // 3. Make sure back buttons point exactly correctly (most are already pointing to dashboard.html, let's point them to index.html to unify the homepage requirement)
        // Wait, user said: "Dashboard references -> dashboard.html". I will leave dashboard.html as dashboard.html, except Home tab points to index.html.

        // 4. Any raw '#' that represents Home should be index.html.
        // E.g. in index.html, `<a href="#" class="nav-item active"> ... Home ... </a>` will be naturally caught by the first regex if it existed.

        // 5. Ensure all other tabs have exact paths
        content = content.replace(/(<a [^>]*class="nav-item[^"]*">\s*<i class="fa-solid fa-chart-pie"><\/i>\s*<span[^>]*>[^<]*<\/span>\s*<\/a>)/gi, m => m.replace(/href="[^"]*"/, 'href="reports.html"'));
        content = content.replace(/(<a [^>]*class="nav-item[^"]*">\s*<i class="fa-solid fa-wallet"><\/i>\s*<span[^>]*>[^<]*<\/span>\s*<\/a>)/gi, m => m.replace(/href="[^"]*"/, 'href="wallets.html"'));
        content = content.replace(/(<a [^>]*class="nav-item[^"]*">\s*<i class="fa-solid fa-gear"><\/i>\s*<span[^>]*>[^<]*<\/span>\s*<\/a>)/gi, m => m.replace(/href="[^"]*"/, 'href="settings.html"'));

        // Handle quick action buttons missing .html 
        content = content.replace(/window\.location\.href='add_expense'/g, "window.location.href='add_expense.html'");
        content = content.replace(/window\.location\.href='add_income'/g, "window.location.href='add_income.html'");
        content = content.replace(/window\.location\.href='voice_entry'/g, "window.location.href='voice_entry.html'");
        content = content.replace(/window\.location\.href='premium'/g, "window.location.href='premium.html'");
        content = content.replace(/window\.location\.href='checkout'/g, "window.location.href='checkout.html'");

        // Handle settings items inside profile/settings page missing .html ideally they shouldn't exist but checking
        content = content.replace(/href="settings"/g, 'href="settings.html"');
        content = content.replace(/href="profile"/g, 'href="profile.html"');
        content = content.replace(/href="premium"/g, 'href="premium.html"');
        content = content.replace(/href="wallets"/g, 'href="wallets.html"');
        content = content.replace(/href="reports"/g, 'href="reports.html"');
        content = content.replace(/onclick="window\.location\.href='dashboard'"/g, "onclick=\"window.location.href='dashboard.html'\"");
        // (Wait, some of the above replace string literal that are correctly part of <a href="settings.html">! Actually it replaces literally. Oh wait, it will replace `href="settings"` but not `href="settings.html"`. Correct.)

        fs.writeFileSync(path.join(dir, file), content, 'utf-8');
    }
});
console.log("Fixes applied successfully.");
