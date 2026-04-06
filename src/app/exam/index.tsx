import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AppScreen } from '@/components/common/AppScreen';
import { ScreenNavHeader } from '@/components/common/ScreenNavHeader';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/radius';
import { createExamSession } from '@/features/exam/runtime';
import { ExamConfig } from '@/features/exam/types';

const OPTIONS: ExamConfig['totalQuestions'][] = [10, 20, 30];

export default function ExamEntryScreen() {
  const [totalQuestions, setTotalQuestions] = useState<ExamConfig['totalQuestions']>(10);

  const handleStart = () => {
    createExamSession({ totalQuestions });
    router.push('/exam/run');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <AppScreen>
        <ScreenNavHeader
          title="Examen general"
          subtitle="Evaluación integral usando todo el contenido cargado."
        />

        <View style={styles.block}>
          <Text style={styles.blockTitle}>Se evaluará</Text>

          <View style={styles.chips}>
            <View style={styles.chip}>
              <Text style={styles.chipText}>Clasificación</Text>
            </View>
            <View style={styles.chip}>
              <Text style={styles.chipText}>Nombre</Text>
            </View>
            <View style={styles.chip}>
              <Text style={styles.chipText}>Capítulos</Text>
            </View>
            <View style={styles.chip}>
              <Text style={styles.chipText}>Cómo se presenta</Text>
            </View>
          </View>
        </View>

        <View style={styles.block}>
          <Text style={styles.blockTitle}>Cantidad de preguntas</Text>

          <View style={styles.optionRow}>
            {OPTIONS.map((value) => {
              const selected = value === totalQuestions;

              return (
                <Pressable
                  key={value}
                  onPress={() => setTotalQuestions(value)}
                  style={[styles.option, selected && styles.optionSelected]}
                >
                  <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                    {value}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Pressable style={styles.primaryButton} onPress={handleStart}>
          <Text style={styles.primaryButtonText}>Comenzar examen</Text>
        </Pressable>
      </AppScreen>
    </>
  );
}

const styles = StyleSheet.create({
  block: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  blockTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    backgroundColor: colors.coralSoft,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: radius.pill,
  },
  chipText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  optionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  option: {
    flex: 1,
    backgroundColor: colors.backgroundSoft,
    borderRadius: radius.lg,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionSelected: {
    backgroundColor: colors.coral,
    borderColor: colors.coral,
  },
  optionText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  optionTextSelected: {
    color: colors.white,
  },
  primaryButton: {
    backgroundColor: colors.coral,
    borderRadius: radius.pill,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 6,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '800',
  },
});
