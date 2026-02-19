import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { useApp } from '@/lib/app-context';
import Colors from '@/constants/colors';
import { PROPERTY_TYPES, FURNISHING_OPTIONS, GENDER_PREFERENCES, DIVISIONS } from '@/constants/locations';
import * as Haptics from 'expo-haptics';

export default function AddPropertyScreen() {
  const insets = useSafeAreaInsets();
  const { user, addProperty } = useApp();
  const [step, setStep] = useState(1);

  const [title, setTitle] = useState('');
  const [type, setType] = useState('apartment');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');

  const [bedrooms, setBedrooms] = useState('2');
  const [bathrooms, setBathrooms] = useState('2');
  const [floorLevel, setFloorLevel] = useState('3');
  const [totalFloors, setTotalFloors] = useState('6');
  const [area, setArea] = useState('1000');
  const [furnishing, setFurnishing] = useState('semi-furnished');
  const [genderPref, setGenderPref] = useState('family');
  const [parking, setParking] = useState(false);
  const [gas, setGas] = useState(true);
  const [water, setWater] = useState(true);
  const [elevator, setElevator] = useState(false);
  const [generator, setGenerator] = useState(false);
  const [security, setSecurity] = useState(false);

  const [rent, setRent] = useState('');
  const [deposit, setDeposit] = useState('');
  const [serviceCharge, setServiceCharge] = useState('');
  const [negotiable, setNegotiable] = useState(true);

  const handleNext = () => {
    if (step === 1) {
      if (!title.trim() || !address.trim()) {
        Alert.alert('ত্রুটি', 'অনুগ্রহ করে টাইটেল ও ঠিকানা দিন');
        return;
      }
    }
    if (step < 4) {
      if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setStep(step + 1);
    }
  };

  const handleSubmit = () => {
    if (!rent.trim()) {
      Alert.alert('ত্রুটি', 'অনুগ্রহ করে ভাড়ার মূল্য দিন');
      return;
    }
    if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const divData = DIVISIONS.find(d => d.id === selectedDivision);

    addProperty({
      ownerId: user?.id || '',
      ownerName: user?.name || '',
      ownerPhone: user?.phone || '',
      title,
      type,
      description,
      images: [],
      division: divData?.nameBn || 'ঢাকা',
      district: divData?.districts[0]?.nameBn || 'ঢাকা',
      upazila: '',
      address,
      rent: parseInt(rent) || 0,
      deposit: parseInt(deposit) || 0,
      serviceCharge: parseInt(serviceCharge) || 0,
      bedrooms: parseInt(bedrooms) || 0,
      bathrooms: parseInt(bathrooms) || 0,
      floorLevel: parseInt(floorLevel) || 0,
      totalFloors: parseInt(totalFloors) || 0,
      area: parseInt(area) || 0,
      furnishing,
      genderPreference: genderPref,
      parking,
      gasConnection: gas,
      waterSupply: water,
      elevator,
      generator,
      security,
      negotiable,
      available: true,
    });

    Alert.alert('সফল', 'প্রপার্টি সফলভাবে যোগ করা হয়েছে!');
    setStep(1);
    setTitle('');
    setAddress('');
    setDescription('');
    setRent('');
    setDeposit('');
    setServiceCharge('');
  };

  const steps = [
    { num: 1, label: 'বেসিক' },
    { num: 2, label: 'বিস্তারিত' },
    { num: 3, label: 'ছবি' },
    { num: 4, label: 'মূল্য' },
  ];

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 12) }]}>
        <Text style={styles.headerTitle}>প্রপার্টি যোগ করুন</Text>
        <View style={styles.stepIndicator}>
          {steps.map((s, i) => (
            <React.Fragment key={s.num}>
              <View style={[styles.stepDot, step >= s.num && styles.stepDotActive]}>
                <Text style={[styles.stepNum, step >= s.num && styles.stepNumActive]}>{s.num}</Text>
              </View>
              {i < steps.length - 1 && <View style={[styles.stepLine, step > s.num && styles.stepLineActive]} />}
            </React.Fragment>
          ))}
        </View>
        <View style={styles.stepLabels}>
          {steps.map(s => (
            <Text key={s.num} style={[styles.stepLabel, step >= s.num && styles.stepLabelActive]}>{s.label}</Text>
          ))}
        </View>
      </View>

      <KeyboardAwareScrollViewCompat
        style={{ flex: 1 }}
        contentContainerStyle={styles.formContent}
        bottomOffset={20}
      >
        {step === 1 && (
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>প্রপার্টি টাইটেল *</Text>
              <TextInput style={styles.textInput} placeholder="যেমন: ৩ বেডরুম ফ্ল্যাট - উত্তরা" placeholderTextColor={Colors.textMuted} value={title} onChangeText={setTitle} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>প্রপার্টি ধরন</Text>
              <View style={styles.chipRow}>
                {PROPERTY_TYPES.map(t => (
                  <Pressable key={t.id} style={[styles.chip, type === t.id && styles.chipActive]} onPress={() => setType(t.id)}>
                    <Ionicons name={t.icon as any} size={16} color={type === t.id ? Colors.primary : Colors.textMuted} />
                    <Text style={[styles.chipText, type === t.id && styles.chipTextActive]}>{t.nameBn}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>বিভাগ</Text>
              <View style={styles.chipRow}>
                {DIVISIONS.map(d => (
                  <Pressable key={d.id} style={[styles.chip, selectedDivision === d.id && styles.chipActive]} onPress={() => setSelectedDivision(d.id)}>
                    <Text style={[styles.chipText, selectedDivision === d.id && styles.chipTextActive]}>{d.nameBn}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>বিস্তারিত ঠিকানা *</Text>
              <TextInput style={[styles.textInput, { height: 80, textAlignVertical: 'top' }]} placeholder="রোড, ব্লক, সেক্টর, এলাকা" placeholderTextColor={Colors.textMuted} value={address} onChangeText={setAddress} multiline />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>বিবরণ</Text>
              <TextInput style={[styles.textInput, { height: 100, textAlignVertical: 'top' }]} placeholder="প্রপার্টি সম্পর্কে বিস্তারিত লিখুন..." placeholderTextColor={Colors.textMuted} value={description} onChangeText={setDescription} multiline />
            </View>
          </View>
        )}

        {step === 2 && (
          <View style={styles.form}>
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>বেডরুম</Text>
                <TextInput style={styles.textInput} keyboardType="number-pad" value={bedrooms} onChangeText={setBedrooms} />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>বাথরুম</Text>
                <TextInput style={styles.textInput} keyboardType="number-pad" value={bathrooms} onChangeText={setBathrooms} />
              </View>
            </View>
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>ফ্লোর লেভেল</Text>
                <TextInput style={styles.textInput} keyboardType="number-pad" value={floorLevel} onChangeText={setFloorLevel} />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>মোট ফ্লোর</Text>
                <TextInput style={styles.textInput} keyboardType="number-pad" value={totalFloors} onChangeText={setTotalFloors} />
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>আয়তন (sqft)</Text>
              <TextInput style={styles.textInput} keyboardType="number-pad" value={area} onChangeText={setArea} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>ফার্নিশিং</Text>
              <View style={styles.chipRow}>
                {FURNISHING_OPTIONS.map(f => (
                  <Pressable key={f.id} style={[styles.chip, furnishing === f.id && styles.chipActive]} onPress={() => setFurnishing(f.id)}>
                    <Text style={[styles.chipText, furnishing === f.id && styles.chipTextActive]}>{f.nameBn}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>ভাড়াটিয়া প্রেফারেন্স</Text>
              <View style={styles.chipRow}>
                {GENDER_PREFERENCES.map(g => (
                  <Pressable key={g.id} style={[styles.chip, genderPref === g.id && styles.chipActive]} onPress={() => setGenderPref(g.id)}>
                    <Text style={[styles.chipText, genderPref === g.id && styles.chipTextActive]}>{g.nameBn}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>সুবিধাসমূহ</Text>
              <View style={styles.chipRow}>
                {[
                  { key: 'parking', label: 'পার্কিং', value: parking, set: setParking },
                  { key: 'gas', label: 'গ্যাস', value: gas, set: setGas },
                  { key: 'water', label: 'পানি', value: water, set: setWater },
                  { key: 'elevator', label: 'লিফট', value: elevator, set: setElevator },
                  { key: 'generator', label: 'জেনারেটর', value: generator, set: setGenerator },
                  { key: 'security', label: 'সিকিউরিটি', value: security, set: setSecurity },
                ].map(item => (
                  <Pressable key={item.key} style={[styles.chip, item.value && styles.chipActive]} onPress={() => item.set(!item.value)}>
                    <Ionicons name={item.value ? 'checkmark-circle' : 'ellipse-outline'} size={16} color={item.value ? Colors.primary : Colors.textMuted} />
                    <Text style={[styles.chipText, item.value && styles.chipTextActive]}>{item.label}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        )}

        {step === 3 && (
          <View style={styles.form}>
            <Pressable style={styles.uploadArea}>
              <Ionicons name="cloud-upload-outline" size={40} color={Colors.textMuted} />
              <Text style={styles.uploadTitle}>ছবি আপলোড করুন</Text>
              <Text style={styles.uploadSubtitle}>সর্বোচ্চ ১০টি ছবি (JPG, PNG)</Text>
            </Pressable>
            <Pressable style={styles.uploadArea}>
              <Ionicons name="videocam-outline" size={40} color={Colors.textMuted} />
              <Text style={styles.uploadTitle}>ভিডিও আপলোড</Text>
              <Text style={styles.uploadSubtitle}>ঐচ্ছিক (MP4, সর্বোচ্চ ৫০MB)</Text>
            </Pressable>
            <View style={styles.uploadNote}>
              <Ionicons name="information-circle" size={18} color={Colors.primary} />
              <Text style={styles.uploadNoteText}>ভালো ছবি আপলোড করলে আপনার প্রপার্টি দ্রুত ভাড়া হবে</Text>
            </View>
          </View>
        )}

        {step === 4 && (
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>মাসিক ভাড়া (টাকা) *</Text>
              <TextInput style={styles.textInput} placeholder="যেমন: 15000" placeholderTextColor={Colors.textMuted} keyboardType="number-pad" value={rent} onChangeText={setRent} />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>সিকিউরিটি ডিপোজিট (টাকা)</Text>
              <TextInput style={styles.textInput} placeholder="যেমন: 30000" placeholderTextColor={Colors.textMuted} keyboardType="number-pad" value={deposit} onChangeText={setDeposit} />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>সার্ভিস চার্জ (টাকা)</Text>
              <TextInput style={styles.textInput} placeholder="যেমন: 3000" placeholderTextColor={Colors.textMuted} keyboardType="number-pad" value={serviceCharge} onChangeText={setServiceCharge} />
            </View>
            <Pressable style={[styles.chip, negotiable && styles.chipActive]} onPress={() => setNegotiable(!negotiable)}>
              <Ionicons name={negotiable ? 'checkmark-circle' : 'ellipse-outline'} size={16} color={negotiable ? Colors.primary : Colors.textMuted} />
              <Text style={[styles.chipText, negotiable && styles.chipTextActive]}>আলোচনাসাপেক্ষ</Text>
            </Pressable>
          </View>
        )}
      </KeyboardAwareScrollViewCompat>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 10) }]}>
        {step > 1 && (
          <Pressable style={styles.prevBtn} onPress={() => setStep(step - 1)}>
            <Ionicons name="arrow-back" size={20} color={Colors.textPrimary} />
            <Text style={styles.prevBtnText}>পিছনে</Text>
          </Pressable>
        )}
        <Pressable
          style={({ pressed }) => [styles.nextBtn, pressed && { opacity: 0.9 }, step === 1 && { flex: 1 }]}
          onPress={step === 4 ? handleSubmit : handleNext}
        >
          <Text style={styles.nextBtnText}>{step === 4 ? 'সাবমিট করুন' : 'পরবর্তী'}</Text>
          {step < 4 && <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { paddingHorizontal: 24, paddingBottom: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  headerTitle: { fontSize: 22, fontFamily: 'Inter_700Bold', color: Colors.textPrimary, marginBottom: 16 },
  stepIndicator: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  stepDot: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.inputBg,
    alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.border,
  },
  stepDotActive: { backgroundColor: Colors.secondary, borderColor: Colors.secondary },
  stepNum: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: Colors.textMuted },
  stepNumActive: { color: '#FFFFFF' },
  stepLine: { width: 40, height: 2, backgroundColor: Colors.border },
  stepLineActive: { backgroundColor: Colors.secondary },
  stepLabels: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 6 },
  stepLabel: { fontSize: 11, fontFamily: 'Inter_400Regular', color: Colors.textMuted, width: 50, textAlign: 'center' },
  stepLabelActive: { color: Colors.secondary, fontFamily: 'Inter_600SemiBold' },
  formContent: { padding: 24, paddingBottom: 120 },
  form: { gap: 18 },
  inputGroup: { gap: 6 },
  label: { fontSize: 13, fontFamily: 'Inter_500Medium', color: Colors.textPrimary },
  textInput: {
    backgroundColor: Colors.inputBg, borderRadius: 12, paddingHorizontal: 14,
    height: 50, fontSize: 15, fontFamily: 'Inter_400Regular', color: Colors.textPrimary,
    borderWidth: 1, borderColor: Colors.borderLight,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20,
    backgroundColor: Colors.inputBg, borderWidth: 1, borderColor: Colors.borderLight,
  },
  chipActive: { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  chipText: { fontSize: 13, fontFamily: 'Inter_500Medium', color: Colors.textSecondary },
  chipTextActive: { color: Colors.primary },
  row: { flexDirection: 'row', gap: 12 },
  uploadArea: {
    alignItems: 'center', justifyContent: 'center', paddingVertical: 40,
    borderWidth: 2, borderColor: Colors.border, borderStyle: 'dashed',
    borderRadius: 16, gap: 8, backgroundColor: Colors.inputBg,
  },
  uploadTitle: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: Colors.textPrimary },
  uploadSubtitle: { fontSize: 13, fontFamily: 'Inter_400Regular', color: Colors.textMuted },
  uploadNote: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.primaryLight, padding: 14, borderRadius: 12 },
  uploadNoteText: { flex: 1, fontSize: 13, fontFamily: 'Inter_400Regular', color: Colors.primaryDark, lineHeight: 18 },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', gap: 12, paddingHorizontal: 24, paddingTop: 12,
    backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: Colors.border,
  },
  prevBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingHorizontal: 20, height: 50, borderRadius: 14,
    backgroundColor: Colors.inputBg, borderWidth: 1, borderColor: Colors.border,
  },
  prevBtnText: { fontSize: 14, fontFamily: 'Inter_500Medium', color: Colors.textPrimary },
  nextBtn: {
    flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: Colors.secondary, height: 50, borderRadius: 14,
  },
  nextBtnText: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: '#FFFFFF' },
});
