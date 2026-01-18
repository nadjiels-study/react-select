
export default function search(text: string, search: string): boolean {
  return text.trim().toLowerCase().includes(search.toLowerCase());
}
