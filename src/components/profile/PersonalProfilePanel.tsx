import { useMemo, useState, type FormEvent, type ReactNode } from 'react';
import {
    AtSign,
    CalendarDays,
    Check,
    FileText,
    Hash,
    LockKeyhole,
    Mail,
    Phone,
    Save,
    UserRound,
    X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import { LobbyModalButton } from '../common/LobbyModalPrimitives';

interface ProfileErrors {
    nickname?: string;
    birthday?: string;
    email?: string;
    bio?: string;
}

const BIO_MAX_LENGTH = 120;
const NICKNAME_MAX_LENGTH = 20;

const formatInputDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const PersonalProfilePanel = () => {
    const { user, updateUser } = useAuth();
    const { showToast } = useUI();
    const [nickname, setNickname] = useState(user?.name ?? '');
    const [birthday, setBirthday] = useState(user?.birthday ?? '');
    const [email, setEmail] = useState(user?.email ?? '');
    const [bio, setBio] = useState(user?.bio ?? '');
    const [errors, setErrors] = useState<ProfileErrors>({});
    const [confirmOneTimeFields, setConfirmOneTimeFields] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const latestBirthday = useMemo(() => {
        const date = new Date();
        date.setFullYear(date.getFullYear() - 18);
        return formatInputDate(date);
    }, []);
    const birthdayLocked = Boolean(user?.birthday);
    const emailLocked = Boolean(user?.email);

    if (!user) return null;

    const validate = () => {
        const nextErrors: ProfileErrors = {};
        const normalizedNickname = nickname.trim();
        const normalizedEmail = email.trim();

        if (!normalizedNickname) {
            nextErrors.nickname = '請輸入暱稱';
        } else if (normalizedNickname.length > NICKNAME_MAX_LENGTH) {
            nextErrors.nickname = `暱稱不可超過 ${NICKNAME_MAX_LENGTH} 個字元`;
        }

        if (!birthdayLocked && birthday && (birthday < '1900-01-01' || birthday > latestBirthday)) {
            nextErrors.birthday = '生日需為有效日期，且玩家須年滿 18 歲';
        }

        if (!emailLocked && normalizedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
            nextErrors.email = '請輸入有效的電子郵件格式';
        }

        if (bio.length > BIO_MAX_LENGTH) {
            nextErrors.bio = `個人簡介不可超過 ${BIO_MAX_LENGTH} 個字元`;
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const commitProfile = () => {
        setIsSaving(true);
        window.setTimeout(() => {
            updateUser({
                name: nickname.trim(),
                birthday: birthdayLocked ? user.birthday : birthday,
                email: emailLocked ? user.email : email.trim(),
                bio: bio.trim(),
            });
            setIsSaving(false);
            setConfirmOneTimeFields(false);
            showToast('個人資料已更新', 'success');
        }, 500);
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!validate()) return;

        const hasNewOneTimeValue = (!birthdayLocked && Boolean(birthday)) || (!emailLocked && Boolean(email.trim()));
        if (hasNewOneTimeValue) {
            setConfirmOneTimeFields(true);
            return;
        }

        commitProfile();
    };

    const pendingOneTimeFields = [
        !birthdayLocked && birthday ? `生日：${birthday}` : '',
        !emailLocked && email.trim() ? `電子郵件：${email.trim()}` : '',
    ].filter(Boolean);

    return (
        <form noValidate onSubmit={handleSubmit} className="relative flex h-full min-h-0 flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto pr-1 custom-scrollbar">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-[9px] font-black tracking-[0.22em] text-white/55">PERSONAL INFORMATION</p>
                        <h3 className="mt-1 text-xl font-black text-white">個人資料</h3>
                        <p className="mt-1 text-xs leading-5 text-white/58">暱稱與簡介可隨時修改；生日與電子郵件設定後不可再次變更。</p>
                    </div>
                    <span className="rounded-full border border-white/16 bg-white/8 px-3 py-1.5 text-[10px] font-black text-white/54">
                        * 為可編輯欄位
                    </span>
                </div>

                <section className="mt-4 grid grid-cols-2 gap-3">
                    <ReadOnlyField icon={<AtSign size={15} />} label="帳號" value={user.account} />
                    <ProfileTextField
                        id="profile-nickname"
                        icon={<UserRound size={15} />}
                        label="暱稱 *"
                        value={nickname}
                        onChange={setNickname}
                        error={errors.nickname}
                        maxLength={NICKNAME_MAX_LENGTH}
                    />
                    <ReadOnlyField icon={<Hash size={15} />} label="ID" value={user.id} />
                    <ProfileTextField
                        id="profile-birthday"
                        icon={<CalendarDays size={15} />}
                        label="生日 *"
                        type="date"
                        value={birthday}
                        onChange={setBirthday}
                        error={errors.birthday}
                        disabled={birthdayLocked}
                        min="1900-01-01"
                        max={latestBirthday}
                        hint={birthdayLocked ? '已設定並鎖定' : '僅能設定一次，玩家須年滿 18 歲'}
                    />
                    <ProfileTextField
                        id="profile-email"
                        icon={<Mail size={15} />}
                        label="電子郵件 *"
                        type="email"
                        value={email}
                        onChange={setEmail}
                        error={errors.email}
                        disabled={emailLocked}
                        placeholder="name@example.com"
                        hint={emailLocked ? '已設定並鎖定' : '僅能設定一次，儲存前請仔細確認'}
                    />
                    <ReadOnlyField
                        icon={<Phone size={15} />}
                        label="手機號碼"
                        value={user.phoneNumber || '尚未綁定'}
                        muted={!user.phoneNumber}
                    />
                </section>

                <label htmlFor="profile-bio" className="mt-3 block rounded-2xl border border-white/14 bg-[#263990]/24 p-4">
                    <span className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-2 text-[10px] font-black text-white/62">
                            <FileText size={15} /> 個人簡介 *
                        </span>
                        <span className={`text-[9px] font-bold ${bio.length > BIO_MAX_LENGTH ? 'text-red-200' : 'text-white/42'}`}>
                            {bio.length} / {BIO_MAX_LENGTH}
                        </span>
                    </span>
                    <textarea
                        id="profile-bio"
                        value={bio}
                        onChange={(event) => setBio(event.target.value)}
                        rows={3}
                        placeholder="介紹一下自己吧"
                        className="lobby-profile-field__input mt-2 w-full resize-none rounded-xl px-3 py-2.5 text-sm leading-5"
                    />
                    {errors.bio && <span className="mt-1.5 block text-[10px] font-bold text-red-200">{errors.bio}</span>}
                </label>
            </div>

            <div className="mt-4 flex shrink-0 items-center justify-between gap-4 border-t border-white/12 pt-4">
                <p className="max-w-[390px] text-[10px] leading-4 text-white/48">
                    生日與電子郵件如需後續更正，正式產品將由客服協助處理；原型不提供再次編輯。
                </p>
                <LobbyModalButton type="submit" disabled={isSaving} className="min-w-[150px]">
                    <Save size={15} />
                    {isSaving ? '儲存中…' : '儲存資料'}
                </LobbyModalButton>
            </div>

            {confirmOneTimeFields && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#060b2a]/72 p-4 backdrop-blur-sm">
                    <section role="alertdialog" aria-modal="true" aria-label="確認一次性資料" className="lobby-modal-dialog-card w-full max-w-[440px] p-5">
                        <button
                            type="button"
                            aria-label="取消一次性資料確認"
                            onClick={() => setConfirmOneTimeFields(false)}
                            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white"
                        >
                            <X size={17} />
                        </button>
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/12 text-white">
                            <LockKeyhole size={22} />
                        </span>
                        <h4 className="mt-4 text-lg font-black text-white">確認一次性資料</h4>
                        <p className="mt-2 text-xs leading-5 text-white/66">以下資料儲存後將無法再次修改，請確認內容正確：</p>
                        <ul className="mt-3 space-y-2">
                            {pendingOneTimeFields.map(field => (
                                <li key={field} className="flex items-center gap-2 rounded-xl border border-white/14 bg-white/9 px-3 py-2.5 text-xs font-bold text-white">
                                    <Check size={14} /> {field}
                                </li>
                            ))}
                        </ul>
                        <div className="mt-5 grid grid-cols-2 gap-3">
                            <LobbyModalButton tone="secondary" onClick={() => setConfirmOneTimeFields(false)} disabled={isSaving}>返回修改</LobbyModalButton>
                            <LobbyModalButton onClick={commitProfile} disabled={isSaving}>{isSaving ? '儲存中…' : '確認並儲存'}</LobbyModalButton>
                        </div>
                    </section>
                </div>
            )}
        </form>
    );
};

interface ProfileTextFieldProps {
    id: string;
    icon: ReactNode;
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: 'text' | 'email' | 'date';
    error?: string;
    hint?: string;
    disabled?: boolean;
    min?: string;
    max?: string;
    maxLength?: number;
    placeholder?: string;
}

const ProfileTextField = ({
    id,
    icon,
    label,
    value,
    onChange,
    type = 'text',
    error,
    hint,
    disabled,
    min,
    max,
    maxLength,
    placeholder,
}: ProfileTextFieldProps) => (
    <label htmlFor={id} className="rounded-2xl border border-white/14 bg-[#263990]/24 p-4">
        <span className="flex items-center justify-between gap-2 text-[10px] font-black text-white/62">
            <span className="flex items-center gap-2">{icon}{label}</span>
            {disabled && <LockKeyhole size={12} className="text-white/45" />}
        </span>
        <input
            id={id}
            type={type}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            disabled={disabled}
            min={min}
            max={max}
            maxLength={maxLength}
            placeholder={placeholder}
            className="lobby-profile-field__input mt-2 h-9 w-full rounded-xl px-3 text-xs font-bold disabled:cursor-not-allowed"
        />
        {(error || hint) && <span className={`mt-1.5 block text-[9px] font-bold ${error ? 'text-red-200' : 'text-white/42'}`}>{error || hint}</span>}
    </label>
);

const ReadOnlyField = ({ icon, label, value, muted = false }: { icon: ReactNode; label: string; value: string; muted?: boolean }) => (
    <article className="rounded-2xl border border-white/10 bg-[#17266d]/22 p-4">
        <div className="flex items-center justify-between gap-2 text-[10px] font-black text-white/48">
            <span className="flex items-center gap-2">{icon}{label}</span>
            <LockKeyhole size={12} />
        </div>
        <strong className={`mt-3 block truncate text-xs ${muted ? 'text-white/38' : 'text-white/72'}`}>{value}</strong>
    </article>
);

export default PersonalProfilePanel;
