import { expect, test } from 'claude-code/testing'

const INPUT = {
  model: 'claude-opus-5-5',
  promptModel: 'claude-opus-5-5',
  surfaces: ['terminal'] as const,
  tools: ['Bash', 'Edit'],
  outputStyle: null,
}
const BASE = [{ id: 'intro', text: 'engine prompt', scope: 'shared' as const }]

test('adds the STE section after the engine sections, scoped to the chat', async ($, on) => {
  // This hook stands for the engine's own composition.
  on('prompt.compose', () => ({ sections: BASE }))
  on('store.get', () => ({ value: undefined }))

  const { sections } = await $.prompt.compose({ ...INPUT, traits: [] })
  const ste = sections.find(s => s.id === 'ste100:style')

  expect(sections[0]?.id).toBe('intro')
  expect(ste?.scope).toBe('session')
  expect(ste?.text).toContain('do not apply to code, code comments')
  expect(ste?.text).toContain('Do not skip steps, checks, tests')
})

test('leaves the prompt alone in -p and SDK runs', async ($, on) => {
  on('prompt.compose', () => ({ sections: BASE }))
  on('store.get', () => ({ value: undefined }))
  // Proves the hook ran: with no skip trait it adds the section.
  const plain = await $.prompt.compose({ ...INPUT, traits: [] })
  expect(plain.sections.some(s => s.id === 'ste100:style')).toBe(true)

  for (const trait of ['print', 'sdk-preset'] as const) {
    const { sections } = await $.prompt.compose({ ...INPUT, traits: [trait] })
    expect(sections.some(s => s.id === 'ste100:style')).toBe(false)
  }
})

test('leaves the prompt alone after /ste off', async ($, on) => {
  on('prompt.compose', () => ({ sections: BASE }))
  let stored: boolean | undefined = true
  on('store.get', () => ({ value: stored }))

  const on1 = await $.prompt.compose({ ...INPUT, traits: [] })
  expect(on1.sections.some(s => s.id === 'ste100:style')).toBe(true)

  stored = false
  const off = await $.prompt.compose({ ...INPUT, traits: [] })
  expect(off.sections.some(s => s.id === 'ste100:style')).toBe(false)
})
