import { CheckResult } from '../types';

const STORAGE_KEY = 'internshield_user_history_v1';

export function saveLocalCheck(check: CheckResult): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getLocalHistory();
    const updated = [check, ...existing.filter(c => c.id !== check.id)].slice(0, 30);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

export function getLocalHistory(): CheckResult[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to read from localStorage:', err);
    return [];
  }
}

export function deleteLocalCheck(id: string): CheckResult[] {
  if (typeof window === 'undefined') return [];
  try {
    const existing = getLocalHistory();
    const updated = existing.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to delete from localStorage:', err);
    return [];
  }
}

export function clearLocalHistory(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear localStorage:', err);
  }
}
