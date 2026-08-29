import { Chapter } from "../content/chapters";

type SpeakerNotesProps = {
  chapter: Chapter;
  open: boolean;
  onClose: () => void;
};

export const SpeakerNotes = ({ chapter, open, onClose }: SpeakerNotesProps) => (
  <aside className="speaker-notes" data-open={open} aria-label="Notas do apresentador">
    {open ? (
      <>
        <div className="speaker-notes__header">
          <div>
            <p className="chapter__kicker">Notas</p>
            <h3>{chapter.title}</h3>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Fechar notas">
            ×
          </button>
        </div>
        <ul>
          {chapter.speakerNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </>
    ) : null}
  </aside>
);
