import { books } from '../content/books'
import Quote from '../components/Quote'

const sections = [
  { label: 'Fiction', data: books.fiction },
  { label: 'Important Reads', data: books.importantReads },
  { label: 'Software Engineering', data: books.softwareEngineering },
]

export default function Books() {
  return (
    <>
      <Quote text={books.quote} source={books.quoteSource} />

      <div className="p-8">
        <div className="max-w-2xl mx-auto flex flex-col gap-12">
          {sections.map((section) => (
            <section key={section.label}>
              <h2 className="text-sm font-semibold tracking-widest uppercase text-[#e8d44d] mb-6 border-b border-gray-700 pb-2">{section.label}</h2>
              <div className="flex flex-col gap-6">
                {section.data.map((book, i) => (
                  <div key={i}>
                    <h3 className="font-semibold text-gray-100">{book.title}</h3>
                    <p className="text-xs text-gray-500 mb-1">{book.author}</p>
                    <p className="text-sm text-gray-400 leading-relaxed">{book.note}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  )
}
