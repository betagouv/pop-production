import React from "react";
import { Row, Col, Container } from "reactstrap";
import { Link } from "react-router-dom";
import {
  ReactiveBase,
  DataSearch,
  ReactiveList,
  SelectedFilters
} from "@appbaseio/reactivesearch";
import ExportComponent from "../components/export";
import { MultiList } from "pop-shared";
import { es_url, bucket_url } from "../../../config.js";
import Header from "../components/Header";

const FILTER = [
  "mainSearch",
  "producteur",
  "image",
  "denomination",
  "auteurs",
  "region",
  "departement",
  "commune"
];

export default class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      normalMode: !props.expert,
      sortOrder: "asc",
      sortKey: "REF"
    };
  }

  render() {
    return (
      <Container className="search">
        <Header base="palissy" normalMode={true} />
        <ReactiveBase url={`${es_url}/palissy`} app="palissy">
          <div>
            <div className="search-and-export-zone">
              <DataSearch
                componentId="mainSearch"
                fuzziness={2}
                dataField={["TICO", "DENO", "REF", "LOCA"]}
                queryFormat="and"
                iconPosition="left"
                className="mainSearch"
                placeholder="Saisissez un titre, une dénomination, une reference ou une localisation"
                URLParams={true}
              />
              <ExportComponent FILTER={FILTER} collection="palissy" />
            </div>
            <Row>
              <Col xs="3">
                <MultiList
                  componentId="denomination"
                  dataField="DENO.keyword"
                  title="Dénominations"
                  displayCount
                  className="filters"
                  placeholder="Rechercher une dénomination"
                  URLParams={true}
                  react={{
                    and: FILTER
                  }}
                />
                <MultiList
                  componentId="producteur"
                  dataField="PRODUCTEUR.keyword"
                  title="Producteur"
                  className="filters"
                  showSearch={false}
                  displayCount
                  URLParams={true}
                  react={{
                    and: FILTER
                  }}
                />
                <MultiList
                  componentId="auteurs"
                  dataField="AUTR.keyword"
                  displayCount
                  title="Auteurs"
                  className="filters"
                  placeholder="Rechercher un auteur"
                  URLParams={true}
                  react={{
                    and: FILTER
                  }}
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
                  react={{
                    and: FILTER
                  }}
                />
                <MultiList
                  componentId="departement"
                  dataField="DPT.keyword"
                  title="Départements"
                  displayCount
                  className="filters"
                  placeholder="Rechercher un département"
                  URLParams={true}
                  react={{
                    and: FILTER
                  }}
                />
                <MultiList
                  componentId="commune"
                  dataField="COM.keyword"
                  title="Communes"
                  displayCount
                  className="filters"
                  placeholder="Rechercher une commune"
                  URLParams={true}
                  react={{
                    and: FILTER
                  }}
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
                  react={{
                    and: FILTER
                  }}
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

function getMemoireImage(memoire) {
  if (!memoire.length || !memoire[0].url) {
    return require("../../../assets/noimage.jpg");
  }
  let image = memoire[0].url;
  image = image.indexOf("www") === -1 ? `${bucket_url}${image}` : image;
  return image;
}

const Card = ({ data }) => {
  const image = getMemoireImage(data.MEMOIRE);

  if (data.REF.startsWith("PA") || data.REF.startsWith("PM")) {
    return (
      <Link
        style={{ textDecoration: "none" }}
        to={`/notice/palissy/${data.REF}`}
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
            <p>{data.AUTR.join(" ; ")}</p>
            <p>{data.CATE.join(" ; ")}</p>
            <p>{data.MATR.join(" ; ")}</p>
            <p>{data.SCLE.join(" ; ")}</p>
            <p>{data.DEPL}</p>
            <p>{data.STAT.join(" ; ")}</p>
            <p>{data.DPRO}</p>
            <p>{data.DOMN}</p>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      style={{ textDecoration: "none" }}
      to={`/notice/palissy/${data.REF}`}
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
          <p>{data.DENO.join(" ; ")}</p>
          <p>{data.LOCA}</p>
          <p>{data.AUTR.join(" ; ")}</p>
        </div>
      </div>
    </Link>
  );
};
