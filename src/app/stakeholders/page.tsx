import Link from 'next/link';

const stakeholders = [
  {
    name: "Mark Watts",
    role: "Alan Watts Organization",
    email: "mark@alanwatts.org",
    description: "Alan Watts' son, controls the legacy audio archive. Leading multiple projects including Roundtable, Drift game, and animated bio film.",
    highlights: [
      "Working with Lisbon team on digital assets dialoging tool",
      "Recently acquired high-quality Nagra playback deck for archival audio",
      "Has ~50 new recordings (many Q&A sessions) needing audio upgrade work",
      "Dealing with AI social media imposters - defensive strategies with YouTube/Google"
    ],
    color: "amber"
  },
  {
    name: "Collin Bird",
    role: "CIO, AIC Holdings",
    description: "Initiated the connection between AIC and the Watts projects. Strategic oversight of AI initiatives.",
    highlights: [
      "Wants AIC to 'play a bigger role' in the Watts legacy work",
      "Connected Daniel to Mark Watts' ongoing efforts"
    ],
    color: "blue"
  },
  {
    name: "Daniel Shanklin",
    role: "Director of AI, AIC Holdings",
    description: "Building the technical AI implementation. Developed the watts-demo prototype with persona engineering and local LLM inference.",
    highlights: [
      "Built working prototype with 90.6/100 quality score",
      "Pioneered 'premise challenging' approach for Watts persona",
      "Eliminated self-help patterns from AI responses"
    ],
    color: "green"
  },
  {
    name: "Alex Duran",
    role: "Permian Investment Partners",
    description: "Connected to Mark Watts' efforts through investment network.",
    highlights: [
      "Relationship with Watts legacy projects",
      "Potential funding/partnership avenue"
    ],
    color: "purple"
  },
  {
    name: "Justin Charles",
    role: "Permian Investment Partners",
    description: "Role to be determined - meeting scheduled to discuss involvement.",
    highlights: [
      "Attending Tuesday intro meeting",
      "Specific expertise/role TBD"
    ],
    color: "zinc"
  },
];

const existingProjects = [
  {
    name: "Roundtable",
    description: "Dialoging tool creating AI conversations between archived figures (Watts, Huxley, McKenna)",
    status: "In Development",
    team: "Lisbon Team"
  },
  {
    name: "Drift",
    description: "Gamified audio adventure game set on rafts in a flooded future world, featuring Watts' voice",
    status: "In Development",
    team: "Mark Watts"
  },
  {
    name: "Animated Bio Film",
    description: "Half-hour animated biographical production about Alan Watts' life",
    status: "In Development",
    team: "Mark Watts"
  },
  {
    name: "Archival Audio Work",
    description: "Re-transferring classic recordings with new Nagra playback deck for highest quality preservation",
    status: "Ongoing",
    team: "Mark Watts"
  },
];

const colorClasses: Record<string, { border: string; bg: string; text: string }> = {
  amber: { border: "border-amber-600/50", bg: "bg-amber-600/10", text: "text-amber-400" },
  blue: { border: "border-blue-600/50", bg: "bg-blue-600/10", text: "text-blue-400" },
  green: { border: "border-green-600/50", bg: "bg-green-600/10", text: "text-green-400" },
  purple: { border: "border-purple-600/50", bg: "bg-purple-600/10", text: "text-purple-400" },
  zinc: { border: "border-zinc-600/50", bg: "bg-zinc-600/10", text: "text-zinc-400" },
};

