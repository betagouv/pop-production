import React from "react";
import { Row, Col, Container } from "reactstrap";
import { Link } from "react-router-dom";
import {
  ReactiveBase,
  DataSearch,
  ReactiveList,
  SelectedFilters
} from "@appbaseio/reactivesearch";
import { MultiList } from "pop-shared";
import ExportComponent from "../components/export";
import { es_url, bucket_url } from "../../../config.js";
import Header from "../components/Header";
import Card from "../components/Merimee";

const FILTER = [
  "mainSearch",
  "region",
  "auteurs",
  "denomination",
  "producteur",
  "departement",
  "commune",
  "image",
  "location",
  "date",
  "zone"
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
        <Header base="merimee" normalMode={true} />
        <ReactiveBase url={`${es_url}/merimee`} app="merimee">
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
                debounce={0}
              />
              <ExportComponent FILTER={FILTER} collection="merimee" />
            </div>
            <Row>
              <Col xs="3">
                <MultiList
                  componentId="denomination"
                  dataField="DENO.keyword"
                  title="Dénominations"
                  className="filters"
                  displayCount
                  placeholder="Rechercher une dénomination"
                  URLParams={true}
                  react={{ and: FILTER }}
                />
                <MultiList
                  componentId="producteur"
                  dataField="PRODUCTEUR.keyword"
                  title="Producteur"
                  className="filters"
                  displayCount
                  showSearch={false}
                  URLParams={true}
                  react={{ and: FILTER }}
                />

                <MultiList
                  componentId="auteurs"
                  dataField="AUTR.keyword"
                  title="Auteurs"
                  displayCount
                  className="filters"
                  placeholder="Rechercher un auteur"
                  URLParams={true}
                  react={{ and: FILTER }}
                />
                <hr />
                <MultiList
                  componentId="region"
                  dataField="REG.keyword"
                  title="Régions"
                  displayCount
                  className="filters"
                  placeholder="Rechercher une région"
                  URLParams={true}
                  react={{ and: FILTER }}
                />
                <MultiList
                  componentId="departement"
                  dataField="DPT.keyword"
                  title="Départements"
                  displayCount
                  className="filters"
                  placeholder="Rechercher un département"
                  URLParams={true}
                  react={{ and: FILTER }}
                />

                <MultiList
                  componentId="commune"
                  dataField="COM.keyword"
                  title="Communes"
                  displayCount
                  className="filters"
                  placeholder="Rechercher une commune"
                  URLParams={true}
                  react={{ and: FILTER }}
                />
                <hr />
                <MultiList
                  componentId="image"
                  dataField="CONTIENT_IMAGE.keyword"
                  title="Contient une image"
                  className="filters"
                  showSearch={false}
                  displayCount
                  URLParams={true}
                  react={{ and: FILTER }}
                />
                <MultiList
                  componentId="location"
                  dataField="POP_CONTIENT_GEOLOCALISATION.keyword"
                  title="Contient une localisation"
                  className="filters"
                  displayCount
                  showSearch={false}
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
