export function htmlToText(html: string): string {
    if (typeof document !== 'undefined') {
      // Client-side parsing
      const div = document.createElement('div');
      div.innerHTML = html;
      return div.textContent || div.innerText || '';
    } else {
      // Server-side parsing (for Next.js server components)
      return html
        .replace(/<[^>]*>?/gm, '') // Remove HTML tags
        .replace(/\s+/g, ' ') // Collapse multiple spaces
        .trim();
    }
  }
