import * as React from 'react';
import {
  Card,
  StyledBody,
  StyledThumbnail,
} from 'baseui/card';
import { StyledLink } from "baseui/link";

export default function BookPreviewCard(book) {
  return (
    <div>
    <Card
    overrides={{Root: {style: {width: '300px'}}}}
    // headerImage={book.imageUrl}
    title={book.bookTitleBare}
    >
    <StyledThumbnail
    overrides={{Root: {style: {height: '100%'}}}}
      src={book.imageUrl}
    />
    <StyledBody>
      <div> ⭐ {book.avgRating}; {book.ratingsCount.toLocaleString()}</div>
      { book.author &&
        <div>{book.author.name}</div>
      }
      <div dangerouslySetInnerHTML={{ __html: "<br/>" }}/>
      { book.description &&
        <div dangerouslySetInnerHTML={{ __html: book.description.html}} />
      }
    </StyledBody>
    <StyledLink href={"https://goodreads.com" + book.bookUrl}>GoodReads</StyledLink>
    {book.kcrPreviewUrl &&
    <StyledLink href={book.kcrPreviewUrl}>, Amazon</StyledLink>
    }
  </Card>
    </div>
  );
}
