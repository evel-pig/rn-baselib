import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProperties,
  StyleProp,
  ViewStyle,
  TextStyle,
  Image,
  ImageSourcePropType,
  ImageStyle,
} from 'react-native';
import { Field, WrappedFieldProps } from 'redux-form';
import appStyles, { Theme } from '../../styles';
import SVGIcon from '../SVGIcon';

export interface TextInputFieldOwnProps extends TextInputProperties {
  /** 输入框格式类型 */
  type?: 'bankcard' | 'phone' | 'IDCard' | 'noNum' | 'password';
  /** 左边标题文字 */
  labelText?: string;
  /** 是否显示下划线, 默认true */
  border?: boolean;
  /** 下划线颜色, 默认 borderColor */
  borderBottomColor?: string;
  /** 获取TextInput组件 */
  getRef?: any;
  /** 输入框内文字对齐方式, 默认right */
  textAlign?: 'auto' | 'left' | 'right' | 'center';
  /** 整体样式 */
  style?: StyleProp<ViewStyle>;
  /** 左边标题样式 */
  labelTextStyle?: StyleProp<TextStyle>;
  /** 输入框组件样式 */
  textInputStyle?: StyleProp<TextStyle>;
  /** 左边svg icon名字 */
  iconSvgName?: string;
  /** 左边svg icon尺寸, 默认 px2dp(30) */
  iconSvgSize?: number;
  /** 左边svg icon颜色, 默认theme */
  iconSvgColor?: string;
  /** 左边icon资源 */
  iconSource?: ImageSourcePropType;
  /** 左边icon样式 */
  iconStyle?: StyleProp<ImageStyle>;
  /** 占位符文字 */
  placeholder?: string;
  /** 占位符文字颜色, 默认fontColor_99 */
  placeholderTextColor?: string;
  /** 输入框高亮时和光标的颜色, 默认theme */
  selectionColor?: string;
  /** 是否要在文本框右侧显示“清除”按钮, 默认为while-editing */
  clearButtonMode?: 'never' | 'while-editing' | 'unless-editing' | 'always';
  [key: string]: any;
}
interface TextInputFieldProps extends TextInputFieldOwnProps, WrappedFieldProps {

}
interface TextInputFieldState {
  value: string;
}

class TextInputField extends Component<TextInputFieldProps, TextInputFieldState> {
  textInput: any;

  static defaultProps = {
    border: true,
    textAlign: 'right',
    iconSvgSize: px2dp(30),
    // iconSvgColor: Theme.theme,
    placeholderTextColor: Theme.fontColor_99,
    selectionColor: Theme.theme,
    clearButtonMode: 'while-editing',
    borderBottomColor: Theme.borderColor,
    autoCapitalize: 'none',
  };

  constructor(props) {
    super(props);
    this.state = { value: this.props.input.value || null };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.input && nextProps.input.value !== this.props.input.value) {
      this._onChange(nextProps.input.value);
    }
  }

  blur = () => {
    this.textInput.blur();
  }

  focus = () => {
    this.textInput.focus();
  }

  _onChange = (value) => {
    let text = value;
    switch (this.props.type) {
      case 'bankcard': {
        text = text.replace(/\D/g, '');
        text = text.substring(0, 19);
        text = text.replace(/\D/g, '').replace(/(....)(?=.)/g, '$1 ');
        break;
      }
      case 'phone': {
        text = text.replace(/\D/g, '');
        text = text.substring(0, 11);
        let valueLen = text.length;
        if (valueLen > 3 && valueLen < 8) {
          text = `${text.substr(0, 3)} ${text.substr(3)}`;
        } else if (valueLen >= 8) {
          text = `${text.substr(0, 3)} ${text.substr(3, 4)} ${text.substr(7)}`;
        }
        break;
      }
      case 'IDCard': {
        text = text.replace(/\s/g, '');
        text = text.substring(0, 18);
        let textLen = text.length;
        if (textLen > 6 && textLen <= 10) {
          text = `${text.substr(0, 6)} ${text.substr(6)}`;
        } else if (textLen > 10 && textLen <= 14) {
          text = `${text.substr(0, 6)} ${text.substr(6, 4)} ${text.substr(10)}`;
        } else if (textLen > 14) {
          text = `${text.substr(0, 6)} ${text.substr(6, 4)} ${text.substr(10, 4)} ${text.substr(14, 4)}`;
        }
        break;
      }
      case 'noNum': {
        text = text.replace(/\d/g, '');
        break;
      }
      default:
        break;
    }
    this.setState({ value: text }, () => {
      const { onChange } = this.props.input;
      if (onChange) onChange(text);
    });
  }

  render() {
    const {
      labelText,
      input,
      meta,
      type,
      maxLength,
      keyboardType,
      border,
      style,
      textAlign,
      getRef,
      children,
      labelTextStyle,
      textInputStyle,
      iconSvgName,
      iconSvgSize,
      iconSvgColor = Theme.theme,
      iconSource,
      iconStyle,
      placeholderTextColor,
      placeholder,
      selectionColor,
      clearButtonMode,
      borderBottomColor,
      autoCapitalize,
      ...rest } = this.props;
    let _keyboardType = keyboardType || 'default';
    let _maxLength = maxLength;

    if (type === 'bankcard') {
      _keyboardType = 'phone-pad';
      _maxLength = 23;
    } else if (type === 'phone') {
      _keyboardType = 'phone-pad';
      _maxLength = 13;
    } else if (type === 'IDCard') {
      _maxLength = 21;
    } else if (type === 'password') {
      _maxLength = maxLength || 20;
    }

    return (
      <View style={[styles.container, { borderBottomColor: border ? borderBottomColor : 'transparent', borderBottomWidth: Theme.borderWidth }, style]}>
        {iconSvgName ? <SVGIcon name={iconSvgName} color={iconSvgColor} size={iconSvgSize} style={[styles.icon, iconStyle]} /> : null}
        {iconSource ? <Image source={iconSource} style={[styles.img, iconStyle]} /> : null}
        {labelText ? <Text style={[appStyles.font_30, styles.labelText, labelTextStyle]}>{labelText}</Text> : null}
        <TextInput
          style={[{ flex: 1, textAlign: textAlign }, textInputStyle]}
          onFocus={input.onFocus as () => void}
          onBlur={input.onBlur as () => void}
          value={this.state.value}
          underlineColorAndroid={'transparent'}
          maxLength={_maxLength}
          keyboardType={_keyboardType}
          secureTextEntry={type === 'password'}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          onChange={(event) => { this._onChange(event.nativeEvent.text); }}
          clearButtonMode={clearButtonMode}
          selectionColor={selectionColor}
          autoCapitalize={autoCapitalize}
          ref={ref => {
            this.textInput = ref;
            if (getRef) getRef(ref);
          }}
          {...rest}
        />
        {children}
      </View>
    );
  }
}

export interface InputProps extends TextInputFieldOwnProps {
  name: string;
}
class MyField extends Field<any> { }
export default class Input extends React.Component<InputProps, any> {
  ins: any;

  render() {
    const { name, ...rest } = this.props;
    return (
      <MyField component={TextInputField} name={name} ref={ref => this.ins = ref} {...rest} withRef />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: px2dp(100),
    paddingHorizontal: px2dp(30),
    backgroundColor: Theme.white,
  } as ViewStyle,
  labelText: {
    color: Theme.fontColor,
    marginRight: px2dp(15),
  },
  icon: {
    color: Theme.theme,
    marginRight: px2dp(15),
  },
  img: {
    width: px2dp(30),
    height: px2dp(30),
    marginRight: px2dp(15),
  } as ImageStyle,
});
