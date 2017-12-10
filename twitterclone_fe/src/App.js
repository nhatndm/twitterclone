import React, { Component } from 'react';
import './App.css';
import * as firebase from 'firebase';
import axios from 'axios';
import { Button, Row, Container, Table } from 'reactstrap';

const config = {
  apiKey: "AIzaSyDKTzsr4Grp48Ain7kIYDPpfwMhK46KCmU",
  authDomain: "coding-90b6c.firebaseapp.com",
  databaseURL: "https://coding-90b6c.firebaseio.com",
  projectId: "coding-90b6c",
  storageBucket: "coding-90b6c.appspot.com",
  messagingSenderId: "1003600292592"
};

const firebaseConfig = firebase.initializeApp(config);

const firebaseAuth = firebaseConfig.auth();

const API_ENDPOINT = 'http://localhost:3000';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoged_in: false,
      tweets: [],
      userName: '',
    }
  }

  generateAuth = (provider, id, name, email, accessToken, accessTokenSecret) => ({
    provider: provider,
    id: id,
    name: name,
    email: email,
    access_token: accessToken,
    access_token_secret: accessTokenSecret,
  });

  componentWillMount = () => {
    if (typeof localStorage !== 'undefined' && localStorage) {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (userInfo) {
        this.setStateLogin(true);
        this.setStateUserName(userInfo.name);
        this.fetchTweet();
      }
    }
  };

  setStateLogin = (status) => {
    this.setState({
      isLoged_in: status
    })
  };

  setStateUserName = (name) => {
    this.setState({
      userName: name
    });
  }

  setStateTweets = (tweets) => {
    this.setState({
      tweets: tweets
    });
  }

  setLocalStorage = (headers, current_user) => {
    const user = {
      'access-token': headers['access-token'],
      'client': headers['client'],
      'expiry': headers['expiry'],
      'token-type': headers['token-type'],
      'uid': headers['uid'], 
      'name': current_user.name,
    }
    if (typeof localStorage !== 'undefined' && localStorage) {
      window.localStorage.setItem('userInfo', JSON.stringify(user));
    }
  }

  loginWithTwitter = () => {
    const provider = new firebase.auth.TwitterAuthProvider();
    firebaseAuth.signInWithPopup(provider)
                .then((response) => {
                  const userInfo = response.additionalUserInfo.profile;
                  const credential = response.credential;
                  const authObject = this.generateAuth('twitter', userInfo.id, userInfo.name, 
                                                        userInfo.email, credential.accessToken, credential.secret)
                  axios.post(`${API_ENDPOINT}/api/v1/oauth`, authObject)
                       .then((response) => {
                          this.setLocalStorage(response.headers, response.data);
                          this.setStateLogin(true);
                          this.setStateUserName(response.data.name);
                          this.fetchTweet();
                       });
                })
                .catch((error) => {
                  console.log(error);
                })
  };

  fetchTweet = () => {
    if (typeof localStorage !== 'undefined' && localStorage) {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (userInfo) {
        axios({
          method: 'GET',
          url: `${API_ENDPOINT}/api/v1/twitter/load_tweet`,
          headers: userInfo,
        }).then((response) => {
          this.setState({
            tweets: response.data
          })
        }).catch((error) => {
          if(error) {
            this.logOut();
          }
        })
      }
    }
  };

  reTweet = (tweetID) => {
    if (typeof localStorage !== 'undefined' && localStorage) {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (userInfo) {
        axios({
          method: 'GET',
          url: `${API_ENDPOINT}/api/v1/twitter/re_tweet?tweet_id=${tweetID}`,
          headers: userInfo,
        }).then((response) => {
          console.log(response);
        }).catch((error) => {
          if(error) {
            this.logOut();
          }
        })
      }
    }
  };

  followTweet = (screenName) => {
    if (typeof localStorage !== 'undefined' && localStorage) {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (userInfo) {
        axios({
          method: 'GET',
          url: `${API_ENDPOINT}/api/v1/twitter/follow?tweeter_name=${screenName}`,
          headers: userInfo,
        }).then((response) => {
          console.log(response);
        }).catch((error) => {
          if(error) {
            this.logOut();
          }
        })
      }
    }
  };

  logOut = () => {
    this.setState({
      isLoged_in: false,
      tweets: [],
      userName: '',
    });
    if (typeof localStorage !== 'undefined' && localStorage) {
      window.localStorage.removeItem('userInfo')
    }
  }

  checkLoginStatus = () => {
    if (this.state.isLoged_in) {
      return (
        <Row>
          <Table>
            <thead>
              <tr>
                <th>#</th>
                <th>Content</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {this.state.tweets.map((value, index) => 
                <tr key={index}>
                  <td>{index}</td>
                  <td>{value.text}</td>
                  <td>
                    <Button color="success" onClick={() => this.reTweet(value.id)}>ReTweet</Button>
                    <Button color="info" onClick={() => this.followTweet(value.user.screen_name)}>Follow</Button>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Row>
      )
    } else {
      return (
        <Row className="content">
          <Button color="primary" onClick={() => this.loginWithTwitter()}>Sign In With Twitter</Button>
        </Row>
      )
    }
  }

  render() {
    return (
      <Container fluid={true}>
        {this.checkLoginStatus()}
      </Container>
    );
  }
}

export default App;
