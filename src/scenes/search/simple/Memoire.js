import React from "react";
import { Row, Col, Container } from "reactstrap";
import { Link } from "react-router-dom";
import {
  ReactiveBase,
  DataSearch,
  ReactiveList,
  SelectedFilters
} from "@appbaseio/reactivesearch/lib";
import { MultiList } from "pop-shared";
import ExportComponent from "../components/export";
import { es_url, bucket_url } from "../../../config.js";
import Header from "../components/Header";

const FILTER = [
  "mainSearch",
  "dom",
  "autp",
  "producteur",
  "loca",
  "region",
  "departement",
  "commune",
  "pays"
];

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
        <Header base="memoire" normalMode={true} />
        <ReactiveBase url={`${es_url}/memoire`} app="memoire">
          <div>
            <div className="search-and-export-zone">
              <DataSearch
                componentId="mainSearch"
                dataField={["TICO", "DENO", "REF", "LOCA"]}
                queryFormat="and"
                iconPosition="left"
                className="mainSearch"
                placeholder="Saisissez un titre, une dénomination, une reference ou une localisation"
                URLParams={true}
              />
              <ExportComponent FILTER={FILTER} collection="memoire" />
            </div>
            <Row>
              <Col xs="3">
                <MultiList
                  componentId="dom"
                  dataField="DOM.keyword"
                  title="Domaine"
                  className="filters"
                  URLParams={true}
                  displayCount
                  react={{ and: FILTER }}
                />
                <MultiList
                  componentId="producteur"
                  dataField="PRODUCTEUR.keyword"
                  title="Producteur"
                  className="filters"
                  displayCount
                  URLParams={true}
                  react={{ and: FILTER }}
                />
                <MultiList
                  componentId="autp"
                  dataField="AUTP.keyword"
                  title="Auteurs"
                  className="filters"
                  displayCount
                  sortByName={true}
                  URLParams={true}
                  react={{ and: FILTER }}
                />
                <MultiList
                  componentId="loca"
                  dataField="LOCA.keyword"
                  title="Localisation"
                  displayCount
                  sortByName={true}
                  className="filters"
                  URLParams={true}
                  react={{ and: FILTER }}
                />
                <MultiList
                  componentId="pays"
                  dataField="PAYS.keyword"
                  title="Pays"
                  displayCount
                  sortByName={true}
                  className="filters"
                  URLParams={true}
                  react={{ and: FILTER }}
                />

                <MultiList
                  componentId="region"
                  dataField="REG.keyword"
                  title="Région"
                  displayCount
                  sortByName={true}
                  className="filters"
                  URLParams={true}
                  react={{ and: FILTER }}
                />
                <MultiList
                  componentId="departement"
                  dataField="DPT.keyword"
                  title="Département"
                  displayCount
                  sortByName={true}
                  className="filters"
                  URLParams={true}
                  react={{ and: FILTER }}
                />
                <MultiList
                  componentId="commune"
                  dataField="COM.keyword"
                  title="Commune"
                  displayCount
                  sortByName={true}
                  className="filters"
                  URLParams={true}
                  react={{ and: FILTER }}
                />
              </Col>
              <Col xs="9">
                <SelectedFilters clearAllLabel="Tout supprimer" />
                <ReactiveList
                  componentId="results"
                  react={{ and: FILTER }}
                  onResultStats={(total, took) => {
                    if (total === 1) {
                      return `1 résultat`;
                    }
                    return `${total} résultats`;
                  }}
                  onNoResults="Aucun résultat trouvé."
                  loader="Préparation de l'affichage des résultats..."
                  dataField=""
                  URLParams={true}
                  size={20}
                  onData={data => <Card key={data.REF} data={data} />}
                  pagination={true}
                />
              </Col>
            </Row>
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
