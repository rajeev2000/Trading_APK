import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { themes } from '../theme/tokens';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
export default function SignInScreen() {
  const [busy, setBusy] = useState(false);
  const c = themes.light;
  async function signIn() {
    if (!isSupabaseConfigured || !supabase) { Alert.alert('Setup required', 'Configure Supabase in your local .env file first.'); return; }
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: 'tradingapk://auth/callback' } });
      if (error) Alert.alert('Sign-in unavailable', error.message);
      else Alert.alert('Continue in browser', 'Finish Google sign-in in the browser, then return to the app. Verify deep-link handling before production.');
    } catch { Alert.alert('Sign-in failed', 'Please try again.'); }
    finally { setBusy(false); }
  }
  return <View style={[styles.page, { backgroundColor: c.background }]}><Text style={[styles.kicker,{color:c.textMuted}]}>TRADING_APK</Text><Text style={[styles.title,{color:c.text}]}>Practice your strategy.</Text><Text style={[styles.body,{color:c.textMuted}]}>A calm workspace for paper trading, strategy notes and evidence-backed alerts.</Text><Pressable accessibilityRole="button" onPress={signIn} disabled={busy} style={[styles.button,{backgroundColor:c.accent}]}><Text style={{color:c.accentText,fontWeight:'600'}}>{busy?'Connecting…':'Continue with Google'}</Text></Pressable><Pressable onPress={()=>router.replace('/(tabs)')} style={styles.demo}><Text style={{color:c.text}}>Explore demo screens</Text></Pressable><Text style={[styles.note,{color:c.textMuted}]}>Paper trading only. No real-money orders.</Text></View>;
}
const styles=StyleSheet.create({page:{flex:1,justifyContent:'center',padding:28},kicker:{fontSize:12,letterSpacing:2,marginBottom:24},title:{fontSize:32,fontWeight:'600',lineHeight:38},body:{fontSize:16,lineHeight:24,marginTop:12,marginBottom:28},button:{minHeight:50,borderRadius:14,alignItems:'center',justifyContent:'center'},demo:{padding:18,alignItems:'center'},note:{fontSize:12,marginTop:32}});
