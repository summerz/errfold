const ANSI = /\u001b\[[0-9;?]*[ -/]*[@-~]/g

const base = (p: string) => p.split('/').filter(Boolean).pop() ?? p

export const shortInput = (tool: string, input: unknown): string => {
  if (!input || typeof input !== 'object') return ''
  const rec = input as Record<string, unknown>
  if (tool === 'Bash' && typeof rec.command === 'string') return rec.command.slice(0, 60).replace(/\r?\n/g, '⏎')
  if (['Read', 'Edit', 'Write'].includes(tool) && typeof rec.file_path === 'string') return base(rec.file_path)
  const first = Object.values(rec).find((v): v is string => typeof v === 'string')
  return first ? first.slice(0, 60).replace(/\r?\n/g, '⏎') : ''
}

export const fullText = (output: unknown): string => {
  if (typeof output === 'string') return output
  if (Array.isArray(output)) return output.map(fullText).filter(Boolean).join('\n')
  if (output && typeof output === 'object') {
    const t = (output as { text?: unknown }).text
    if (typeof t === 'string') return t
  }
  return ''
}

export const stripAnsi = (s: string): string => s.replace(ANSI, '')

export const firstLine = (output: unknown): string =>
  stripAnsi(fullText(output)).split('\n').map(l => l.trim()).find(Boolean) ?? ''

export const cut = (s: string, width: number): string => (s.length > width ? s.slice(0, Math.max(0, width - 1)) + '…' : s)
