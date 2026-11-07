import type { Register } from 'claude-code'

// Rules adapted from ASD-STE100 (Simplified Technical English) for chat answers.
const STE_RULES = `# Writing style: ASD-STE100 Simplified Technical English

Write your prose messages to the user in this chat in ASD-STE100 Simplified Technical English.

Scope
- These rules apply only to your own prose in chat replies to the user.
- They do not apply to code, code comments, docstrings, commit messages, pull request text, documentation, or any other file content. For those, follow the project's existing conventions and the user's instructions.
- They do not apply to tool inputs, prompts you write for subagents, or text you quote (code, commands, paths, identifiers, logs, error messages). Keep those exactly as they are.
- Code blocks, diffs, tables and file lists keep their normal format.

Priorities
- The rules change how you write, not how much you do. Do not skip steps, checks, tests, caveats or technical detail to make a reply shorter.
- Correct and complete information comes before short text.
- If the user asks for a different style, length or format, follow the user.

Words
- Use simple, common words. Use one word for one meaning, and use the same word for the same thing every time.
- Use exact technical terms (names of files, functions, APIs, errors, tools). Do not replace them with simpler words. Do not invent jargon or abbreviations.
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

// The status line already shows the plugin's name (ste100) as the label.
const STATUS_ON = '● on'
const SECTION_ID = 'ste100:style'
const KEY = 'enabled'

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'ste',
      description: 'Simplified Technical English style: /ste on, /ste off, or /ste to toggle',
    })
    const isOn = (await $.store.get(KEY)) !== false
    $.ui.status(isOn ? STATUS_ON : undefined)

    return next(e)
  })

  on('command.run', { command: 'ste' }, async ($, e) => {
    const wasOn = (await $.store.get(KEY)) !== false
    const arg = e.args.trim().toLowerCase()
    const isOn = arg === 'on' ? true : arg === 'off' ? false : !wasOn
    await $.store.set(KEY, isOn)
    $.ui.status(isOn ? STATUS_ON : undefined)

    return {
      text: isOn
        ? 'STE100 style is on. It applies from your next message.'
        : 'STE100 style is off. It applies from your next message.',
    }
  })

  on('prompt.compose', async ($, e, next) => {
    const result = await next(e)
    // No surface draws the session (`claude -p`, a script): output may be parsed, so leave it.
    // The desktop app also has the `print` trait, so do not test traits here.
    if (e.surfaces.length === 0) return result
    if ((await $.store.get(KEY)) === false) return result

    return {
      sections: [
        ...result.sections.filter(s => s.id !== SECTION_ID),
        { id: SECTION_ID, text: STE_RULES, scope: 'session' as const },
      ],
    }
  })
}
