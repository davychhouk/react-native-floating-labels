## react-native-floating-labels
 
A `<FloatingLabel>` component for react-native.

## Add it to your project

Run `npm install git://github.com/andreipfeiffer/react-native-floating-labels`

## Usage

```javascript
import FloatingLabel from "react-native-floating-labels";

class TextInput extends React.Component {

  render() {
    return (
      <FloatingLabel
        labelStyle={/* styles for label */}
        inputStyle={/* styles for input */}
        style={/* styles for wrapper */}
        /* any other React Native TextInput props */
      >
        Label Text
      </FloatingLabel>
    );
  }
};
```
