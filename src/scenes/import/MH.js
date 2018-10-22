import React from "react";
import { Container } from "reactstrap";
import Importer from "./importer";
import Merimee from "../../entities/merimee";
import Palissy from "../../entities/palissy";

import api from "../../services/api";
import utils from "./utils";

export default class Import extends React.Component {
  render() {
    return (
      <Container className="import">
        <Importer
          collection="monuments-historiques"
          parseFiles={parseFiles}
          dropzoneText="Glissez & déposez vos fichiers au format MH ( extension .csv avec séparateur | ) et les images associées (au format .jpg) dans cette zone"
        />
      </Container>
    );
  }
}

function parseFiles(files, encoding) {
  return new Promise((resolve, reject) => {
    var objectFile = files.find(file => file.name.includes(".csv"));
    if (!objectFile) {
      reject("Pas de fichiers .csv detecté");
      return;
    }
    utils.readCSV(objectFile, "|", encoding).then(async objs => {
      const importedNotices = [];
      for (var i = 0; i < objs.length; i++) {
        const obj = objs[i];

        if (!obj.REF) {
          reject(
            "Impossible de détecter les notices. Vérifiez que le séparateur est bien | et que chaque notice possède une référence"
          );
          return;
        }

        //Create New notices
        if (obj.REF === "PM") {
          if (!obj.DPT) {
            reject("DPT est vide. Impossible de générer un id");
            return;
          }
          const ref = await api.getNewId("palissy", "PM", obj.DPT);
          obj.REF = ref.id;
        } else if (obj.REF === "PA") {
          if (!obj.DPT) {
            reject("DPT est vide. Impossible de générer un id");
            return;
          }
          const ref = await api.getNewId("merimee", "PA", obj.DPT);
          obj.REF = ref.id;
        }

        if (obj.REF.indexOf("PM") !== -1) {
          importedNotices.push(new Palissy(obj));
        } else if (obj.REF.indexOf("PA") !== -1) {
          importedNotices.push(new Merimee(obj));
        } else {
          reject(`La référence ${obj.REF} n'est ni palissy, ni mérimée`);
          return;
        }
      }

      resolve({ importedNotices, fileNames: [objectFile.name] });
    });
  });
}
