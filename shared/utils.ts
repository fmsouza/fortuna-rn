export function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error);
    reader.readAsText(file);
  })
}

export async function asyncFilter<T>(list: T[], predicate: (value: T, index: number, array: T[]) => Promise<boolean>): Promise<T[]> {
	const results = await Promise.all(list.map(predicate));
	return list.filter((_v, index) => results[index]);
}

export async function sha256(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}
