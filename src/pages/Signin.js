import React from "react";
import { Alert, Button, Col, Container, Grid, Icon, Panel, Row } from "rsuite";
import { auth, database } from "../firebase";
import firebase from "firebase/app";

const Signin = () => {
  const onSignIn = async () => {
    try {
      const { additionalUserInfo, user } = await auth.signInWithPopup(
        new firebase.auth.GoogleAuthProvider()
      );
      if (additionalUserInfo.isNewUser) {
        await database.ref(`/profiles/${user.uid}`).set({
          name: user.displayName,
          createdAt: firebase.database.ServerValue.TIMESTAMP,
          email: user.email,
        });
      }
      Alert.success("Signed in successfully!", 4000);
    } catch (error) {
      Alert.error(error.message, 4000);
    }
  };

  return (
    <Container>
      <Grid className="mt-page">
        <Row>
          <Col xs={24} md={12} mdOffset={6}>
            <Panel>
              <div className="text-center">
                <h2>Welcome to Chatty :)</h2>
                <p>Please hurry up to login and use this wonderful app</p>
              </div>
              <div className="mt-3">
                <Button block color="green" onClick={onSignIn}>
                  <Icon icon="google" /> Log In With Google
                </Button>
              </div>
            </Panel>
          </Col>
        </Row>
      </Grid>
    </Container>
  );
};

export default Signin;
