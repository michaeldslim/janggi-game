import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AvatarPicker } from '../src/components/AvatarPicker';
import { CareerDifficultyBanner } from '../src/components/CareerDifficultyBanner';
import { ChipGroup } from '../src/components/ChipGroup';
import { SettingsToggleRow } from '../src/components/SettingsToggleRow';
import { careerRankKey, difficultyLabel } from '../src/career/careerLabels';
import { getDifficultySuggestion } from '../src/career/careerDifficultySuggestion';
import { useCareer } from '../src/career/CareerProvider';
import { colors } from '../src/constants/colors';
import { useI18n } from '../src/i18n/I18nProvider';
import type { Locale } from '../src/i18n';
import { useGameSettings } from '../src/settings/GameSettingsProvider';
import type { AiDifficulty, AiSpeed, GameMode, Side } from '../src/types/janggi';

export default function SettingsScreen() {
  const router = useRouter();
  const { locale, setLocale, t, sideLabel } = useI18n();
  const {
    gameMode,
    userSideVsAi,
    player1SideLocal,
    aiDifficulty,
    aiSpeed,
    playerAvatarId,
    aiAvatarId,
    careerModeEnabled,
    setGameMode,
    setUserSideVsAi,
    setPlayer1SideLocal,
    setAiDifficulty,
    setAiSpeed,
    setPlayerAvatarId,
    setAiAvatarId,
    setCareerModeEnabled,
  } = useGameSettings();
  const { careerState, loaded: careerLoaded } = useCareer();

  const languageOptions = [
    { value: 'en' as Locale, label: t('language.en') },
    { value: 'ko' as Locale, label: t('language.ko') },
  ];

  const gameModeOptions = useMemo(
    () => [
      { value: 'vsAi' as GameMode, label: t('game.vsAi') },
      { value: 'local' as GameMode, label: t('game.twoPlayers') },
    ],
    [t],
  );

  const sideOptions = useMemo(
    () => [
      { value: 'cho' as Side, label: sideLabel('cho', true) },
      { value: 'han' as Side, label: sideLabel('han', true) },
    ],
    [sideLabel],
  );

  const difficultyOptions = useMemo(
    () => [
      { value: 'easy' as AiDifficulty, label: t('settings.difficultyEasy') },
      { value: 'medium' as AiDifficulty, label: t('settings.difficultyMedium') },
      { value: 'hard' as AiDifficulty, label: t('settings.difficultyHard') },
    ],
    [t],
  );

  const speedOptions = useMemo(
    () => [
      { value: 'slow' as AiSpeed, label: t('settings.speedSlow') },
      { value: 'medium' as AiSpeed, label: t('settings.speedMedium') },
      { value: 'fast' as AiSpeed, label: t('settings.speedFast') },
    ],
    [t],
  );

  const difficultySuggestion =
    careerModeEnabled && careerLoaded
      ? getDifficultySuggestion(careerState.rank, aiDifficulty)
      : null;

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
          <Text style={styles.sectionTitle}>{t('settings.avatars')}</Text>
          <AvatarPicker
            label={t('settings.playerAvatar')}
            description={t('settings.playerAvatarDescription')}
            value={playerAvatarId}
            onChange={setPlayerAvatarId}
          />
          <AvatarPicker
            label={t('settings.aiAvatar')}
            description={t('settings.aiAvatarDescription')}
            value={aiAvatarId}
            onChange={setAiAvatarId}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.gameMode')}</Text>
          <Text style={styles.sectionDescription}>{t('settings.gameModeDescription')}</Text>
          <ChipGroup options={gameModeOptions} value={gameMode} onChange={setGameMode} />
        </View>

        {gameMode === 'vsAi' ? (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('settings.aiSpeed')}</Text>
              <Text style={styles.sectionDescription}>{t('settings.aiSpeedDescription')}</Text>
              <ChipGroup options={speedOptions} value={aiSpeed} onChange={setAiSpeed} />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('settings.aiDifficulty')}</Text>
              <Text style={styles.sectionDescription}>{t('settings.aiDifficultyDescription')}</Text>
              <ChipGroup
                options={difficultyOptions}
                value={aiDifficulty}
                onChange={setAiDifficulty}
              />
            </View>

            {difficultySuggestion ? (
              <CareerDifficultyBanner
                message={t('career.difficultySuggest.body', {
                  rank: t(careerRankKey(careerState.rank)),
                  difficulty: difficultyLabel(t, difficultySuggestion.recommended),
                })}
                actionLabel={t('career.difficultySuggest.action', {
                  difficulty: difficultyLabel(t, difficultySuggestion.recommended),
                })}
                recommendedDifficulty={difficultySuggestion.recommended}
                onApply={setAiDifficulty}
              />
            ) : null}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('settings.aiSide')}</Text>
              <Text style={styles.sectionDescription}>{t('settings.aiSideDescription')}</Text>
              <ChipGroup
                options={sideOptions}
                value={userSideVsAi}
                onChange={setUserSideVsAi}
              />
            </View>
          </>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('settings.player1Side')}</Text>
            <Text style={styles.sectionDescription}>{t('settings.player1SideDescription')}</Text>
            <ChipGroup
              options={sideOptions}
              value={player1SideLocal}
              onChange={setPlayer1SideLocal}
            />
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.career')}</Text>
          <SettingsToggleRow
            label={t('career.modeLabel')}
            description={t('career.modeDesc')}
            value={careerModeEnabled}
            onValueChange={setCareerModeEnabled}
          />
          {careerModeEnabled ? (
            <Text style={styles.careerRules}>{t('career.rulesSnippet')}</Text>
          ) : null}
          {careerModeEnabled ? (
            <Pressable accessibilityRole="link" onPress={() => router.push('/career')}>
              <Text style={styles.careerLink}>{t('career.screen.title')}</Text>
            </Pressable>
          ) : null}
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
  careerRules: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 4,
  },
  careerLink: {
    color: colors.gold,
    fontSize: 15,
    fontWeight: '600',
    marginTop: 8,
  },
});
