import { ChatPage } from '@/src/components/chat';

interface PageProps {
  params: Promise<{ roomId: string }>;
  searchParams: Promise<{ name?: string }>;
}

export default async function Page({ params, searchParams }: PageProps) {
  const { roomId } = await params;
  const { name } = await searchParams;
  return <ChatPage roomId={roomId} roomName={name} />;
}
