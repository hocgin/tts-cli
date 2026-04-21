---
name: tts-cli
description: >
  CLI text-to-speech tool powered by Microsoft Edge TTS. Synthesize text to MP3 audio with
  WebVTT subtitles, support 400+ voices across 75+ locales. Supports text args, stdin pipe,
  file input, rate/volume/pitch adjustment, proxy, and voice listing. Use when user says:
  "tts", "text to speech", "语音合成", "文字转语音", "tts合成", "生成语音", "synthesize speech",
  "edge tts", "文本转音频", "tts cli", "generate audio", "语音文件", "字幕生成", "generate subtitles"
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
---

# tts-cli

TTS 命令行工具，使用 Microsoft Edge 在线 TTS 服务。

## 安装

```bash
# 全局安装（需要 Node.js >= 18）
npm install -g @hocgin/tts-cli

# 或使用 pnpm
pnpm add -g @hocgin/tts-cli

# 或从源码构建
cd /path/to/tts-cli
pnpm build && npm link
```

## CLI 语法

```
tts [OPTIONS]
```

## 输入方式

```bash
# 命令行参数
tts --text "Hello World" -o output.mp3

# 管道输入（stdin）
echo "Hello World" | tts -o output.mp3
cat article.txt | tts --voice zh-CN-XiaoxiaoNeural -o output.mp3

# 从文件读取
tts --file input.txt -o output.mp3
```

输入优先级：`--text` > `--file` > stdin 管道。

## 语音合成

```bash
# 基本合成（默认使用 en-US-AriaNeural）
tts --text "Hello World" -o output.mp3

# 指定语音
tts --text "你好世界" --voice zh-CN-XiaoxiaoNeural -o output.mp3
tts --text "こんにちは" --voice ja-JP-NanamiNeural -o output.mp3

# 调整语速/音量/音调
tts --text "Hello" --rate "+50%" -o output.mp3
tts --text "Hello" --volume "+20%" -o output.mp3
tts --text "Hello" --pitch "+5Hz" -o output.mp3
tts --text "Hello" --rate "+30%" --volume "+10%" --pitch "+2Hz" -o output.mp3
```

## 字幕生成

```bash
# 生成 WebVTT 字幕
tts --text "Hello World" -o output.mp3 --write-subtitles output.vtt

# 查看字幕内容
cat output.vtt
# WEBVTT
#
# 1
# 00:00:00.100 --> 00:00:00.475
# Hello
#
# 2
# 00:00:00.488 --> 00:00:00.851
# World
```

## 语音列表

```bash
# 列出所有语音
tts --list-voices

# 按语言筛选
tts --list-voices zh-CN
tts --list-voices en-US
tts --list-voices ja
tts --list-voices fr
```

## 完整选项

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
| `-V, --version` | 显示版本号 | - |

## 常用场景

### 批量合成

```bash
# 遍历文件逐个合成
for file in texts/*.txt; do
  base=$(basename "$file" .txt)
  tts --file "$file" --voice en-US-AriaNeural -o "audio/${base}.mp3"
done

# 从 CSV 读取并合成
while IFS=, read -r text voice; do
  tts --text "$text" --voice "$voice" -o "output/${voice}.mp3"
done < input.csv
```

### 在脚本中调用

```bash
# 合成并获取文件路径
tts --text "Hello World" -o /tmp/speech.mp3
echo "Audio saved to /tmp/speech.mp3"

# 合成带字幕的音频（适合视频制作）
tts --file narration.txt -o narration.mp3 --write-subtitles narration.vtt
```

### 使用代理

```bash
tts --text "Hello" --proxy http://127.0.0.1:7890 -o output.mp3
tts --text "Hello" --proxy socks5://127.0.0.1:1080 -o output.mp3
```

## 项目架构

```
src/
├── index.ts                      # CLI 入口 (commander)
├── commands/
│   ├── synthesize.command.ts     # 语音合成命令
│   └── list-voices.command.ts    # 语音列表命令
├── services/
│   ├── tts.service.ts            # TTS 引擎封装 (edge-tts-universal Communicate.stream)
│   └── voice.service.ts          # 语音列表服务 (listVoices)
├── handlers/
│   └── input.handler.ts          # stdin/文件/文本 输入处理
├── utils/
│   ├── subtitle.ts               # WebVTT 字幕生成
│   ├── format.ts                 # 时间格式化、表格格式化
│   ├── logger.ts                 # pino 日志
│   └── errors.ts                 # 自定义错误类
├── types/
│   └── tts.types.ts              # 类型定义
└── schemas/
    └── synthesize.schema.ts      # Zod 参数校验
```

### 核心类型

```typescript
interface SynthesizeOptions {
  readonly text: string;
  readonly voice: string;
  readonly rate: string;
  readonly volume: string;
  readonly pitch: string;
  readonly proxy?: string;
}

interface WordBoundary {
  readonly offset: number;    // 100 纳秒 ticks
  readonly duration: number;
  readonly text: string;
}

interface SynthesizeResult {
  readonly audio: Buffer;
  readonly wordBoundaries: ReadonlyArray<WordBoundary>;
}

interface VoiceInfo {
  readonly name: string;
  readonly locale: string;
  readonly gender: string;
}
```

### 错误处理

CLI 对以下场景有明确的错误提示：

- 无输入：`Error: No input provided. Use --text, --file, or pipe text via stdin.`
- 缺少输出：`Error: Option --output is required for synthesis`
- 无效参数：`Error: Rate must be in format "+50%" or "-20%"`
- 文件读取失败：`Error: Failed to read file: <path>`
- 合成失败：`Error: TTS synthesis failed`
- 无音频数据：`Error: No audio data received from TTS engine`
- 语音列表为空：`Error: No voices found for locale: <locale>`

## 开发

```bash
pnpm install       # 安装依赖
pnpm build         # 构建（tsup，输出 ESM + CJS）
pnpm dev           # 开发模式（tsup --watch）
pnpm test          # 运行测试（vitest）
pnpm test:watch    # 测试监听模式
pnpm test:coverage # 测试覆盖率报告
pnpm format        # 代码格式化（prettier）
```

## See Also

- [edge-tts](https://github.com/rany2/edge-tts) - Python 版 Edge TTS（功能参考）
- [edge-tts-universal](https://github.com/travisvn/edge-tts-universal) - TypeScript TTS 引擎
- [GitHub: hocgin/tts-cli](https://github.com/hocgin/tts-cli) - 项目仓库
