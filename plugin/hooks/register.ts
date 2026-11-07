import type { Register } from 'claude-code'

// Rules adapted from ASD-STE100 (Simplified Technical English) for chat answers.
const STE_RULES = `# Writing style: ASD-STE100 Simplified Technical English

Write every message to the user in ASD-STE100 Simplified Technical English. Code, commands, file paths, identifiers, quoted text and error messages stay exactly as they are; these rules apply only to your own prose.

Words
- Use simple, common words. Use one word for one meaning, and use the same word for the same thing every time.
- Use technical names (file, function, API names) when necessary. Do not invent jargon or abbreviations.
- Use verbs as verbs. Write "examine the log", not "do an examination of the log".
- Do not use filler, hedges or intensifiers ("basically", "actually", "really", "just", "I think").

Sentences
- Procedural sentences (instructions, steps): 20 words or fewer.
- Descriptive sentences (explanations): 25 words or fewer.
- One instruction per sentence, unless two actions occur at the same time.
- Use the active voice. Write "The script deletes the cache", not "The cache is deleted".
- Use the imperative for instructions: "Run the tests."
- Use simple verb tenses: present, simple past, simple future.
- Do not omit articles (a, an, the) or verbs to make text shorter.
- Write warnings and cautions as a clear command first, then a short reason.

Structure
- Put the result or answer first.
- Paragraphs: one topic, 6 sentences or fewer.
- Use numbered lists for sequential steps and bulleted lists for items that have no order.
- Do not repeat information. Do not add a summary of what you already said.
- Do not use preambles or meta-commentary ("Here is...", "Let me explain...").`

const SECTION_ID = 'ste100:style'
const KEY = 'enabled'

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'ste',
      description: 'Simplified Technical English style: /ste on, /ste off, or /ste to toggle',
    })
    const isOn = (await $.store.get(KEY)) !== false
    $.ui.status(isOn ? 'STE100' : undefined)

    return next(e)
  })

  on('command.run', { command: 'ste' }, async ($, e) => {
    const wasOn = (await $.store.get(KEY)) !== false
    const arg = e.args.trim().toLowerCase()
    const isOn = arg === 'on' ? true : arg === 'off' ? false : !wasOn
    await $.store.set(KEY, isOn)
    $.ui.status(isOn ? 'STE100' : undefined)

    return {
      text: isOn
        ? 'STE100 style is on. It applies from your next message.'
        : 'STE100 style is off. It applies from your next message.',
    }
  })

  on('prompt.compose', async ($, e, next) => {
    const result = await next(e)
    if ((await $.store.get(KEY)) === false) return result

    return {
      sections: [
        ...result.sections.filter(s => s.id !== SECTION_ID),
        { id: SECTION_ID, text: STE_RULES, scope: 'session' as const },
      ],
    }
  })
}
