import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import FakeData from '../FakeData.json';
import DrinkEntry from './communityChildren/DrinkEntry';

unction Community() {
  const getCustomDrinks = () => {
    axios.get('/community/');
  };

  getCustomDrinks();
  return (
    <>
      <h1>Welcome to the Community Tab</h1>
      <p>
        Here you can see your New Custom Drinks, Your Current Go To, or that old
        Faithful from College
      </p>
      <Container>
        {/* <Row> */}
        <Row xs={1} sm={2} md={3} lg={4} xl={4} className="g-4">
          {FakeData.drinks.map((drink) => (
            <Col key={drink.idDrink}>
              <DrinkEntry currDrink={drink} />
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}

export default Community;
