interface QuoteProps {
  text: string
  source: string
}

export default function Quote({ text, source }: QuoteProps) {
  return (
    <div className="bg-[#1a1714] w-full px-8 py-3 mb-8">
      <blockquote className="text-center">
        <p className="text-xs font-normal text-white/60" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>"{text}"</p>
        <footer className="mt-3 text-xs font-normal text-white/60" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>— {source}</footer>
      </blockquote>
    </div>
  )
}
