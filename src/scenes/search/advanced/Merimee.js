import React from "react";
import { Row, Col, Container } from "reactstrap";
import { Link } from "react-router-dom";
import { ReactiveBase, ReactiveList } from "@appbaseio/reactivesearch";
import ExportComponent from "../components/export";
import Merimee from "../../../entities/Merimee";
import QueryBuilder from "../components/QueryBuilder";
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
        <Header base="merimee" normalMode={false} />
        <ReactiveBase url={`${es_url}/merimee`} app="merimee">
          <div>
            <Row>
              <Col md={9}>
                <QueryBuilder
                  entity={Merimee}
                  componentId="advancedSearch"
                  autocomplete={false}
                />
              </Col>
              <Col md={3}>
                <ExportComponent
                  FILTER={["advancedSearch"]}
                  collection="merimee"
                  autocomplete
                />
              </Col>
            </Row>
            <div className="text-center my-3">
              Trier par :
              <select
                className="ml-2"
                onChange={e => this.setState({ sortKey: e.target.value })}
              >
                {new Merimee({})._fields
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
              react={{ and: "advancedSearch" }}
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

function getMemoireImage(memoire) {
  if (!memoire.length || !memoire[0].url) {
    return require("../../../assets/noimage.jpg");
  }
  let image = memoire[0].url;

  image = image.indexOf("www") === -1 ? `${bucket_url}${image}` : image;
  return image;
}

const Card = ({ data }) => {
  let image = getMemoireImage(data.MEMOIRE);
  return (
    <Link
      style={{ textDecoration: "none" }}
      to={`/notice/merimee/${data.REF}`}
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
          <p>{data.DOMN}</p>
          <p>{data.DENO.join(", ")}</p>
          <p>{data.LOCA}</p>
          <p>{data.AUTR.join(", ")}</p>
        </div>
      </div>
    </Link>
  );
};
