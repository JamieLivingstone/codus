import { getVersion } from '@tauri-apps/api/app';
import { useEffect, useState } from 'react';

export function useAppVersion() {
  const [version, setVersion] = useState('');

  useEffect(() => {
    getVersion()
      .then(setVersion)
      .catch(() => setVersion('0.0.0'));
  }, []);

  return version;
}
