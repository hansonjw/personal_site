import ReactMarkdown from 'react-markdown'
import { background } from '../content/background'
import Quote from '../components/Quote'
import experienceContent from '../content/experience.md?raw'
import educationContent from '../content/education.md?raw'

const mdComponents = {
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="font-semibold text-gray-100 mt-8 mb-2 first:mt-0">{children}</h2>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="text-sm text-gray-400 leading-relaxed mb-3">{children}</p>
  ),
}

export default function Background() {
  return (
    <>
      <Quote text={background.quote} source={background.quoteSource} />

      <div className="p-8">
        <div className="max-w-2xl mx-auto flex flex-col gap-12">

          {/* Skills */}
          <section>
            <h2 className="text-sm font-semibold tracking-widest uppercase text-white mb-6 border-b border-gray-700 pb-2">Skills</h2>
            <ul className="flex flex-col gap-2">
              {background.skills.map((skill) => (
                <li key={skill} className="text-gray-400 text-sm">{skill}</li>
              ))}
            </ul>
          </section>

          {/* Education */}
          <section>
            <h2 className="text-sm font-semibold tracking-widest uppercase text-white mb-6 border-b border-gray-700 pb-2">Education</h2>
            <ReactMarkdown components={mdComponents}>{educationContent}</ReactMarkdown>
          </section>

          {/* Experience */}
          <section>
            <h2 className="text-sm font-semibold tracking-widest uppercase text-white mb-6 border-b border-gray-700 pb-2">Experience</h2>
            <ReactMarkdown components={mdComponents}>{experienceContent}</ReactMarkdown>
          </section>

        </div>
      </div>
    </>
  )
}
