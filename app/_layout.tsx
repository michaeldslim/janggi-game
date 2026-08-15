import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { I18nProvider } from '../src/i18n/I18nProvider';
import { GameSettingsProvider } from '../src/settings/GameSettingsProvider';

export default function RootLayout() {
  return (
    <I18nProvider>
      <GameSettingsProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }} />
      </GameSettingsProvider>
    </I18nProvider>
  );
}
