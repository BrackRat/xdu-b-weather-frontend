/**
 * 浏览器精确定位 — 获取 GCJ-02 坐标
 *
 * WGS-84 → GCJ-02 转换（火星坐标系）
 * 中国境内使用的加密坐标系，地图服务（高德、腾讯）均使用此格式
 */

export interface GcjPosition {
  lat: number;
  lon: number;
  accuracy: number;
}

/** WGS-84 → GCJ-02 转换 */
function wgs84ToGcj02(wgsLat: number, wgsLon: number): [number, number] {
  const pi = Math.PI;
  const a = 6378245.0;
  const ee = 0.00669342162296594323;

  function transformLat(x: number, y: number): number {
    let ret =
      -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
    ret += ((20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0) / 3.0;
    ret += ((20.0 * Math.sin(y * pi) + 40.0 * Math.sin((y / 3.0) * pi)) * 2.0) / 3.0;
    ret +=
      ((160.0 * Math.sin((y / 12.0) * pi) + 320.0 * Math.sin((y * pi) / 30.0)) * 2.0) / 3.0;
    return ret;
  }

  function transformLon(x: number, y: number): number {
    let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
    ret += ((20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0) / 3.0;
    ret += ((20.0 * Math.sin(x * pi) + 40.0 * Math.sin((x / 3.0) * pi)) * 2.0) / 3.0;
    ret +=
      ((150.0 * Math.sin((x / 12.0) * pi) + 300.0 * Math.sin((x / 30.0) * pi)) * 2.0) / 3.0;
    return ret;
  }

  function outOfChina(lat: number, lon: number): boolean {
    return !(lon > 73.66 && lon < 135.05 && lat > 18.16 && lat < 53.59);
  }

  if (outOfChina(wgsLat, wgsLon)) {
    return [wgsLat, wgsLon];
  }

  let dLat = transformLat(wgsLon - 105.0, wgsLat - 35.0);
  let dLon = transformLon(wgsLon - 105.0, wgsLat - 35.0);
  const radLat = (wgsLat / 180.0) * pi;
  let magic = Math.sin(radLat);
  magic = 1 - ee * magic * magic;
  const sqrtMagic = Math.sqrt(magic);
  dLat = (dLat * 180.0) / (((a * (1 - ee)) / (magic * sqrtMagic)) * pi);
  dLon = (dLon * 180.0) / ((a / sqrtMagic) * Math.cos(radLat) * pi);

  return [wgsLat + dLat, wgsLon + dLon];
}

/** GeolocationPositionError 的错误码映射 */
const GEO_ERROR_MESSAGES: Record<number, string> = {
  1: '定位权限被拒绝，请在系统设置中允许定位',
  2: '无法获取位置，请检查网络或 GPS 是否开启',
  3: '定位超时，请稍后重试'
};

/**
 * 请求浏览器定位（GCJ-02 坐标）
 *
 * iOS 注意事项:
 * - 必须 HTTPS（iOS 强制要求，HTTP 会静默失败）
 * - enableHighAccuracy 在 WiFi 定位时可能较慢，先用普通模式，失败后降级重试
 * - timeout 设为 20s，iOS WiFi 定位经常需要更久
 */
export function requestGeolocation(): Promise<GcjPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('浏览器不支持地理定位'));
      return;
    }

    if (window.isSecureContext === false) {
      reject(new Error('需要 HTTPS 安全连接才能使用定位'));
      return;
    }

    function onSuccess(pos: GeolocationPosition) {
      const { latitude, longitude, accuracy } = pos.coords;
      const [gcjLat, gcjLon] = wgs84ToGcj02(latitude, longitude);
      resolve({ lat: gcjLat, lon: gcjLon, accuracy });
    }

    function onError(err: GeolocationPositionError) {
      const msg = GEO_ERROR_MESSAGES[err.code] ?? err.message ?? '定位失败';
      reject(new Error(msg));
    }

    // 第一次尝试：enableHighAccuracy + 20s timeout
    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 300000
    });
  });
}

/** 格式化坐标为显示字符串，如 34.2631 */
export function formatGcjCoord(val: number): string {
  return val.toFixed(4);
}
