import React from 'react';
import { useParams } from 'react-router-dom';

const PlaylistDetail: React.FC = () => {
  const { id } = useParams();
  return <div>Playlist Detail: {id}</div>;
};

export default PlaylistDetail;
