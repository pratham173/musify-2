import React from 'react';
import { useParams } from 'react-router-dom';

const AlbumDetail: React.FC = () => {
  const { id } = useParams();
  return <div>Album Detail: {id}</div>;
};

export default AlbumDetail;
