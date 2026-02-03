import React from 'react';
import { useParams } from 'react-router-dom';

const ArtistDetail: React.FC = () => {
  const { id } = useParams();
  return <div>Artist Detail: {id}</div>;
};

export default ArtistDetail;
