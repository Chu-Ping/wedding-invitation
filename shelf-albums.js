import { shelfPhotoSets } from './shelf-photos.js?v=20261018-albums-68';

// Shelf item order is left to right, top to bottom. Values are source set numbers.
export const shelfAlbumSets = [
  [1], [2, 3], [4], [5, 6, 7], [8, 9], [10, 11], [12, 13], [14, 15],
  [16, 17], [18, 20], [19, 21], [22], [23], [24, 26], [25], [27], [28],
];

export const shelfPhotoAlbums = shelfAlbumSets.map(sets => sets.flatMap(number => {
  const photos = shelfPhotoSets[number - 1];
  if (!photos?.length) throw new Error(`Missing shelf photo set: ${number}`);
  return photos;
}));
