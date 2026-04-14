import { useState } from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { interests } from '../content/interests'
import Quote from '../components/Quote'

// Import all interest images
import maroonbells from '../assets/interests/maroonbells.jpeg'
import stream from '../assets/interests/stream.jpeg'
import redwoods from '../assets/interests/redwoods.png'
import onetree from '../assets/interests/onetree.png'
import mechazilla from '../assets/interests/mechazilla.jpeg'
import garden from '../assets/interests/garden.jpeg'
import starbase from '../assets/interests/starbase.jpeg'
import saturn5 from '../assets/interests/saturn5.jpeg'
import solar from '../assets/interests/solar.png'
import brk from '../assets/interests/brk.jpeg'
import trinidad from '../assets/interests/trinidad.png'
import pebble from '../assets/interests/pebble.jpeg'
import mendocino from '../assets/interests/mendocino.png'
import lostwhale from '../assets/interests/lostwhale.png'
import cash from '../assets/interests/cash.jpeg'
import cashmace from '../assets/interests/cashmace.jpeg'

const imageMap: Record<string, string> = {
  maroonbells, stream, redwoods, onetree, mechazilla, garden,
  starbase, saturn5, solar, brk, trinidad, pebble,
  mendocino, lostwhale, cash, cashmace,
}

export default function Interests() {
  const [openKey, setOpenKey] = useState<string | null>(null)

  const toggle = (key: string) => {
    setOpenKey(openKey === key ? null : key)
  }

  return (
    <>
      <Quote text={interests.quote} source={interests.quoteSource} />

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {interests.items.map((item) => (
            <div key={item.key} className="border border-gray-700 rounded-lg overflow-hidden">

              {/* Photo */}
              <img
                src={imageMap[item.key]}
                alt={item.title}
                className="w-full h-56 object-cover"
                style={{ objectPosition: item.objectPosition ?? 'center' }}
              />

              {/* Accordion */}
              <div>
                <button
                  onClick={() => toggle(item.key)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left bg-[#1a1714] hover:bg-[#1a1714] transition-colors"
                >
                  <span className="font-medium text-sm text-gray-300">{item.title}</span>
                  {openKey === item.key ? <FaChevronUp className="text-[#5fbcd3]" /> : <FaChevronDown className="text-[#5fbcd3]" />}
                </button>

                {openKey === item.key && (
                  <div className="px-4 py-3 flex flex-col gap-2 bg-black">
                    {item.words.map((word, i) => (
                      <p key={i} className="text-sm text-gray-400 leading-relaxed">{word}</p>
                    ))}
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#5fbcd3] hover:underline mt-1"
                    >
                      View on map →
                    </a>
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>
    </>
  )
}
