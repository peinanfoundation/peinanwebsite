import Image from "next/image";
import { parseNewsContent } from "@/lib/news-content";

type NewsContentProps = {
  content: string;
  imageAlt?: string;
};

export default function NewsContent({ content, imageAlt = "" }: NewsContentProps) {
  const blocks = parseNewsContent(content);

  if (blocks.length === 0) {
    return null;
  }

  return (
    <>
      {blocks.map((block, index) => {
        if (block.type === "image") {
          return (
            <div
              key={`image-${index}`}
              className="relative aspect-[980/650] overflow-hidden rounded-2xl shadow-md"
            >
              <Image
                src={block.url}
                alt={imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 780px) 100vw, 780px"
              />
            </div>
          );
        }

        return block.text
          .split(/\n{2,}/)
          .filter(Boolean)
          .map((paragraph, paragraphIndex) => (
            <p key={`text-${index}-${paragraphIndex}`}>{paragraph}</p>
          ));
      })}
    </>
  );
}
