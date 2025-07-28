"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "../components/ui/textarea"
import { Loader2, Play, Book, Copy, Check } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

const defaultPayload = {
  githubUrl: "https://github.com/assafelovic/gpt-researcher",
}

const mockResponse = {
  summary:
    "GPT Researcher is an autonomous agent designed for comprehensive online research on various tasks. It aims to produce detailed, factual, and unbiased research reports by leveraging AI technology. The project addresses issues of misinformation, speed, determinism, and reliability in research tasks.",
  cool_facts: [
    "The project leverages both 'gpt-4o-mini' and 'gpt-4o' (128K context) to complete research tasks, optimizing costs by using each only when necessary.",
    "The average research task using GPT Researcher takes around 2 minutes to complete and costs approximately $0.006.",
  ],
}

export function ApiDemo() {
  const [payload, setPayload] = useState(JSON.stringify(defaultPayload, null, 2))
  const [response, setResponse] = useState(JSON.stringify(mockResponse, null, 2))
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const { data: session, status } = useSession()
  const router = useRouter()

  const handleSendRequest = async () => {
    // Check authentication status
    if (status === "loading") {
      toast({
        title: "Loading...",
        description: "Please wait while we check your authentication status.",
      })
      return
    }

    if (!session) {
      // User is not authenticated, redirect to login
      toast({
        title: "Authentication Required",
        description: "Please sign in to use the API demo.",
      })
      router.push("/auth")
      return
    }

    // User is authenticated, redirect to playground
    router.push("/playground")
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({
        title: "Copied!",
        description: "Response copied to clipboard.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Request Panel */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  POST
                </Badge>
                Request
              </CardTitle>
              <CardDescription className="mt-1">https://dandi-cli.vercel.app/api/github-summarizer</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Book className="w-4 h-4 mr-2" />
              Documentation
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Request Body (JSON)</label>
            <Textarea
              value={payload}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPayload(e.target.value)}
              className="font-mono text-sm min-h-[120px]"
              placeholder="Enter JSON payload..."
            />
          </div>
          <Button onClick={handleSendRequest} disabled={status === "loading"} className="w-full">
            {status === "loading" ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Checking Authentication...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Try API Demo
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Response Panel */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  200 OK
                </Badge>
                Response
              </CardTitle>
              <CardDescription className="mt-1">2.98 s • 817 B</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => copyToClipboard(response)}>
              {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto max-h-[300px] font-mono">
              <code>{response}</code>
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Try These Examples */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Try These Popular Repositories</CardTitle>
          <CardDescription>Click any example below to test our API with different repositories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "React", url: "https://github.com/facebook/react" },
              { name: "VS Code", url: "https://github.com/microsoft/vscode" },
              { name: "Next.js", url: "https://github.com/vercel/next.js" },
              { name: "TensorFlow", url: "https://github.com/tensorflow/tensorflow" },
              { name: "Vue.js", url: "https://github.com/vuejs/vue" },
              { name: "Node.js", url: "https://github.com/nodejs/node" },
            ].map((repo) => (
              <Button
                key={repo.name}
                variant="outline"
                size="sm"
                onClick={() => setPayload(JSON.stringify({ githubUrl: repo.url }, null, 2))}
                className="justify-start"
              >
                {repo.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 