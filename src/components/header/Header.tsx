import React, { FC } from "react";
import { Container, Title, SearchBox, Dex } from "./styles";
import Search from "../search/Search";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <Link to="/">
      <Container>
        <Title>
          Poke<Dex>Dex</Dex>
        </Title>
        <Search />
      </Container>
    </Link>
  );
};

export default Header;