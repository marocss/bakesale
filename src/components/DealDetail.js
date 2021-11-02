import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Text,
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  PanResponder,
  Animated,
} from 'react-native';

import { priceDisplay } from '../util';
import ajax from '../ajax';

export default class DealDetail extends Component {
  imagePanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gestureState) => {
      console.log('moving..', gestureState.dx);
    },
    onPanResponderRelease: (event, gestureState) => {
      console.log('released');
    },
  });

  static propTypes = {
    initialDealData: PropTypes.object.isRequired,
    onBack: PropTypes.func.isRequired,
  };

  state = {
    deal: this.props.initialDealData,
    imageIndex: 0,
  };

  async componentDidMount() {
    const fullDeal = await ajax.fetchDealDetail(this.state.deal.key);
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({
      deal: fullDeal,
    });
  }

  render() {
    const { deal } = this.state;

    return (
      <View style={styles.deal}>
        <TouchableOpacity onPress={this.props.onBack}>
          <Text style={styles.backButton}>Back</Text>
        </TouchableOpacity>

        <Image
          source={{ uri: deal.media[this.state.imageIndex] }}
          style={styles.image}
          {...this.imagePanResponder.panHandlers}
        />
        <View style={styles.detail}>
          <View>
            <Text style={styles.title}>{deal.title}</Text>
          </View>

          <View style={styles.footer}>
            <View style={styles.info}>
              <Text style={styles.price}>{priceDisplay(deal.price)}</Text>
              <Text style={styles.cause}>{deal.cause.name}</Text>
            </View>

            {deal.user && (
              <View style={styles.user}>
                <Image
                  source={{ uri: deal.user.avatar }}
                  style={styles.avatar}
                />
                <Text>{deal.user.name}</Text>
              </View>
            )}
          </View>

          <View style={styles.description}>
            <Text>{deal.description}</Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  deal: {
    // marginHorizontal: 12,
    marginTop: 50,
  },
  image: {
    width: '100%',
    height: 150,
    // backgroundColor: '#ccc',
  },
  info: {
    alignItems: 'center',
  },
  detail: {
    // borderColor: '#bbb',
    // borderWidth: 1,
  },
  title: {
    fontSize: 16,
    padding: 10,
    fontWeight: 'bold',
    backgroundColor: 'rgba(237, 149, 45, 0.4)',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 15,
  },
  cause: {
    marginVertical: 10,
  },
  price: {
    fontWeight: 'bold',
  },
  user: {
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  username: {
    width: 60,
    height: 60,
  },
  description: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderStyle: 'dotted',
    margin: 10,
    padding: 10,
  },
  backButton: {
    marginBottom: 8,
    color: '#22f',
    marginLeft: 12,
  },
});
