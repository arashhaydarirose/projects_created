export function getDisplayMedia(constraints: DisplayMediaStreamConstraints): Promise<MediaStream> {
  if (navigator.mediaDevices && 'getDisplayMedia' in navigator.mediaDevices) {
    return (navigator.mediaDevices as any).getDisplayMedia(constraints);
  } else if ((navigator as any).getDisplayMedia) {
    return (navigator as any).getDisplayMedia(constraints);
  } else {
    throw new Error('getDisplayMedia is not supported in this browser');
  }
}