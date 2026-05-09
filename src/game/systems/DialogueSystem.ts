import type { DialogueLine } from "../data/dialogues";

export class DialogueSystem {
  private readonly dialogueEl = document.querySelector<HTMLDivElement>("#dialogue");
  private readonly speakerEl = document.querySelector<HTMLDivElement>("#speaker");
  private readonly lineEl = document.querySelector<HTMLDivElement>("#line");
  private lines: DialogueLine[] = [];
  private index = 0;
  private onComplete?: () => void;

  show(lines: DialogueLine[], onComplete?: () => void): void {
    this.lines = lines;
    this.index = 0;
    this.onComplete = onComplete;
    this.dialogueEl?.classList.remove("hidden");
    this.render();
  }

  advance(): void {
    if (!this.isOpen()) return;

    this.index += 1;
    if (this.index >= this.lines.length) {
      this.dialogueEl?.classList.add("hidden");
      const complete = this.onComplete;
      this.onComplete = undefined;
      complete?.();
      return;
    }

    this.render();
  }

  isOpen(): boolean {
    return this.dialogueEl ? !this.dialogueEl.classList.contains("hidden") : false;
  }

  private render(): void {
    const line = this.lines[this.index];
    if (!line || !this.speakerEl || !this.lineEl) return;

    this.speakerEl.textContent = line.speaker;
    this.speakerEl.style.color = line.speaker === "Kyle" ? "#9ee6ff" : "#ffe37d";
    this.lineEl.textContent = line.text;
  }
}
