import React from "react";
import Autocomplete from "react-autocomplete";

import { ReactiveComponent } from "@appbaseio/reactivesearch";

function getQuery(valueSelected, actionSelected, resultSelected) {
  if (actionSelected === "<>") {
    // { value: "<>", text: "exist" },
    return { exists: { field: valueSelected } };
  } else if (actionSelected === "><") {
    // { value: "><", text: "n'existe pas" }
    return { exists: { field: valueSelected } };
  } else if (actionSelected === "==" && resultSelected) {
    // { value: "==", text: "égal à" },
    const obj = {};
    obj[`${valueSelected}.keyword`] = resultSelected;
    return { term: obj };
  } else if (actionSelected === "!=" && resultSelected) {
    // { value: "!=", text: "différent de" },
    const obj = {};
    obj[`${valueSelected}.keyword`] = resultSelected;
    return { must_not: { term: obj } };
  } else if (actionSelected === ">=" && resultSelected) {
    // { value: ">=", text: "supérieur ou égal à" },
    const obj = {};
    obj[`${valueSelected}.keyword`] = { gte: resultSelected };
    return { range: obj };
  } else if (actionSelected === "<=" && resultSelected) {
    // { value: "<=", text: "inférieur ou égal à" },
    const obj = {};
    obj[`${valueSelected}.keyword`] = { lte: resultSelected };
    return { range: obj };
  } else if (actionSelected === "<" && resultSelected) {
    // { value: "<", text: "strictement inférieur à" },
    const obj = {};
    obj[`${valueSelected}.keyword`] = { lt: resultSelected };
    return { range: obj };
  } else if (actionSelected === ">" && resultSelected) {
    // { value: ">", text: "strictement supérieur à" },
    const obj = {};
    obj[`${valueSelected}.keyword`] = { gt: resultSelected };
    return { range: obj };
  } else {
    return null;
  }
}

export default class RuleComponent extends React.Component {
  state = {
    query: {}
  };

  onUpdate(combinator, valueSelected, actionSelected, resultSelected) {
    if (valueSelected) {
      const query = `{"aggs": {"${valueSelected}.keyword": {"terms": {"field": "${valueSelected}.keyword","include" : ".*${resultSelected}.*","order": {"_count": "desc"},"size": 10}}}}`;
      this.setState({ query: JSON.parse(query) });
    } else {
      this.setState({ query: {} });
    }
    const query = getQuery(valueSelected, actionSelected, resultSelected);
    if (query) {
      this.props.onUpdate({ id: this.props.id, query, combinator });
    }
  }

  render() {
    return (
      <ReactiveComponent
        componentId={`Rule${this.props.id}`}
        defaultQuery={() => this.state.query}
      >
        <Rule
          first={this.props.first}
          id={this.props.id}
          onRemove={this.props.onRemove}
          onUpdate={this.onUpdate.bind(this)}
          fields={this.props.fields}
        />
      </ReactiveComponent>
    );
  }
}

class Rule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      valueSelected: this.props.fields[0],
      actionSelected: "==",
      resultSelected: "",
      combinator: "ET"
    };
  }
  componentDidMount() {
    this.update();
  }

  update() {
    const { valueSelected, actionSelected, resultSelected } = this.state;
    this.props.onUpdate(
      this.state.combinator,
      valueSelected,
      actionSelected,
      resultSelected
    );
  }

  render() {
    return (
      <div className="rule">
        {this.props.id > 0 ? (
          <Combinator
            value={this.state.combinator}
            onChange={e =>
              this.setState({ combinator: e.target.value }, () => {
                this.update();
              })
            }
          />
        ) : (
          <div />
        )}
        <ValueSelector
          fields={this.props.fields}
          value={this.state.valueSelected}
          onChange={e => {
            this.setState(
              {
                valueSelected: e.target.value,
                resultSelected: "",
                actionSelected: "=="
              },
              () => {
                this.update();
              }
            );
          }}
        />
        <ActionElement
          value={this.state.actionSelected}
          onChange={e => {
            this.setState({ actionSelected: e.target.value }, () => {
              this.update();
            });
          }}
        />
        <ValueEditor
          actionSelected={this.state.actionSelected}
          value={this.state.resultSelected}
          aggregations={this.props.aggregations}
          onChange={e => {
            this.setState({ resultSelected: e.target.value }, () => {
              this.update();
            });
          }}
        />
        <button
          className="closeButton"
          onClick={() => this.props.onRemove(this.props.id)}
        >
          X
        </button>
      </div>
    );
  }
}

