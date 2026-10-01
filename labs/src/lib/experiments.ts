import { existsSync } from 'node:fs';
import { getCollection, type CollectionEntry } from 'astro:content';

export type Experiment = CollectionEntry<'experiments'> & {
  /** Chronological number, oldest = 1 */
  number: number;
  /** Zero-padded label, e.g. "001" */
  label: string;
  /** Where the experiment itself lives */
  src: string;
  external: boolean;
};

const statusLabels = {
  sketch: 'Sketch',
  prototype: 'Prototype',
  graduated: 'Graduated',
} as const;

export const statusLabel = (s: keyof typeof statusLabels) => statusLabels[s];

/** All published experiments, newest first, numbered oldest-first. */
export async function getExperiments(): Promise<Experiment[]> {
  const entries = (await getCollection('experiments'))
    .filter((e) => !e.data.draft)
    .sort((a, b) => a.data.date.valueOf() - b.data.date.valueOf());

  return entries
    .map((entry, i) => {
      const external = Boolean(entry.data.url);
      const src = entry.data.url ?? `/x/${entry.id}/`;
      // Fail the build early if a local experiment's file is missing.
      if (!external && !existsSync(`public/x/${entry.id}/index.html`)) {
        throw new Error(
          `Experiment "${entry.id}" has no public/x/${entry.id}/index.html (or set \`url\` in its frontmatter).`,
        );
      }
      return {
        ...entry,
        number: i + 1,
        label: String(i + 1).padStart(3, '0'),
        src,
        external,
      };
    })
    .reverse();
}

export const formatDate = (d: Date) =>
  d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
