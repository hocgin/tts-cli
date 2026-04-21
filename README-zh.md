# @hocgin/tts-cli

[English](README.md) | [中文](README-zh.md)

TTS 命令行工具，使用 Microsoft Edge 在线 TTS 服务。

## 安装

```bash
npm install -g @hocgin/tts-cli
```

## 使用

```bash
# 合成语音
tts --text "Hello world" --voice en-US-AriaNeural -o output.mp3

# 从文件读取文本
tts --file input.txt -o output.mp3

# 管道输入
echo "你好世界" | tts --voice zh-CN-XiaoxiaoNeural -o output.mp3

# 带字幕输出
tts --text "Hello world" -o output.mp3 --write-subtitles output.vtt

# 调整语速/音量/音调
tts --text "Hello" --rate "+50%" --volume "+10%" --pitch "+5Hz" -o output.mp3

# 列出所有中文语音
tts --list-voices zh-CN

# 列出所有语音
tts --list-voices

# 详细日志
tts --text "Hello" -o output.mp3 -v
```

## 选项

| 选项 | 说明 | 默认值 |
|------|------|--------|
| `--text <text>` | 要合成的文本 | - |
| `--file <file>` | 从文件读取文本 | - |
| `--voice <voice>` | 语音名称 | `en-US-AriaNeural` |
| `-o, --output <file>` | 输出音频文件路径 | 必填 |
| `--write-subtitles <file>` | 输出 WebVTT 字幕文件 | - |
| `--rate <rate>` | 语速 (如 "+50%", "-20%") | `+0%` |
| `--volume <volume>` | 音量 (如 "+50%", "-20%") | `+0%` |
| `--pitch <pitch>` | 音调 (如 "+5Hz", "-5Hz") | `+0Hz` |
| `--proxy <url>` | 代理服务器 | - |
| `--list-voices [locale]` | 列出可用语音 | - |
| `-v, --verbose` | 详细日志 | - |

## 开发

```bash
pnpm install
pnpm build

# 测试
pnpm test

# 测试覆盖率
pnpm test:coverage

# 格式化
pnpm format
```

## Claude Code Skill

```bash
npx skills add https://github.com/hocgin/tts-cli
```
