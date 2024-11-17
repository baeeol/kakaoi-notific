class KakaoRequestUtil {
  static getSecureImageUrlArray(imageParams: string) {
    return JSON.parse(imageParams).secureUrls.slice(5, -1).split(", ");
  }
}

export default KakaoRequestUtil;
