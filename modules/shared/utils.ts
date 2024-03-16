import * as FileSystem from 'expo-file-system';
import * as Crypto from 'expo-crypto';
import _merge from 'lodash/merge';
import _cloneDeep from 'lodash/cloneDeep';

export function readFile(uri: string): Promise<string> {
  return FileSystem.readAsStringAsync(uri);
}

export async function asyncFilter<T>(list: T[], predicate: (value: T, index: number, array: T[]) => Promise<boolean>): Promise<T[]> {
	const results = await Promise.all(list.map(predicate));
	return list.filter((_v, index) => results[index]);
}

export async function sha256(message: string): Promise<string> {
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    message
  );
}

export function deepMerge(sourceObject: any, targetObject: any): any {
  const sourceClose = _cloneDeep(sourceObject);
  const targetClose = _cloneDeep(targetObject);
  return _merge(sourceClose, targetClose);
}