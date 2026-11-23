import type { UserProfileState } from '../types/profile';
import { generatePersonalIntelligenceProfile } from '../engine/profile/profileGenerator';

const STORAGE_KEY = 'career_pilot_profile_v1';

export const createDefaultProfile = (): UserProfileState => ({
  id: `cp-usr-${Date.now().toString(36)}`,
  version: 1,
  lastUpdated: new Date().toISOString(),
  userName: 'You',
  completionPercentage: 0,
  uncertaintyScore: 85, // High initial uncertainty until answered
  answers: {},
  intelligenceProfile: generatePersonalIntelligenceProfile({}, { userName: 'You' }),
  explodedSelf: {
    dimensionVectors: {
      interests: 0.1,
      aptitudes: 0.1,
      skills: 0.1,
      workStyle: 0.1,
      values: 0.1,
      financialLifestyle: 0.1,
      education: 0.1,
      riskTolerance: 0.1,
      ambitions: 0.1,
    },
    cognitiveVector: {
      analyticalVsIntuitive: 0,
      abstractVsConcrete: 0,
      autonomyVsStructured: 0,
      peopleVsThings: 0,
      riskTolerantVsAverse: 0,
      speedVsThoroughness: 0,
      depthVsBreadth: 0,
    },
    topInterests: [],
    skillsInventory: [],
    coreValues: [],
    workEnvironmentPreferences: {
      remotePreference: 'flexible',
      pace: 'balanced',
      teamDensity: 'small-team',
    },
    financialParameters: {
      minimumCompensationUsd: 65000,
      targetCompensationUsd: 120000,
      currency: 'USD',
    },
    riskScore: 40,
    educationLevel: 'Bachelor Degree or Equivalent',
    geographicRegion: 'Global / Remote-ready',
  },
  bookmarkedCareers: [],
  activePathwayId: undefined,
});

export const loadStoredProfile = (): UserProfileState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultProfile();
    const parsed = JSON.parse(raw);
    if (parsed && parsed.version === 1) {
      if (!parsed.intelligenceProfile) {
        parsed.intelligenceProfile = generatePersonalIntelligenceProfile(parsed.answers || {}, {
          userName: parsed.userName || 'You',
        });
      }
      return parsed;
    }
    return createDefaultProfile();
  } catch (err) {
    console.error('Failed to load stored profile, reverting to default', err);
    return createDefaultProfile();
  }
};

export const saveStoredProfile = (profile: UserProfileState): void => {
  try {
    const updated = {
      ...profile,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save profile to localStorage', err);
  }
};

export const exportProfileJson = (profile: UserProfileState): void => {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(profile, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  downloadAnchor.setAttribute('download', `career-pilot-profile-${timestamp}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};

export const importProfileJson = (jsonString: string): UserProfileState => {
  if (typeof jsonString !== 'string' || !jsonString.trim()) {
    throw new Error('Invalid JSON payload: string input required.');
  }

  // Prevent prototype pollution
  if (jsonString.includes('__proto__') || jsonString.includes('constructor') || jsonString.includes('prototype')) {
    const probe = JSON.parse(jsonString);
    delete (probe as any).__proto__;
    delete (probe as any).constructor;
    delete (probe as any).prototype;
  }

  const parsed = JSON.parse(jsonString);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Invalid Career Pilot profile schema: object payload required.');
  }

  if (!parsed.id || typeof parsed.id !== 'string') {
    throw new Error('Invalid profile schema: missing or invalid profile id.');
  }

  if (!parsed.explodedSelf || typeof parsed.explodedSelf !== 'object') {
    throw new Error('Invalid profile schema: missing explodedSelf dimensional configuration.');
  }

  // Sanitize userName
  const cleanUserName =
    typeof parsed.userName === 'string'
      ? parsed.userName.replace(/[<>]/g, '').trim().slice(0, 80) || 'You'
      : 'You';

  // Ensure answers map is valid
  const cleanAnswers =
    parsed.answers && typeof parsed.answers === 'object' && !Array.isArray(parsed.answers)
      ? parsed.answers
      : {};

  // Regenerate intelligence profile deterministically to ensure schema integrity
  const intelligenceProfile = generatePersonalIntelligenceProfile(cleanAnswers, {
    userName: cleanUserName,
    existingProfile: parsed.intelligenceProfile,
  });

  return {
    ...createDefaultProfile(),
    ...parsed,
    userName: cleanUserName,
    answers: cleanAnswers,
    intelligenceProfile,
    version: 1,
    lastUpdated: new Date().toISOString(),
  };
};

export const getStorageMetadata = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const bytesUsed = raw ? new Blob([raw]).size : 0;
    return {
      bytesUsed,
      bytesFormatted: `${(bytesUsed / 1024).toFixed(1)} KB`,
      storageKey: STORAGE_KEY,
      isEnclaveLocal: true,
      provider: 'Browser HTML5 Local Storage Enclave',
    };
  } catch {
    return {
      bytesUsed: 0,
      bytesFormatted: '0 KB',
      storageKey: STORAGE_KEY,
      isEnclaveLocal: true,
      provider: 'Browser HTML5 Local Storage Enclave',
    };
  }
};

export const purgeStoredProfile = (): UserProfileState => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to purge profile from localStorage', err);
  }
  return createDefaultProfile();
};
