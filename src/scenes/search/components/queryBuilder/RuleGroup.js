import React from "react";
import Rule from "./Rule";
import { history } from "../../../../redux/store";
import qs from "qs";

function gnagna(key, operator, value) {
  if (operator === "<>") {
    // { value: "<>", text: "exist" },
    return {
      bool: {
        // Must exists ...
        must: { exists: { field: key } },
        // ... and must be not empty.
        must_not: { term: { [`${key}.keyword`]: "" } }
      }
    };
  } else if (operator === "><") {
    // { value: "><", text: "n'existe pas" }
    return {
      bool: {
        // Should be ...
        should: [
          // ... empty string ...
          { term: { [`${key}.keyword`]: "" } },
          // ... or not exists.
          { bool: { must_not: { exists: { field: key } } } }
        ]
      }
    };
  } else if (operator === "==" && value) {
    // { value: "==", text: "égal à" },
    return { term: { [`${key}.keyword`]: value } };
  } else if (operator === "!=" && value) {
    // { value: "!=", text: "différent de" },
    return {
      must_not: { term: { [`${key}.keyword`]: value } }
    };
  } else if (operator === ">=" && value) {
    // { value: ">=", text: "supérieur ou égal à" },
    return { range: { [`${key}.keyword`]: { gte: value } } };
  } else if (operator === "<=" && value) {
    // { value: "<=", text: "inférieur ou égal à" },
    return { range: { [`${key}.keyword`]: { lte: value } } };
  } else if (operator === "<" && value) {
    // { value: "<", text: "strictement inférieur à" },
    return { range: { [`${key}.keyword`]: { lt: value } } };
  } else if (operator === ">" && value) {
    // { value: ">", text: "strictement supérieur à" },
    return { range: { [`${key}.keyword`]: { gt: value } } };
  } else if (operator === "^" && value) {
    // { value: "^", text: "commence par" }
    return { wildcard: { [`${key}.keyword`]: `${value}*` } };
  } else if (operator === "*" && value) {
    // { value: "*", text: "contient" }
    return {
      wildcard: { [`${key}.keyword`]: `*${value}*` }
    };
  } else {
    return null;
  }
}

//Fonction pour merger des requetes unitaires
function getQuery(q) {
  let obj = {
    must: [],
    must_not: [],
    should: [],
    should_not: []
  };
  for (let i = 0; i < q.length; i++) {
    //ALGO UN PEU CON ....
    let combinator = "ET";
    if (i === 0) {
      if (q.length === 1) {
        combinator = "ET";
      } else {
        combinator = q[1].combinator;
      }
    } else {
      combinator = q[i].combinator;
    }

    if (combinator === "ET") {
      obj.must.push(q[i].query);
    } else {
      obj.should.push(q[i].query);
    }
  }

  history.replace("?" + qs.stringify({ q: q.map(e => e.data) }));
  return obj;
}

export default class RuleGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      queries: []
    };
  }
  componentDidMount() {
    const search = qs.parse(history.location.search, {
      ignoreQueryPrefix: true
    });
    if (search && search.q) {
      let id = 0;
      const queries = search.q.map(s => {
        return {
          id: id++,
          data: s,
          combinator: s.combinator,
          query: gnagna(s.key, s.operator, s.value)
        };
      });
      this.setState({ queries }, () => this.props.onUpdate(getQuery(queries)));
    }
  }

  onRuleAdd() {
    this.setState({
      queries: this.state.queries.concat({ id: this.state.queries.length })
    });
  }

  onRemove(id) {
    let queries = this.state.queries.filter(e => e.id !== id);
    queries = queries.map((q, i) => ({ ...q, id: i }));
    this.setState({ queries }, () => this.props.onUpdate(getQuery(queries)));
  }

  onUpdate(obj) {
    const queries = [
      ...this.state.queries.slice(0, obj.id),
      obj,
      ...this.state.queries.slice(obj.id + 1)
    ];
    console.log(queries);
    this.setState({ queries }, () => this.props.onUpdate(getQuery(queries)));
  }

  renderChildren() {
    return this.state.queries.map(({ id }) => {
      console.log("render" + id);
      return (
        <Rule
          autocomplete={this.props.autocomplete}
          key={id}
          id={id}
          onRemove={this.onRemove.bind(this)}
          onUpdate={this.onUpdate.bind(this)}
          fields={this.props.fields}
        />
      );
    });
  }

  render() {
    return (
      <div className="ruleGroup">
        <button onClick={this.onRuleAdd.bind(this)}>Ajouter une règle</button>
        {this.renderChildren()}
      </div>
    );
  }
}
