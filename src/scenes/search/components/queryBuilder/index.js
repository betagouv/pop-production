import React from "react";
import { ReactiveComponent } from "@appbaseio/reactivesearch";
import QueryBuilder from "./QueryBuilder";

export default class AdvancedSearch extends React.Component {
  constructor(props) {
    super(props);
    const object = new props.entity({});
    const properties = [];
    for (var property in object) {
      if (
        object.hasOwnProperty(property) &&
        property.indexOf("_") !== 0 &&
        typeof object[property] === "object"
      ) {
        properties.push(property);
      }
    }
    this.state = {
      properties
    };
  }

  render() {
    return (
      <ReactiveComponent
        componentId={this.props.componentId} // a unique id we will refer to later
      >
        <QueryBuilder fields={this.state.properties} />
      </ReactiveComponent>
    );
  }
}
