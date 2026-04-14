import { FaGithub } from 'react-icons/fa'
import { FaFootball } from 'react-icons/fa6'
import { AiOutlineStock } from 'react-icons/ai'
import { BiMath } from 'react-icons/bi'
import type { IconType } from 'react-icons'
import { projects } from '../content/projects'
import Quote from '../components/Quote'

const quote = {
  text: "Stay primitive. Trust the soup. Swing for the seats. Be ready for resistance.",
  source: "Steven Pressfield",
}

const iconMap: Record<string, IconType> = {
  AiOutlineStock,
  FaFootball,
  BiMath,
}

export default function Projects() {
  return (
    <>
      <Quote text={quote.text} source={quote.source} />

      <div className="p-8">
        <div className="flex flex-col gap-6 max-w-2xl mx-auto">
          {projects.map((project) => {
            const Icon = iconMap[project.icon]
            return (
              <div key={project.title} className="border border-gray-700 rounded-lg p-6 flex flex-row gap-4">

                {/* Left — all content */}
                <div className="flex flex-col gap-4 w-2/3">

                  {/* Title and status */}
                  <div className="flex items-center gap-3">
                    <h2 className="font-semibold text-gray-100">{project.title}</h2>
                    <span className="text-xs px-2 py-1 rounded-full bg-[#e8d44d]/10 text-[#e8d44d]">
                      {project.status}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-400 text-sm leading-relaxed">{project.description}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-400">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* GitHub link */}
                  {project.link ? (
                    <a href={project.link} target="_blank" rel="noopener noreferrer">
                      <FaGithub className="text-2xl text-gray-400 hover:text-white transition-colors" />
                    </a>
                  ) : (
                    <FaGithub className="text-2xl text-gray-700" />
                  )}

                </div>

                {/* Right — icon only */}
                <div className="w-1/3 flex items-center justify-center">
                  {Icon && <Icon className="text-9xl text-gray-700" />}
                </div>

              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
