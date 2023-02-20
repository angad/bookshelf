import * as React from 'react';

import L from "leaflet";

import { MapContainer, Popup, Polygon, ImageOverlay } from "react-leaflet";
import BookPreviewCard from './BookPreviewCard';

export default function ImageMap(bookshelfImage, width, height, books) {
  function rotate(cx, cy, x, y, angle) {
    var radians = (Math.PI / 180) * angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
        ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return [nx, ny];
  }

  const divisor = 1;
  const w = width / divisor;
  const h = height / divisor;
  const wh = [h, w];
  const origin = [0, 0];
  const bounds = [origin, wh];
  const blackOptions = { color: 'red' }

  const rectangles = [];
  for (const book of books) {
    var bounding_box = []
    for(const xy of book['bounding_box']) {
      var x = xy[0] / divisor;
      var y = xy[1] / divisor;
      var k = rotate(h / 2, w / 2, x, y, 180);
      bounding_box.push(k);
    }
    rectangles.push(
      <Polygon
      key={book['bookshelf_query_full']}
      positions={bounding_box}
      pathOptions={blackOptions}>
        <Popup>
          {BookPreviewCard(book)}
        </Popup>
      </Polygon>
      );
  }

  return (
      <MapContainer
        style={{ height: "100vh", minHeight: "100vh" }}
        bounds={bounds}
        boundsOptions={{
          padding: [0, 0]
        }}
        // maxBounds={bounds}
        // zoomSnap={0}
        minZoom={-2}
        whenReady={(e) => e.target.fitBounds(bounds)}
        crs={L.CRS.Simple}
      >
        <ImageOverlay
          url={bookshelfImage}
          bounds={bounds}
        >
          {rectangles}
        </ImageOverlay>
      </MapContainer>
  );
}
