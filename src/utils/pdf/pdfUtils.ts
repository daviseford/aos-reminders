import matchAll from 'string.prototype.matchall'

export const parsePdf = (pdfText: string): string[] => {
  const regex = /^\((.+)\) Tj$/gm
  const matches = matchAll(pdfText, regex)

  const result: string[] = [...matches].map(x => x[1].trim())

  return result
}
