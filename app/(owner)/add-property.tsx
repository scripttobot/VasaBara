import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, Platform, ScrollView, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { useApp } from '@/lib/app-context';
import { useColors } from '@/lib/theme-context';
import { PROPERTY_TYPES, FURNISHING_OPTIONS, GENDER_PREFERENCES, DIVISIONS } from '@/constants/locations';
import * as Haptics from 'expo-haptics';

export default function AddPropertyScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
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
    <View style={[s.counterBox, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
      <Text style={[s.counterLabel, { color: colors.textSecondary }]}>{label}</Text>
      <View style={s.counterRow}>
        <Pressable style={[s.counterBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => value > min && onChange(value - 1)} disabled={value <= min}>
          <Ionicons name="remove" size={18} color={value <= min ? colors.textMuted : colors.primary} />
        </Pressable>
        <Text style={[s.counterValue, { color: colors.textPrimary }]}>{value}</Text>
        <Pressable style={[s.counterBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => value < max && onChange(value + 1)} disabled={value >= max}>
          <Ionicons name="add" size={18} color={value >= max ? colors.textMuted : colors.primary} />
        </Pressable>
      </View>
    </View>
  );

  const ToggleItem = ({ label, icon, value, onChange }: { label: string; icon: string; value: boolean; onChange: (v: boolean) => void }) => (
    <Pressable style={[s.toggleItem, { backgroundColor: value ? colors.primaryLight : colors.inputBg, borderColor: value ? colors.primary : colors.border }]} onPress={() => onChange(!value)}>
      <Ionicons name={icon as any} size={20} color={value ? colors.primary : colors.textMuted} />
      <Text style={[s.toggleLabel, { color: value ? colors.primary : colors.textSecondary }]}>{label}</Text>
      {value && <Ionicons name="checkmark-circle" size={18} color={colors.primary} />}
    </Pressable>
  );

  return (
    <View style={[s.container, { backgroundColor: colors.background }]}>
      <View style={[s.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 8), backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={s.headerTop}>
          <Text style={[s.headerTitle, { color: colors.textPrimary }]}>প্রপার্টি যোগ করুন</Text>
          <Text style={[s.stepText, { color: colors.primary }]}>{step}/4</Text>
        </View>
        <View style={[s.progressBar, { backgroundColor: colors.borderLight }]}>
          <View style={[s.progressFill, { width: `${stepProgress}%`, backgroundColor: colors.primary }]} />
        </View>
        <View style={s.stepLabelsRow}>
          {['তথ্য', 'বিবরণ', 'ছবি', 'মূল্য'].map((label, i) => (
            <Text key={i} style={[s.stepLabelItem, { color: colors.textMuted }, step > i && { color: colors.primary, fontFamily: 'Inter_500Medium' }, step === i + 1 && { color: colors.primary, fontFamily: 'Inter_600SemiBold' }]}>{label}</Text>
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
              <Ionicons name="home-outline" size={20} color={colors.primary} />
              <Text style={[s.sectionTitle, { color: colors.textPrimary }]}>বেসিক তথ্য</Text>
            </View>

            <View style={s.inputGroup}>
              <Text style={[s.label, { color: colors.textPrimary }]}>প্রপার্টি টাইটেল <Text style={{ color: colors.danger }}>*</Text></Text>
              <TextInput style={[s.textInput, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.textPrimary }]} placeholder="যেমন: ৩ বেডরুম ফ্ল্যাট - উত্তরা" placeholderTextColor={colors.textMuted} value={title} onChangeText={setTitle} />
            </View>

            <View style={s.inputGroup}>
              <Text style={[s.label, { color: colors.textPrimary }]}>প্রপার্টি ধরন</Text>
              <View style={s.typeGrid}>
                {PROPERTY_TYPES.map(t => (
                  <Pressable key={t.id} style={[s.typeCard, { backgroundColor: type === t.id ? colors.primaryLight : colors.inputBg, borderColor: type === t.id ? colors.primary : colors.border }]} onPress={() => setType(t.id)}>
                    <Ionicons name={t.icon as any} size={24} color={type === t.id ? colors.primary : colors.textMuted} />
                    <Text style={[s.typeCardText, { color: type === t.id ? colors.primary : colors.textSecondary, fontFamily: type === t.id ? 'Inter_600SemiBold' : 'Inter_500Medium' }]}>{t.nameBn}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={s.inputGroup}>
              <Text style={[s.label, { color: colors.textPrimary }]}>বিভাগ <Text style={{ color: colors.danger }}>*</Text></Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.horizontalChips}>
                {DIVISIONS.map(d => (
                  <Pressable key={d.id} style={[s.chip, { backgroundColor: selectedDivision === d.id ? colors.primaryLight : colors.inputBg, borderColor: selectedDivision === d.id ? colors.primary : colors.border }]} onPress={() => { setSelectedDivision(d.id); setSelectedDistrict(''); setSelectedUpazila(''); }}>
                    <Text style={[s.chipText, { color: selectedDivision === d.id ? colors.primary : colors.textSecondary }]}>{d.nameBn}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {divisionData && (
              <View style={s.inputGroup}>
                <Text style={[s.label, { color: colors.textPrimary }]}>জেলা</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.horizontalChips}>
                  {divisionData.districts.map(d => (
                    <Pressable key={d.id} style={[s.chip, { backgroundColor: selectedDistrict === d.id ? colors.primaryLight : colors.inputBg, borderColor: selectedDistrict === d.id ? colors.primary : colors.border }]} onPress={() => { setSelectedDistrict(d.id); setSelectedUpazila(''); }}>
                      <Text style={[s.chipText, { color: selectedDistrict === d.id ? colors.primary : colors.textSecondary }]}>{d.nameBn}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}

            {districtData && districtData.upazilas.length > 0 && (
              <View style={s.inputGroup}>
                <Text style={[s.label, { color: colors.textPrimary }]}>এলাকা/উপজেলা</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.horizontalChips}>
                  {districtData.upazilas.map(u => (
                    <Pressable key={u.id} style={[s.chip, { backgroundColor: selectedUpazila === u.id ? colors.primaryLight : colors.inputBg, borderColor: selectedUpazila === u.id ? colors.primary : colors.border }]} onPress={() => setSelectedUpazila(u.id)}>
                      <Text style={[s.chipText, { color: selectedUpazila === u.id ? colors.primary : colors.textSecondary }]}>{u.nameBn}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}

            <View style={s.inputGroup}>
              <Text style={[s.label, { color: colors.textPrimary }]}>বিস্তারিত ঠিকানা <Text style={{ color: colors.danger }}>*</Text></Text>
              <TextInput style={[s.textInput, s.textArea, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.textPrimary }]} placeholder="রোড, ব্লক, সেক্টর, বাসা নম্বর" placeholderTextColor={colors.textMuted} value={address} onChangeText={setAddress} multiline textAlignVertical="top" />
            </View>

            <View style={s.inputGroup}>
              <Text style={[s.label, { color: colors.textPrimary }]}>বিবরণ</Text>
              <TextInput style={[s.textInput, s.textAreaLarge, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.textPrimary }]} placeholder="প্রপার্টি সম্পর্কে বিস্তারিত লিখুন..." placeholderTextColor={colors.textMuted} value={description} onChangeText={setDescription} multiline textAlignVertical="top" />
            </View>
          </View>
        )}

        {step === 2 && (
          <View style={s.form}>
            <View style={s.sectionHeader}>
              <Ionicons name="options-outline" size={20} color={colors.primary} />
              <Text style={[s.sectionTitle, { color: colors.textPrimary }]}>বিস্তারিত তথ্য</Text>
            </View>

            <View style={s.counterGrid}>
              <CounterInput label="বেডরুম" value={bedrooms} onChange={setBedrooms} max={10} />
              <CounterInput label="বাথরুম" value={bathrooms} onChange={setBathrooms} max={10} />
              <CounterInput label="ফ্লোর" value={floorLevel} onChange={setFloorLevel} max={40} />
              <CounterInput label="মোট ফ্লোর" value={totalFloors} onChange={setTotalFloors} max={40} />
            </View>

            <View style={s.inputGroup}>
              <Text style={[s.label, { color: colors.textPrimary }]}>আয়তন (sqft)</Text>
              <TextInput style={[s.textInput, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.textPrimary }]} keyboardType="number-pad" value={area} onChangeText={setArea} placeholder="1000" placeholderTextColor={colors.textMuted} />
            </View>

            <View style={s.inputGroup}>
              <Text style={[s.label, { color: colors.textPrimary }]}>ফার্নিশিং</Text>
              <View style={s.chipRow}>
                {FURNISHING_OPTIONS.map(f => (
                  <Pressable key={f.id} style={[s.chip, { backgroundColor: furnishing === f.id ? colors.primaryLight : colors.inputBg, borderColor: furnishing === f.id ? colors.primary : colors.border }]} onPress={() => setFurnishing(f.id)}>
                    <Ionicons name={furnishing === f.id ? 'checkmark-circle' : 'ellipse-outline'} size={16} color={furnishing === f.id ? colors.primary : colors.textMuted} />
                    <Text style={[s.chipText, { color: furnishing === f.id ? colors.primary : colors.textSecondary }]}>{f.nameBn}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={s.inputGroup}>
              <Text style={[s.label, { color: colors.textPrimary }]}>ভাড়াটিয়া প্রেফারেন্স</Text>
              <View style={s.chipRow}>
                {GENDER_PREFERENCES.map(g => (
                  <Pressable key={g.id} style={[s.chip, { backgroundColor: genderPref === g.id ? colors.primaryLight : colors.inputBg, borderColor: genderPref === g.id ? colors.primary : colors.border }]} onPress={() => setGenderPref(g.id)}>
                    <Text style={[s.chipText, { color: genderPref === g.id ? colors.primary : colors.textSecondary }]}>{g.nameBn}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={s.inputGroup}>
              <Text style={[s.label, { color: colors.textPrimary }]}>সুবিধাসমূহ</Text>
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
              <Ionicons name="images-outline" size={20} color={colors.primary} />
              <Text style={[s.sectionTitle, { color: colors.textPrimary }]}>ছবি ও ভিডিও</Text>
            </View>

            <Pressable style={[s.uploadCard, { borderColor: colors.border, backgroundColor: colors.inputBg }]}>
              <View style={[s.uploadIconCircle, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="camera-outline" size={28} color={colors.primary} />
              </View>
              <Text style={[s.uploadTitle, { color: colors.textPrimary }]}>ছবি আপলোড করুন</Text>
              <Text style={[s.uploadSubtitle, { color: colors.textMuted }]}>সর্বোচ্চ ১০টি ছবি • JPG, PNG</Text>
              <View style={[s.uploadButton, { backgroundColor: colors.primary }]}>
                <Ionicons name="add" size={18} color="#FFFFFF" />
                <Text style={s.uploadButtonText}>ছবি যোগ করুন</Text>
              </View>
            </Pressable>

            <Pressable style={[s.uploadCard, { borderColor: colors.border, backgroundColor: colors.inputBg }]}>
              <View style={[s.uploadIconCircle, { backgroundColor: colors.secondaryLight }]}>
                <Ionicons name="videocam-outline" size={28} color={colors.secondary} />
              </View>
              <Text style={[s.uploadTitle, { color: colors.textPrimary }]}>ভিডিও আপলোড</Text>
              <Text style={[s.uploadSubtitle, { color: colors.textMuted }]}>ঐচ্ছিক • MP4 • সর্বোচ্চ ৫০MB</Text>
              <View style={[s.uploadButton, { backgroundColor: colors.secondary }]}>
                <Ionicons name="add" size={18} color="#FFFFFF" />
                <Text style={s.uploadButtonText}>ভিডিও যোগ করুন</Text>
              </View>
            </Pressable>

            <View style={[s.tipBox, { backgroundColor: colors.accentLight, borderColor: colors.accent + '50' }]}>
              <Ionicons name="bulb-outline" size={20} color={colors.accent} />
              <View style={{ flex: 1 }}>
                <Text style={[s.tipTitle, { color: colors.textPrimary }]}>টিপস</Text>
                <Text style={[s.tipText, { color: colors.textSecondary }]}>ভালো মানের ছবি আপলোড করলে আপনার প্রপার্টি ৩গুণ দ্রুত ভাড়া হবে। বিভিন্ন কোণ থেকে ছবি তুলুন।</Text>
              </View>
            </View>
          </View>
        )}

        {step === 4 && (
          <View style={s.form}>
            <View style={s.sectionHeader}>
              <Ionicons name="cash-outline" size={20} color={colors.primary} />
              <Text style={[s.sectionTitle, { color: colors.textPrimary }]}>মূল্য নির্ধারণ</Text>
            </View>

            <View style={[s.priceCard, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
              <View style={s.inputGroup}>
                <Text style={[s.label, { color: colors.textPrimary }]}>মাসিক ভাড়া (৳) <Text style={{ color: colors.danger }}>*</Text></Text>
                <View style={[s.priceInputRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <Text style={[s.priceCurrency, { color: colors.primary }]}>৳</Text>
                  <TextInput style={[s.priceInput, { color: colors.textPrimary }]} placeholder="15,000" placeholderTextColor={colors.textMuted} keyboardType="number-pad" value={rent} onChangeText={setRent} />
                  <Text style={[s.priceUnit, { color: colors.textMuted }]}>/মাস</Text>
                </View>
              </View>

              <View style={s.inputGroup}>
                <Text style={[s.label, { color: colors.textPrimary }]}>সিকিউরিটি ডিপোজিট (৳)</Text>
                <View style={[s.priceInputRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <Text style={[s.priceCurrency, { color: colors.primary }]}>৳</Text>
                  <TextInput style={[s.priceInput, { color: colors.textPrimary }]} placeholder="30,000" placeholderTextColor={colors.textMuted} keyboardType="number-pad" value={deposit} onChangeText={setDeposit} />
                </View>
              </View>

              <View style={s.inputGroup}>
                <Text style={[s.label, { color: colors.textPrimary }]}>সার্ভিস চার্জ (৳)</Text>
                <View style={[s.priceInputRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <Text style={[s.priceCurrency, { color: colors.primary }]}>৳</Text>
                  <TextInput style={[s.priceInput, { color: colors.textPrimary }]} placeholder="3,000" placeholderTextColor={colors.textMuted} keyboardType="number-pad" value={serviceCharge} onChangeText={setServiceCharge} />
                  <Text style={[s.priceUnit, { color: colors.textMuted }]}>/মাস</Text>
                </View>
              </View>

              <View style={s.inputGroup}>
                <Text style={[s.label, { color: colors.textPrimary }]}>অগ্রিম (মাস)</Text>
                <TextInput style={[s.textInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.textPrimary }]} keyboardType="number-pad" value={advanceMonths} onChangeText={setAdvanceMonths} placeholder="2" placeholderTextColor={colors.textMuted} />
              </View>

              <View style={s.inputGroup}>
                <Text style={[s.label, { color: colors.textPrimary }]}>কবে থেকে পাওয়া যাবে</Text>
                <TextInput style={[s.textInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.textPrimary }]} value={availableFrom} onChangeText={setAvailableFrom} placeholder="যেমন: ১ এপ্রিল ২০২৬" placeholderTextColor={colors.textMuted} />
              </View>
            </View>

            <View style={[s.switchRow, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
              <View style={{ flex: 1 }}>
                <Text style={[s.switchLabel, { color: colors.textPrimary }]}>আলোচনাসাপেক্ষ</Text>
                <Text style={[s.switchDesc, { color: colors.textMuted }]}>ভাড়া নিয়ে আলোচনা করতে রাজি</Text>
              </View>
              <Switch value={negotiable} onValueChange={setNegotiable} trackColor={{ false: colors.border, true: colors.primaryLight }} thumbColor={negotiable ? colors.primary : colors.inputBg} />
            </View>

            {rent ? (
              <View style={[s.summaryCard, { backgroundColor: colors.primaryLight, borderColor: colors.primary + '30' }]}>
                <Text style={[s.summaryTitle, { color: colors.primary }]}>মূল্য সারাংশ</Text>
                <View style={s.summaryRow}><Text style={[s.summaryLabel, { color: colors.textSecondary }]}>মাসিক ভাড়া</Text><Text style={[s.summaryValue, { color: colors.textPrimary }]}>৳{parseInt(rent).toLocaleString('bn-BD')}</Text></View>
                {deposit ? <View style={s.summaryRow}><Text style={[s.summaryLabel, { color: colors.textSecondary }]}>ডিপোজিট</Text><Text style={[s.summaryValue, { color: colors.textPrimary }]}>৳{parseInt(deposit).toLocaleString('bn-BD')}</Text></View> : null}
                {serviceCharge ? <View style={s.summaryRow}><Text style={[s.summaryLabel, { color: colors.textSecondary }]}>সার্ভিস চার্জ</Text><Text style={[s.summaryValue, { color: colors.textPrimary }]}>৳{parseInt(serviceCharge).toLocaleString('bn-BD')}/মাস</Text></View> : null}
                <View style={[s.summaryRow, { borderTopWidth: 1, borderTopColor: colors.borderLight, paddingTop: 10, marginTop: 6 }]}>
                  <Text style={[s.summaryLabel, { fontFamily: 'Inter_600SemiBold', color: colors.textSecondary }]}>মোট প্রথম মাস</Text>
                  <Text style={[s.summaryValue, { color: colors.primary, fontFamily: 'Inter_700Bold' }]}>৳{((parseInt(rent) || 0) + (parseInt(deposit) || 0) + (parseInt(serviceCharge) || 0)).toLocaleString('bn-BD')}</Text>
                </View>
              </View>
            ) : null}
          </View>
        )}
      </KeyboardAwareScrollViewCompat>

      <View style={[s.bottomBar, { paddingBottom: Math.max(insets.bottom, Platform.OS === 'web' ? 34 : 10) + 4, backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        {step > 1 ? (
          <Pressable style={[s.prevBtn, { backgroundColor: colors.inputBg }]} onPress={() => setStep(step - 1)}>
            <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
            <Text style={[s.prevBtnText, { color: colors.textPrimary }]}>পিছনে</Text>
          </Pressable>
        ) : <View style={{ width: 10 }} />}
        <Pressable
          style={({ pressed }) => [s.nextBtn, { backgroundColor: colors.primary }, pressed && { opacity: 0.9 }, submitting && { opacity: 0.6 }]}
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
  container: { flex: 1 },

  header: {
    paddingHorizontal: 20, paddingBottom: 12,
    borderBottomWidth: 0.5,
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  headerTitle: { fontSize: 20, fontFamily: 'Inter_700Bold' },
  stepText: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  progressBar: { height: 4, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },
  stepLabelsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  stepLabelItem: { fontSize: 11, fontFamily: 'Inter_400Regular' },

  formContent: { padding: 20, paddingBottom: 120 },
  form: { gap: 20 },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  sectionTitle: { fontSize: 16, fontFamily: 'Inter_600SemiBold' },

  inputGroup: { gap: 6 },
  label: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  textInput: {
    borderRadius: 12, paddingHorizontal: 16,
    height: 48, fontSize: 15, fontFamily: 'Inter_400Regular',
    borderWidth: 1,
  },
  textArea: { height: 80, paddingTop: 14 },
  textAreaLarge: { height: 100, paddingTop: 14 },

  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  typeCard: {
    alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 14, paddingHorizontal: 16, borderRadius: 14,
    borderWidth: 1.5, minWidth: 90,
  },
  typeCardText: { fontSize: 12 },

  horizontalChips: { gap: 8, paddingRight: 8 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 22,
    borderWidth: 1,
  },
  chipText: { fontSize: 13, fontFamily: 'Inter_500Medium' },

  counterGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  counterBox: {
    flex: 1, minWidth: '45%', borderRadius: 14,
    padding: 14, borderWidth: 1, alignItems: 'center', gap: 8,
  },
  counterLabel: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  counterRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  counterBtn: {
    width: 34, height: 34, borderRadius: 17,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1.5,
  },
  counterValue: { fontSize: 20, fontFamily: 'Inter_700Bold', minWidth: 24, textAlign: 'center' as const },

  amenitiesGrid: { gap: 8 },
  toggleItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 14, paddingVertical: 12, borderRadius: 12,
    borderWidth: 1,
  },
  toggleLabel: { flex: 1, fontSize: 14, fontFamily: 'Inter_500Medium' },

  uploadCard: {
    alignItems: 'center', paddingVertical: 28, paddingHorizontal: 20,
    borderWidth: 2, borderStyle: 'dashed',
    borderRadius: 16, gap: 10,
  },
  uploadIconCircle: {
    width: 56, height: 56, borderRadius: 28,
    alignItems: 'center', justifyContent: 'center',
  },
  uploadTitle: { fontSize: 16, fontFamily: 'Inter_600SemiBold' },
  uploadSubtitle: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  uploadButton: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 20, paddingVertical: 10, borderRadius: 22, marginTop: 4,
  },
  uploadButtonText: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: '#FFFFFF' },

  tipBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    borderRadius: 12, padding: 14,
    borderWidth: 1,
  },
  tipTitle: { fontSize: 13, fontFamily: 'Inter_600SemiBold', marginBottom: 2 },
  tipText: { fontSize: 12, fontFamily: 'Inter_400Regular', lineHeight: 18 },

  priceCard: { borderRadius: 16, padding: 16, gap: 16, borderWidth: 1 },
  priceInputRow: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 12, borderWidth: 1, height: 48,
  },
  priceCurrency: { fontSize: 18, fontFamily: 'Inter_700Bold', paddingHorizontal: 14 },
  priceInput: { flex: 1, fontSize: 16, fontFamily: 'Inter_600SemiBold', height: 48 },
  priceUnit: { fontSize: 13, fontFamily: 'Inter_400Regular', paddingRight: 14 },

  switchRow: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 14, padding: 16, borderWidth: 1,
  },
  switchLabel: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  switchDesc: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },

  summaryCard: {
    borderRadius: 14, padding: 16,
    borderWidth: 1,
  },
  summaryTitle: { fontSize: 14, fontFamily: 'Inter_600SemiBold', marginBottom: 10 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  summaryLabel: { fontSize: 14, fontFamily: 'Inter_400Regular' },
  summaryValue: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', gap: 12, paddingHorizontal: 20, paddingTop: 12,
    borderTopWidth: 0.5,
  },
  prevBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4,
    paddingHorizontal: 18, height: 48, borderRadius: 24,
  },
  prevBtnText: { fontSize: 14, fontFamily: 'Inter_500Medium' },
  nextBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    height: 48, borderRadius: 24,
  },
  nextBtnText: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: '#FFFFFF' },
});
