import * as React from 'react';
import {
  Card,
  StyledBody,
  StyledThumbnail,
} from 'baseui/card';
import { StyledLink } from "baseui/link";
import {useStyletron} from 'baseui';
import {Grid, Cell, BEHAVIOR} from 'baseui/layout-grid';

const Outer = ({children}) => {
    const [css] = useStyletron();
    return (
      <div className={css({})}>
        {children}
      </div>
    );
  };

const Inner = ({children}) => {
  const [css] = useStyletron();
  return (
    <div
        className={css({
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '.25rem',
      })}
    >
      {children}
    </div>
  );
};

export default function Recommendations(title, text) {
  return (
      <Outer>
      <Grid behavior={BEHAVIOR.fluid}>
        <Cell span={12}>
          <Inner>
            <Card
            overrides={{Root: {style: {width: '300px'}}}}
            // headerImage={book.imageUrl}
            title={title}
            >
            <StyledBody>
                {text}
            </StyledBody>
            </Card>
            </Inner>
          </Cell>
        </Grid>
      </Outer>
  );
}
