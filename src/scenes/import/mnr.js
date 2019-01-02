import React from "react";
import { Container } from "reactstrap";
import Importer from "./importer";
import Mnr from "../../entities/Mnr";

import utils from "./utils";

export default class Import extends React.Component {
  render() {
    return (
      <Container className="import">
        <Importer collection="mnr" parseFiles={parseFiles} readme={readme} />
      </Container>
    );
  }
}

function parseFiles(files, encoding) {
  return new Promise((resolve, reject) => {
    var file = files.find(
      file => ("" + file.name.split(".").pop()).toLowerCase() === "csv"
    );
    if (!file) {
      reject("Fichier .csv absent");
      return;
    }

    utils.readCSV(file, ",", encoding, '"').then(notices => {
      const importedNotices = notices.map(e => new Mnr(e));
      resolve({ importedNotices, fileNames: [file.name] });
    });
  });
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

//On valide dabord avec la MAP 
// function readme() {
//   return (
//     <div>
//       <h2>Formats d’import</h2>
//       Les formats de données pris en charge sont les suivants :
//       <ul>
//         <li>notice : csv (séparateur : virgule, encodage : UTF8)</li>
//         <li>illustration : jpg, png</li>
//       </ul>
//       La taille maximale d’un import est de 300Mo (soit environ 3000 notices
//       avec image, ou 1 million de notices sans images). <br />
//       <br />
//       Champs obligatoire et contrôles de vocabulaire
//       <br />
//       Les champs suivants doivent obligatoirement être renseignés :<br />
//       - REF (référence de la notice).
//       <br />
//       <br />
//       Que voulez-vous faire ?<br />
//       Je veux créer une notice : j’importe la notice.
//       <br />
//       Je veux mettre à jour tout ou partie d’une notice : j’importe les champs à
//       mettre à jour avec leurs nouvelles valeurs et j’écrase l’ancienne notice.
//       (Toujours renseigner le champs REF afin d'indiquer la notice à modifier).
//       <br /> <br />
//       Je veux effacer une ou plusieurs valeurs d’une notice : j’importe un
//       fichier comportant le ou les champs que je veux supprimer en les laissant
//       vides. Je veux supprimer une notice : je contacte l’administrateur de la
//       base.
//       <br /> <br />
//       * Je veux ajouter une image :<br />
//       1) à l'import je renseigne le champs XXX (@sebastienlegoff1)
//       <br />
//       2) sur une notice déjà existante, je peux cliquer sur "Ajouter une image"
//       et télécharger une image depuis mon ordinateur. Le champ XXX contiendra le
//       lien de l'image ainsi téléchargée.
//       <br />
//       <br />
//       NB : à la création d'une notice, POP génère automatiquement certains
//       champs utiles au traitement des données. Il s'agit des champs : XXX, XXX,
//       XXX... Aucun besoin de les renseigner lors d'un import.
//       <br />
//     </div>
//   );
// }
