import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'
import { cut, firstLine, fullText, shortInput, stripAnsi } from './fold'

const PANE = 'errors'
const MAX = 100
const WIDTH = 100

type Err = { at: number; tool: string; input: string; text: string; tool_use_id: string }
// ponytail: module array, a reload drops the log, which is fine
let log: Err[] = []
const rev = atom({ plugin: 'errfold', key: 'rev' } as const, 0)

const hhmm = (at: number) => new Date(at).toTimeString().slice(0, 5)

const status = async ($: EngineInterface, show: boolean) => {
  if (!show) return
  const n = log.length
  await $.ui.status(n > 0 ? `✗ ${n} tool error${n === 1 ? '' : 's'}  /errors` : undefined)
}

export const register: Register = (on, options) => {
  const lines = Math.max(1, Number.parseInt(String(options.lines ?? '8'), 10) || 8)
  const showStatus = options.status !== false

  on('session.start', async ($, e, next) => {
    await $.command.register({ name: 'errors', description: 'Toggle the tool errors pane' })
    return next(e)
  })

  on('command.run', { command: 'errors' }, async $ => {
    if ((await $.ui.panes()).some(pane => pane.id === PANE)) {
      await $.ui.close({ id: PANE })
      return { text: 'Errors pane closed.' }
    }
    await $.ui.open({ id: PANE, title: 'Tool errors', rows: 20, columns: 100, focus: true, closeOnEscape: true })
    return { text: 'Errors pane opened.' }
  })

  // tool.call sees every finished call, even in collapsed groups that never render ToolResult rows.
  on('tool.call', async ($, e, next) => {
    const r = await next(e)
    if (r.isError && !log.some(x => x.tool_use_id === e.tool_use_id)) {
      const { tool, tool_use_id, ...args } = e as unknown as Record<string, unknown> & { tool: string; tool_use_id: string }
      log = [{ at: Date.now(), tool, input: shortInput(tool, args), text: stripAnsi(r.text ?? '').slice(0, 4000), tool_use_id }, ...log].slice(0, MAX)
      await update($, rev, n => n + 1)
      await status($, showStatus)
    }
    return r
  })

  // ToolResult props carry no input, so the ToolUse row (drawn first) leaves it here.
  const inputs = new Map<string, unknown>()
  on('ui.render', { component: 'ToolUse' }, async ($, e, next) => {
    if (!inputs.has(e.props.tool_use_id)) {
      inputs.set(e.props.tool_use_id, e.props.input)
      if (inputs.size > 300) inputs.delete(inputs.keys().next().value as string)
    }
    return next(e) // the call row is already one line
  })

  // Failed results become one line; the person expands (ctrl+o) for the full text.
  on('ui.render', { component: 'ToolResult' }, async ($, e, next) => {
    const p = e.props
    if (!p.isErrored) return next(e)
    const input = shortInput(p.tool, inputs.get(p.tool_use_id))
    const full = stripAnsi(fullText(p.output))
    if (!log.some(x => x.tool_use_id === p.tool_use_id)) {
      log = [{ at: Date.now(), tool: p.tool, input, text: full.slice(0, 4000), tool_use_id: p.tool_use_id }, ...log].slice(0, MAX)
      await update($, rev, n => n + 1)
      await status($, showStatus)
    }
    if (p.isExpanded === true) return next(e)
    const { Text } = $.ui.resolve(e)
    const head = `✗ ${p.tool}${input ? ' ' + input : ''}`
    const msg = firstLine(p.output)
    const room = Math.max(0, WIDTH - head.length - 3)
    return (
      <Text color="error" wrap="truncate-end">
        <Text bold>✗ {p.tool}</Text>
        {input ? ' ' + input : ''}
        {msg ? ' — ' + cut(msg, room) : ''}
      </Text>
    )
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Text, Button } = $.ui.resolve(e)
    await read($, rev)
    const clear = async () => {
      log = []
      await update($, rev, n => n + 1)
      await status($, showStatus)
    }
    return (
      <Box flexDirection="column">
        {log.length === 0 && <Text dimColor>No tool errors this session.</Text>}
        {log.map(err => {
          const body = err.text.split('\n').slice(0, lines)
          return (
            <Box flexDirection="column" marginBottom={1}>
              <Text color="error">{hhmm(err.at)}  ✗ {err.tool} {err.input}</Text>
              {body.map(line => <Text dimColor>{line}</Text>)}
            </Box>
          )
        })}
        {log.length > 0 && <Button key="clear" plain hotkey="c" label="c: [clear]" onPress={clear} />}
      </Box>
    )
  })
}
