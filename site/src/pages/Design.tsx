import ReactMarkdown from 'react-markdown'
import Logo from '../components/Logo'
import { design } from '../content/design'
import Quote from '../components/Quote'
import designContent from '../content/design.md?raw'

export default function Design() {
  return (
    <>
      <Quote text={design.quote} source={design.quoteSource} />

      {/* Logo — pure black canvas */}
      <div className="bg-black p-8 flex justify-center">
        <Logo size={180} />
      </div>

      {/* Design sections */}
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
          <ReactMarkdown
            components={{
              h2: ({ children }) => (
                <h2 className="text-sm font-semibold tracking-widest uppercase text-white mt-12 mb-4 border-b border-gray-700 pb-2 first:mt-0">
                  {children}
                </h2>
              ),
              p: ({ children }) => (
                <p className="text-sm text-gray-400 leading-relaxed mb-3">
                  {children}
                </p>
              ),
            }}
          >
            {designContent}
          </ReactMarkdown>
        </div>
      </div>
    </>
  )
}
