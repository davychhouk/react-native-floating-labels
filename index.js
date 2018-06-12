import React, { Component } from "react";
import PropTypes from "prop-types";

import {
  StyleSheet,
  TextInput,
  LayoutAnimation,
  Animated,
  Easing,
  Text,
  View,
  Platform,
  ViewPropTypes
} from "react-native";

var textPropTypes = Text.propTypes || ViewPropTypes;
var textInputPropTypes = TextInput.propTypes || textPropTypes;
var propTypes = {
  ...textInputPropTypes,
  inputStyle: textInputPropTypes.style,
  labelStyle: textPropTypes.style,
  disabled: PropTypes.bool,
  style: ViewPropTypes.style
};

// @todo extend default label styles with custom ones
export default class FloatingLabel extends Component {

  constructor(props) {
    super(props);

    const dirty = props.value || props.placeholder;
    const style = dirty ? dirtyStyle : cleanStyle;
    
    this.state = {
      text: props.value,
      dirty: dirty,
      labelStyle: {
        fontSize: new Animated.Value(style.fontSize),
        top: new Animated.Value(style.top)
      }
    }
  }

  componentWillReceiveProps(props) {
    if (typeof props.value !== "undefined" && props.value !== this.state.text) {
      this.setState({ text: props.value, dirty: !!props.value });
      this._animate(!!props.value);
    }
  }

  _animate = (dirty) => {
    var nextStyle = dirty ? dirtyStyle : cleanStyle;
    var labelStyle = this.state.labelStyle;
    var anims = Object.keys(nextStyle).map(prop => {
      return Animated.timing(
        labelStyle[prop],
        {
          toValue: nextStyle[prop],
          duration: 200
        },
        Easing.ease
      );
    });

    Animated.parallel(anims).start();
  }

  _onFocus = () => {
    this._animate(true);
    this.setState({ dirty: true });
    if (this.props.onFocus) {
      this.props.onFocus(arguments);
    }
  }

  _onBlur = () => {
    if (!this.state.text) {
      this._animate(false);
      this.setState({ dirty: false });
    }

    if (this.props.onBlur) {
      this.props.onBlur(arguments);
    }
  }

  onChangeText = (text) => {
    this.setState({ text });
    if (this.props.onChangeText) {
      this.props.onChangeText(text);
    }
  }

  updateText = (event) => {
    var text = event.nativeEvent.text;
    this.setState({ text });

    if (this.props.onEndEditing) {
      this.props.onEndEditing(event);
    }
  }

  _renderLabel = () => {
    return (
      <Animated.Text
        ref="label"
        style={[this.state.labelStyle, styles.label, this.props.labelStyle]}
      >
        {this.props.children}
      </Animated.Text>
    );
  }

  render() {
    var props = {
        autoCapitalize: this.props.autoCapitalize,
        autoCorrect: this.props.autoCorrect,
        autoFocus: this.props.autoFocus,
        bufferDelay: this.props.bufferDelay,
        clearButtonMode: this.props.clearButtonMode,
        clearTextOnFocus: this.props.clearTextOnFocus,
        controlled: this.props.controlled,
        editable: this.props.editable,
        enablesReturnKeyAutomatically: this.props.enablesReturnKeyAutomatically,
        keyboardType: this.props.keyboardType,
        multiline: this.props.multiline,
        numberOfLines: this.props.numberOfLines,
        onBlur: this._onBlur,
        onChange: this.props.onChange,
        onChangeText: this.onChangeText,
        onEndEditing: this.updateText,
        onFocus: this._onFocus,
        onSubmitEditing: this.props.onSubmitEditing,
        placeholder: this.props.placeholder,
        secureTextEntry: this.props.secureTextEntry,
        returnKeyType: this.props.returnKeyType,
        selectTextOnFocus: this.props.selectTextOnFocus,
        selectionState: this.props.selectionState,
        style: [styles.input],
        testID: this.props.testID,
        value: this.state.text,
        underlineColorAndroid: this.props.underlineColorAndroid, // android TextInput will show the default bottom border
        onKeyPress: this.props.onKeyPress,
        blurOnSubmit: this.props.blurOnSubmit
      },
      elementStyles = [styles.element];

    if (this.props.inputStyle) {
      props.style.push(this.props.inputStyle);
    }

    if (this.props.style) {
      elementStyles.push(this.props.style);
    }

    return (
      <View style={elementStyles}>
        {this._renderLabel()}
        <TextInput {...props} ref={this.props.inputRef} underlineColorAndroid='transparent' />
      </View>
    );
  }
};

var labelStyleObj = {
  marginTop: 21,
//   paddingLeft: 9,
  color: "#AAA",
  position: "absolute"
};

if (Platform.OS === "web") {
  labelStyleObj.pointerEvents = "none";
}

var styles = StyleSheet.create({
  element: {
    position: "relative"
  },
  input: {
    height: 30,
    // borderColor: "gray",
    // backgroundColor: "transparent",
    // justifyContent: "center",
    // borderWidth: 1,
    // color: "black",
    // fontSize: 20,
    // borderRadius: 4,
    // paddingLeft: 10,
    marginTop: 20,
    paddingBottom: 2,
    paddingLeft: 0,
    paddingTop: 0,
    paddingRight: 0
  },
  label: labelStyleObj
});

var cleanStyle = {
  fontSize: 16,
  top: 7
};

var dirtyStyle = {
  fontSize: 12,
  top: -17
};
