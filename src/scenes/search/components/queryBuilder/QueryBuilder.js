import React from "react";
import RuleGroup from "./RuleGroup";

import "./QueryBuilder.css";

export default class QueryBuilder extends React.Component {
  onUpdate({ obj, url }) {
    if (!obj) {
      this.props.setQuery({ query: {}, value: url }); // ???
      return;
    }
    const query = { bool: { ...obj } };

    console.log("url", url);
    this.props.setQuery({ query, value: url }); // ???
  }

  render() {
    return (
      <div className="queryBuilder">
        <RuleGroup
          autocomplete={this.props.autocomplete}
          id="0"
          onUpdate={this.onUpdate.bind(this)}
          fields={this.props.fields}
        />
      </div>
    );
  }
}
