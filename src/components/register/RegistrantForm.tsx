import { useState, type FormEvent } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Label, Select, Textarea } from '@/components/ui/Field';
import { FamilyAdultCard } from '@/components/register/FamilyAdultCard';
import { FamilyChildCard } from '@/components/register/FamilyChildCard';
import { LodgingToggle } from '@/components/register/LodgingToggle';
import { affiliationOptions, birthMonthOptions, bloodTypeOptions } from '@/lib/options';
import { calcAmountDue, calcTotalCount, formatCurrency } from '@/lib/calc';
import type { Affiliation, BloodType, FamilyAdult, FamilyChild, LodgingOption, RegistrationInput, Settings } from '@/types';

const emptyAdult: FamilyAdult = { name: '', birthMonth: 1, bloodType: 'A'};
const emptyChild: FamilyChild = { name: '', age: 0, schoolStatus: '미취학' };

interface Props {
  initialValue: RegistrationInput;
  settings: Pick<Settings, 'adultFee' | 'schoolAgeChildFee' | 'preschoolChildFee'>;
  submitLabel: string;
  submitting: boolean;
  onSubmit: (input: RegistrationInput) => void;
  onCancel?: () => void;
}

export function RegistrantForm({ initialValue, settings, submitLabel, submitting, onSubmit, onCancel }: Props) {
  const [name, setName] = useState(initialValue.name);
  const [affiliation, setAffiliation] = useState<Affiliation>(initialValue.affiliation);
  const [phone, setPhone] = useState(initialValue.phone);
  const [birthMonth, setBirthMonth] = useState(initialValue.birthMonth);
  const [bloodType, setBloodType] = useState<BloodType>(initialValue.bloodType);
  const [lodging, setLodging] = useState<LodgingOption>(initialValue.lodging);
  const [adults, setAdults] = useState<FamilyAdult[]>(initialValue.adults);
  const [children, setChildren] = useState<FamilyChild[]>(initialValue.children);
  const [note, setNote] = useState(initialValue.note);
  const [error, setError] = useState('');

  const totalCount = calcTotalCount(adults, children);
  const amountDue = calcAmountDue(adults, children, settings);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError('이름과 연락처를 입력해 주세요.');
      return;
    }
    setError('');
    onSubmit({
      name: name.trim(),
      affiliation,
      phone: phone.trim(),
      birthMonth,
      bloodType,
      lodging,
      adults,
      children,
      note: note.trim(),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Card className="space-y-4">
        <h2 className="text-base font-bold text-brand-800">대표자 정보</h2>
        <div>
          <Label htmlFor="name">이름</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="affiliation">소속</Label>
            <Select
              id="affiliation"
              value={affiliation}
              onChange={(e) => setAffiliation(e.target.value as Affiliation)}
            >
              {affiliationOptions.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="phone">연락처</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="010-0000-0000"
              required
            />
          </div>
          <div>
            <Label htmlFor="birthMonth">생년월</Label>
            <Select
              id="birthMonth"
              value={birthMonth}
              onChange={(e) => setBirthMonth(Number(e.target.value))}
            >
              {birthMonthOptions.map((m) => (
                <option key={m} value={m}>
                  {m}월
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="bloodType">혈액형</Label>
            <Select
              id="bloodType"
              value={bloodType}
              onChange={(e) => setBloodType(e.target.value as BloodType)}
            >
              {bloodTypeOptions.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </Select>
          </div>
          <div className="col-span-2">
            <Label htmlFor="lodging">숙박 여부</Label>
            <LodgingToggle value={lodging} onChange={setLodging} />
          </div>
        </div>
      </Card>

      <Card className="space-y-3">
        <h2 className="text-base font-bold text-brand-800">가족 구성원</h2>
        <div className="space-y-3">
          {adults.map((adult, i) => (
            <FamilyAdultCard
              key={i}
              index={i}
              value={adult}
              onChange={(next) => setAdults((prev) => prev.map((a, idx) => (idx === i ? next : a)))}
              onRemove={() => setAdults((prev) => prev.filter((_, idx) => idx !== i))}
            />
          ))}
          {children.map((child, i) => (
            <FamilyChildCard
              key={i}
              index={i}
              value={child}
              onChange={(next) => setChildren((prev) => prev.map((c, idx) => (idx === i ? next : c)))}
              onRemove={() => setChildren((prev) => prev.filter((_, idx) => idx !== i))}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setAdults((prev) => [...prev, { ...emptyAdult }])}
          >
            + 성인 추가
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setChildren((prev) => [...prev, { ...emptyChild }])}
          >
            + 자녀 추가
          </Button>
        </div>
      </Card>

      <Card>
        <Label htmlFor="note">추가 전달사항</Label>
        <Textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={'저녁에 도착합니다. / 첫날만 참석합니다. / 알레르기가 있습니다.'}
        />
      </Card>

      <Card className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">총 참가 인원 : {totalCount}명</p>
          <p className="text-lg font-bold text-brand-700">{formatCurrency(amountDue)}</p>
        </div>
      </Card>

      {error && <p className="text-center text-sm text-rose-500">{error}</p>}

      <div className="flex gap-2">
        {onCancel && (
          <Button type="button" variant="outline" className="flex-1" onClick={onCancel} disabled={submitting}>
            취소
          </Button>
        )}
        <Button type="submit" size="lg" className="flex-1" disabled={submitting}>
          {submitting ? '처리 중...' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
