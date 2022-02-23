import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import { Col, Grid, Row } from "rsuite";
import { useMediaQuery } from "../../components/customHooks";
import Sidebar from "../../components/Sidebar";
import { ChatsProvider } from "../../context/chats.context";
import { ContactsProvider } from "../../context/contacts.context";
import Chat from "./Chat";

const Home = () => {
  const isDesktop = useMediaQuery("(min-width: 992px)");
  const { isExact } = useRouteMatch();
  const showSidebar = isDesktop || isExact;

  return (
    <ContactsProvider>
      <ChatsProvider>
        <Grid fluid className="h-100">
          <Row className="h-100">
            {showSidebar && (
              <Col xs={24} md={8} className="h-100">
                <Sidebar />
              </Col>
            )}
            <Switch>
              <Route exact path="/chats/:chatId">
                <Col xs={24} md={16} className="h-100">
                  <Chat />
                </Col>
              </Route>
              <Route>
                {isDesktop && (
                  <Col xs={24} md={16} className="h-100">
                    <h6 className="text-center mt-page">
                      Click on a chat to start chatting
                    </h6>
                  </Col>
                )}
              </Route>
            </Switch>
          </Row>
        </Grid>
      </ChatsProvider>
    </ContactsProvider>
  );
};

export default Home;
