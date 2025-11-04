'use client'

import { useState } from 'react'

interface BacklinkTarget {
  id: string
  url: string
  anchorText: string
  status: 'pending' | 'in-progress' | 'completed' | 'failed'
  createdAt: Date
  completedAt?: Date
}

interface BacklinkOpportunity {
  platform: string
  url: string
  type: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export default function Home() {
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [anchorText, setAnchorText] = useState('')
  const [targetCount, setTargetCount] = useState(10)
  const [backlinks, setBacklinks] = useState<BacklinkTarget[]>([])
  const [opportunities, setOpportunities] = useState<BacklinkOpportunity[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`])
  }

  const findBacklinkOpportunities = async () => {
    addLog('Searching for backlink opportunities...')

    // Simulated backlink opportunities
    const mockOpportunities: BacklinkOpportunity[] = [
      { platform: 'Medium', url: 'https://medium.com', type: 'Guest Post', difficulty: 'medium' },
      { platform: 'Dev.to', url: 'https://dev.to', type: 'Comment', difficulty: 'easy' },
      { platform: 'Reddit', url: 'https://reddit.com', type: 'Discussion', difficulty: 'medium' },
      { platform: 'Quora', url: 'https://quora.com', type: 'Answer', difficulty: 'easy' },
      { platform: 'HackerNews', url: 'https://news.ycombinator.com', type: 'Comment', difficulty: 'hard' },
      { platform: 'Product Hunt', url: 'https://producthunt.com', type: 'Launch', difficulty: 'medium' },
      { platform: 'LinkedIn', url: 'https://linkedin.com', type: 'Article', difficulty: 'easy' },
      { platform: 'Twitter/X', url: 'https://twitter.com', type: 'Tweet', difficulty: 'easy' },
      { platform: 'GitHub', url: 'https://github.com', type: 'Repository', difficulty: 'medium' },
      { platform: 'Stack Overflow', url: 'https://stackoverflow.com', type: 'Answer', difficulty: 'hard' },
    ]

    setOpportunities(mockOpportunities)
    addLog(`Found ${mockOpportunities.length} backlink opportunities`)
    return mockOpportunities
  }

  const createBacklink = async (opportunity: BacklinkOpportunity): Promise<BacklinkTarget> => {
    addLog(`Creating backlink on ${opportunity.platform}...`)

    // Simulate backlink creation delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

    const success = Math.random() > 0.2 // 80% success rate

    const backlink: BacklinkTarget = {
      id: Math.random().toString(36).substr(2, 9),
      url: `${opportunity.url}/${Math.random().toString(36).substr(2, 9)}`,
      anchorText: anchorText || 'Visit Website',
      status: success ? 'completed' : 'failed',
      createdAt: new Date(),
      completedAt: success ? new Date() : undefined,
    }

    if (success) {
      addLog(`✓ Successfully created backlink on ${opportunity.platform}`)
    } else {
      addLog(`✗ Failed to create backlink on ${opportunity.platform}`)
    }

    return backlink
  }

  const startAutomation = async () => {
    if (!websiteUrl) {
      alert('Please enter your website URL')
      return
    }

    setIsRunning(true)
    setBacklinks([])
    setLogs([])
    addLog('Starting backlink automation...')
    addLog(`Target website: ${websiteUrl}`)
    addLog(`Target count: ${targetCount} backlinks`)

    try {
      // Find opportunities
      const opportunities = await findBacklinkOpportunities()

      // Create backlinks
      const selectedOpportunities = opportunities.slice(0, targetCount)

      for (const opportunity of selectedOpportunities) {
        const backlink = await createBacklink(opportunity)
        setBacklinks(prev => [...prev, backlink])
      }

      const successful = backlinks.filter(b => b.status === 'completed').length
      addLog(`Automation complete! Created ${successful}/${targetCount} backlinks`)
    } catch (error) {
      addLog(`Error: ${error}`)
    } finally {
      setIsRunning(false)
    }
  }

  const stopAutomation = () => {
    setIsRunning(false)
    addLog('Automation stopped by user')
  }

  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">
            🔗 Backlink Automation Agent
          </h1>
          <p className="text-gray-300 text-lg">
            Automate your backlink creation across multiple platforms
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Configuration Panel */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">Configuration</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-white mb-2 font-medium">
                  Your Website URL
                </label>
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://yourwebsite.com"
                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isRunning}
                />
              </div>

              <div>
                <label className="block text-white mb-2 font-medium">
                  Anchor Text
                </label>
                <input
                  type="text"
                  value={anchorText}
                  onChange={(e) => setAnchorText(e.target.value)}
                  placeholder="Click here"
                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isRunning}
                />
              </div>

              <div>
                <label className="block text-white mb-2 font-medium">
                  Target Backlinks: {targetCount}
                </label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={targetCount}
                  onChange={(e) => setTargetCount(parseInt(e.target.value))}
                  className="w-full"
                  disabled={isRunning}
                />
              </div>

              <div className="flex gap-4">
                {!isRunning ? (
                  <button
                    onClick={startAutomation}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                  >
                    🚀 Start Automation
                  </button>
                ) : (
                  <button
                    onClick={stopAutomation}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                  >
                    ⏸ Stop Automation
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Statistics Panel */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">Statistics</h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-600/30 rounded-lg p-4 border border-green-500/50">
                <div className="text-3xl font-bold text-white">
                  {backlinks.filter(b => b.status === 'completed').length}
                </div>
                <div className="text-green-200 text-sm">Successful</div>
              </div>

              <div className="bg-red-600/30 rounded-lg p-4 border border-red-500/50">
                <div className="text-3xl font-bold text-white">
                  {backlinks.filter(b => b.status === 'failed').length}
                </div>
                <div className="text-red-200 text-sm">Failed</div>
              </div>

              <div className="bg-blue-600/30 rounded-lg p-4 border border-blue-500/50">
                <div className="text-3xl font-bold text-white">
                  {backlinks.length}
                </div>
                <div className="text-blue-200 text-sm">Total Attempts</div>
              </div>

              <div className="bg-purple-600/30 rounded-lg p-4 border border-purple-500/50">
                <div className="text-3xl font-bold text-white">
                  {backlinks.length > 0
                    ? Math.round((backlinks.filter(b => b.status === 'completed').length / backlinks.length) * 100)
                    : 0}%
                </div>
                <div className="text-purple-200 text-sm">Success Rate</div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-white font-semibold mb-2">Available Platforms</h3>
              <div className="flex flex-wrap gap-2">
                {opportunities.slice(0, 10).map((opp, i) => (
                  <span
                    key={i}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      opp.difficulty === 'easy'
                        ? 'bg-green-600/40 text-green-200'
                        : opp.difficulty === 'medium'
                        ? 'bg-yellow-600/40 text-yellow-200'
                        : 'bg-red-600/40 text-red-200'
                    }`}
                  >
                    {opp.platform}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Activity Log */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Activity Log</h2>
          <div className="bg-black/30 rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm">
            {logs.length === 0 ? (
              <div className="text-gray-400">Waiting for automation to start...</div>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="text-green-400 mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Backlinks List */}
        {backlinks.length > 0 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">Created Backlinks</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left text-white py-2 px-4">URL</th>
                    <th className="text-left text-white py-2 px-4">Anchor Text</th>
                    <th className="text-left text-white py-2 px-4">Status</th>
                    <th className="text-left text-white py-2 px-4">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {backlinks.map((backlink) => (
                    <tr key={backlink.id} className="border-b border-white/10">
                      <td className="text-blue-300 py-2 px-4 truncate max-w-xs">
                        <a href={backlink.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {backlink.url}
                        </a>
                      </td>
                      <td className="text-gray-300 py-2 px-4">{backlink.anchorText}</td>
                      <td className="py-2 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            backlink.status === 'completed'
                              ? 'bg-green-600/40 text-green-200'
                              : backlink.status === 'failed'
                              ? 'bg-red-600/40 text-red-200'
                              : 'bg-yellow-600/40 text-yellow-200'
                          }`}
                        >
                          {backlink.status}
                        </span>
                      </td>
                      <td className="text-gray-400 py-2 px-4 text-sm">
                        {backlink.createdAt.toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>⚠️ This is a demonstration tool. Actual backlink creation requires API integrations.</p>
        </div>
      </div>
    </main>
  )
}
