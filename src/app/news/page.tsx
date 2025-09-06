"use client";

import { Card } from "@/components/ui/card";
import { FacebookCard } from "@/components/ui/FacebookCard";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  FacebookPost,
  getFacebookPostsInQuantity,
} from "@/usecases/facebookPosts";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NewsPage() {
  const { t } = useLanguage();

  const [noMorePosts, setNoMorePosts] = useState<boolean>(false);
  const [facebookPosts, setFacebookPosts] = useState<FacebookPost[]>([]);
  const [loading, setLoading] = useState(false);
  const postsPerPage = 5;

  const loadPosts = async (isInitial: boolean = false) => {
    setLoading(true);
    try {
      const posts = await getFacebookPostsInQuantity(postsPerPage);
      if (isInitial) {
        setFacebookPosts(posts);
      } else {
        setFacebookPosts((prevPosts) => [...prevPosts, ...posts]);
      }

      if (posts.length != postsPerPage) {
        setNoMorePosts(true);
      }
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts(true);
  }, []);

  const handleShowMore = () => {
    loadPosts();
  };

  return (
    <div className="min-h-screen">
      <section className="border-b border-[#262626] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-amber-400">
            {t.home.latestNews}
          </h1>
          <p className="text-xl text-gray-200">
            Śledź najnowsze informacje o wydarzeniu Wtyczka 2025
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              href="https://facebook.com/wtyczka.eeia"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-7 py-3 rounded-xl font-bold tracking-wider uppercase transition-all western-btn bg-[#1877F2] hover:bg-[#145db2] text-white shadow-lg border-2 border-[#145db2] focus:outline-none focus:ring-2 focus:ring-[#1877F2] focus:ring-offset-2"
              style={{ fontFamily: 'var(--font-rye), fantasy, serif', boxShadow: '0 4px 16px rgba(24, 119, 242, 0.25)' }}
            >
              <ExternalLink className="h-5 w-5" />
              <span>Obserwuj nas na Facebooku</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="site-container flex flex-col mt-12">
          <div className="readable-width flex flex-col gap-8">
            {facebookPosts.map((post, index) => (
              <FacebookCard key={index} {...post} />
            ))}
            {!noMorePosts && (
              <Card className="items-center justify-center inline-flex card-hover mb-12 shadow-xl">
                <div
                  className={`p-6 w-full text-center cursor-pointer ${
                    loading ? " text-muted-foreground" : "text-foreground"
                  }`}
                  onClick={handleShowMore}
                >
                  {loading ? "Ładuję..." : "Pokaż więcej"}
                </div>
              </Card>
            )}
            {noMorePosts && facebookPosts.length > 0 && (
              <Card className="items-center justify-center inline-flex  mb-12 shadow-xl">
                <div className="p-6 text-muted-foreground">
                  To już wszystkie aktualności!
                </div>
              </Card>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#18181b] border-t border-[#262626]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-amber-400 mb-4">
            Nie przegap żadnych aktualności!
          </h2>
          <p className="text-gray-200 mb-8">
            Obserwuj naszą stronę na Facebooku, aby być na bieżąco z wszystkimi
            informacjami dotyczącymi Wtyczki 2025.
          </p>
          <Link
            href="https://www.facebook.com/wtyczka.eeia"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-8 py-3 rounded-xl font-bold tracking-wider uppercase transition-all western-btn bg-[#1877F2] hover:bg-[#145db2] text-white shadow-lg border-2 border-[#145db2] focus:outline-none focus:ring-2 focus:ring-[#1877F2] focus:ring-offset-2"
            style={{ fontFamily: 'var(--font-rye), fantasy, serif', boxShadow: '0 4px 16px rgba(24, 119, 242, 0.25)' }}
          >
            <ExternalLink className="h-5 w-5" />
            <span>Odwiedź naszego Facebooka</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

