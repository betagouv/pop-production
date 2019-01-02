import React from "react";
import { Container } from "reactstrap";
import { connect } from "react-redux";
import Importer from "./importer";
import Joconde from "../../entities/Joconde";

import utils from "./utils";

class Import extends React.Component {
  parseFiles(files, encoding) {
    return new Promise((resolve, reject) => {
      var file = files.find(
        file => ("" + file.name.split(".").pop()).toLowerCase() === "txt"
      );
      if (!file) {
        reject("Fichier .txt absent");
        return;
      }

      utils.readFile(file, encoding, res => {
        const importedNotices = utils
          .parseAjoutPilote(res, Joconde)
          .map(value => {
            if (!value.MUSEO && this.props.museofile) {
              value.MUSEO = this.props.museofile;
            }
            return value;
          })
          .map(value => new Joconde(value));

        const filesMap = {};
        for (var i = 0; i < files.length; i++) {
          //Sometimes, name is the long name with museum code, sometimes its not... The easiest way I found was to transform long name to short name each time I get a file name
          filesMap[Joconde.convertLongNameToShort(files[i].name)] = files[i];
        }

        //ADD IMAGES
        for (var i = 0; i < importedNotices.length; i++) {
          const names = importedNotices[i].IMG;
          for (var j = 0; j < names.length; j++) {
            let img = filesMap[Joconde.convertLongNameToShort(names[j])];
            if (!img) {
              importedNotices[i]._errors.push(
                `Image ${Joconde.convertLongNameToShort(names[j])} introuvable`
              );
            } else {
              const shortname = Joconde.convertLongNameToShort(img.name);
              let newImage = utils.renameFile(img, shortname);
              importedNotices[i]._images.push(newImage);
            }
          }
        }

        resolve({ importedNotices, fileNames: [file.name] });
      });
    });
  }
  render() {
    return (
      <Container className="import">
        <Importer
          collection="joconde"
          parseFiles={this.parseFiles.bind(this)}
          report={report}
          readme={readme}
          fieldsToExport={[
            { name: "Identifiant", key: "REF" },
            { name: "N° inventaire", key: "INV" }
          ]}
          dropzoneText="Glissez & déposez vos fichiers au format joconde (.txt) et les images associées (au format .jpg) dans cette zone"
        />
      </Container>
    );
  }
}

const mapstatetoprops = ({ Auth }) => {
  const { museofile } = Auth.user;
  return {
    museofile
  };
};

export default connect(
  mapstatetoprops,
  {}
)(Import);

function report(notices, collection, email, institution) {
  const arr = [];

  const d = new Date();
  var months = [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "decembre"
  ];
  const date = ("0" + d.getDate()).slice(-2);
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  const minutes = ("0" + d.getMinutes()).slice(-2);
  const hours = ("0" + d.getHours()).slice(-2);

  const created = notices.filter(e => e._status === "created");
  const updated = notices.filter(e => e._status === "updated");
  const rejected = notices.filter(e => e._status === "rejected");

  const imagesNumber = notices.reduce((acc, val) => {
    if (val.status === "created" || val.status === "updated") {
      return acc + val.images.length;
    }
    return acc;
  }, 0);

  let contact =
    "jeannette.ivain@culture.gouv.fr et sophie.daenens@culture.gouv.fr";

  arr.push(
    `<h1>Rapport de chargement ${collection} du ${date} ${month} ${year}, ${hours}h${minutes}</h1>`
  );
  arr.push(`<h2>Établissement: ${institution}</h2>`);
  arr.push(`<h2>Producteur: ${email}</h2>`);
  arr.push(`<h2>Contact: ${contact}</h2>`);
  arr.push(`<p>Nombre de notices chargées: ${notices.length}</p>`);
  arr.push(`<ul>`);
  arr.push(`<li>${notices.length - rejected.length} notice(s) valide(s)</li>`);
  arr.push(`<li style="list-style-type:none">`);
  arr.push(`<ul>`);
  arr.push(`<li>${created.length} notice(s) créée(s)</li>`);
  arr.push(`<li>${updated.length} notice(s) mise(s) à jour</li>`);
  arr.push(
    `<li>${notices.length -
      rejected.length -
      created.length -
      updated.length} notice(s) importée(s) sans mise à jour</li>`
  );
  arr.push(`<li>${imagesNumber} image(s) chargée(s)</li>`);
  arr.push(`</ul>`);
  arr.push(`</li >`);
  arr.push(`<li>${rejected.length} notice(s) rejetée(s)</li>`);
  arr.push(`</ul>`);

  const obj = {};
  let count = 0;

  console.log(notices);

  const URL = `http://pop${
    process.env.NODE_ENV === "production" ? "" : "-staging"
  }.culture.gouv.fr/notice/joconde/`;

  for (let i = 0; i < notices.length; i++) {
    for (let j = 0; j < notices[i]._warnings.length; j++) {
      count++;
      if (obj[notices[i]._warnings[j]] !== undefined) {
        obj[notices[i]._warnings[j]].count =
          obj[notices[i]._warnings[j]].count + 1;
        obj[notices[i]._warnings[j]].notices.push(
          `<a href="${URL}${notices[i].REF}">${
            notices[i].REF
          }<a/> (${notices[i].INV})`
        );
      } else {
        obj[notices[i]._warnings[j]] = {
          count: 1,
          notices: [
            `<a href="${URL}${notices[i].REF}">${
              notices[i].REF
            }<a/> (${notices[i].INV})`
          ]
        };
      }
    }
  }

  arr.push(`<p>${count} avertissement(s) dont : </p>`);
  arr.push(`<ul>`);
  for (let key in obj) {
    const count = obj[key].count;
    const nots = obj[key].notices;
    const { terme, champ, thesaurus } = regexIt(key);

    arr.push(
      `<li>${count} sur le terme <strong>${terme}</strong> du champ <strong>${champ}</strong> est non conforme au thésaurus <strong>${thesaurus}</strong> :</li>`
    );
    arr.push(`<ul>`);
    arr.push(...nots.map(e => `<li>${e}</li>`));
    arr.push(`</ul>`);
  }
  arr.push(`</ul>`);
  return arr.join("");
}

function regexIt(str) {
  const arr = [];
  const regex = /Le champ (.+) avec la valeur (.+) n'est pas conforme avec le thesaurus http:\/\/data\.culture\.fr\/thesaurus\/resource\/ark:\/(.+)/gm;
  let m;

  while ((m = regex.exec(str)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }

    // The result can be accessed through the `m`-variable.
    m.forEach((match, groupIndex) => {
      arr.push(match);
    });
  }

  return { terme: arr[2], champ: arr[1], thesaurus: arr[3] };
}

function readme() {
  return (
    <div>
      <h5>Plateforme Ouverte du Patrimoine</h5>
      <p>
        La plateforme POP regroupe les contenus numériques de patrimoine
        français afin de les rendre accessibles et consultables au plus grand
        nombre
      </p>
    </div>
  );
}
