import { FaLinkedin, FaEnvelope, FaGithub } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { SiHackerrank } from 'react-icons/si'
import type { IconType } from 'react-icons'
import { contact } from '../content/contact'
import Quote from '../components/Quote'

const iconMap: Record<string, IconType> = {
  FaLinkedin,
  FaEnvelope,
  FaGithub,
  FaXTwitter,
  SiHackerrank,
}

export default function Contact() {
  return (
    <>
      <Quote text={contact.quote} source={contact.quoteSource} />

      <div className="p-8">
        <div className="flex flex-col gap-4 max-w-2xl mx-auto">
          {contact.links.map((item) => {
            const Icon = iconMap[item.icon]
            return (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 border-2 border-gray-700 rounded-lg p-5 hover:border-[#5fbcd3] transition-colors group"
              >
                {Icon && <Icon className="text-3xl text-gray-600 group-hover:text-[#5fbcd3] transition-colors" />}
                <span className="font-medium text-gray-400 group-hover:text-white transition-colors">{item.label}</span>
              </a>
            )
          })}
        </div>
      </div>
    </>
  )
}
