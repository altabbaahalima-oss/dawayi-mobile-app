import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';

export default function App() {
  // حالات التنقل بين الشاشات: 'welcome' | 'settings' | 'reminder'
  const [currentScreen, setCurrentScreen] = useState('welcome');

  // بيانات الإعدادات الطوارئ والمستفيد
  const [emergencyNumber, setEmergencyNumber] = useState('');
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [beneficiaryEmail, setBeneficiaryEmail] = useState('');

  // مؤقت الطوارئ في حال عدم الاستجابة (مثلاً 30 ثانية)
  const [timer, setTimer] = useState(30);
  const [isAlertActive, setIsAlertActive] = useState(false);

  useEffect_simulate_alarm: {
    // محاكاة بدء عداد التذكير عند الانتقال لشاشة التذكير
    if (currentScreen === 'reminder') {
      setIsAlertActive(true);
      setTimer(30);
    }
  }

  useEffect(() => {
    let interval = null;
    if (currentScreen === 'reminder' && isAlertActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && isAlertActive) {
      // هنا يتم تنفيذ الاتصال التلقائي برقم الطوارئ
      alert(`تنبيه: لم يتم الرد! يتم الآن الاتصال تلقائياً برقم الطوارئ: ${emergencyNumber || 'غير محدد'}`);
      setIsAlertActive(false);
    }
    return () => clearInterval(interval);
  }, [currentScreen, isAlertActive, timer, emergencyNumber]);

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. الشاشة الأولى: الترحيب وتسجيل الدخول */}
      {currentScreen === 'welcome' && (
        <View style={styles.screenContainer}>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>تطبيق دوائي 💊</Text>
          </View>
          <Text style={styles.title}>مرحباً بك في دوائي</Text>
          <Text style={styles.subtitle}>رفيقك الأمين لتذكيرك بمواعيد أدوائك والحفاظ على سلامتك بمان وأمان.</Text>
          
          <View style={styles.card}>
            <TextInput
              style={styles.input}
              placeholder="اسم المستخدم أو البريد"
              placeholderTextColor="#9CA3AF"
            />
            <TextInput
              style={styles.input}
              placeholder="كلمة المرور"
              secureTextEntry
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => setCurrentScreen('settings')}
            >
              <Text style={styles.primaryButtonText}>تسجيل الدخول</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 2. الشاشة الثانية: إعدادات الطوارئ والتقارير اليومية */}
      {currentScreen === 'settings' && (
        <ScrollView contentContainerStyle={styles.screenContainer}>
          <Text style={styles.title}>إعدادات الطوارئ والتقارير</Text>
          <Text style={styles.subtitle}>أدخل أرقام التواصل والبريد لإرسال التقرير الصحي اليومي.</Text>

          <View style={styles.card}>
            <Text style={styles.label}>رقم الطوارئ (للاتصال التلقائي)</Text>
            <TextInput
              style={styles.input}
              placeholder="مثال: 0500000000"
              keyboardType="phone-pad"
              value={emergencyNumber}
              onChangeText={setEmergencyNumber}
              placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.label}>اسم ورقم المستفيد</Text>
            <TextInput
              style={styles.input}
              placeholder="الاسم الكريم"
              value={beneficiaryName}
              onChangeText={setBeneficiaryName}
              placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.label}>البريد الإلكتروني للتقرير اليومي</Text>
            <TextInput
              style={styles.input}
              placeholder="example@mail.com"
              keyboardType="email-address"
              value={beneficiaryEmail}
              onChangeText={setBeneficiaryEmail}
              placeholderTextColor="#9CA3AF"
            />

            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => setCurrentScreen('reminder')}
            >
              <Text style={styles.primaryButtonText}>حفظ والانتقال للتذكير (تجربة)</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* 3. الشاشة الثالثة: شاشة التذكير النشطة والاتصال التلقائي */}
      {currentScreen === 'reminder' && (
        <View style={styles.screenContainer}>
          <View style={styles.alertCard}>
            <Text style={styles.pillEmoji}>⏰</Text>
            <Text style={styles.reminderTitle}>حاضر وقت الدواء!</Text>
            <Text style={styles.reminderDesc}>يرجى تناول "حبة الضغط أو السكر" المسجلة في جدولك الآن.</Text>
            
            {isAlertActive && (
              <View style={styles.timerContainer}>
                <Text style={styles.timerText}>سيتم الاتصال بالطوارئ خلال:</Text>
                <Text style={styles.timerNumber}>{timer} ثانية</Text>
              </View>
            )}

            <TouchableOpacity 
              style={styles.successButton}
              onPress={() => {
                setIsAlertActive(false);
                alert('تم تأكيد تناول الدواء بنجاح! شكراً لك.');
                setCurrentScreen('settings');
              }}
            >
              <Text style={styles.successButtonText}>تم تناول الدواء ✓</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => setCurrentScreen('settings')}
            >
              <Text style={styles.secondaryButtonText}>العودة للإعدادات</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6', // رمادي فاتح جداً لراحة العين
  },
  screenContainer: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBadge: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  headerBadgeText: {
    color: '#374151',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
    marginTop: 12,
    textAlign: 'right',
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: '#1F2937',
    textAlign: 'right',
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: '#059669', // أخضر متناسق وجميل
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  alertCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#059669',
  },
  pillEmoji: {
    fontSize: 50,
    marginBottom: 10,
  },
  reminderTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  reminderDesc: {
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 20,
  },
  timerContainer: {
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  timerText: {
    color: '#991B1B',
    fontSize: 12,
  },
  timerNumber: {
    color: '#991B1B',
    fontSize: 20,
    fontWeight: 'bold',
  },
  successButton: {
    backgroundColor: '#059669',
    width: '100%',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  successButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    padding: 10,
  },
  secondaryButtonText: {
    color: '#6B7280',
    fontSize: 14,
  },
});
        
