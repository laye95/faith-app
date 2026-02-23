import NetInfo, { type NetInfoState } from '@react-native-community/netinfo';
import { useEffect, useMemo, useState } from 'react';
import { useVideoSetting, type VideoQualityPreference } from './useVideoSetting';

export interface VideoQualityOptions {
  maxWidth?: number;
  preferHls?: boolean;
}

const WIFI_TARGET = 1280;
const CELLULAR_TARGET = 640;
const SLOW_TARGET = 480;

function getOptionsForPreference(pref: VideoQualityPreference): VideoQualityOptions {
  switch (pref) {
    case 'high':
      return { maxWidth: WIFI_TARGET, preferHls: false };
    case 'medium':
      return { maxWidth: CELLULAR_TARGET, preferHls: false };
    case 'low':
      return { maxWidth: SLOW_TARGET, preferHls: false };
    case 'data_saver':
      return { maxWidth: SLOW_TARGET, preferHls: false };
    default:
      return {};
  }
}

function getOptionsFromNetwork(state: NetInfoState): VideoQualityOptions {
  const type = state.type;
  const effectiveType = (state.details as { effectiveType?: string })?.effectiveType;

  if (type === 'wifi') {
    return { maxWidth: WIFI_TARGET, preferHls: true };
  }
  if (type === 'cellular' || type === 'unknown') {
    if (effectiveType === '2g' || effectiveType === 'slow-2g') {
      return { maxWidth: SLOW_TARGET, preferHls: true };
    }
    if (effectiveType === '3g') {
      return { maxWidth: SLOW_TARGET, preferHls: true };
    }
    return { maxWidth: CELLULAR_TARGET, preferHls: true };
  }
  return { maxWidth: CELLULAR_TARGET, preferHls: true };
}

export function useNetworkQuality(): VideoQualityOptions {
  const [qualityPref] = useVideoSetting();
  const [networkOptions, setNetworkOptions] = useState<VideoQualityOptions>(() => ({}));

  useEffect(() => {
    const update = (state: NetInfoState) => {
      setNetworkOptions(getOptionsFromNetwork(state));
    };

    const unsub = NetInfo.addEventListener(update);
    NetInfo.fetch().then(update);
    return () => unsub();
  }, []);

  return useMemo(() => {
    if (qualityPref === 'auto') {
      return networkOptions;
    }
    return getOptionsForPreference(qualityPref);
  }, [qualityPref, networkOptions]);
}
