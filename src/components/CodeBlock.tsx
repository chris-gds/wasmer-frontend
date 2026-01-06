/**
 * CodeBlockProps - Configuration for code block display
 * @property {string} filename - Filename to display in header
 * @property {string} language - Programming language for syntax highlighting
 * @property {string} code - Code content to display
 */
interface CodeBlockProps {
  filename: string;
  language: string;
  code: string;
}

/**
 * CodeBlock - Displays syntax-highlighted code with filename header
 * Uses semantic color tokens for consistent theming
 * @component
 * @example
 * <CodeBlock
 *   filename="wasmer.toml"
 *   language="toml"
 *   code='[package]\nname = "example"'
 * />
 */
export function CodeBlock({ filename, language, code }: CodeBlockProps) {
  return (
    <div className="code-block-container mt-8">
      <div className="code-block-header">
        <span>{filename}</span>
      </div>
      <pre className="code-content">
        <code className={`language-${language}`} data-language={language}>
          {/* This would be replaced with actual syntax highlighting */}
          <span className="line-number">1</span> <span className="section">[package]</span><br/>
          <span className="line-number">2</span> <span className="key">name</span> = <span className="string">'youruser/package'</span><br/>
          <span className="line-number">3</span> <span className="key">version</span> = <span className="string">'0.1.0'</span><br/>
          <span className="line-number">4</span> <span className="key">description</span> = <span className="string">'Description for package''</span><br/>
        </code>
      </pre>
    </div>
  );
}
