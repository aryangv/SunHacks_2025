"use client"

import Link from "next/link"
import { useState, useEffect } from "react"

export default function ResourcesDisplayPage() {
  const [selectedResource, setSelectedResource] = useState<number | null>(null)
  const [resources, setResources] = useState([
    {
      id: 1,
      title: "Introduction to Machine Learning",
      type: "PDF Document",
      description: "Comprehensive guide covering ML fundamentals and algorithms",
      url: "#",
    },
    {
      id: 2,
      title: "Data Structures and Algorithms",
      type: "Video Series",
      description: "Complete course on DSA with practical examples",
      url: "#",
    },
    {
      id: 3,
      title: "Web Development Bootcamp",
      type: "Interactive Course",
      description: "Full-stack development from basics to advanced concepts",
      url: "#",
    },
    {
      id: 4,
      title: "Python Programming Guide",
      type: "eBook",
      description: "Step-by-step Python tutorial with hands-on projects",
      url: "#",
    },
    {
      id: 5,
      title: "Database Design Principles",
      type: "Research Paper",
      description: "Academic paper on modern database architecture patterns",
      url: "#",
    },
  ])

  // Load resources from localStorage
  useEffect(() => {
    const savedResources = localStorage.getItem('generatedResources')
    if (savedResources) {
      // Parse the resources text and create resource objects
      const resourceText = savedResources
      
      // Split by lines and filter out empty lines
      const lines = resourceText.split('\n').filter(line => line.trim())
      
      // Find the start of the actual resource list (skip intro text)
      let startIndex = 0
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()
        // Look for patterns that indicate the start of resource listings
        if (line.includes('**') && (line.includes('Title') || line.includes('Name') || line.includes('Course') || line.includes('Book'))) {
          startIndex = i
          break
        }
        // Or look for numbered lists or bullet points
        if (line.match(/^\d+\./) || line.match(/^[-*]\s/)) {
          startIndex = i
          break
        }
      }
      
      // Extract resources from the relevant lines
      const resourceLines = lines.slice(startIndex)
      const parsedResources = []
      
      // Group lines by resource - look for patterns that indicate new resources
      let currentResource = null
      let resourceId = 1
      
      for (let i = 0; i < resourceLines.length; i++) {
        const line = resourceLines[i].trim()
        
        // Skip empty lines
        if (!line) continue
        
        // Look for title patterns - this starts a new resource
        if (line.includes('**Title:**') || line.includes('**Name:**')) {
          const titleMatch = line.match(/\*\*(?:Title|Name):\*\*\s*(.+)/i)
          if (titleMatch) {
            // Save previous resource if it exists
            if (currentResource) {
              parsedResources.push(currentResource)
            }
            // Start new resource
            currentResource = {
              id: resourceId++,
              title: titleMatch[1].trim(),
              type: "Educational Resource",
              description: "",
              url: "#",
            }
          }
        }
        // Look for description patterns - add to current resource
        else if (line.includes('**Description:**') && currentResource) {
          const descMatch = line.match(/\*\*Description:\*\*\s*(.+)/i)
          if (descMatch) {
            currentResource.description = descMatch[1].trim()
          }
        }
        // Look for URL patterns - add to current resource
        else if (line.includes('**URL:**') && currentResource) {
          const urlMatch = line.match(/\*\*URL:\*\*\s*(.+)/i)
          if (urlMatch) {
            const url = urlMatch[1].trim()
            if (url !== 'N/A' && url !== 'Not available') {
              currentResource.url = url
            }
          }
        }
        // Look for author patterns - add to current resource
        else if (line.includes('**Author:**') && currentResource) {
          const authorMatch = line.match(/\*\*Author:\*\*\s*(.+)/i)
          if (authorMatch) {
            currentResource.description = `${currentResource.description} By ${authorMatch[1].trim()}`
          }
        }
        // Look for type patterns - add to current resource
        else if (line.includes('**Type:**') && currentResource) {
          const typeMatch = line.match(/\*\*Type:\*\*\s*(.+)/i)
          if (typeMatch) {
            currentResource.type = typeMatch[1].trim()
          }
        }
        // Look for bold text that might be titles (fallback) - but not field labels
        else if (line.includes('**') && !line.includes('Title:') && !line.includes('Name:') && !line.includes('Description:') && !line.includes('URL:') && !line.includes('Author:') && !line.includes('Type:') && !line.includes('**Title:**') && !line.includes('**Name:**')) {
          const titleMatch = line.match(/\*\*([^*]+)\*\*/)
          if (titleMatch) {
            // Save previous resource if it exists
            if (currentResource) {
              parsedResources.push(currentResource)
            }
            // Start new resource
            currentResource = {
              id: resourceId++,
              title: titleMatch[1].trim(),
              type: "Educational Resource",
              description: "",
              url: "#",
            }
          }
        }
        // If it's a standalone line that looks like a title (no special formatting) - start new resource
        else if (!line.includes('**') && !line.includes('http') && line.length > 10 && !line.includes('**Title:**') && !line.includes('**Name:**') && !line.includes('Title:') && !line.includes('Name:')) {
          // Save previous resource if it exists
          if (currentResource) {
            parsedResources.push(currentResource)
          }
          // Start new resource
          currentResource = {
            id: resourceId++,
            title: line,
            type: "Educational Resource", 
            description: "",
            url: "#",
          }
        }
        // If we have a current resource and this line looks like a description - add to current resource
        else if (currentResource && !currentResource.description && line.length > 20) {
          currentResource.description = line
        }
      }
      
      // Add the last resource if it exists
      if (currentResource) {
        parsedResources.push(currentResource)
      }
      
      // If no structured resources found, create simple ones from lines
      if (parsedResources.length === 0) {
        const simpleResources = resourceLines.slice(0, 10).map((line, index) => ({
          id: index + 1,
          title: line.trim(),
          type: "Educational Resource",
          description: "AI-generated educational resource",
          url: "#",
        }))
        setResources(simpleResources)
      } else {
        setResources(parsedResources)
      }
    }
  }, [])

  const handleDownload = () => {
    const resourcesText = resources
      .map((resource) => `${resource.title}\nType: ${resource.type}\nDescription: ${resource.description}\n---`)
      .join("\n\n")

    const blob = new Blob([resourcesText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "synapse-x-resources.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen space-background text-white font-montserrat">
      <div className="min-h-screen p-8">
        <header className="text-center pt-8 mb-12">
          <div className="flex justify-between items-center max-w-6xl mx-auto">
            <Link
              href="/"
              className="bg-black/30 border border-gray-400 hover:border-gray-300 text-white font-bold py-3 px-8 rounded-xl transition-colors backdrop-blur-sm"
            >
              SYNAPSE X
            </Link>

            <div className="bg-black/30 border border-gray-400 text-white font-bold py-3 px-12 rounded-xl backdrop-blur-sm">
              RESOURCES
            </div>

            <div className="w-32"></div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto">
          <div className="feature-card wave-pattern rounded-2xl p-8">
            <div className="space-y-6">
              {resources.map((resource, index) => (
                <div
                  key={resource.id}
                  className={`bg-black/20 border rounded-xl p-6 cursor-pointer transition-all duration-300 hover:bg-black/30 ${
                    selectedResource === resource.id
                      ? "border-purple-400 bg-black/40 shadow-lg shadow-purple-400/20"
                      : "border-gray-500 hover:border-gray-400"
                  }`}
                  onClick={() => setSelectedResource(selectedResource === resource.id ? null : resource.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">{resource.title}</h3>
                      <p className="text-gray-300 mb-2">{resource.description}</p>
                      {resource.description.includes('By ') && (
                        <p className="text-purple-300 text-sm">{resource.description}</p>
                      )}
                    </div>
                    <div className="ml-4">
                      <span className="text-gray-400 text-sm">#{index + 1}</span>
                    </div>
                  </div>

                  {selectedResource === resource.id && (
                    <div className="mt-4 pt-4 border-t border-gray-600">
                      <div className="flex gap-4">
                        <a 
                          href={resource.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm inline-block"
                        >
                          Open Resource
                        </a>
                        <button className="border border-gray-400 hover:border-gray-300 text-gray-300 hover:text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
                          Add to Favorites
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Featured/Selected Resource Display */}
              {selectedResource && (
                <div className="bg-black/30 border-2 border-purple-400 rounded-xl p-8 mt-8">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">Featured Resource</h2>
                      <p className="text-gray-300">{resources.find((r) => r.id === selectedResource)?.title}</p>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-purple-400 rounded-sm"></div>
                      <div className="w-3 h-3 bg-purple-400 rounded-sm"></div>
                      <div className="w-3 h-3 bg-purple-400 rounded-sm"></div>
                      <div className="w-3 h-3 bg-purple-400 rounded-sm"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <button
              onClick={handleDownload}
              className="bg-black/30 border border-gray-400 hover:border-gray-300 text-white font-bold py-3 px-8 rounded-xl transition-colors backdrop-blur-sm"
            >
              DOWNLOAD
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}
