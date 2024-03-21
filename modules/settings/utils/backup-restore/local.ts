import dayjs from 'dayjs'
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Updates from 'expo-updates';

import { DB_NAME } from '~/db';

const CURRENT_DB_PATH = `${FileSystem.documentDirectory}SQLite/${DB_NAME}`;

export async function backupToLocal() {
  const timestamp = dayjs().format('DD_MM_YYYY_HHmmss');
  const [dbName, extension] = DB_NAME.split('.');
  const fileName = `${dbName}_backup_${timestamp}.${extension}`;
  const destinationPath = FileSystem.documentDirectory + fileName;

  try {
    await FileSystem.copyAsync({
      from: CURRENT_DB_PATH,
      to: destinationPath
    });
    const dbFile = await FileSystem.getInfoAsync(destinationPath);

    await Sharing.isAvailableAsync();
    await Sharing.shareAsync(`file://${dbFile.uri}`);
  } catch (e) {
    console.log(e);
  }
}

export async function restoreFromLocal() {
  const dbFile = await DocumentPicker.getDocumentAsync({
    type: 'application/octet-stream',
  });
  
  if (dbFile.canceled) {
    return;
  }

  const [{uri}] = dbFile.assets;

  await FileSystem.copyAsync({
    from: uri,
    to: CURRENT_DB_PATH,
  });

  await Updates.reloadAsync();
}