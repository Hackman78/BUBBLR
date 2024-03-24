/* eslint-disable no-plusplus */
import React from 'react';
import axios from 'axios';

import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import ListGroup from 'react-bootstrap/ListGroup';

import OgDrink from './profileChildren/OgDrink';
import Concoction from './profileChildren/Concoction';
import UserSearch from './profileChildren/UserSearch';
import FriendItem from './profileChildren/FriendItem';

import fakeData from '../FakeData.json';

class Profile extends React.Component {
  constructor() {
    super();

    this.state = {
      displayName: 'User',
      createdAt: ' ',
      ogDrinkData: fakeData.drinks.slice(0, 5),
      concoctions: [],
      id: 1,
      friends: [],
    };

    this.getUser = () => {
      const { id } = this.state;
      axios
        .get(`/profile/${id}`)
        .then((userResponse) => {
          const { displayName, createdAt } = userResponse.data;

          // need to update drinks/reviews this way as well
          this.setState({ displayName, createdAt, id });
          return axios.get(`/profile/friends/${id}`);
        })
        .then(({ data }) => {
          this.setState({ friends: data });
          return axios.get('/profile/concoctions');
        })
        .then(({ data }) => {
          this.setState({ concoctions: data });
        })
        .catch((err) => console.error('Failed getting user data', err));
    };

    this.followUser = (idFollow) => {
      const { id } = this.state;
      axios
        .post('/profile/follow', { id, idFollow })
        .then(() => this.getUser())
        .catch((err) => console.error('failed following user: ', err));
    };

    this.unfollowUser = (idUnfollow) => {
      const { id } = this.state;
      axios
        .delete('/profile/unfollow', {
          data: { friend1Id: id, friend2Id: idUnfollow },
        })
        .then(() => {
          this.getUser();
        })
        .catch((err) => console.error('failed unfollowing user: ', err));
    };

    this.handleClose = (scope) => scope(false);
    this.handleShow = (scope) => scope(true);

    this.handleSubmit = (scope) => {
      const { drinkName, drinkIngredients, id } = scope.state;
      axios.patch('/profile/updateConcoction', { id, drinkName, drinkIngredients })
        .then(() => axios.get('/profile/concoctions'))
        .then(({ data }) => {
          // update concoction data
          this.setState({ concoctions: data });
        });

      this.handleClose(scope.setShow);
    };

    // this function will need to make an axios request to update db
    this.removeDrink = (e) => {
      const { ogDrinkData } = this.state;
      let targetDrinkGroup;
      let idName;
      if (e.target.className.includes('ogDrink')) {
        targetDrinkGroup = ogDrinkData;
        idName = 'idDrink';
        for (let i = 0; i < targetDrinkGroup.length; i++) {
          if (targetDrinkGroup[i][idName] === e.target.value) {
            targetDrinkGroup.splice(i, 1);
            this.setState({ ogDrinkData });
          }
        }
      } if (e.target.className.includes('concoction')) {
        axios.delete(`/profile/removeConcoction/${e.target.value}`)
          .then(() => axios.get('/profile/concoctions'))
          .then(({ data }) => this.setState({ concoctions: data }));
      }
    };

    this.getIngredients = (drink) => {
      const ingredients = [];
      for (let i = 1; i < 16; i++) {
        const stringIngredient = `strIngredient${i}`;
        if (drink[stringIngredient]) {
          ingredients.push(` ${drink[stringIngredient]}`);
        } else {
          return ingredients;
        }
      }

      return ingredients;
    };
  }

  componentDidMount() {
    this.getUser();
  }

  render() {
    const {
      displayName,
      createdAt,
      ogDrinkData,
      concoctions,
      friends,
    } = this.state;
    return (
      <>
        <UserSearch followUser={this.followUser} />
        <Card>
          <Card.Body>
            <Card.Title>Profile</Card.Title>
            <Card.Text>{displayName}</Card.Text>
            <Card.Text>{`You joined on: ${createdAt}`}</Card.Text>
            <Card>
              <Card.Body>
                <Card.Title>Your Friends</Card.Title>
                <ListGroup>
                  {friends.map((friend) => (
                    <FriendItem
                      friend={friend}
                      unfollowUser={this.unfollowUser}
                      key={`friend-${friend.id}`}
                    />
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <Card.Title>Your Concoctions</Card.Title>
            <Container>
              <Row>
                {concoctions.map((drink, index) => (
                  <Concoction
                    handleClose={this.handleClose}
                    handleShow={this.handleShow}
                    handleSubmit={this.handleSubmit}
                    removeDrink={this.removeDrink}
                    drink={drink}
                    key={`conc-${drink.id}`}
                    index={index}
                  />
                ))}
              </Row>
            </Container>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <Card.Title>Your Favorite Originals</Card.Title>
            <Container>
              <Row>
                {ogDrinkData.map((drink) => (
                  <OgDrink
                    removeDrink={this.removeDrink}
                    key={drink.idDrink}
                    drink={drink}
                    getIngredients={this.getIngredients}
                  />
                ))}
              </Row>
            </Container>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <Card.Title>Your Reviews</Card.Title>
            <ListGroup>
              Hello
            </ListGroup>
          </Card.Body>
        </Card>
      </>
    );
  }
}

export default Profile;
