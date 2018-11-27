import React from "react";
import { Row, Col, Container, Button, Form } from "reactstrap";
import { Link } from "react-router-dom";
import { reduxForm } from "redux-form";
import { toastr } from "react-redux-toastr";
import { connect } from "react-redux";

import { bucket_url } from "../../config";

import FieldInput from "./components/fieldInput.js";
import FieldTags from "./components/fieldTags";
import FieldImages from "./components/fieldImages";
import Section from "./components/section.js";

import Loader from "../../components/loader";
import API from "../../services/api";

import "./index.css";

class Notice extends React.Component {
  state = {
    notice: null,
    error: "",
    loading: true,
    editable: true
  };

  componentWillMount() {
    this.load(this.props.match.params.ref);
  }

  componentWillReceiveProps(newProps) {
    if (
      this.props.match &&
      this.props.match.params.ref !== newProps.match.params.ref
    ) {
      this.load(newProps.match.params.ref);
    }
  }

  load(ref) {
    this.setState({ loading: true });
    API.getNotice("memoire", ref).then(notice => {
      if (!notice) {
        this.setState({
          loading: false,
          error: `Impossible de charger la notice ${ref}`
        });
        console.error(`Impossible de charger la notice ${ref}`);
        return;
      }
      console.log("NOTICE", notice);
      const editable =
        ["CRMH", "CAOA", "SAP", "SDAP"].includes(notice.PRODUCTEUR) &&
        this.props.canUpdate;
      this.props.initialize({ ...notice, IMG: [notice.IMG] });
      this.setState({ loading: false, notice, editable });
    });
  }

  onSubmit(values) {
    this.setState({ saving: true });
    API.updateNotice(this.state.notice.REF, "memoire", values).then(e => {
      toastr.success(
        "Modification enregistrée",
        "La modification sera visible dans 1 à 5 min en diffusion"
      );
      this.setState({ saving: false });
    });
  }

  delete() {
    const ref = this.props.match.params.ref;
    const confirmText =
      `Vous êtes sur le point de supprimer la notice REF ${ref}. ` +
      `Êtes-vous certain·e de vouloir continuer ?`;
    const toastrConfirmOptions = {
      onOk: () => {
        API.deleteNotice("memoire", ref).then(() => {
          toastr.success(
            "Notice supprimée",
            "La modification sera visible dans 1 à 5 min en diffusion"
          );
        });
      }
    };
    toastr.confirm(confirmText, toastrConfirmOptions);
  }

