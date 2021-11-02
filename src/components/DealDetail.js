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
  Dimensions,
  Button,
  Linking,
  ScrollView,
} from 'react-native';

import { priceDisplay } from '../util';
import ajax from '../ajax';

export default class DealDetail extends Component {
  imageXPos = new Animated.Value(0);

  imagePanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,

    onPanResponderMove: (event, gestureState) => {
      console.log('moving..', gestureState.dx);
      this.imageXPos.setValue(gestureState.dx);
    },

    onPanResponderRelease: (event, gestureState) => {
      console.log('released');
      this.width = Dimensions.get('window').width;

      if (Math.abs(gestureState.dx) > this.width * 0.35) {
        const direction = Math.sign(gestureState.dx); // -1 = swipe left, +1 = swipe right

        Animated.timing(this.imageXPos, {
          toValue: direction * this.width,
          useNativeDriver: false,
          duration: 300,
        }).start(() => this.handleSwipe(-1 * direction));
      } else {
        // reset if swipe was less than 35%
        Animated.spring(this.imageXPos, {
          toValue: 0,
          useNativeDriver: false,
        }).start();
      }
    },
  });

  handleSwipe = indexDirection => {
    if (!this.state.deal.media[this.state.imageIndex + indexDirection]) {
      Animated.spring(this.imageXPos, {
        toValue: 0,
        useNativeDriver: false,
      }).start();
      return;
    }

    this.setState(
      prevState => ({
        imageIndex: prevState.imageIndex + indexDirection,
      }),
      () => {
        // start next image animation
        this.imageXPos.setValue(indexDirection * this.width);
        Animated.spring(this.imageXPos, {
          toValue: 0,
          useNativeDriver: false,
        }).start();
      },
    );
  };

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

  openDealUrl = () => {
    Linking.openURL(this.state.deal.url);
  };

  render() {
    const { deal } = this.state;

    return (
      <View style={styles.deal}>
        <TouchableOpacity onPress={this.props.onBack}>
          <Text style={styles.backButton}>Back</Text>
        </TouchableOpacity>

        <Animated.Image
          source={{ uri: deal.media[this.state.imageIndex] }}
          style={[styles.image, { left: this.imageXPos }]}
          {...this.imagePanResponder.panHandlers}
        />
        <View>
          <Text style={styles.title}>{deal.title}</Text>
        </View>
        <ScrollView style={styles.detail}>
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
          <Button title="Buy this deal!" onPress={this.openDealUrl} />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  deal: {
    flex: 1,
    paddingTop: 50,
    paddingBottom: 50,
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
    // marginBottom: 50,
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
