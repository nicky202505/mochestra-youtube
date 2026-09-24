import { useCallback, useRef, useState } from 'react';
import Tabs from './components/Tabs';
import SearchPanel from './components/SearchPanel';
import FavoritesPanel from './components/FavoritesPanel';
import RecommendedPanel from './components/RecommendedPanel';
import Player from './components/Player';
import KeyDialog from './components/KeyDialog';
import { useFavorites } from './hooks/useFavorites';
import { getItem, setItem } from './lib/storage';

export default function App() {
  const [activeTab, setActiveTab] = useState('search');
  const [items, setItems] = useState([]);
  const [recommended] = useState([]); // 추천 리스트 데이터 소스는 준비 중
  const [selectedId, setSelectedId] = useState(null);
  const [apiKey, setApiKey] = useState(() => getItem('yt_api_key', ''));
  const [dialogOpen, setDialogOpen] = useState(false);

  const { favorites, isFav, toggleFavorite } = useFavorites();
  const searchPanelRef = useRef(null);

  const play = useCallback((id) => setSelectedId(id), []);

  function handleDialogClose(savedValue) {
    setDialogOpen(false);
    if (savedValue !== null) {
      setApiKey(savedValue);
      setItem('yt_api_key', savedValue);
    }
  }

  function handlePlayButtonClick() {
    if (items.length) play(items[0].id);
    else searchPanelRef.current?.focusInput();
  }

  return (
    <main className="frame">
      <Tabs active={activeTab} onChange={setActiveTab} />

      <SearchPanel
        ref={searchPanelRef}
        active={activeTab === 'search'}
        apiKey={apiKey}
        onNeedApiKey={() => setDialogOpen(true)}
        items={items}
        setItems={setItems}
        selectedId={selectedId}
        onPlay={play}
        isFav={isFav}
        onToggleFavorite={toggleFavorite}
      />
      <FavoritesPanel
        active={activeTab === 'favorites'}
        favorites={favorites}
        selectedId={selectedId}
        onPlay={play}
      />
      <RecommendedPanel
        active={activeTab === 'recommended'}
        recommended={recommended}
        selectedId={selectedId}
        onPlay={play}
      />

      <Player videoId={selectedId} onPlayClick={handlePlayButtonClick} />

      <p className="hint">
        검색어 또는 YouTube 링크를 입력하세요 ·{' '}
        <a onClick={() => setDialogOpen(true)}>API 키 설정</a>
      </p>

      <KeyDialog open={dialogOpen} initialValue={apiKey} onClose={handleDialogClose} />
    </main>
  );
}
