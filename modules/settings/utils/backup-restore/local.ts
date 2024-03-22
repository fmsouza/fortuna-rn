import dayjs from 'dayjs'
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Updates from 'expo-updates';
import { Platform } from 'react-native';

import { DB_NAME } from '~/db';

const CURRENT_DB_PATH = `${FileSystem.documentDirectory}SQLite/${DB_NAME}`;

export async function backupToLocal() {
  const timestamp = dayjs().format('DD_MM_YYYY_HHmmss');
  const [dbName, extension] = DB_NAME.split('.');
  const fileName = `${dbName}_backup_${timestamp}.${extension}`;
  const backupCopyPath = FileSystem.documentDirectory + fileName;

  await FileSystem.copyAsync({
    from: CURRENT_DB_PATH,
    to: backupCopyPath
  });
  const dbBackupFile = await FileSystem.getInfoAsync(backupCopyPath);

  switch (Platform.OS) {

    case 'android': {
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (!permissions.granted) {
          throw new Error('Permission denied');
      }

      const destinationUri = await FileSystem.StorageAccessFramework.createFileAsync(
        permissions.directoryUri,
        fileName,
        'application/octet-stream'
      );

      const contentAsString = await FileSystem.readAsStringAsync(dbBackupFile.uri, { encoding: FileSystem.EncodingType.Base64 });

      await FileSystem.StorageAccessFramework.writeAsStringAsync(
        destinationUri,
        contentAsString,
        { encoding: FileSystem.EncodingType.Base64 }
      );
      break;
    }

    case 'ios': {
      await Sharing.isAvailableAsync();
      await Sharing.shareAsync(`file://${dbBackupFile.uri}`);
      break;
    }
  }
}

export async function restoreFromLocal() {
  const dbBackupFile = await DocumentPicker.getDocumentAsync({
    type: 'application/octet-stream',
  });
  
  if (dbBackupFile.canceled) {
    return;
  }

  const [{uri}] = dbBackupFile.assets;

  await FileSystem.copyAsync({
    from: uri,
    to: CURRENT_DB_PATH,
  });

  await Updates.reloadAsync();
}