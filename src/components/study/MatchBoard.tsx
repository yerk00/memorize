import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MatchGame } from '@/features/study/types';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/radius';

type Props = {
  game: MatchGame;
  selectedLeftId: string | null;
  selectedRightId: string | null;
  matchedPairIds: string[];
  onSelectLeft: (id: string) => void;
  onSelectRight: (id: string) => void;
};

export function MatchBoard({
  game,
  selectedLeftId,
  selectedRightId,
  matchedPairIds,
  onSelectLeft,
  onSelectRight,
}: Props) {
  const helperText =
    game.type === 'name_to_phrase'
      ? 'Relaciona cada libro con cómo se presenta'
      : game.type === 'name_to_chapters'
      ? 'Relaciona cada libro con su cantidad de capítulos'
      : 'Relaciona cada libro con su clasificación';

  const rightTitle =
    game.type === 'name_to_phrase'
      ? 'Cómo se presenta'
      : game.type === 'name_to_chapters'
      ? 'Capítulos'
      : 'Clasificación';

  return (
    <View>
      <Text style={styles.helper}>{helperText}</Text>

      <View style={styles.columns}>
        <View style={styles.column}>
          <Text style={styles.columnTitle}>Libros</Text>
          {game.leftItems.map((item) => {
            const matched = matchedPairIds.includes(item.pairId);
            const selected = selectedLeftId === item.id;

            return (
              <Pressable
                key={item.id}
                disabled={matched}
                onPress={() => onSelectLeft(item.id)}
                style={[
                  styles.card,
                  matched && styles.cardMatched,
                  selected && styles.cardSelected,
                ]}
              >
                <Text style={[styles.cardText, matched && styles.cardTextMatched]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.column}>
          <Text style={styles.columnTitle}>{rightTitle}</Text>
          {game.rightItems.map((item) => {
            const matched = matchedPairIds.includes(item.pairId);
            const selected = selectedRightId === item.id;

            return (
              <Pressable
                key={item.id}
                disabled={matched}
                onPress={() => onSelectRight(item.id)}
                style={[
                  styles.card,
                  matched && styles.cardMatched,
                  selected && styles.cardSelected,
                ]}
              >
                <Text style={[styles.cardText, matched && styles.cardTextMatched]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  helper: {
    color: colors.textSoft,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 14,
  },
  columns: {
    flexDirection: 'row',
    gap: 12,
  },
  column: {
    flex: 1,
    gap: 10,
  },
  columnTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 70,
    justifyContent: 'center',
  },
  cardSelected: {
    borderColor: colors.coral,
    backgroundColor: colors.coralSoft,
  },
  cardMatched: {
    backgroundColor: colors.mintSoft,
    borderColor: 'transparent',
    opacity: 0.8,
  },
  cardText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
  },
  cardTextMatched: {
    color: colors.textSoft,
  },
});