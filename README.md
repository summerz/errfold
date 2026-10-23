# errfold

Folds failed tool calls to one line.

[한국어](README.ko.md)

## Why

A failed tool call prints its whole error into the transcript:

- A long stack trace pushes the conversation off screen.
- The same retry noise repeats on every attempt.
- Once folded away by scrolling, an old error is hard to find again.

errfold records each failure when the call completes, folds its transcript row to one line, and keeps the full list one command away.

## Install

Run in the prompt of a terminal session:

```
/plugin install errfold --marketplace summerz/errfold
```

Answer `y` to add the marketplace, then pick a scope.

- Prompt: the command above.
- Shell: `claude plugin install errfold --marketplace summerz/errfold`
- Desktop app: `/plugin` does not run. Click + next to the prompt box, then Plugins, then Add marketplace with `summerz/errfold`, then Add plugin.

## Features

- Records every failed tool call at completion.
- Folds the failed row in the transcript to one line.
- `/errors` opens a pane that lists the errors, newest first. `[clear]` (key `c`) empties the list.
- With `status` on, the status line shows `✗ n tool errors`.
- `lines` sets how many lines of each error the pane shows.

## Settings

| Setting | Default | Does |
| --- | --- | --- |
| `lines` | `8` | lines of each error shown in the `/errors` pane |
| `status` | `true` | show `✗ n tool errors` in the status line |

Change them in the plugin's rows of the config menu, or in `~/.claude/settings.json`:

```json
{ "pluginConfigs": { "errfold": { "lines": "12", "status": false } } }
```

## License

MIT
