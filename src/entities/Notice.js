import { Mapping } from "pop-shared";
import validator from "validator";

export default class Notice {
  constructor(body, collection) {
    this._errors = [];
    this._messages = [];
    this._warnings = [];
    this._images = [];
    this._type = collection;
    this._mapping = Mapping[collection];
    this.POP_IMPORT = { value: [] };

    for (let key in this._mapping) {
      if (body[key] !== undefined) {
        if (this._mapping[key].type === "Array") {
          this[key] = this.extractArray(body[key]);
        } else {
          this[key] = body[key];
        }
      }
    }
  }

  validate() {
    for (let key in this._mapping) {
      //Check required fields
      if (this._mapping[key].required && !body[key]) {
        this._errors.push(`Le champ ${key} ne doit pas être vide`);
      }

      //check format
      if (this._mapping[key].validation && this[key] && this[key].value) {
        let validate = true;
        switch (this._mapping[key].validation) {
          case "Alphanumeric":
            validate = validator.isAlphanumeric(this[key].value, "fr-FR");
            break;
          default:
            console.log("TODO", this._mapping[key].validation);
            break;
        }

        if (!validate) {
          this._errors.push(
            `Le champ ${key} avec la valeur "${
              this[key].value
            }" n'est pas de type ${this._mapping[key].validation}`
          );
        }
      }
    }
  }

  setProperty(property, type, value, opt = null) {
    //if there is a value, add it. Otherwise I dont want to overwrite a value if there is nothing
    if (value !== undefined && value !== null) {
      this[property] = { type, value }; // The type is used in order to check if the value is different from the production. I need the type
      if (opt) {
        this[property] = { ...this[property], ...opt };
      }
    }
  }

  makeItFlat = function() {
    let flat = {};
    for (var property in this) {
      if (
        this.hasOwnProperty(property) &&
        property.indexOf("_") !== 0 &&
        typeof this[property] !== "function" &&
        !this._mapping[property].generated
      ) {
        flat[property] = this[property];
      }
    }
    return flat;
  };

  extractArray = function(str, delim = ";") {
    if (str === undefined) {
      return undefined;
    }
    if (!str) {
      return [];
    }
    if (Array.isArray(str)) {
      return str;
    }
    const arr = str.split(delim).map(e => e.trim());

    //remove duplicates
    return arr.filter((obj, key, array) => array.map(obj2 => obj !== obj2));
    //return [...new Set(arr)]; // DOESNT WORK IN PRODUCTION
  };

  extractEmail = function(str) {
    if (str === undefined) {
      return str;
    }
    if (!str) {
      return "";
    }
    var regex = /([\w\d-._@]*)/;
    var result = str.match(regex);
    if (result && result.length == 2) {
      return result[1];
    }
    // erreurs.push(`Impossible d'extraire l'email dans ${str}`)
    return str;
  };
  extractUrls = function(str) {
    if (str === undefined) {
      return str;
    }

    if (!str) {
      return [];
    }
    const arr = _regex(str, /(http[-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/g);
    if (arr.length) {
      return arr;
    }
    // erreurs.push(`Impossible d'extraire l'url dans ${str}`);
    return str;
  };

  stripHTML(html) {
    if (html === undefined) {
      return html;
    }
    var tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }
}

function _regex(str, reg) {
  if (!str) {
    return [];
  }
  var regex = new RegExp(reg);
  const arr = [];
  let m;
  while ((m = regex.exec(str)) !== null) {
    if (m.index === regex.lastIndex) {
      // This is necessary to avoid infinite loops with zero-width matches
      regex.lastIndex++;
    }
    if (m[1]) {
      arr.push(m[1].trim());
    }
  }
  return arr;
}
