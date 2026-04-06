import { useState } from 'react';

import { File } from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { useQueryClient } from '@tanstack/react-query';

import { supabase } from '@/services/supabase/client';
import { userService } from '@/services/api/userService';
import { queryKeys } from '@/services/queryKeys';
import { useToast } from '@/hooks/useToast';
import { useTranslation } from '@/hooks/useTranslation';

export function useAvatarUpload(userId: string | undefined) {
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();
  const toast = useToast();
  const { t } = useTranslation();

  const pickAndUpload = async () => {
    if (!userId) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (result.canceled) return;

    const asset = result.assets[0];
    const mimeType = asset.mimeType ?? 'image/jpeg';
    const filePath = `${userId}/avatar.jpg`;

    setIsUploading(true);
    try {
      // The new expo-file-system File class implements the Blob interface,
      // so we can read its content as an ArrayBuffer and upload directly.
      const file = new File(asset.uri);
      const buffer = await file.arrayBuffer();

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, buffer, { contentType: mimeType, upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const urlWithCacheBuster = `${data.publicUrl}?t=${Date.now()}`;

      await userService.updateAvatarUrl(userId, urlWithCacheBuster);

      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(userId) });
    } catch (err) {
      console.error('[useAvatarUpload] Upload failed:', err);
      toast.error(t('profile.avatarUpdateFailed'));
    } finally {
      setIsUploading(false);
    }
  };

  return { pickAndUpload, isUploading };
}

const __expoRouterPrivateRoute_useAvatarUpload = () => null;

export default __expoRouterPrivateRoute_useAvatarUpload;
