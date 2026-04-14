import ReactMarkdown from 'react-markdown'
import { landing } from '../content/landing'
import photo from '../assets/pro.jpeg'
import Quote from '../components/Quote'
import bioContent from '../content/landing.md?raw'

export default function Landing() {
  return (
    <>
      <Quote text={landing.quote} source={landing.quoteSource} />

      <div className="p-8">
        {/* Two column layout */}
        <div className="flex flex-col md:flex-row gap-10 items-start max-w-3xl mx-auto">

          {/* Bio — left */}
          <div className="flex-1">
            <ReactMarkdown
              components={{
                p: ({ children }) => (
                  <p className="text-gray-300 leading-relaxed mb-4">{children}</p>
                ),
              }}
            >
              {bioContent}
            </ReactMarkdown>
          </div>

          {/* Photo — right */}
          <div className="flex-shrink-0 flex justify-center w-full md:w-auto">
            <img
              src={photo}
              alt="Justin Hanson"
              className="w-48 h-48 rounded-full object-cover"
            />
          </div>

        </div>
      </div>
    </>
  )
}
