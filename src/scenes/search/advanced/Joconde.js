import React from "react";
import { Row, Col, Container } from "reactstrap";
import { Link } from "react-router-dom";
import { ReactiveBase, ReactiveList } from "@appbaseio/reactivesearch";
import ExportComponent from "../components/export";
import QueryBuilder from "../components/QueryBuilder";
import { es_url, bucket_url } from "../../../config.js";
import Joconde from "../../../entities/Joconde";
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
        <Header base="joconde" normalMode={false} />
        <ReactiveBase url={`${es_url}/joconde`} app="joconde">
          <div>
            <Row>
              <Col md={9}>
                <QueryBuilder entity={Joconde} componentId="advancedSearch" />
              </Col>
              <Col md={3}>
                <ExportComponent
                  FILTER={["advancedSearch"]}
                  collection="joconde"
                />
              </Col>
            </Row>
            <div className="text-center my-3">
              Trier par :
              <select
                className="ml-2"
                onChange={e => this.setState({ sortKey: e.target.value })}
              >
                {new Joconde({})._fields
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
  const image = data.IMG.length
    ? `${bucket_url}${data.IMG[0]}`
    : require("../../../assets/noimage.jpg");
  return (
    <Link
      style={{ textDecoration: "none" }}
      to={`/notice/joconde/${data.REF}`}
      className="card"
      key={data.REF}
    >
      <img src={image} alt="Lien cassé" />
      <div className="content">
        <div style={{ display: "flex" }}>
          <h2>{data.TITR}</h2>
          <span>{data.REF}</span>
        </div>
        <div>
          <p>{data.DOMN.join(", ")}</p>
          <p>{data.DENO.join(", ")}</p>
          <p>{data.AUTR}</p>
          <p>{data.PERI.join(", ")}</p>
          <p>{data.LOCA}</p>
          <p>{data.INV}</p>
        </div>
      </div>
    </Link>
  );
};
