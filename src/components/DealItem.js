import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Text, Image, StyleSheet, View } from 'react-native';

import { priceDisplay } from '../util';

export default class DealItem extends Component {
  static propTypes = {
    deal: PropTypes.object.isRequired,
  };

  render() {
    const { deal } = this.props;
    return (
      <View>
        <Image style={styles.image} source={{ uri: deal.media[0] }} />
        <View>
          <Text style={styles.title}>{deal.title}</Text>
          <Text style={styles.price}>{priceDisplay(deal.price)}</Text>
          <Text style={styles.name}>{deal.cause.name}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 150,
  },
  title: {},
  price: {},
  name: {},
});
