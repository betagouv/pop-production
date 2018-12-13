import React from "react";
import { Row, Col, Container } from "reactstrap";
import { Link } from "react-router-dom";
import { ReactiveBase, ReactiveList } from "@appbaseio/reactivesearch/lib";
import ExportComponent from "../components/export";
import QueryBuilder from "../components/QueryBuilder";
import Memoire from "../../../entities/Memoire";
import { es_url, bucket_url } from "../../../config.js";
import Header from "../components/Header";

export default class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sortOrder: "asc",
      sortKey: "REF"
    };
  }

  render() {
    return (
      <Container className="search">
        <Header base="memoire" normalMode={false} />
        <ReactiveBase url={`${es_url}/memoire`} app="memoire">
          <div>
            <Row>
              <Col md={9}>
                <QueryBuilder
                  entity={Memoire}
                  componentId="advancedSearch"
                  autocomplete={false}
                />
              </Col>
              <Col md={3}>
                <ExportComponent
                  FILTER={["advancedSearch"]}
                  collection="memoire"
                />
              </Col>
            </Row>
            <div className="text-center my-3">
              Trier par :
              <select
                className="ml-2"
                onChange={e => this.setState({ sortKey: e.target.value })}
              >
                {new Memoire({})._fields
                  .filter(e => !["TICO", "TITR"].includes(e))
                  .map(e => (
                    <option key={e} value={e}>
                      {e}
                    </option>
                  ))}
              </select>
              <select
                className="ml-2"
                onChange={e => this.setState({ sortOrder: e.target.value })}
              >
                <option value="asc">Ascendant</option>
                <option value="desc">Descendant</option>
              </select>
            </div>
            <ReactiveList
              componentId="results"
              react={{ and: ["advancedSearch"] }}
              onResultStats={(total, took) => {
                if (total === 1) {
                  return `1 résultat`;
                }
                return `${total} résultats`;
              }}
              onNoResults="Aucun résultat trouvé."
              loader="Préparation de l'affichage des résultats..."
              dataField={`${this.state.sortKey}.keyword`}
              sortBy={this.state.sortOrder}
              URLParams={true}
              size={20}
              onData={data => <Card key={data.REF} data={data} />}
              pagination={true}
            />
          </div>
        </ReactiveBase>
      </Container>
    );
  }
}

const Card = ({ data }) => {
  let image = "";
  if (data.IMG.indexOf("memoire") === 0) {
    image = `${bucket_url}${data.IMG}`;
  } else if (data.IMG) {
    image = `${data.IMG}`;
  } else {
    image = require("../../../assets/noimage.jpg");
  }

  return (
    <Link
      style={{ textDecoration: "none" }}
      to={`/notice/memoire/${data.REF}`}
      className="card"
      key={data.REF}
    >
      <img src={image} alt="Lien cassé" />
      <div className="content">
        <div style={{ display: "flex" }}>
          <h2>{data.TICO}</h2>
          <span>{data.REF}</span>
        </div>
        <div>
          <p>{data.LOCA}</p>
          <p>{data.EDIF}</p>
          <p>{data.LEG}</p>
          <p>{data.OBJT}</p>
          <p>{data.DATPV}</p>
          <p>{data.AUTP}</p>
          <p>{data.SERIE}</p>
          <p>{data.TITRE}</p>
        </div>
      </div>
    </Link>
  );
};
