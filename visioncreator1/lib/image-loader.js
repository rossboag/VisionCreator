export default function imageLoader({ src, width, quality }) {
  if (src.startsWith('https://') || src.startsWith('http://')) {
    return src
  }
  return `${process.env.CDN_URL}${src}?w=${width}&q=${quality || 75}`
}

