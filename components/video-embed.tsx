const ALLOWED_HOSTS = new Set([
  "www.youtube.com",
  "youtube.com",
  "youtu.be",
  "www.youtube-nocookie.com",
  "player.vimeo.com",
  "vimeo.com",
]);

function toEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();

    if (!ALLOWED_HOSTS.has(host)) {
      return null;
    }

    if (host === "youtu.be") {
      const id = parsed.pathname.replace(/^\//, "");
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }

    if (host.includes("youtube")) {
      const id = parsed.searchParams.get("v") ?? parsed.pathname.split("/").pop();
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }

    if (host.includes("vimeo")) {
      const id = parsed.pathname.replace(/^\//, "").split("/").filter(Boolean).pop();
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }

    return null;
  } catch {
    return null;
  }
}

type VideoEmbedProps = {
  url: string;
  title: string;
};

export function VideoEmbed({ url, title }: VideoEmbedProps) {
  const embedUrl = toEmbedUrl(url);
  if (!embedUrl) {
    return null;
  }

  return (
    <div className="video-embed relative aspect-video w-full overflow-hidden border border-[var(--home-stat-red)]/40 bg-black">
      <iframe
        src={embedUrl}
        title={`${title} video`}
        className="absolute inset-0 h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}
