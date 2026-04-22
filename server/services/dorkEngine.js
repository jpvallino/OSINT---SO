/**
 * Dork Engine - Generates advanced search queries (Google Dorks style)
 * These generate clickable links instead of scraping results
 */

const DORK_TEMPLATES = {
  social: [
    { label: 'LinkedIn Profile', template: 'site:linkedin.com/in "{query}"', icon: '💼' },
    { label: 'Twitter/X Profile', template: 'site:x.com "{query}" OR site:twitter.com "{query}"', icon: '🐦' },
    { label: 'Facebook Profile', template: 'site:facebook.com "{query}"', icon: '👤' },
    { label: 'Instagram Profile', template: 'site:instagram.com "{query}"', icon: '📸' },
    { label: 'Reddit Mentions', template: 'site:reddit.com "{query}"', icon: '🟠' },
    { label: 'YouTube Channel', template: 'site:youtube.com "{query}"', icon: '📺' },
    { label: 'Medium Articles', template: 'site:medium.com "{query}"', icon: '✍️' },
    { label: 'Mastodon Profile', template: 'site:mastodon.social "{query}" OR "{query}" mastodon', icon: '🐘' }
  ],
  professional: [
    { label: 'GitHub Profile', template: 'site:github.com "{query}"', icon: '💻' },
    { label: 'GitLab Profile', template: 'site:gitlab.com "{query}"', icon: '🦊' },
    { label: 'Stack Overflow', template: 'site:stackoverflow.com "{query}"', icon: '📚' },
    { label: 'LinkedIn Experience', template: 'site:linkedin.com "{query}" experience', icon: '💼' },
    { label: 'Crunchbase', template: 'site:crunchbase.com "{query}"', icon: '📈' },
    { label: 'AngelList', template: 'site:angel.co "{query}"', icon: '😇' },
    { label: 'Personal Website', template: '"{query}" resume OR portfolio OR "about me"', icon: '🌐' },
    { label: 'Academic Papers', template: 'site:scholar.google.com "{query}" OR site:researchgate.net "{query}"', icon: '🎓' }
  ],
  documents: [
    { label: 'PDF Documents', template: 'filetype:pdf "{query}"', icon: '📄' },
    { label: 'Word Documents', template: 'filetype:docx "{query}" OR filetype:doc "{query}"', icon: '📝' },
    { label: 'Presentations', template: 'filetype:pptx "{query}" OR filetype:ppt "{query}"', icon: '📊' },
    { label: 'Spreadsheets', template: 'filetype:xlsx "{query}" OR filetype:csv "{query}"', icon: '📋' },
    { label: 'Resume/CV', template: 'intitle:"resume" OR intitle:"curriculum vitae" "{query}"', icon: '📑' },
    { label: 'Public Records', template: '"{query}" public record OR court OR filing', icon: '⚖️' },
    { label: 'Cached Pages', template: 'cache:"{query}"', icon: '💾' }
  ],
  mentions: [
    { label: 'News Mentions', template: '"{query}" news OR press OR article', icon: '📰' },
    { label: 'Forum Mentions', template: '"{query}" forum OR discussion OR thread', icon: '💬' },
    { label: 'Blog Mentions', template: '"{query}" blog OR post OR wrote', icon: '✏️' },
    { label: 'Conference Talks', template: '"{query}" conference OR talk OR speaker OR keynote', icon: '🎤' },
    { label: 'Podcast Mentions', template: '"{query}" podcast OR episode OR interview', icon: '🎙️' },
    { label: 'Awards/Recognition', template: '"{query}" award OR winner OR recognition OR honored', icon: '🏆' },
    { label: 'Email Mentions', template: '"{query}" @gmail.com OR @yahoo.com OR @outlook.com', icon: '📧' }
  ]
};

/**
 * Generate dork queries for a given search term
 */
export function generateDorks(query, categories = null) {
  const targetCategories = categories || Object.keys(DORK_TEMPLATES);
  const results = {};

  for (const category of targetCategories) {
    if (!DORK_TEMPLATES[category]) continue;

    results[category] = DORK_TEMPLATES[category].map(dork => {
      const dorkQuery = dork.template.replace(/\{query\}/g, query);
      const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(dorkQuery)}`;
      const duckduckgoUrl = `https://duckduckgo.com/?q=${encodeURIComponent(dorkQuery)}`;
      const bingUrl = `https://www.bing.com/search?q=${encodeURIComponent(dorkQuery)}`;

      return {
        label: dork.label,
        icon: dork.icon,
        dorkQuery,
        searchEngines: {
          google: googleUrl,
          duckduckgo: duckduckgoUrl,
          bing: bingUrl
        }
      };
    });
  }

  return results;
}

/**
 * Generate email-specific dorks
 */
export function generateEmailDorks(email) {
  const [username, domain] = email.split('@');

  return {
    email: [
      {
        label: 'Email in Documents',
        icon: '📄',
        dorkQuery: `"${email}"`,
        searchEngines: {
          google: `https://www.google.com/search?q="${encodeURIComponent(email)}"`,
          duckduckgo: `https://duckduckgo.com/?q="${encodeURIComponent(email)}"`,
          bing: `https://www.bing.com/search?q="${encodeURIComponent(email)}"`
        }
      },
      {
        label: 'Username Cross-Reference',
        icon: '👤',
        dorkQuery: `"${username}" site:github.com OR site:linkedin.com OR site:twitter.com`,
        searchEngines: {
          google: `https://www.google.com/search?q=${encodeURIComponent(`"${username}" site:github.com OR site:linkedin.com OR site:twitter.com`)}`,
          duckduckgo: `https://duckduckgo.com/?q=${encodeURIComponent(`"${username}" site:github.com OR site:linkedin.com OR site:twitter.com`)}`,
          bing: `https://www.bing.com/search?q=${encodeURIComponent(`"${username}" site:github.com OR site:linkedin.com OR site:twitter.com`)}`
        }
      },
      {
        label: 'Have I Been Pwned',
        icon: '🔓',
        dorkQuery: `Check email breach status`,
        searchEngines: {
          hibp: `https://haveibeenpwned.com/`
        }
      },
      {
        label: 'Domain WHOIS',
        icon: '🌐',
        dorkQuery: `WHOIS lookup for ${domain}`,
        searchEngines: {
          rdap: `https://rdap.org/domain/${domain}`
        }
      }
    ]
  };
}
