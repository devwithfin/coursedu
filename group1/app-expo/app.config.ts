import { ExpoConfig, ConfigContext } from 'expo/config';
import os from 'os';
import { execSync } from 'child_process';

const shouldSkipInterface = (name = '') => {
  const lower = name.toLowerCase();
  return (
    lower.includes('loopback') ||
    lower.includes('virtual') ||
    lower.includes('vmnet') ||
    lower.includes('vbox') ||
    lower.includes('veth') ||
    lower.includes('hyper-v') ||
    lower.includes('ws') ||
    lower.includes('wsl') ||
    lower.includes('bluetooth') ||
    lower.includes('tunnel')
  );
};

const getInterfacePriority = (name = '') => {
  const lower = name.toLowerCase();
  if (lower.includes('wi-fi') || lower.includes('wlan')) return 0;
  if (lower.includes('ethernet') && !lower.includes('virtual')) return 1;
  return 2;
};

const fromSystemCommand = () => {
  const commands =
    process.platform === 'win32'
      ? ['ipconfig']
      : ['ip -o -4 addr show scope global', '/sbin/ip -o -4 addr show scope global', 'ifconfig', '/sbin/ifconfig'];

  for (const command of commands) {
    try {
      const output = execSync(command, { encoding: 'utf8' });
      const regex =
        process.platform === 'win32'
          ? /IPv4 Address[^\d]*(\d+\.\d+\.\d+\.\d+)/gi
          : /inet\s+(\d+\.\d+\.\d+\.\d+)/gi;
      let match;
      while ((match = regex.exec(output)) !== null) {
        const ip = match[1];
        if (!ip || ip.startsWith('127.') || ip.startsWith('169.254.')) continue;
        return ip;
      }
    } catch {
      continue;
    }
  }
  return null;
};

const getLocalNetworkAddress = () => {
  const networks = os.networkInterfaces();
  const candidates: { address: string; priority: number }[] = [];
  const fallback: string[] = [];

  for (const [name, details] of Object.entries(networks)) {
    if (!details) continue;
    for (const detail of details) {
      if (!detail || detail.family !== 'IPv4' || detail.internal) continue;
      if (shouldSkipInterface(name)) {
        fallback.push(detail.address);
        continue;
      }
      candidates.push({ address: detail.address, priority: getInterfacePriority(name) });
    }
  }

  if (candidates.length > 0) {
    candidates.sort((a, b) => a.priority - b.priority);
    return candidates[0].address;
  }

  return fallback[0] || fromSystemCommand();
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "myApp",
  slug: "myApp",
  version: "1.0.0",
  orientation: "portrait",
  userInterfaceStyle: "light",
  newArchEnabled: true,
  ios: {
    supportsTablet: true
  },
  android: {
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false
  },
  web: {
  },
  extra: {
    api_url_mobile: process.env.EXPO_PUBLIC_API_URL || (() => {
      const localAddress = getLocalNetworkAddress();
      return localAddress ? `http://${localAddress}:3000` : "http://localhost:3000";
    })()
  }
});