  render() {
    if (this.state.loading) {
      return <Loader />;
    }

    if (this.state.error) {
      return <div className="error">{this.state.error}</div>;
    }

    const arr = [];
    for (var key in this.state.notice) {
      if (this.state.notice[key]) {
        arr.push(<span key={key}>{`${key}:${this.state.notice[key]}`}</span>);
      }
    }

    return (
      <Container className="notice" fluid>
        <Form
          onSubmit={this.props.handleSubmit(this.onSubmit.bind(this))}
          className="main-body"
        >
          <Row>
            <div className="back" onClick={() => this.props.history.goBack()}>
              Retour
            </div>
          </Row>
          <Row>
            <FieldImages name="IMG" disabled={!this.state.editable} />
          </Row>
          <div className="section">
            <div className="title">1. Sujet de la photographie</div>
            <div>1.1. Localisation</div>
            <Row>
              <Col sm={6}>
                <FieldInput
                  title="Localisation (LOCA)"
                  name="LOCA"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Pays (PAYS)"
                  name="PAYS"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Région (REG)"
                  name="REG"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Département (DPT)"
                  name="DPT"
                  disabled={!this.state.editable}
                />
              </Col>
              <Col sm={6}>
                <FieldInput
                  title="Commune (COM)"
                  name="COM"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Code INSEE de la commune (INSEE)"
                  name="INSEE"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Adresse et/ou lieu-dit (ADRESSE)"
                  name="ADRESSE"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Mots-clés géographiques (MCGEO)"
                  name="MCGEO"
                  disabled={!this.state.editable}
                />
              </Col>
            </Row>
            <div>1.2. Identification</div>
            <Row>
              <Col sm={6}>
                <FieldInput
                  title="Édifice (EDIF)"
                  name="EDIF"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Objet (OBJT)"
                  name="OBJT"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Titre courant de l’œuvre (TICO)"
                  name="TICO"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Sujet représenté par la photographie (SUJET)"
                  name="SUJET"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Légende (LEG)"
                  name="LEG"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Titre de la pièce de théâtre ou du film (TITRE)"
                  name="TITRE"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Producteur de la pièce de théâtre ou du film (THEATRE)"
                  name="THEATRE"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Rôle interprété (ROLE)"
                  name="ROLE"
                  disabled={!this.state.editable}
                />

                <FieldInput
                  title="Auteur de l’œuvre (AUTOEU)"
                  name="AUTOEU"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Siècle de l’œuvre (SCLE)"
                  name="SCLE"
                  disabled={!this.state.editable}
                />
              </Col>
              <Col sm={6}>
                <FieldInput
                  title="Date de l’œuvre (DATOEU)"
                  name="DATOEU"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Lieu d’origine de l’élément réemployé (LIEUORIG)"
                  name="LIEUORIG"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Référence de la notice Mérimée ou Palissy (LBASE)"
                  name="LBASE"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Lien vers la notice Mérimée ou Palissy (LBASE2)"
                  name="LBASE2"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Rang d’affichage de l’image (MARQ)"
                  name="MARQ"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Titre de la série (SERIE)"
                  name="SERIE"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Mots-clés (MCL)"
                  name="MCL"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Identité de la personne photographiée (MCPER)"
                  name="MCPER"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Adresse de la personne photographiée (ADPHOT)"
                  name="ADPHOT"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Domaine (DOM)"
                  name="DOM"
                  disabled={!this.state.editable}
                />
              </Col>
            </Row>
            <div>1.3. Références des documents reproduits</div>
            <Row>
              <Col sm={6}>
                <FieldInput
                  title="Auteur du document reproduit / auteur de l’original (AUTOR)"
                  name="AUTOR"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Référence bibliographique ou documentaire  (TIREDE)"
                  name="TIREDE"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Lieu de conservation du document reproduit (LIEUCOR)"
                  name="LIEUCOR"
                  disabled={!this.state.editable}
                />
              </Col>
              <Col sm={6}>
                <FieldInput
                  title="Cote de conservation du document reproduit (COTECOR)"
                  name="COTECOR"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Auteur de la gravure (AUTG)"
                  name="AUTG"
                  disabled={!this.state.editable}
                />
              </Col>
            </Row>
          </div>
          <div className="section">
            <div className="title">2. Auteur</div>
            <Row>
              <Col sm={6}>
                <FieldInput
                  title="Photographe  (AUTP)"
                  name="AUTP"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Auteur du tirage (AUTTI)"
                  name="AUTTI"
                  disabled={!this.state.editable}
                />
                <Col sm={6} />
                <FieldInput
                  title="Lien vers la base Autor (LAUTP)"
                  name="LAUTP"
                  disabled={!this.state.editable}
                />
              </Col>
            </Row>
          </div>
          <div className="section">
            <div className="title">3. Description de la photographie</div>
            <div>3.1. Éléments d’identification</div>
            <Row>
              <Col sm={6}>
                <FieldInput
                  title="Type document (TYPDOC)"
                  name="TYPDOC"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Numéro du phototype (NUMI)"
                  name="NUMI"
                  disabled={!this.state.editable}
                />

                <FieldInput
                  title="Numéro du négatif (NUMP)"
                  name="NUMP"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Ancien numéro du négatif (ANUMP)"
                  name="ANUMP"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Numéro donné par le photographe (NUMAUTP)"
                  name="NUMAUTP"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Numéro du tirage (NUMTI)"
                  name="NUMTI"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Ancien numéro du tirage (ANUMTI)"
                  name="ANUMTI"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Numéro de reproduction (REPRO)"
                  name="REPRO"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Numéro de la gravure (NUMG)"
                  name="NUMG"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Numéro de l’original (NUMOR)"
                  name="NUMOR"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Ancien numéro de l’original (ANUMOR)"
                  name="ANUMOR"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Phototype(s) en relation (RENV)"
                  name="RENV"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Lieu de conservation du tirage (LIEUCTI)"
                  name="LIEUCTI"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Cote conservation du tirage (COTECTI)"
                  name="COTECTI"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Précisions sur la conservation de l’original (PRECOR)"
                  name="PRECOR"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Date d’immatriculation (DATIMM)"
                  name="DATIMM"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Modalité d’entrée (ACQU)"
                  name="ACQU"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Crédit photographique (COPY)"
                  name="COPY"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Droits de diffusion (DIFF)"
                  name="DIFF"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Échelle du graphique (ECH)"
                  name="ECH"
                  disabled={!this.state.editable}
                />
              </Col>
            </Row>
            <div>3.2. Description technique du phototype</div>
            <Row>
              <Col sm={6}>
                <FieldInput
                  title="Description technique du négatif (TECH)"
                  name="TECH"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Format du négatif (FORMAT)"
                  name="FORMAT"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Description technique du tirage (TECHTI)"
                  name="TECHTI"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Format du tirage (FORMATTI)"
                  name="FORMATTI"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Description technique de l’original (TECHOR)"
                  name="TECHOR"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Format de l'original (FORMATOR)"
                  name="FORMATOR"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Annotations présentes sur le négatif (MENTIONS)"
                  name="MENTIONS"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Annotations présentes sur le tirage (MENTTI)"
                  name="MENTTI"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Orientation du phototype (SENS)"
                  name="SENS"
                  disabled={!this.state.editable}
                />

                <FieldInput
                  title="Couleur (COULEUR)"
                  name="COULEUR"
                  disabled={!this.state.editable}
                />
              </Col>
            </Row>
            <div>3.3. Datation et événements liés à l’image</div>
            <Row>
              <Col sm={6}>
                <FieldInput
                  title="Date prise vue (DATPV)"
                  name="DATPV"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Précision sur la date de prise de vue (JDATPV)"
                  name="JDATPV"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Date de l'original (DATOR)"
                  name="DATOR"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Référence d’exposition de l’image (EXPO)"
                  name="EXPO"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Référence de publication de l’image (PUBLI)"
                  name="PUBLI"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Observations  (OBS)"
                  name="OBS"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Observations sur le tirage (OBSTI)"
                  name="OBSTI"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Observations sur l’original (OBSOR)"
                  name="OBSOR"
                  disabled={!this.state.editable}
                />
              </Col>
            </Row>
          </div>
          <div className="section">
            <div className="title">4. Gestion de la base de données</div>
            <Row>
              <Col sm={6}>
                <FieldInput
                  title="Référence (REF)"
                  name="REF"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Date de création (DMIS)"
                  name="DMIS"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Date mise à jour (DMAJ)"
                  name="DMAJ"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Lien vers le service producteur (CONTACT)"
                  name="CONTACT"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Nom du producteur (IDPROD)"
                  name="IDPROD"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Code du producteur (EMET)"
                  name="EMET"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Nom de l’image (REFIMG)"
                  name="REFIMG"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Type de support numérique (TYPSUPP)"
                  name="TYPSUPP"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Type d’image numérique (TYPEIMG)"
                  name="TYPEIMG"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Référence de l’image (REFIM)"
                  name="REFIM"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Vidéo (VIDEO)"
                  name="VIDEO"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Référence sur le vidéodisque (NVD	REF)"
                  name="NVD	REF"
                  disabled={!this.state.editable}
                />
                <FieldTags
                  title="Lien vers l’image (IMG)"
                  name="IMG"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Ville (WCOM)"
                  name="WCOM"
                  disabled={!this.state.editable}
                />
                <FieldInput
                  title="Accès Mémoire (WEB)"
                  name="WEB"
                  disabled={!this.state.editable}
                />
              </Col>
            </Row>
          </div>
          {this.props.canUpdate ? (
            <div className="buttons">
              <Button color="danger" onClick={() => this.delete()}>
                Supprimer
              </Button>
              <Button
                disabled={!this.state.editable}
                color="primary"
                type="submit"
              >
                Sauvegarder
              </Button>
            </div>
          ) : (
            <div />
          )}
        </Form>
      </Container>
    );
  }
}

const mapStateToProps = ({ Auth }) => {
  const { role, group } = Auth.user;
  return {
    canUpdate: Auth.user
      ? (role === "producteur" || role === "administrateur") &&
        (group === "mh" || group === "admin")
      : false
  };
};

export default connect(
  mapStateToProps,
  {}
)(reduxForm({ form: "notice" })(Notice));
