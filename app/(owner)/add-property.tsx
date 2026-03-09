import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, Platform, ScrollView, Switch } from 'react-native';
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
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState('');
  const [type, setType] = useState('apartment');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('dhaka');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedUpazila, setSelectedUpazila] = useState('');

  const [bedrooms, setBedrooms] = useState(2);
  const [bathrooms, setBathrooms] = useState(2);
  const [floorLevel, setFloorLevel] = useState(3);
  const [totalFloors, setTotalFloors] = useState(6);
  const [area, setArea] = useState('1000');
  const [furnishing, setFurnishing] = useState('semi-furnished');
  const [genderPref, setGenderPref] = useState('family');
  const [parking, setParking] = useState(false);
  const [gas, setGas] = useState(true);
  const [water, setWater] = useState(true);
  const [elevator, setElevator] = useState(false);
  const [generator, setGenerator] = useState(false);
  const [security, setSecurity] = useState(false);
  const [balcony, setBalcony] = useState(true);
  const [rooftop, setRooftop] = useState(false);
  const [cctv, setCctv] = useState(false);

  const [rent, setRent] = useState('');
  const [deposit, setDeposit] = useState('');
  const [serviceCharge, setServiceCharge] = useState('');
  const [negotiable, setNegotiable] = useState(true);
  const [advanceMonths, setAdvanceMonths] = useState('2');
  const [availableFrom, setAvailableFrom] = useState('');

  const divisionData = useMemo(() => DIVISIONS.find(d => d.id === selectedDivision), [selectedDivision]);
  const districtData = useMemo(() => divisionData?.districts.find(d => d.id === selectedDistrict), [divisionData, selectedDistrict]);

  const stepProgress = (step / 4) * 100;

  const handleNext = () => {
    if (step === 1) {
      if (!title.trim()) { Alert.alert('ত্রুটি', 'প্রপার্টি টাইটেল দিন'); return; }
      if (!address.trim()) { Alert.alert('ত্রুটি', 'ঠিকানা দিন'); return; }
      if (!selectedDivision) { Alert.alert('ত্রুটি', 'বিভাগ সিলেক্ট করুন'); return; }
    }
    if (step < 4) {
      if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setStep(step + 1);
    }
  };

  const handleSubmit = async () => {
    if (!rent.trim()) { Alert.alert('ত্রুটি', 'ভাড়ার মূল্য দিন'); return; }
    if (submitting) return;
    setSubmitting(true);

    if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    addProperty({
      ownerId: user?.id || '',
      ownerName: user?.name || '',
      ownerPhone: user?.phone || '',
      title,
      type,
      description,
      images: [],
      division: divisionData?.nameBn || 'ঢাকা',
      district: districtData?.nameBn || divisionData?.districts[0]?.nameBn || '',
      upazila: districtData?.upazilas.find(u => u.id === selectedUpazila)?.nameBn || '',
      address,
      rent: parseInt(rent) || 0,
      deposit: parseInt(deposit) || 0,
      serviceCharge: parseInt(serviceCharge) || 0,
      bedrooms,
      bathrooms,
      floorLevel,
      totalFloors,
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

    Alert.alert('সফল!', 'প্রপার্টি সফলভাবে যোগ করা হয়েছে!');
    setStep(1);
    setTitle(''); setAddress(''); setDescription(''); setRent(''); setDeposit(''); setServiceCharge('');
    setSubmitting(false);
  };

  const CounterInput = ({ label, value, onChange, min = 0, max = 50 }: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number }) => (
    <View style={s.counterBox}>
      <Text style={s.counterLabel}>{label}</Text>
      <View style={s.counterRow}>
        <Pressable style={s.counterBtn} onPress={() => value > min && onChange(value - 1)} disabled={value <= min}>
          <Ionicons name="remove" size={18} color={value <= min ? Colors.textMuted : Colors.primary} />
        </Pressable>
        <Text style={s.counterValue}>{value}</Text>
        <Pressable style={s.counterBtn} onPress={() => value < max && onChange(value + 1)} disabled={value >= max}>
          <Ionicons name="add" size={18} color={value >= max ? Colors.textMuted : Colors.primary} />
        </Pressable>
      </View>
    </View>
  );

  const ToggleItem = ({ label, icon, value, onChange }: { label: string; icon: string; value: boolean; onChange: (v: boolean) => void }) => (
    <Pressable style={[s.toggleItem, value && s.toggleItemActive]} onPress={() => onChange(!value)}>
      <Ionicons name={icon as any} size={20} color={value ? Colors.primary : Colors.textMuted} />
      <Text style={[s.toggleLabel, value && s.toggleLabelActive]}>{label}</Text>
      {value && <Ionicons name="checkmark-circle" size={18} color={Colors.primary} />}
    </Pressable>
  );

  return (
    <View style={s.container}>
      <View style={[s.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 8) }]}>
        <View style={s.headerTop}>
          <Text style={s.headerTitle}>প্রপার্টি যোগ করুন</Text>
          <Text style={s.stepText}>{step}/4</Text>
        </View>
        <View style={s.progressBar}>
          <View style={[s.progressFill, { width: `${stepProgress}%` }]} />
        </View>
        <View style={s.stepLabelsRow}>
          {['তথ্য', 'বিবরণ', 'ছবি', 'মূল্য'].map((label, i) => (
            <Text key={i} style={[s.stepLabelItem, step > i && s.stepLabelDone, step === i + 1 && s.stepLabelCurrent]}>{label}</Text>
          ))}
        </View>
      </View>

      <KeyboardAwareScrollViewCompat
        style={{ flex: 1 }}
        contentContainerStyle={s.formContent}
        bottomOffset={20}
      >
        {step === 1 && (
          <View style={s.form}>
            <View style={s.sectionHeader}>
              <Ionicons name="home-outline" size={20} color={Colors.primary} />
              <Text style={s.sectionTitle}>বেসিক তথ্য</Text>
            </View>

            <View style={s.inputGroup}>
              <Text style={s.label}>প্রপার্টি টাইটেল <Text style={s.required}>*</Text></Text>
              <TextInput style={s.textInput} placeholder="যেমন: ৩ বেডরুম ফ্ল্যাট - উত্তরা" placeholderTextColor={Colors.textMuted} value={title} onChangeText={setTitle} />
            </View>

            <View style={s.inputGroup}>
              <Text style={s.label}>প্রপার্টি ধরন</Text>
              <View style={s.typeGrid}>
                {PROPERTY_TYPES.map(t => (
                  <Pressable key={t.id} style={[s.typeCard, type === t.id && s.typeCardActive]} onPress={() => setType(t.id)}>
                    <Ionicons name={t.icon as any} size={24} color={type === t.id ? Colors.primary : Colors.textMuted} />
                    <Text style={[s.typeCardText, type === t.id && s.typeCardTextActive]}>{t.nameBn}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={s.inputGroup}>
              <Text style={s.label}>বিভাগ <Text style={s.required}>*</Text></Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.horizontalChips}>
                {DIVISIONS.map(d => (
                  <Pressable key={d.id} style={[s.chip, selectedDivision === d.id && s.chipActive]} onPress={() => { setSelectedDivision(d.id); setSelectedDistrict(''); setSelectedUpazila(''); }}>
                    <Text style={[s.chipText, selectedDivision === d.id && s.chipTextActive]}>{d.nameBn}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {divisionData && (
              <View style={s.inputGroup}>
                <Text style={s.label}>জেলা</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.horizontalChips}>
                  {divisionData.districts.map(d => (
                    <Pressable key={d.id} style={[s.chip, selectedDistrict === d.id && s.chipActive]} onPress={() => { setSelectedDistrict(d.id); setSelectedUpazila(''); }}>
                      <Text style={[s.chipText, selectedDistrict === d.id && s.chipTextActive]}>{d.nameBn}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}

            {districtData && districtData.upazilas.length > 0 && (
              <View style={s.inputGroup}>
                <Text style={s.label}>এলাকা/উপজেলা</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.horizontalChips}>
                  {districtData.upazilas.map(u => (
                    <Pressable key={u.id} style={[s.chip, selectedUpazila === u.id && s.chipActive]} onPress={() => setSelectedUpazila(u.id)}>
                      <Text style={[s.chipText, selectedUpazila === u.id && s.chipTextActive]}>{u.nameBn}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}

            <View style={s.inputGroup}>
              <Text style={s.label}>বিস্তারিত ঠিকানা <Text style={s.required}>*</Text></Text>
              <TextInput style={[s.textInput, s.textArea]} placeholder="রোড, ব্লক, সেক্টর, বাসা নম্বর" placeholderTextColor={Colors.textMuted} value={address} onChangeText={setAddress} multiline textAlignVertical="top" />
            </View>

            <View style={s.inputGroup}>
              <Text style={s.label}>বিবরণ</Text>
              <TextInput style={[s.textInput, s.textAreaLarge]} placeholder="প্রপার্টি সম্পর্কে বিস্তারিত লিখুন..." placeholderTextColor={Colors.textMuted} value={description} onChangeText={setDescription} multiline textAlignVertical="top" />
            </View>
          </View>
        )}

        {step === 2 && (
          <View style={s.form}>
            <View style={s.sectionHeader}>
              <Ionicons name="options-outline" size={20} color={Colors.primary} />
              <Text style={s.sectionTitle}>বিস্তারিত তথ্য</Text>
            </View>

            <View style={s.counterGrid}>
              <CounterInput label="বেডরুম" value={bedrooms} onChange={setBedrooms} max={10} />
              <CounterInput label="বাথরুম" value={bathrooms} onChange={setBathrooms} max={10} />
              <CounterInput label="ফ্লোর" value={floorLevel} onChange={setFloorLevel} max={40} />
              <CounterInput label="মোট ফ্লোর" value={totalFloors} onChange={setTotalFloors} max={40} />
            </View>

            <View style={s.inputGroup}>
              <Text style={s.label}>আয়তন (sqft)</Text>
              <TextInput style={s.textInput} keyboardType="number-pad" value={area} onChangeText={setArea} placeholder="1000" placeholderTextColor={Colors.textMuted} />
            </View>

            <View style={s.inputGroup}>
              <Text style={s.label}>ফার্নিশিং</Text>
              <View style={s.chipRow}>
                {FURNISHING_OPTIONS.map(f => (
                  <Pressable key={f.id} style={[s.chip, furnishing === f.id && s.chipActive]} onPress={() => setFurnishing(f.id)}>
                    <Ionicons name={furnishing === f.id ? 'checkmark-circle' : 'ellipse-outline'} size={16} color={furnishing === f.id ? Colors.primary : Colors.textMuted} />
                    <Text style={[s.chipText, furnishing === f.id && s.chipTextActive]}>{f.nameBn}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={s.inputGroup}>
              <Text style={s.label}>ভাড়াটিয়া প্রেফারেন্স</Text>
              <View style={s.chipRow}>
                {GENDER_PREFERENCES.map(g => (
                  <Pressable key={g.id} style={[s.chip, genderPref === g.id && s.chipActive]} onPress={() => setGenderPref(g.id)}>
                    <Text style={[s.chipText, genderPref === g.id && s.chipTextActive]}>{g.nameBn}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={s.inputGroup}>
              <Text style={s.label}>সুবিধাসমূহ</Text>
              <View style={s.amenitiesGrid}>
                <ToggleItem label="পার্কিং" icon="car-outline" value={parking} onChange={setParking} />
                <ToggleItem label="গ্যাস" icon="flame-outline" value={gas} onChange={setGas} />
                <ToggleItem label="পানি" icon="water-outline" value={water} onChange={setWater} />
                <ToggleItem label="লিফট" icon="arrow-up-outline" value={elevator} onChange={setElevator} />
                <ToggleItem label="জেনারেটর" icon="flash-outline" value={generator} onChange={setGenerator} />
                <ToggleItem label="সিকিউরিটি" icon="shield-outline" value={security} onChange={setSecurity} />
                <ToggleItem label="বারান্দা" icon="sunny-outline" value={balcony} onChange={setBalcony} />
                <ToggleItem label="ছাদ" icon="home-outline" value={rooftop} onChange={setRooftop} />
                <ToggleItem label="CCTV" icon="videocam-outline" value={cctv} onChange={setCctv} />
              </View>
            </View>
          </View>
        )}

        {step === 3 && (
          <View style={s.form}>
            <View style={s.sectionHeader}>
              <Ionicons name="images-outline" size={20} color={Colors.primary} />
              <Text style={s.sectionTitle}>ছবি ও ভিডিও</Text>
            </View>

            <Pressable style={s.uploadCard}>
              <View style={s.uploadIconCircle}>
                <Ionicons name="camera-outline" size={28} color={Colors.primary} />
              </View>
              <Text style={s.uploadTitle}>ছবি আপলোড করুন</Text>
              <Text style={s.uploadSubtitle}>সর্বোচ্চ ১০টি ছবি • JPG, PNG</Text>
              <View style={s.uploadButton}>
                <Ionicons name="add" size={18} color="#FFFFFF" />
                <Text style={s.uploadButtonText}>ছবি যোগ করুন</Text>
              </View>
            </Pressable>

            <Pressable style={s.uploadCard}>
              <View style={[s.uploadIconCircle, { backgroundColor: '#FFF0EB' }]}>
                <Ionicons name="videocam-outline" size={28} color={Colors.secondary} />
              </View>
              <Text style={s.uploadTitle}>ভিডিও আপলোড</Text>
              <Text style={s.uploadSubtitle}>ঐচ্ছিক • MP4 • সর্বোচ্চ ৫০MB</Text>
              <View style={[s.uploadButton, { backgroundColor: Colors.secondary }]}>
                <Ionicons name="add" size={18} color="#FFFFFF" />
                <Text style={s.uploadButtonText}>ভিডিও যোগ করুন</Text>
              </View>
            </Pressable>

            <View style={s.tipBox}>
              <Ionicons name="bulb-outline" size={20} color={Colors.accent} />
              <View style={{ flex: 1 }}>
                <Text style={s.tipTitle}>টিপস</Text>
                <Text style={s.tipText}>ভালো মানের ছবি আপলোড করলে আপনার প্রপার্টি ৩গুণ দ্রুত ভাড়া হবে। বিভিন্ন কোণ থেকে ছবি তুলুন।</Text>
              </View>
            </View>
          </View>
        )}

        {step === 4 && (
          <View style={s.form}>
            <View style={s.sectionHeader}>
              <Ionicons name="cash-outline" size={20} color={Colors.primary} />
              <Text style={s.sectionTitle}>মূল্য নির্ধারণ</Text>
            </View>

            <View style={s.priceCard}>
              <View style={s.inputGroup}>
                <Text style={s.label}>মাসিক ভাড়া (৳) <Text style={s.required}>*</Text></Text>
                <View style={s.priceInputRow}>
                  <Text style={s.priceCurrency}>৳</Text>
                  <TextInput style={s.priceInput} placeholder="15,000" placeholderTextColor={Colors.textMuted} keyboardType="number-pad" value={rent} onChangeText={setRent} />
                  <Text style={s.priceUnit}>/মাস</Text>
                </View>
              </View>

              <View style={s.inputGroup}>
                <Text style={s.label}>সিকিউরিটি ডিপোজিট (৳)</Text>
                <View style={s.priceInputRow}>
                  <Text style={s.priceCurrency}>৳</Text>
                  <TextInput style={s.priceInput} placeholder="30,000" placeholderTextColor={Colors.textMuted} keyboardType="number-pad" value={deposit} onChangeText={setDeposit} />
                </View>
              </View>

              <View style={s.inputGroup}>
                <Text style={s.label}>সার্ভিস চার্জ (৳)</Text>
                <View style={s.priceInputRow}>
                  <Text style={s.priceCurrency}>৳</Text>
                  <TextInput style={s.priceInput} placeholder="3,000" placeholderTextColor={Colors.textMuted} keyboardType="number-pad" value={serviceCharge} onChangeText={setServiceCharge} />
                  <Text style={s.priceUnit}>/মাস</Text>
                </View>
              </View>

              <View style={s.inputGroup}>
                <Text style={s.label}>অগ্রিম (মাস)</Text>
                <TextInput style={s.textInput} keyboardType="number-pad" value={advanceMonths} onChangeText={setAdvanceMonths} placeholder="2" placeholderTextColor={Colors.textMuted} />
              </View>

              <View style={s.inputGroup}>
                <Text style={s.label}>কবে থেকে পাওয়া যাবে</Text>
                <TextInput style={s.textInput} value={availableFrom} onChangeText={setAvailableFrom} placeholder="যেমন: ১ এপ্রিল ২০২৬" placeholderTextColor={Colors.textMuted} />
              </View>
            </View>

            <View style={s.switchRow}>
              <View style={{ flex: 1 }}>
                <Text style={s.switchLabel}>আলোচনাসাপেক্ষ</Text>
                <Text style={s.switchDesc}>ভাড়া নিয়ে আলোচনা করতে রাজি</Text>
              </View>
              <Switch value={negotiable} onValueChange={setNegotiable} trackColor={{ false: '#E4E6EB', true: Colors.primaryLight }} thumbColor={negotiable ? Colors.primary : '#F4F5F7'} />
            </View>

            {rent ? (
              <View style={s.summaryCard}>
                <Text style={s.summaryTitle}>মূল্য সারাংশ</Text>
                <View style={s.summaryRow}><Text style={s.summaryLabel}>মাসিক ভাড়া</Text><Text style={s.summaryValue}>৳{parseInt(rent).toLocaleString('bn-BD')}</Text></View>
                {deposit ? <View style={s.summaryRow}><Text style={s.summaryLabel}>ডিপোজিট</Text><Text style={s.summaryValue}>৳{parseInt(deposit).toLocaleString('bn-BD')}</Text></View> : null}
                {serviceCharge ? <View style={s.summaryRow}><Text style={s.summaryLabel}>সার্ভিস চার্জ</Text><Text style={s.summaryValue}>৳{parseInt(serviceCharge).toLocaleString('bn-BD')}/মাস</Text></View> : null}
                <View style={[s.summaryRow, { borderTopWidth: 1, borderTopColor: Colors.borderLight, paddingTop: 10, marginTop: 6 }]}>
                  <Text style={[s.summaryLabel, { fontFamily: 'Inter_600SemiBold' }]}>মোট প্রথম মাস</Text>
                  <Text style={[s.summaryValue, { color: Colors.primary, fontFamily: 'Inter_700Bold' }]}>৳{((parseInt(rent) || 0) + (parseInt(deposit) || 0) + (parseInt(serviceCharge) || 0)).toLocaleString('bn-BD')}</Text>
                </View>
              </View>
            ) : null}
          </View>
        )}
      </KeyboardAwareScrollViewCompat>

      <View style={[s.bottomBar, { paddingBottom: Math.max(insets.bottom, Platform.OS === 'web' ? 34 : 10) + 4 }]}>
        {step > 1 ? (
          <Pressable style={s.prevBtn} onPress={() => setStep(step - 1)}>
            <Ionicons name="chevron-back" size={20} color={Colors.textPrimary} />
            <Text style={s.prevBtnText}>পিছনে</Text>
          </Pressable>
        ) : <View style={{ width: 10 }} />}
        <Pressable
          style={({ pressed }) => [s.nextBtn, pressed && { opacity: 0.9 }, submitting && { opacity: 0.6 }]}
          onPress={step === 4 ? handleSubmit : handleNext}
          disabled={submitting}
        >
          <Text style={s.nextBtnText}>{step === 4 ? 'প্রকাশ করুন' : 'পরবর্তী'}</Text>
          <Ionicons name={step === 4 ? 'checkmark-circle' : 'arrow-forward'} size={20} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },

  header: {
    paddingHorizontal: 20, paddingBottom: 12, backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5, borderBottomColor: '#E4E6EB',
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  headerTitle: { fontSize: 20, fontFamily: 'Inter_700Bold', color: Colors.textPrimary },
  stepText: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: Colors.primary },
  progressBar: { height: 4, backgroundColor: '#F0F2F5', borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 2 },
  stepLabelsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  stepLabelItem: { fontSize: 11, fontFamily: 'Inter_400Regular', color: Colors.textMuted },
  stepLabelDone: { color: Colors.primary, fontFamily: 'Inter_500Medium' },
  stepLabelCurrent: { color: Colors.primary, fontFamily: 'Inter_600SemiBold' },

  formContent: { padding: 20, paddingBottom: 120 },
  form: { gap: 20 },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  sectionTitle: { fontSize: 16, fontFamily: 'Inter_600SemiBold', color: Colors.textPrimary },

  inputGroup: { gap: 6 },
  label: { fontSize: 13, fontFamily: 'Inter_500Medium', color: Colors.textPrimary },
  required: { color: Colors.danger },
  textInput: {
    backgroundColor: '#F8F9FA', borderRadius: 12, paddingHorizontal: 16,
    height: 48, fontSize: 15, fontFamily: 'Inter_400Regular', color: Colors.textPrimary,
    borderWidth: 1, borderColor: '#E8ECF0',
  },
  textArea: { height: 80, paddingTop: 14 },
  textAreaLarge: { height: 100, paddingTop: 14 },

  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  typeCard: {
    alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 14, paddingHorizontal: 16, borderRadius: 14,
    backgroundColor: '#F8F9FA', borderWidth: 1.5, borderColor: '#E8ECF0', minWidth: 90,
  },
  typeCardActive: { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  typeCardText: { fontSize: 12, fontFamily: 'Inter_500Medium', color: Colors.textSecondary },
  typeCardTextActive: { color: Colors.primary, fontFamily: 'Inter_600SemiBold' },

  horizontalChips: { gap: 8, paddingRight: 8 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 22,
    backgroundColor: '#F8F9FA', borderWidth: 1, borderColor: '#E8ECF0',
  },
  chipActive: { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  chipText: { fontSize: 13, fontFamily: 'Inter_500Medium', color: Colors.textSecondary },
  chipTextActive: { color: Colors.primary },

  counterGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  counterBox: {
    flex: 1, minWidth: '45%', backgroundColor: '#F8F9FA', borderRadius: 14,
    padding: 14, borderWidth: 1, borderColor: '#E8ECF0', alignItems: 'center', gap: 8,
  },
  counterLabel: { fontSize: 13, fontFamily: 'Inter_500Medium', color: Colors.textSecondary },
  counterRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  counterBtn: {
    width: 34, height: 34, borderRadius: 17, backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#E8ECF0',
  },
  counterValue: { fontSize: 20, fontFamily: 'Inter_700Bold', color: Colors.textPrimary, minWidth: 24, textAlign: 'center' },

  amenitiesGrid: { gap: 8 },
  toggleItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 14, paddingVertical: 12, borderRadius: 12,
    backgroundColor: '#F8F9FA', borderWidth: 1, borderColor: '#E8ECF0',
  },
  toggleItemActive: { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  toggleLabel: { flex: 1, fontSize: 14, fontFamily: 'Inter_500Medium', color: Colors.textSecondary },
  toggleLabelActive: { color: Colors.primary },

  uploadCard: {
    alignItems: 'center', paddingVertical: 28, paddingHorizontal: 20,
    borderWidth: 2, borderColor: '#E8ECF0', borderStyle: 'dashed',
    borderRadius: 16, gap: 10, backgroundColor: '#FAFBFC',
  },
  uploadIconCircle: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  uploadTitle: { fontSize: 16, fontFamily: 'Inter_600SemiBold', color: Colors.textPrimary },
  uploadSubtitle: { fontSize: 13, fontFamily: 'Inter_400Regular', color: Colors.textMuted },
  uploadButton: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.primary, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 22, marginTop: 4,
  },
  uploadButtonText: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: '#FFFFFF' },

  tipBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    backgroundColor: '#FFF8E6', borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: '#FFE0A3',
  },
  tipTitle: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: Colors.textPrimary, marginBottom: 2 },
  tipText: { fontSize: 12, fontFamily: 'Inter_400Regular', color: Colors.textSecondary, lineHeight: 18 },

  priceCard: { backgroundColor: '#F8F9FA', borderRadius: 16, padding: 16, gap: 16, borderWidth: 1, borderColor: '#E8ECF0' },
  priceInputRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    borderRadius: 12, borderWidth: 1, borderColor: '#E8ECF0', height: 48,
  },
  priceCurrency: { fontSize: 18, fontFamily: 'Inter_700Bold', color: Colors.primary, paddingHorizontal: 14 },
  priceInput: { flex: 1, fontSize: 16, fontFamily: 'Inter_600SemiBold', color: Colors.textPrimary, height: 48 },
  priceUnit: { fontSize: 13, fontFamily: 'Inter_400Regular', color: Colors.textMuted, paddingRight: 14 },

  switchRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F9FA',
    borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#E8ECF0',
  },
  switchLabel: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: Colors.textPrimary },
  switchDesc: { fontSize: 12, fontFamily: 'Inter_400Regular', color: Colors.textMuted, marginTop: 2 },

  summaryCard: {
    backgroundColor: Colors.primaryLight, borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: Colors.primary + '30',
  },
  summaryTitle: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: Colors.primary, marginBottom: 10 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  summaryLabel: { fontSize: 14, fontFamily: 'Inter_400Regular', color: Colors.textSecondary },
  summaryValue: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: Colors.textPrimary },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', gap: 12, paddingHorizontal: 20, paddingTop: 12,
    backgroundColor: '#FFFFFF', borderTopWidth: 0.5, borderTopColor: '#E4E6EB',
  },
  prevBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4,
    paddingHorizontal: 18, height: 48, borderRadius: 24,
    backgroundColor: '#F0F2F5',
  },
  prevBtnText: { fontSize: 14, fontFamily: 'Inter_500Medium', color: Colors.textPrimary },
  nextBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.primary, height: 48, borderRadius: 24,
  },
  nextBtnText: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: '#FFFFFF' },
});
