import React from 'react';
import Card from 'react-bootstrap/Card';

function DrinkTags({ id, tag }) {
  return (
    <b>
      {' '}
      #
      {tag}
    </b>
  );
}

export default DrinkTags;
