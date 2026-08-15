import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChipGroup } from '../src/components/ChipGroup';
import { colors } from '../src/constants/colors';
import { useI18n } from '../src/i18n/I18nProvider';
import type { Locale } from '../src/i18n';
import { useGameSettings } from '../src/settings/GameSettingsProvider';
import type { Side } from '../src/types/janggi';

export default function SettingsScreen() {
  const router = useRouter();
  const { locale, setLocale, t, sideLabel } = useI18n();
  const {
    userSideVsAi,
    player1SideLocal,
    setUserSideVsAi,
    setPlayer1SideLocal,
  } = useGameSettings();

  const languageOptions = [
    { value: 'en' as Locale, label: t('language.en') },
    { value: 'ko' as Locale, label: t('language.ko') },
  ];

  const sideOptions = useMemo(
    () => [
      { value: 'cho' as Side, label: sideLabel('cho', true) },
      { value: 'han' as Side, label: sideLabel('han', true) },
    ],
    [sideLabel],
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>{t('common.back')}</Text>
        </Pressable>
        <Text style={styles.title}>{t('settings.title')}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.language')}</Text>
          <Text style={styles.sectionDescription}>{t('settings.languageDescription')}</Text>
          <ChipGroup options={languageOptions} value={locale} onChange={setLocale} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.aiSide')}</Text>
          <Text style={styles.sectionDescription}>{t('settings.aiSideDescription')}</Text>
          <ChipGroup
            options={sideOptions}
            value={userSideVsAi}
            onChange={setUserSideVsAi}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.player1Side')}</Text>
          <Text style={styles.sectionDescription}>{t('settings.player1SideDescription')}</Text>
          <ChipGroup
            options={sideOptions}
            value={player1SideLocal}
            onChange={setPlayer1SideLocal}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    minWidth: 64,
    paddingVertical: 6,
  },
  backButtonText: {
    color: colors.textMuted,
    fontSize: 15,
    fontWeight: '600',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
  },
  headerSpacer: {
    minWidth: 64,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
    gap: 28,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
  },
  sectionDescription: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
});
