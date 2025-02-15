import NewsFeed from "@/components/feed";
import { cookies } from "next/headers";
import { getTopNewsUrl } from "@/modules/utils";

export type NewsArticle = {
  id: string;
  publishedDate: string;
  title: string;
  url: string;
  text: string;
  summary: string;
  image?: string;
  favicon: string;
}

export default async function Home() {
  const cookieStore = await cookies();
  const followedTopics = cookieStore.get("followedTopics")?.value;
  const categories = followedTopics && JSON.parse(followedTopics).join(',').toLowerCase();

  const url = getTopNewsUrl(categories);
  const response = await fetch(url);
  const newsArticles: NewsArticle[] = await response.json();

  return (
    <main className="relative h-screen bg-transparent">
      <NewsFeed newsArticles={newsArticles} />
    </main>
  );
}