/**
 * Utility functions for processing GitHub asset URLs and markdown content
 */

/**
 * Processes GitHub asset URLs to make them displayable
 * @param text - The text content that may contain GitHub URLs
 * @returns Processed text with displayable URLs
 */
export function processGitHubAssets(text: string): string {
  if (!text) return '';
  
  // Pattern for GitHub user-attachments URLs
  const githubAssetPattern = /https:\/\/github\.com\/user-attachments\/assets\/[a-f0-9-]+/g;
  
  // Pattern for GitHub raw content URLs (for images in repos)
  const githubRawPattern = /https:\/\/raw\.githubusercontent\.com\/[^\/]+\/[^\/]+\/[^\/]+\/[^\/\s]+\.(png|jpg|jpeg|gif|webp|svg|mp4|webm|mov)/gi;
  
  // Pattern for GitHub blob URLs (convert to raw)
  const githubBlobPattern = /https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/blob\/([^\/]+)\/([^\/\s]+\.(png|jpg|jpeg|gif|webp|svg|mp4|webm|mov))/gi;
  
  let processedText = text;
  
  // Convert GitHub blob URLs to raw URLs
  processedText = processedText.replace(githubBlobPattern, (_, owner, repo, branch, filePath) => {
    return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`;
  });
  
  // Process GitHub asset URLs - these should work directly
  processedText = processedText.replace(githubAssetPattern, (url) => {
    // GitHub user-attachments URLs should work directly
    return url;
  });
  
  // Process raw GitHub URLs - these should work directly
  processedText = processedText.replace(githubRawPattern, (url) => {
    return url;
  });
  
  return processedText;
}

/**
 * Extracts all GitHub asset URLs from text
 * @param text - The text content to search
 * @returns Array of GitHub asset URLs found
 */
export function extractGitHubAssetUrls(text: string): string[] {
  if (!text) return [];
  
  const urls: string[] = [];
  
  // GitHub user-attachments pattern
  const githubAssetPattern = /https:\/\/github\.com\/user-attachments\/assets\/[a-f0-9-]+/g;
  const assetMatches = text.match(githubAssetPattern);
  if (assetMatches) {
    urls.push(...assetMatches);
  }
  
  // GitHub raw content pattern
  const githubRawPattern = /https:\/\/raw\.githubusercontent\.com\/[^\/]+\/[^\/]+\/[^\/]+\/[^\/\s]+\.(png|jpg|jpeg|gif|webp|svg|mp4|webm|mov)/gi;
  const rawMatches = text.match(githubRawPattern);
  if (rawMatches) {
    urls.push(...rawMatches);
  }
  
  // GitHub blob pattern (convert to raw)
  const githubBlobPattern = /https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/blob\/([^\/]+)\/([^\/\s]+\.(png|jpg|jpeg|gif|webp|svg|mp4|webm|mov))/gi;
  const blobMatches = text.match(githubBlobPattern);
  if (blobMatches) {
    const convertedUrls = blobMatches.map(match => {
      const [, owner, repo, branch, filePath] = match.match(/https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/blob\/([^\/]+)\/([^\/\s]+\.(png|jpg|jpeg|gif|webp|svg|mp4|webm|mov))/i) || [];
      return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`;
    });
    urls.push(...convertedUrls);
  }
  
  return [...new Set(urls)]; // Remove duplicates
}

/**
 * Checks if a URL is a GitHub asset URL
 * @param url - The URL to check
 * @returns True if it's a GitHub asset URL
 */
export function isGitHubAssetUrl(url: string): boolean {
  if (!url) return false;
  
  return (
    url.includes('github.com/user-attachments/assets/') ||
    url.includes('raw.githubusercontent.com') ||
    url.includes('github.com') && /\.(png|jpg|jpeg|gif|webp|svg|mp4|webm|mov)/i.test(url)
  );
}

/**
 * Gets the appropriate alt text for a GitHub asset URL
 * @param url - The GitHub asset URL
 * @param fallback - Fallback alt text
 * @returns Appropriate alt text
 */
export function getGitHubAssetAltText(url: string, fallback: string = 'GitHub asset'): string {
  if (!url) return fallback;
  
  // Extract filename from URL
  const filename = url.split('/').pop() || '';
  
  // Remove file extension for alt text
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
  
  // If it's a GitHub user-attachments URL, use a generic description
  if (url.includes('github.com/user-attachments/assets/')) {
    return 'Issue screenshot or attachment';
  }
  
  // Otherwise, use the filename
  return nameWithoutExt || fallback;
}
