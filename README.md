# @hocgin/tts-cli

[English](README.md) | [中文](README-zh.md)

TTS CLI tool powered by Microsoft Edge online TTS service.

## Installation

```bash
npm install -g @hocgin/tts-cli
```

## Usage

```bash
# Synthesize speech
tts --text "Hello world" --voice en-US-AriaNeural -o output.mp3

# Read text from file
tts --file input.txt -o output.mp3

# Pipe input
echo "Hello world" | tts --voice en-US-AriaNeural -o output.mp3

# With subtitles
tts --text "Hello world" -o output.mp3 --write-subtitles output.vtt

# Adjust rate/volume/pitch
tts --text "Hello" --rate "+50%" --volume "+10%" --pitch "+5Hz" -o output.mp3

# List Chinese voices
tts --list-voices zh-CN

# List all voices
tts --list-voices

# Verbose logging
tts --text "Hello" -o output.mp3 -v
```

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `--text <text>` | Text to synthesize | - |
| `--file <file>` | Read text from file | - |
| `--voice <voice>` | Voice name | `en-US-AriaNeural` |
| `-o, --output <file>` | Output audio file path | required |
| `--write-subtitles <file>` | Output WebVTT subtitle file | - |
| `--rate <rate>` | Speech rate (e.g. "+50%", "-20%") | `+0%` |
| `--volume <volume>` | Volume (e.g. "+50%", "-20%") | `+0%` |
| `--pitch <pitch>` | Pitch (e.g. "+5Hz", "-5Hz") | `+0Hz` |
| `--proxy <url>` | Proxy server | - |
| `--list-voices [locale]` | List available voices | - |
| `-v, --verbose` | Verbose logging | - |

## Development

```bash
pnpm install
pnpm build

# Test
pnpm test

# Test coverage
pnpm test:coverage

# Format
pnpm format
```

## Claude Code Skill

```bash
npx skills add https://github.com/hocgin/tts-cli
```
