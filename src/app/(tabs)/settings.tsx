import { Image } from 'expo-image';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppHeader } from '@/components/common/AppHeader';
import { AppScreen } from '@/components/common/AppScreen';
import { useAuth } from '@/features/auth/auth-context';
import { signOut } from '@/features/auth/auth.service';
import { updateMyNickname } from '@/features/auth/profile.service';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/radius';

const MIN_NICKNAME_LENGTH = 3;
const nicknamePattern = /^[a-zA-Z0-9_.-]+$/;

export default function SettingsScreen() {
  const { session, profile, refreshProfile } = useAuth();

  const [nickname, setNickname] = useState(profile?.nickname ?? '');
  const [savingNickname, setSavingNickname] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [successText, setSuccessText] = useState('');

  const avatarLabel = useMemo(() => {
    const value = profile?.nickname || profile?.full_name || session?.user.email || 'U';
    return value.charAt(0).toUpperCase();
  }, [profile?.full_name, profile?.nickname, session?.user.email]);

  const canSaveNickname = useMemo(() => {
    const clean = nickname.trim();
    return clean.length >= MIN_NICKNAME_LENGTH && nicknamePattern.test(clean);
  }, [nickname]);

  const handleSaveNickname = async () => {
    if (!session?.user || !canSaveNickname) return;

    try {
      setSavingNickname(true);
      setErrorText('');
      setSuccessText('');

      await updateMyNickname(session.user.id, nickname);
      const nextProfile = await refreshProfile();
      setNickname(nextProfile?.nickname ?? nickname.trim());
      setSuccessText('Tu nickname fue actualizado.');
    } catch (error) {
      setErrorText(
        error instanceof Error ? error.message : 'No se pudo actualizar el nickname.'
      );
    } finally {
      setSavingNickname(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setSigningOut(true);
      setErrorText('');
      setSuccessText('');
      await signOut();
    } catch (error) {
      setErrorText(
        error instanceof Error ? error.message : 'No se pudo cerrar sesión.'
      );
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <AppScreen>
      <AppHeader
        title="Perfil"
        subtitle="Gestiona tu nombre visible y tu sesión."
      />

      <View style={styles.profileCard}>
        {profile?.avatar_url ? (
          <Image source={{ uri: profile.avatar_url }} style={styles.avatarImage} contentFit="cover" />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarFallbackText}>{avatarLabel}</Text>
          </View>
        )}

        <Text style={styles.name}>{profile?.full_name || 'Usuario de Google'}</Text>
        <Text style={styles.email}>{profile?.email || session?.user.email || 'Sin correo disponible'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Nickname</Text>
        <TextInput
          value={nickname}
          onChangeText={(value) => {
            setNickname(value);
            if (errorText) setErrorText('');
            if (successText) setSuccessText('');
          }}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!savingNickname && !signingOut}
          placeholder="ej. mia.estudia"
          placeholderTextColor={colors.textSoft}
          style={styles.input}
        />
        <Text style={styles.helperText}>
          Usa letras, números, punto, guion o guion bajo.
        </Text>
      </View>

      {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
      {successText ? <Text style={styles.successText}>{successText}</Text> : null}

      <Pressable
        style={[styles.primaryButton, (!canSaveNickname || savingNickname || signingOut) && styles.disabled]}
        disabled={!canSaveNickname || savingNickname || signingOut}
        onPress={handleSaveNickname}
      >
        {savingNickname ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={styles.primaryButtonText}>Guardar nickname</Text>
        )}
      </Pressable>

      <Pressable
        style={[styles.secondaryButton, (savingNickname || signingOut) && styles.disabled]}
        disabled={savingNickname || signingOut}
        onPress={handleSignOut}
      >
        {signingOut ? (
          <ActivityIndicator color={colors.coral} />
        ) : (
          <Text style={styles.secondaryButtonText}>Cerrar sesión</Text>
        )}
      </Pressable>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
    alignItems: 'center',
  },
  avatarImage: {
    width: 76,
    height: 76,
    borderRadius: 38,
    marginBottom: 12,
  },
  avatarFallback: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.coralSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarFallbackText: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
  },
  name: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  email: {
    color: colors.textSoft,
    fontSize: 13,
    marginTop: 6,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  label: {
    color: colors.textSoft,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: colors.text,
    fontSize: 15,
  },
  helperText: {
    color: colors.textSoft,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 8,
  },
  errorText: {
    color: colors.danger,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },
  successText: {
    color: '#1f7a1f',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },
  primaryButton: {
    backgroundColor: colors.coral,
    borderRadius: radius.pill,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '800',
  },
  secondaryButton: {
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    color: colors.coral,
    fontSize: 15,
    fontWeight: '800',
  },
  disabled: {
    opacity: 0.6,
  },
});
