import * as React from 'react';
import {useStyletron} from 'baseui';
import {Grid, Cell, BEHAVIOR} from 'baseui/layout-grid';
import BookPreviewCard from './BookPreviewCard';

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

export default function BookPreview(book) {
  return (
      <Outer>
      <Grid behavior={BEHAVIOR.fluid}>
        <Cell span={12}>
          <Inner>
            {BookPreviewCard(book)}
            </Inner>
          </Cell>
        </Grid>
      </Outer>
  );
}
