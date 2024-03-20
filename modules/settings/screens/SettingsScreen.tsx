import { List } from 'react-native-paper';

import { Container } from '~/modules/shared/components';
import { useHeaderOptions } from '~/modules/shared/navigation';
import { makeStyles } from '~/theme';

import pkg from '../../../package.json';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    flex: 1,
    paddingHorizontal: theme.dimensions.spacing(),
  },
}));

export function SettingsScreen() {
  const styles = useStyles();

  useHeaderOptions({
    title: 'Settings',
  });

  return (
    <Container style={styles.container}>
    <List.Section>
      <List.Subheader>General</List.Subheader>
      <List.Item title="Language settings" left={() => <List.Icon icon="comment-text-multiple-outline"  />} />
      <List.Item title="Enable dark mode" left={() => <List.Icon icon="brightness-4" />} />
    </List.Section>
    <List.Section>
      <List.Subheader>Data & Storage</List.Subheader>
      <List.Item title="Backup/Restore your data" left={() => <List.Icon icon="database-sync-outline" />} />
      <List.Item title="Reset app data" left={() => <List.Icon icon="delete-forever-outline" />} />
    </List.Section>
    <List.Section>
      <List.Subheader>About</List.Subheader>
      <List.Item title="Terms of use" left={() => <List.Icon icon="file-document-multiple-outline" />} />
      <List.Item title="Privacy Policy" left={() => <List.Icon icon="security" />} />
      <List.Item
        titleStyle={{ fontSize: 12 }}
        title={`Fortuna © ${new Date().getFullYear()}`}
      />
      <List.Item
        titleStyle={{ fontSize: 12 }}
        title={`Version: ${pkg.version}`}
      />
    </List.Section>
    </Container>
  );
}
