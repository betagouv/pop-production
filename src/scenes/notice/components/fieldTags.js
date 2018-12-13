import React from "react";
import { Field } from "redux-form";
import ReactTags from "react-tag-input";
import api from "../../../services/api";
import "./fieldTags.css";

const Tags = ReactTags.WithContext;

class TagsInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      suggestions: []
    };
  }

  handleDelete(i) {
    const arr = this.props.input.value;
    const newArr = arr.filter((tag, index) => index !== i);
    this.props.input.onChange(newArr);
  }

  handleAddition(tag) {
    const arr = this.props.input.value;
    const newArr = arr.concat(tag.text);
    this.props.input.onChange(newArr);
  }

  handleInputChange(str) {
    if (str && this.props.thesaurus) {
      api.getThesaurus(this.props.thesaurus, str).then(values => {
        if (values) {
          const suggestions = values.map(e => ({ id: e.value, text: e.value }));
          this.setState({ suggestions });
        }
      });
    }
  }

  render() {
    if (!Array.isArray(this.props.input.value)) {
      return (
        <div>
          {`${
            this.props.input.name
          } devrait être multiple mais est : ${JSON.stringify(
            this.props.input.value
          )}`}{" "}
        </div>
      );
    }
    return (
      <div>
        <Tags
          tags={
            this.props.input.value
              ? this.props.input.value.map(e => {
                  return { id: e, text: e };
                })
              : []
          }
          suggestions={this.state.suggestions}
          handleDelete={this.handleDelete.bind(this)}
          handleAddition={this.handleAddition.bind(this)}
          handleInputChange={this.handleInputChange.bind(this)}
          autocomplete={0}
          placeholder="Ajouter une nouvelle entrée"
          autofocus={false}
          readOnly={this.props.disabled}
        />
      </div>
    );
  }
}

const makeField = ({ ...rest }) => {
  return <TagsInput {...rest} />;
};

export default ({ title, ...rest }) => {
  return (
    <div style={styles.container}>
      {title && <div style={styles.title}>{title}</div>}
      <Field component={makeField} {...rest} />
    </div>
  );
};

const styles = {
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "start",
    alignItems: "start",
    paddingTop: "10px",
    paddingBottom: "10px"
  },
  title: {
    paddingRight: "15px",
    minWidth: "100px",
    color: "#5a5a5a",
    fontStyle: "italic"
  }
};

// // Set up test data
// const Countries = [
//     'Afghanistan',
//     'Albania',
//     'Algeria',
//     'Andorra',
//     'Angola',
//     'Anguilla',
//     'Antigua &amp; Barbuda',
//     'Argentina',
//     'Armenia',
//     'Aruba',
//     'Australia',
//     'Austria',
//     'Azerbaijan',
//     'Bahamas',
//     'Bahrain',
//     'Bangladesh',
//     'Barbados',
//     'Belarus',
//     'Belgium',
//     'Belize',
//     'Benin',
//     'Bermuda',
//     'Bhutan',
//     'Bolivia',
//     'Bosnia &amp; Herzegovina',
//     'Botswana',
//     'Brazil',
//     'British Virgin Islands',
//     'Brunei',
//     'Bulgaria',
//     'Burkina Faso',
//     'Burundi',
//     'Cambodia',
//     'Cameroon',
//     'Cape Verde',
//     'Cayman Islands',
//     'Chad',
//     'Chile',
//     'China',
//     'Colombia',
//     'Congo',
//     'Cook Islands',
//     'Costa Rica',
//     'Cote D Ivoire',
//     'Croatia',
//     'Cruise Ship',
//     'Cuba',
//     'Cyprus',
//     'Czech Republic',
//     'Denmark',
//     'Djibouti',
//     'Dominica',
//     'Dominican Republic',
//     'Ecuador',
//     'Egypt',
//     'El Salvador',
//     'Equatorial Guinea',
//     'Estonia',
//     'Ethiopia',
//     'Falkland Islands',
//     'Faroe Islands',
//     'Fiji',
//     'Finland',
//     'France',
//     'French Polynesia',
//     'French West Indies',
//     'Gabon',
//     'Gambia',
//     'Georgia',
//     'Germany',
//     'Ghana',
//     'Gibraltar',
//     'Greece',
//     'Greenland',
//     'Grenada',
//     'Guam',
//     'Guatemala',
//     'Guernsey',
//     'Guinea',
//     'Guinea Bissau',
//     'Guyana',
//     'Haiti',
//     'Honduras',
//     'Hong Kong',
//     'Hungary',
//     'Iceland',
//     'India',
//     'Indonesia',
//     'Iran',
//     'Iraq',
//     'Ireland',
//     'Isle of Man',
//     'Israel',
//     'Italy',
//     'Jamaica',
//     'Japan',
//     'Jersey',
//     'Jordan',
//     'Kazakhstan',
//     'Kenya',
//     'Kuwait',
//     'Kyrgyz Republic',
//     'Laos',
//     'Latvia',
//     'Lebanon',
//     'Lesotho',
//     'Liberia',
//     'Libya',
//     'Liechtenstein',
//     'Lithuania',
//     'Luxembourg',
//     'Macau',
//     'Macedonia',
//     'Madagascar',
//     'Malawi',
//     'Malaysia',
//     'Maldives',
//     'Mali',
//     'Malta',
//     'Mauritania',
//     'Mauritius',
//     'Mexico',
//     'Moldova',
//     'Monaco',
//     'Mongolia',
//     'Montenegro',
//     'Montserrat',
//     'Morocco',
//     'Mozambique',
//     'Namibia',
//     'Nepal',
//     'Netherlands',
//     'Netherlands Antilles',
//     'New Caledonia',
//     'New Zealand',
//     'Nicaragua',
//     'Niger',
//     'Nigeria',
//     'Norway',
//     'Oman',
//     'Pakistan',
//     'Palestine',
//     'Panama',
//     'Papua New Guinea',
//     'Paraguay',
//     'Peru',
//     'Philippines',
//     'Poland',
//     'Portugal',
//     'Puerto Rico',
//     'Qatar',
//     'Reunion',
//     'Romania',
//     'Russia',
//     'Rwanda',
//     'Saint Pierre &amp; Miquelon',
//     'Samoa',
//     'San Marino',
//     'Satellite',
//     'Saudi Arabia',
//     'Senegal',
//     'Serbia',
//     'Seychelles',
//     'Sierra Leone',
//     'Singapore',
//     'Slovakia',
//     'Slovenia',
//     'South Africa',
//     'South Korea',
//     'Spain',
//     'Sri Lanka',
//     'St Kitts &amp; Nevis',
//     'St Lucia',
//     'St Vincent',
//     'St. Lucia',
//     'Sudan',
//     'Suriname',
//     'Swaziland',
//     'Sweden',
//     'Switzerland',
//     'Syria',
//     'Taiwan',
//     'Tajikistan',
//     'Tanzania',
//     'Thailand',
//     "Timor L'Este",
//     'Togo',
//     'Tonga',
//     'Trinidad &amp; Tobago',
//     'Tunisia',
//     'Turkey',
//     'Turkmenistan',
//     'Turks &amp; Caicos',
//     'Uganda',
//     'Ukraine',
//     'United Arab Emirates',
//     'United Kingdom',
//     'United States of America',
//     'Uruguay',
//     'Uzbekistan',
//     'Venezuela',
//     'Vietnam',
//     'Virgin Islands (US)',
//     'Yemen',
//     'Zambia',
//     'Zimbabwe',
// ];

// const suggestions = Countries.map((country) => {
//     return {
//         id: country,
//         text: country
//     }
// })
