import NewsFeed from "@/components/feed";

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

  //const response = await fetch(url);
  //const newsArticles: NewsArticle[] = await response.json();

  return (
    <main className="relative h-screen bg-transparent">
      <NewsFeed newsArticles={newsArticles} />
    </main>
  );
}