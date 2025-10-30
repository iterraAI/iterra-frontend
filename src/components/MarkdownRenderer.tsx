import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { processGitHubAssets, getGitHubAssetAltText } from '../utils/githubAssets';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {

  // Custom components for rendering
  const components = {
    img: ({ src, alt, ...props }: any) => {
      // Ensure GitHub URLs are properly handled
      const processedSrc = processGitHubAssets(src || '');
      const altText = alt || getGitHubAssetAltText(src || '');
      
      return (
        <img
          src={processedSrc}
          alt={altText}
          className="max-w-full h-auto rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
          loading="lazy"
          onError={(e) => {
            // Fallback for broken images
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
          {...props}
        />
      );
    },
    
    video: ({ src, ...props }: any) => {
      const processedSrc = processGitHubAssets(src || '');
      
      return (
        <video
          src={processedSrc}
          className="max-w-full h-auto rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
          controls
          preload="metadata"
          onError={(e) => {
            // Fallback for broken videos
            const target = e.target as HTMLVideoElement;
            target.style.display = 'none';
          }}
          {...props}
        />
      );
    },
    
    // Style links to GitHub issues/PRs
    a: ({ href, children, ...props }: any) => {
      const isGitHubLink = href?.includes('github.com');
      const isIssueLink = href?.includes('/issues/');
      const isPRLink = href?.includes('/pull/');
      
      let className = 'text-blue-600 dark:text-blue-400 hover:underline';
      
      if (isGitHubLink) {
        if (isIssueLink) {
          className += ' font-medium';
        } else if (isPRLink) {
          className += ' font-medium text-purple-600 dark:text-purple-400';
        }
      }
      
      return (
        <a
          href={href}
          className={className}
          target="_blank"
          rel="noopener noreferrer"
          {...props}
        >
          {children}
        </a>
      );
    },
    
    // Style code blocks
    code: ({ className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      
      if (language) {
        // Code block
        return (
          <pre className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto">
            <code className={className} {...props}>
              {children}
            </code>
          </pre>
        );
      } else {
        // Inline code
        return (
          <code
            className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono"
            {...props}
          >
            {children}
          </code>
        );
      }
    },
    
    // Style blockquotes
    blockquote: ({ children, ...props }: any) => (
      <blockquote
        className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-r-lg"
        {...props}
      >
        {children}
      </blockquote>
    ),
    
    // Style tables
    table: ({ children, ...props }: any) => (
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600" {...props}>
          {children}
        </table>
      </div>
    ),
    
    th: ({ children, ...props }: any) => (
      <th
        className="border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 px-4 py-2 text-left font-semibold"
        {...props}
      >
        {children}
      </th>
    ),
    
    td: ({ children, ...props }: any) => (
      <td
        className="border border-gray-300 dark:border-gray-600 px-4 py-2"
        {...props}
      >
        {children}
      </td>
    ),
  };

  const processedContent = processGitHubAssets(content);

  return (
    <div className={`prose prose-gray dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={components}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}
