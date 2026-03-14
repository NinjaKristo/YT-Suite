# CLAUDE.md — Clip/Trim Feature for youtube-dl-gui Fork

## Project
Fork of https://github.com/jely2002/youtube-dl-gui
Stack: Tauri (Rust) + Vue 3 + TypeScript + Tailwind
Goal: Add clip/trim support via yt-dlp --download-sections

## Prerequisites before starting
- Read existing AGENTS.md in repo root
- Read CONTRIBUTING.md
- Identify where yt-dlp command is assembled (likely src-tauri/ or src/)
- Identify the download form/options UI component in src/

## Feature: Clip Mode

### Phase 1 — UI (Vue/TypeScript)
- [ ] Add "Clip mode" toggle to download options panel
- [ ] When enabled, show two time inputs: Start Time / End Time
  - Format: HH:MM:SS or MM:SS — validate on input
  - Placeholder hints: e.g. "48:20" or "01:23:45"
- [ ] Add format selector (default: mp4)
- [ ] Add quality cap selector (360/480/720/1080, default: 720)
- [ ] Save clip settings to app state alongside other download options

### Phase 2 — Command Builder (Rust or TS layer)
- [ ] When clip mode is on, inject into yt-dlp command:
      --download-sections "*{start}-{end}"
      --force-keyframes-at-cuts
      -f "bv[height<={quality}][ext=mp4]+ba[ext=m4a]/bv[height<={quality}]+ba/best[height<={quality}]"
      --merge-output-format mp4
- [ ] Preserve existing %(title)s output naming template
- [ ] Ensure clip args don't conflict with playlist mode (disable clip toggle for playlists)

### Phase 3 — UX polish
- [ ] Show clip time range in download queue item display
- [ ] Validate: end time must be > start time
- [ ] Error messaging if ffmpeg not found (required for --force-keyframes-at-cuts)

### Phase 4 — Git hygiene (for future PR)
- [ ] Work on branch: feature/clip-mode
- [ ] Commit messages: conventional commits style (feat:, fix:, chore:)
- [ ] Do not modify README, LICENSE, or CONTRIBUTING.md yet

## Key files to locate first
- yt-dlp command assembly: search for `--download-sections` or `download` in src-tauri/src/
- Download options UI: search for quality/format selectors in src/components/
- App state store: likely src/store/ or composables

## Out of scope for this phase
- Subtitle clipping
- Chapter-based clipping
- Anything requiring new Rust dependencies

## Notes
- yt-dlp must be >= 2023.03 for --download-sections support
- ffmpeg required on PATH for keyframe-accurate cuts
- No GitHub account yet — keep all changes local, branch ready for future fork+PR
