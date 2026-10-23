import { expect, test } from 'claude-code/testing'
import { firstLine, shortInput } from '../hooks/fold'

test('shortInput picks the telling field per tool', () => {
  expect(shortInput('Bash', { command: 'ls\nrm x' })).toBe('ls⏎rm x')
  expect(shortInput('Bash', { command: 'x'.repeat(100) })).toHaveLength(60)
  expect(shortInput('Read', { file_path: '/a/b/c.ts' })).toBe('c.ts')
  expect(shortInput('Grep', { n: 1, pattern: 'foo' })).toBe('foo')
  expect(shortInput('Bash', undefined)).toBe('')
})

test('firstLine reads strings, {text}, blocks, and strips ANSI', () => {
  expect(firstLine('\n\u001b[31mboom\u001b[0m\nmore')).toBe('boom')
  expect(firstLine({ text: 'a\nb' })).toBe('a')
  expect(firstLine([{ type: 'text', text: '' }, { type: 'text', text: 'second' }])).toBe('second')
  expect(firstLine(undefined)).toBe('')
})
