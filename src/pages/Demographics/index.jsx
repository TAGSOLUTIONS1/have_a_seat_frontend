import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/authContext/AuthProvider';
import { useToast } from '@/components/ui/use-toast';
import { Base_Url } from '@/baseUrl';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  Heart,
  Sparkles,
  Calendar,
  Plus,
  Trash2,
  Save,
  X,
  Loader2,
  Gift,
  User,
  Users,
  Cake,
  Edit3,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const PRESET_EVENTS = [
  { title: 'Anniversary', icon: Heart, color: '#FF6B9D' },
  { title: "Valentine's Day", icon: Heart, color: '#FF6B9D' },
  { title: 'New Year', icon: Sparkles, color: '#FFD93D' },
  { title: 'Christmas', icon: Sparkles, color: '#4ECDC4' },
  { title: 'Thanksgiving', icon: Heart, color: '#FF9800' },
  { title: "Mother's Day", icon: Heart, color: '#E91E63' },
  { title: "Father's Day", icon: Heart, color: '#2196F3' },
  { title: 'Friendship Day', icon: Heart, color: '#9C27B0' },
  { title: 'First Date Anniversary', icon: Sparkles, color: '#FF5722' },
];

// Modern Key Date Card Component
const KeyDateCard = React.memo(({ gradient, Icon, title, subtitle, date, onPress, iconColor, empty = false }) => {
  const formatDate = (d) => {
    if (!d) return 'Select date';
    try {
      const dateObj = new Date(d);
      return dateObj.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } catch {
      return 'Select date';
    }
  };

  return (
    <Card 
      className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 overflow-hidden"
      onClick={onPress}
    >
      <div 
        className="relative h-full min-h-[200px] p-6 flex flex-col justify-between"
        style={{
          background: empty 
            ? 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
            : `linear-gradient(135deg, ${gradient[0]} 0%, ${gradient[1]} 100%)`,
        }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center backdrop-blur-sm ${
            empty ? 'bg-gray-200/50' : 'bg-white/20'
          }`}>
            <Icon size={28} color={empty ? '#6c757d' : (iconColor || '#FFFFFF')} />
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPress();
            }}
            className={`p-2 rounded-lg transition-colors ${
              empty 
                ? 'bg-gray-200/50 hover:bg-gray-300/50' 
                : 'bg-white/20 hover:bg-white/30'
            }`}
          >
            <Edit3 size={16} color={empty ? '#6c757d' : '#FFFFFF'} />
          </button>
        </div>
        
        <div className="space-y-2">
          <h3 className={`font-bold text-xl ${empty ? 'text-gray-600' : 'text-white'}`}>
            {title}
          </h3>
          {subtitle && (
            <p className={`text-sm ${empty ? 'text-gray-500' : 'text-white/80'}`}>
              {subtitle}
            </p>
          )}
          <div className="flex items-center gap-2 mt-4">
            <Calendar 
              size={18} 
              color={empty ? '#6c757d' : '#FFFFFF'} 
              className="opacity-80"
            />
            <span className={`font-semibold ${empty ? 'text-gray-600' : 'text-white'}`}>
              {formatDate(date)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
});

KeyDateCard.displayName = 'KeyDateCard';

// Modern Birthday Item Component
const BirthdayItem = React.memo(({ item, index, onUpdateName, onOpenDatePicker, onRemove, formatDate }) => (
  <Card className="hover:shadow-md transition-all duration-200 border border-gray-100">
    <CardContent className="p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center flex-shrink-0">
          <Cake size={18} className="text-white" />
        </div>
        <Input
          type="text"
          placeholder="Enter name"
          value={item.name || ''}
          onChange={(e) => onUpdateName(e.target.value)}
          className="flex-1 border-gray-200 focus:border-plum"
        />
        <Button
          variant="outline"
          onClick={onOpenDatePicker}
          className="flex items-center gap-2 border-gray-200 hover:bg-plum hover:text-white hover:border-plum transition-colors"
        >
          <Calendar size={16} />
          <span className="text-sm font-medium">{formatDate(item.date)}</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <Trash2 size={18} />
        </Button>
      </div>
    </CardContent>
  </Card>
));

BirthdayItem.displayName = 'BirthdayItem';

// Modern Special Event Item Component
const SpecialEventItem = React.memo(({ item, index, onUpdateTitle, onOpenDatePicker, onRemove, formatDate }) => (
  <Card className="hover:shadow-md transition-all duration-200 border border-gray-100">
    <CardContent className="p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center flex-shrink-0">
          <Sparkles size={18} className="text-white" />
        </div>
        <Input
          type="text"
          placeholder="Event name"
          value={item.title || ''}
          onChange={(e) => onUpdateTitle(e.target.value)}
          className="flex-1 border-gray-200 focus:border-plum"
        />
        <Button
          variant="outline"
          onClick={onOpenDatePicker}
          className="flex items-center gap-2 border-gray-200 hover:bg-plum hover:text-white hover:border-plum transition-colors"
        >
          <Calendar size={16} />
          <span className="text-sm font-medium">{formatDate(item.date)}</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <Trash2 size={18} />
        </Button>
      </div>
    </CardContent>
  </Card>
));

SpecialEventItem.displayName = 'SpecialEventItem';

const Demographics = () => {
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview'); // 'overview', 'birthdays', 'events'
  const [saving, setSaving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { authState } = useAuth();
  const { toast } = useToast();

  const [spouseBirthday, setSpouseBirthday] = useState(null);
  const [myBirthday, setMyBirthday] = useState(null);
  const [anniversary, setAnniversary] = useState(null);
  const [familyBirthdays, setFamilyBirthdays] = useState([]);
  const [specialDays, setSpecialDays] = useState([]);

  const [datePicker, setDatePicker] = useState({ visible: false, target: null, selectedDate: null });

  useEffect(() => {
    const load = async () => {
      if (!authState?.accessToken) {
        setLoading(false);
        return;
      }

      try {
        const data = await loadImportantDates();
        if (data) {
          setSpouseBirthday(data.spouseBirthday ? new Date(data.spouseBirthday) : null);
          setMyBirthday(data.myBirthday ? new Date(data.myBirthday) : null);
          setAnniversary(data.anniversary ? new Date(data.anniversary) : null);
          setFamilyBirthdays((data.familyBirthdays || []).map(it => ({ ...it, date: it.date ? new Date(it.date) : null })));
          setSpecialDays((data.specialDays || []).map(it => ({ ...it, date: it.date ? new Date(it.date) : null, category: it.category || 'Other' })));
        }
      } catch (e) {
        console.error('Error loading demographics:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [authState?.accessToken]);

  async function saveImportantDates(payload) {
    const serverPayload = {
      my_birthday: payload.myBirthday || null,
      spouse_birthday: payload.spouseBirthday || null,
      anniversary: payload.anniversary || null,
      birthdays: Array.isArray(payload.familyBirthdays) ? payload.familyBirthdays.map(it => ({
        name: it.name || '',
        date: it.date || null,
      })) : [],
      special_events: Array.isArray(payload.specialDays) ? payload.specialDays.map(it => ({
        title: it.title || '',
        date: it.date || null,
        category: it.category || 'Other',
      })) : [],
    };

    const res = await fetch(`${Base_Url}/api/v1/user/important-dates`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authState?.accessToken}`,
      },
      body: JSON.stringify(serverPayload),
    });
    if (!res.ok) throw new Error('Failed saving important dates');
    return res.json();
  }

  async function loadImportantDates() {
    const res = await fetch(`${Base_Url}/api/v1/user/important-dates`, {
      headers: { 'Authorization': `Bearer ${authState?.accessToken}` },
    });
    if (!res.ok) throw new Error('Failed loading important dates');
    const data = await res.json();
    return {
      myBirthday: data.my_birthday || null,
      spouseBirthday: data.spouse_birthday || null,
      anniversary: data.anniversary || null,
      familyBirthdays: Array.isArray(data.birthdays) ? data.birthdays.map(it => ({ name: it.name || '', date: it.date || null })) : [],
      specialDays: Array.isArray(data.special_events) ? data.special_events.map(it => ({ title: it.title || '', date: it.date || null, category: it.category || 'Other' })) : [],
    };
  }

  const formatDateOnly = useCallback((value) => {
    if (!value) return null;
    try {
      const d = value instanceof Date ? value : new Date(value);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch {
      if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
      return null;
    }
  }, []);

  const buildPayload = useCallback(() => ({
    spouseBirthday: formatDateOnly(spouseBirthday),
    myBirthday: formatDateOnly(myBirthday),
    anniversary: formatDateOnly(anniversary),
    familyBirthdays: (familyBirthdays || []).map(it => ({
      name: it.name || '',
      date: formatDateOnly(it.date),
    })),
    specialDays: (specialDays || []).map(it => ({
      title: it.title || '',
      date: formatDateOnly(it.date),
      category: it.category || 'Other',
    })),
  }), [spouseBirthday, myBirthday, anniversary, familyBirthdays, specialDays, formatDateOnly]);

  const onSave = useCallback(async () => {
    if (!authState?.accessToken) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to save demographics',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSaving(true);
      const payload = buildPayload();
      await saveImportantDates(payload);
      toast({
        title: 'Saved',
        description: 'Important dates updated',
      });
    } catch (e) {
      toast({
        title: 'Save failed',
        description: e.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  }, [buildPayload, authState?.accessToken, toast]);

  const onClearAll = useCallback(async () => {
    if (!authState?.accessToken) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to delete demographics',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSpouseBirthday(null);
      setMyBirthday(null);
      setAnniversary(null);
      setFamilyBirthdays([]);
      setSpecialDays([]);
      setSaving(true);
      await saveImportantDates({
        spouseBirthday: null,
        myBirthday: null,
        anniversary: null,
        familyBirthdays: [],
        specialDays: [],
      });
      setShowDeleteDialog(false);
      toast({
        title: 'Cleared',
        description: 'All demographics removed',
      });
    } catch (e) {
      toast({
        title: 'Clear failed',
        description: e.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  }, [authState?.accessToken, toast]);

  const openDatePicker = useCallback((target, currentDate = null) => {
    setDatePicker({ visible: true, target, selectedDate: currentDate });
  }, []);

  const closeDatePicker = useCallback(() => {
    setDatePicker({ visible: false, target: null, selectedDate: null });
  }, []);

  const onDatePicked = useCallback((date) => {
    if (!datePicker.target || !date) return closeDatePicker();
    
    const d = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
    switch (datePicker.target) {
      case 'spouse':
        setSpouseBirthday(d);
        break;
      case 'me':
        setMyBirthday(d);
        break;
      case 'anniversary':
        setAnniversary(d);
        break;
      default: {
        const [kind, idxStr] = datePicker.target.split(':');
        const idx = Number(idxStr);
        if (kind === 'family') {
          setFamilyBirthdays(prev => {
            const newList = [...prev];
            newList[idx] = { ...newList[idx], date: d };
            return newList;
          });
        } else if (kind === 'special') {
          setSpecialDays(prev => {
            const newList = [...prev];
            newList[idx] = { ...newList[idx], date: d };
            return newList;
          });
        }
      }
    }
    closeDatePicker();
  }, [datePicker.target, closeDatePicker]);

  const addFamilyBirthday = useCallback(() => {
    setFamilyBirthdays(prev => [...prev, { name: '', date: null }]);
  }, []);

  const removeFamilyBirthday = useCallback((index) => {
    setFamilyBirthdays(prev => prev.filter((_, i) => i !== index));
  }, []);

  const createUpdateFamilyName = useCallback((index) => {
    return (name) => {
      setFamilyBirthdays(prev => {
        const newList = [...prev];
        newList[index] = { ...newList[index], name };
        return newList;
      });
    };
  }, []);

  const addSpecial = useCallback(() => {
    setSpecialDays(prev => [...prev, { title: '', date: null, category: 'Other' }]);
  }, []);

  const removeSpecial = useCallback((index) => {
    setSpecialDays(prev => prev.filter((_, i) => i !== index));
  }, []);

  const createUpdateSpecialTitle = useCallback((index) => {
    return (title) => {
      setSpecialDays(prev => {
        const newList = [...prev];
        newList[index] = { ...newList[index], title };
        return newList;
      });
    };
  }, []);

  const addPresetSpecial = useCallback((title) => {
    if (title === 'Anniversary' && anniversary) {
      setSpecialDays(prev => [...prev, { title, date: anniversary, category: 'Anniversary' }]);
    } else {
      setSpecialDays(prev => [...prev, { title, date: null, category: 'Holiday' }]);
    }
  }, [anniversary]);

  const addPresetBirthday = useCallback(() => {
    if (spouseBirthday) {
      setFamilyBirthdays(prev => [...prev, { name: 'Spouse', date: spouseBirthday }]);
    } else {
      setFamilyBirthdays(prev => [...prev, { name: 'Spouse', date: null }]);
    }
  }, [spouseBirthday]);


  const formatDate = useCallback((d) => {
    if (!d) return 'Not set';
    try {
      const dateObj = new Date(d);
      return dateObj.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } catch {
      return 'Not set';
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-plum animate-spin" />
      </div>
    );
  }

  if (!authState?.accessToken) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Please log in to view your demographics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Demographics</h1>
          <p className="text-gray-600">Manage your important dates and special occasions</p>
        </div>

        {/* Navigation Pills with Clear All */}
        <div className="flex items-center gap-3 mb-8 flex-wrap">
          <div className="flex gap-2 overflow-x-auto pb-2 flex-1">
            <button
              onClick={() => setActiveSection('overview')}
              className={`px-6 py-3 rounded-full font-semibold text-sm transition-all duration-200 whitespace-nowrap ${
                activeSection === 'overview'
                  ? 'bg-gradient-to-r from-plum to-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveSection('birthdays')}
              className={`px-6 py-3 rounded-full font-semibold text-sm transition-all duration-200 whitespace-nowrap ${
                activeSection === 'birthdays'
                  ? 'bg-gradient-to-r from-plum to-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users size={16} />
                <span>Birthdays</span>
                {familyBirthdays.length > 0 && (
                  <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                    {familyBirthdays.length}
                  </span>
                )}
              </div>
            </button>
            <button
              onClick={() => setActiveSection('events')}
              className={`px-6 py-3 rounded-full font-semibold text-sm transition-all duration-200 whitespace-nowrap ${
                activeSection === 'events'
                  ? 'bg-gradient-to-r from-plum to-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sparkles size={16} />
                <span>Special Events</span>
                {specialDays.length > 0 && (
                  <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                    {specialDays.length}
                  </span>
                )}
              </div>
            </button>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowDeleteDialog(true)}
            disabled={saving}
            className="text-red-600 border-2 border-red-300 hover:bg-red-50 hover:border-red-400 font-semibold px-5 py-3 shadow-md hover:shadow-lg transition-all whitespace-nowrap"
          >
            <Trash2 size={18} className="mr-2" />
            Clear All
          </Button>
        </div>

        {/* Overview Section */}
        {activeSection === 'overview' && (
          <div className="space-y-8">
            {/* Key Dates Grid */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">Key Dates</h2>
                  <p className="text-gray-600 text-sm">Your most important dates</p>
                </div>
                <Button
                  onClick={onSave}
                  disabled={saving}
                  className="bg-gradient-to-r from-plum to-purple-600 hover:from-purple-700 hover:to-purple-700 text-white px-6 py-3 font-bold shadow-lg hover:shadow-xl transition-all"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} className="mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KeyDateCard
                  gradient={['#667eea', '#764ba2']}
                  Icon={User}
                  title="My Birthday"
                  subtitle="Your special day"
                  date={myBirthday}
                  onPress={() => openDatePicker('me', myBirthday)}
                  iconColor="#FFFFFF"
                  empty={!myBirthday}
                />
                <KeyDateCard
                  gradient={['#f093fb', '#f5576c']}
                  Icon={Heart}
                  title="Spouse Birthday"
                  subtitle="Their special day"
                  date={spouseBirthday}
                  onPress={() => openDatePicker('spouse', spouseBirthday)}
                  iconColor="#FFFFFF"
                  empty={!spouseBirthday}
                />
                <KeyDateCard
                  gradient={['#4facfe', '#00f2fe']}
                  Icon={Heart}
                  title="Anniversary"
                  subtitle="Your celebration"
                  date={anniversary}
                  onPress={() => openDatePicker('anniversary', anniversary)}
                  iconColor="#FFFFFF"
                  empty={!anniversary}
                />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
                        <Users size={24} className="text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Family Birthdays</CardTitle>
                        <CardDescription>Total birthdays saved</CardDescription>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-plum">{familyBirthdays.length}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    onClick={() => setActiveSection('birthdays')}
                    className="w-full"
                  >
                    Manage Birthdays
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                        <Sparkles size={24} className="text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Special Events</CardTitle>
                        <CardDescription>Holidays & occasions</CardDescription>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-plum">{specialDays.length}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    onClick={() => setActiveSection('events')}
                    className="w-full"
                  >
                    Manage Events
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Birthdays Section */}
        {activeSection === 'birthdays' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Family & Friends Birthdays</h2>
                <p className="text-gray-600 text-sm">Keep track of all important birthdays</p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={onSave}
                  disabled={saving}
                  className="bg-gradient-to-r from-plum to-purple-600 hover:from-purple-700 hover:to-purple-700 text-white px-6 py-3 font-bold shadow-lg hover:shadow-xl transition-all"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} className="mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button
                  onClick={addFamilyBirthday}
                  className="bg-gradient-to-r from-plum to-purple-600 hover:from-purple-700 hover:to-purple-700"
                >
                  <Plus size={18} className="mr-2" />
                  Add Birthday
                </Button>
              </div>
            </div>

            {/* Quick Add */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-base">Quick Add</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  <Button
                    variant="outline"
                    onClick={addPresetBirthday}
                    className="flex items-center gap-2 whitespace-nowrap"
                  >
                    <Heart size={16} className="text-pink-500" />
                    <span>Add Spouse Birthday</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Birthday List */}
            {familyBirthdays.length === 0 ? (
              <Card className="border-2 border-dashed border-gray-200">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center mb-4">
                    <Cake size={40} className="text-plum" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No birthdays yet</h3>
                  <p className="text-gray-600 text-sm mb-4 text-center">Add birthdays to keep track of special days</p>
                  <Button
                    onClick={addFamilyBirthday}
                    className="bg-gradient-to-r from-plum to-purple-600"
                  >
                    <Plus size={18} className="mr-2" />
                    Add Your First Birthday
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {familyBirthdays.map((it, idx) => (
                  <BirthdayItem
                    key={`birthday-${idx}`}
                    item={it}
                    index={idx}
                    onUpdateName={createUpdateFamilyName(idx)}
                    onOpenDatePicker={() => openDatePicker(`family:${idx}`, it.date)}
                    onRemove={() => removeFamilyBirthday(idx)}
                    formatDate={formatDate}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Special Events Section */}
        {activeSection === 'events' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Special Events & Holidays</h2>
                <p className="text-gray-600 text-sm">Celebrate all your special occasions</p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={onSave}
                  disabled={saving}
                  className="bg-gradient-to-r from-plum to-purple-600 hover:from-purple-700 hover:to-purple-700 text-white px-6 py-3 font-bold shadow-lg hover:shadow-xl transition-all"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} className="mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button
                  onClick={addSpecial}
                  className="bg-gradient-to-r from-plum to-purple-600 hover:from-purple-700 hover:to-purple-700"
                >
                  <Plus size={18} className="mr-2" />
                  Add Event
                </Button>
              </div>
            </div>

            {/* Quick Add Presets */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-base">Quick Add Presets</CardTitle>
                <CardDescription>Tap to add popular events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3 flex-wrap">
                  {PRESET_EVENTS.map((p, i) => {
                    const IconComponent = p.icon;
                    return (
                      <Button
                        key={i}
                        variant="outline"
                        onClick={() => addPresetSpecial(p.title)}
                        className="flex items-center gap-2"
                        style={{ borderColor: p.color }}
                      >
                        <IconComponent size={16} style={{ color: p.color }} />
                        <span>{p.title}</span>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Events List */}
            {specialDays.length === 0 ? (
              <Card className="border-2 border-dashed border-gray-200">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center mb-4">
                    <Sparkles size={40} className="text-plum" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No events yet</h3>
                  <p className="text-gray-600 text-sm mb-4 text-center">Add special events and holidays to never miss a celebration</p>
                  <Button
                    onClick={addSpecial}
                    className="bg-gradient-to-r from-plum to-purple-600"
                  >
                    <Plus size={18} className="mr-2" />
                    Add Your First Event
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {specialDays.map((it, idx) => (
                  <SpecialEventItem
                    key={`special-${idx}`}
                    item={it}
                    index={idx}
                    onUpdateTitle={createUpdateSpecialTitle(idx)}
                    onOpenDatePicker={() => openDatePicker(`special:${idx}`, it.date)}
                    onRemove={() => removeSpecial(idx)}
                    formatDate={formatDate}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Date Picker Modal */}
      {datePicker.visible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={closeDatePicker}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Select Date</h3>
              <button
                onClick={closeDatePicker}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <DatePicker
              selected={datePicker.selectedDate ? new Date(datePicker.selectedDate) : new Date()}
              onChange={(date) => {
                if (date) {
                  onDatePicked(date);
                }
              }}
              inline
              dateFormat="yyyy-MM-dd"
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete All Dates</DialogTitle>
            <DialogDescription>
              This will remove all saved birthdays and special events. Continue?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onClearAll}
              disabled={saving}
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default Demographics;

