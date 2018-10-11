import React from "react";
import { Row, Col, Container, ButtonGroup, Button } from "reactstrap";
import { Link } from "react-router-dom";
import {
  ReactiveBase,
  DataSearch,
  ReactiveList,
  SelectedFilters
} from "@appbaseio/reactivesearch/lib";
import MultiList from "./components/multiList";

import ExportComponent from "./components/export";

import QueryBuilder from "./components/queryBuilder";

import Memoire from "../../entities/memoire";
import { es_url, bucket_url } from "../../config.js";

const FILTER = ["mainSearch", "dom", "autp", "producteur", "loca"];

export default class Search extends React.Component {
  constructor(props) {
    super(props);

    const fieldsToExport = [];
    const obj = new Memoire({});
    for (var property in obj) {
      if (
        obj.hasOwnProperty(property) &&
        property.indexOf("_") !== 0 &&
        typeof obj[property] === "object"
      ) {
        fieldsToExport.push(property);
      }
    }

    this.state = {
      normalMode: true,
      fieldsToExport
    };
  }

  renderAdvanced() {
    return (
      <div>
        <QueryBuilder entity={Memoire} componentId="advancedSearch" />
        <div className="text-center m-4">
          <ExportComponent
            FILTER={["advancedSearch"]}
            filename="merimee.csv"
            columns={this.state.fieldsToExport}
          />
        </div>
        <ReactiveList
          componentId="results"
          react={{ and: ["advancedSearch"] }}
          onResultStats={(total, took) => {
            return `${total} résultats trouvés en ${took} ms.`;
          }}
          URLParams={true}
          dataField=""
          size={20}
          onData={data => <Card key={data.REF} data={data} />}
          pagination={true}
        />
      </div>
    );
  }

  renderNormal() {
    return (
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
          <ExportComponent
            FILTER={FILTER}
            filename="merimee.csv"
            columns={this.state.fieldsToExport}
          />
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
              URLParams={true}
              react={{ and: FILTER }}
            />
            <MultiList
              componentId="loca"
              dataField="LOCA.keyword"
              title="Localisation"
              displayCount
              className="filters"
              URLParams={true}
              react={{ and: FILTER }}
            />
          </Col>
          <Col xs="9">
            <SelectedFilters />
            <ReactiveList
              componentId="results"
              react={{ and: FILTER }}
              onResultStats={(total, took) => {
                return `${total} résultats trouvés en ${took} ms.`;
              }}
              dataField=""
              URLParams={true}
              size={20}
              onData={data => <Card key={data.REF} data={data} />}
              pagination={true}
            />
          </Col>
        </Row>
      </div>
    );
  }

  render() {
    return (
      <Container className="search">
        <div className="header">
          <div className="title">Rechercher une Notice</div>
          <div className="buttons">
            <ButtonGroup>
              <Button
                color="primary"
                onClick={() =>
                  this.setState({ normalMode: !this.state.normalMode })
                }
                active={this.state.normalMode}
              >
                Recherche simple
              </Button>
              <Button
                color="primary"
                onClick={() =>
                  this.setState({ normalMode: !this.state.normalMode })
                }
                active={!this.state.normalMode}
              >
                Recherche experte
              </Button>
            </ButtonGroup>
          </div>
        </div>
        <ReactiveBase url={`${es_url}/memoire`} app="memoire">
          {this.state.normalMode ? this.renderNormal() : this.renderAdvanced()}
        </ReactiveBase>
      </Container>
    );
  }
}

const Card = ({ data }) => {
  // const image = data.IMG ? `${data.IMG}` : require('../../assets/noimage.jpg');

  let image = "";
  if (data.IMG.indexOf("memoire") === 0) {
    image = `${bucket_url}${data.IMG}`;
  } else if (data.IMG) {
    image = `${data.IMG}`;
  } else {
    image = require("../../assets/noimage.jpg");
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
          <p>{data.DOMN}</p>
          <p>{data.LOCA}</p>
        </div>
      </div>
    </Link>
  );
};
