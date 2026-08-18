import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { CareerProvider } from '../src/career/CareerProvider';
import { I18nProvider } from '../src/i18n/I18nProvider';
import { GameSettingsProvider } from '../src/settings/GameSettingsProvider';

export default function RootLayout() {
  return (
    <I18nProvider>
      <GameSettingsProvider>
        <CareerProvider>
          <StatusBar style="light" />
          <Stack screenOptions={{ headerShown: false }} />
        </CareerProvider>
      </GameSettingsProvider>
    </I18nProvider>
  );
}
