// 링크나 11자리 영상 ID면 바로 재생
export function parseVideoId(text) {
  const s = text.trim();
  if (/^[\w-]{11}$/.test(s)) return s;
  const m = s.match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/|\/live\/)([\w-]{11})/);
  return m ? m[1] : null;
}

function decode(s) {
  const t = document.createElement('textarea');
  t.innerHTML = s;
  return t.value;
}

export async function searchYouTube(query, apiKey) {
  const url = new URL('https://www.googleapis.com/youtube/v3/search');
  url.search = new URLSearchParams({
    part: 'snippet',
    type: 'video',
    maxResults: '10',
    q: query,
    key: apiKey,
    regionCode: 'KR',
  });
  const res = await fetch(url);
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.items.map((v) => ({
    id: v.id.videoId,
    title: decode(v.snippet.title),
    channel: decode(v.snippet.channelTitle),
    thumb: v.snippet.thumbnails.medium?.url || v.snippet.thumbnails.default.url,
  }));
}
