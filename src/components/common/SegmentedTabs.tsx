import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/radius';

type Option<T extends string> = {
  label: string;
  value: T;
};

type Props<T extends string> = {
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
};

export function SegmentedTabs<T extends string>({
  value,
  options,
  onChange,
}: Props<T>) {
  return (
    <View style={styles.container}>
      {options.map((option) => {
        const active = option.value === value;

        return (
          <Pressable
            key={option.value}
            style={[styles.option, active && styles.optionActive]}
            onPress={() => onChange(option.value)}
          >
            <Text style={[styles.label, active && styles.labelActive]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    padding: 6,
    flexDirection: 'row',
    marginBottom: 18,
  },
  option: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: radius.pill,
  },
  optionActive: {
    backgroundColor: colors.white,
  },
  label: {
    color: colors.textSoft,
    fontSize: 13,
    fontWeight: '600',
  },
  labelActive: {
    color: colors.text,
  },
});