export default function StakeholdersPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <header className="border-b border-zinc-800/50 p-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center text-lg">
              🧘
            </div>
            <h1 className="font-serif text-xl">Alan Watts AI</h1>
          </div>
          <div className="flex gap-3">
            <Link
              href="/technology"
              className="px-4 py-2 text-zinc-400 hover:text-white text-sm transition-colors"
            >
              Technology
            </Link>
            <Link
              href="/loops"
              className="px-4 py-2 text-zinc-400 hover:text-white text-sm transition-colors"
            >
              Study Loops
            </Link>
            <Link
              href="/"
              className="px-4 py-2 bg-amber-600/20 text-amber-400 border border-amber-600/50 rounded-lg text-sm hover:bg-amber-600/30 transition-colors"
            >
              Try the Demo
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero */}
        <section className="mb-16 text-center">
          <h1 className="text-4xl font-serif mb-4">Project Stakeholders</h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            The people and organizations involved in bringing Alan Watts&apos; wisdom to life through AI.
          </p>
        </section>

        {/* Upcoming Meeting */}
        <section className="mb-16">
          <div className="bg-amber-900/20 border border-amber-600/30 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="text-3xl">📅</div>
              <div>
                <h2 className="text-xl font-medium text-amber-400 mb-2">Upcoming: Philosophe AI Project Intro</h2>
                <p className="text-zinc-300 mb-3">
                  <strong>Tuesday, January 27, 2026</strong> · 1:30 PM - 2:00 PM CST · Microsoft Teams
                </p>
                <p className="text-zinc-400 text-sm">
                  Attendees: Daniel Shanklin, Justin Charles, Winnie Makama, Collin Bird
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Stakeholders */}
        <section className="mb-16">
          <h2 className="text-2xl font-serif mb-6 text-amber-400">Key Stakeholders</h2>
          <div className="space-y-6">
            {stakeholders.map((person, i) => {
              const colors = colorClasses[person.color];
              return (
                <div key={i} className={`bg-zinc-900/50 border ${colors.border} rounded-xl p-6`}>
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className={`w-12 h-12 rounded-full ${colors.bg} flex items-center justify-center text-xl font-serif ${colors.text} flex-shrink-0`}>
                      {person.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                        <h3 className="text-lg font-medium">{person.name}</h3>
                        <span className={`text-sm ${colors.text}`}>{person.role}</span>
                      </div>
                      {person.email && (
                        <p className="text-zinc-500 text-sm mb-2">{person.email}</p>
                      )}
                      <p className="text-zinc-400 mb-3">{person.description}</p>
                      <ul className="space-y-1">
                        {person.highlights.map((highlight, j) => (
                          <li key={j} className="text-zinc-500 text-sm flex items-start gap-2">
                            <span className={`${colors.text} mt-1`}>▸</span>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Existing Projects */}
        <section className="mb-16">
          <h2 className="text-2xl font-serif mb-6 text-amber-400">Mark Watts&apos; Existing Projects</h2>
          <p className="text-zinc-400 mb-6">
            These projects are already in development under Mark Watts&apos; direction.
            Understanding them helps clarify where AIC&apos;s work might complement or integrate.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {existingProjects.map((project, i) => (
              <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium">{project.name}</h3>
                  <span className="text-xs px-2 py-1 bg-zinc-800 rounded-full text-zinc-400">
                    {project.status}
                  </span>
                </div>
                <p className="text-zinc-400 text-sm mb-2">{project.description}</p>
                <p className="text-zinc-600 text-xs">Team: {project.team}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Open Questions */}
        <section className="mb-16">
          <h2 className="text-2xl font-serif mb-6 text-amber-400">Open Questions for Tuesday</h2>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <ol className="space-y-4">
              {[
                "What is Justin Charles's specific role/expertise?",
                "How does AIC's technical work complement Mark Watts' existing projects?",
                "Is the goal to support Mark's efforts or build something separate?",
                "Access to legacy audio materials for training/transcription?",
              ].map((question, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-amber-600/20 text-amber-400 flex items-center justify-center text-sm flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-zinc-300">{question}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Comparable Model */}
        <section className="mb-16">
          <h2 className="text-2xl font-serif mb-6 text-amber-400">Comparable Model</h2>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h3 className="text-lg font-medium mb-2">XG University</h3>
            <p className="text-zinc-400 mb-3">
              Similar concept using public domain historical figures (Socrates, Jefferson) as AI chat personas.
            </p>
            <a
              href="https://xguniversity.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 text-sm"
            >
              xguniversity.com →
            </a>
          </div>
        </section>

        {/* Navigation */}
        <section className="text-center py-12 border-t border-zinc-800">
          <div className="flex justify-center gap-4">
            <Link
              href="/technology"
              className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-white transition-colors"
            >
              View Technology
            </Link>
            <Link
              href="/"
              className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 rounded-xl text-white transition-colors"
            >
              Try the Demo
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 p-6 text-center text-zinc-600 text-sm">
        <p>Built by AIC Holdings · January 2026</p>
      </footer>
    </div>
  );
}