class ValueEditor extends React.Component {
  state = {
    focused: false,
    selected: 0
  };

  renderSuggestion() {
    if (
      this.state.focused &&
      this.props.aggregations &&
      Object.keys(this.props.aggregations).length
    ) {
      const key = Object.keys(this.props.aggregations)[0];
      const options = this.props.aggregations[key].buckets.map(e => (
        <li key={e.key}>{e.key}</li>
      ));
      return <ul>{options}</ul>;
    }
    return <div />;
  }

  onSelect(value) {
    this.props.onChange({ target: { value } });
    this.setState({ suggestions: [] });
  }

  onBlur() {
    if (
      this.props.aggregations &&
      Object.keys(this.props.aggregations).length
    ) {
      const key = Object.keys(this.props.aggregations)[0];
      const value = this.props.aggregations[key].buckets[this.state.selected]
        .key;
      this.props.onChange({ target: { value } });
    }
    this.setState({ focused: false });
  }

  onFocus() {
    this.setState({ focused: true });
  }

  render() {
    if (["<>", "><"].includes(this.props.actionSelected)) {
      return <div />;
    }

    let suggestions = [];
    if (
      this.props.aggregations &&
      Object.keys(this.props.aggregations).length
    ) {
      const key = Object.keys(this.props.aggregations)[0];
      suggestions = this.props.aggregations[key].buckets;
    }

    return (
      <div>
        <Autocomplete
          getItemValue={item => item.key}
          items={suggestions}
          renderItem={(item, isHighlighted) => (
            <div
              key={item.key}
              style={{ background: isHighlighted ? "lightgray" : "white" }}
            >
              {item.key}
            </div>
          )}
          value={this.props.value}
          onChange={this.props.onChange}
          onSelect={value => this.props.onChange({ target: { value } })}
          menuStyle={{
            zIndex: 99,
            padding: "5px",
            borderRadius: "3px",
            boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
            background: "rgba(255, 255, 255, 0.9)",
            padding: "2px 0",
            fontSize: "90%",
            position: "fixed",
            overflow: "auto",
            maxHeight: "50%" // TODO: don't cheat, let it flow to the bottom
          }}
        />
        {this.renderSuggestion()}
      </div>
    );
  }
}

const Combinator = props => {
  const choices = ["ET", "OU"].map(option => (
    <option key={option} value={option}>
      {option}
    </option>
  ));
  return (
    <select
      selected="ET"
      value={props.value}
      className="combinator"
      onChange={props.onChange.bind(this)}
    >
      {choices}
    </select>
  );
};

const ActionElement = ({ onChange, value }) => {
  const choices = [
    { value: "==", text: "égal à" },
    { value: "!=", text: "différent de" },
    { value: ">=", text: "supérieur ou égal à" },
    { value: "<=", text: "inférieur ou égal à" },
    { value: ">", text: "strictement supérieur à" },
    { value: "<", text: "strictement inférieur à" },
    { value: "<>", text: "exist" },
    { value: "><", text: "n'existe pas" }
  ].map(({ value, text }) => (
    <option key={value} value={value}>
      {text}
    </option>
  ));
  return (
    <select
      selected={choices[0]}
      className="actionelement"
      value={value}
      onChange={onChange}
    >
      {choices}
    </select>
  );
};

const ValueSelector = ({ fields, onChange, value }) => {
  const choices = fields.map(e => (
    <option key={e} value={e}>
      {e}
    </option>
  ));
  return (
    <select className="valueselector" value={value} onChange={onChange}>
      {choices}
    </select>
  );
};
