import { connect } from 'react-redux';
import { NavigationScreenConfigProps } from 'react-navigation';
import { reduxForm, formValueSelector, ConfigProps, InjectedFormProps } from 'redux-form';
import { Toast } from '../components';

/**
 * 继承react-navigation中会传到页面中的props;
 */
export interface NormalComponentProps extends Partial<NavigationScreenConfigProps> {
  userToken?: {
    token: string;
    userId: number;
  };
  dispatch?: any;
}

interface NormalConnectProps {
  reducers?: string[];
}

/**
 * 自动connect了userToken的修饰器(Decorator)函数
 */
const normalConnect = (props?: NormalConnectProps) => Component => {
  const { reducers = [] } = props || {};
  return connect(state => {
    let mapState2Props = {
      userToken: state.userToken,
    };
    if (reducers && reducers.length > 0) {
      for (let key of reducers) {
        if (state[key] === undefined) {
          console.warn(`请检查传入的reducer的key是否正确:${key};\n当前reducer keys:${Object.keys(state)}`);
        } else {
          mapState2Props[key] = state[key];
        }
      }
    }
    return mapState2Props;
  }, null, null, { withRef: true })(Component) as any;
};

export interface FormComponentProps<FormData = {}> extends NormalComponentProps, InjectedFormProps<FormData> {
  fieldsValue?: { [key: string]: any };
}

interface Config extends ConfigProps {
  // 配置需要传递到页面form表单的fieldsValue
  fields?: string[];
  // 配置表单需要校验的规则
  validate?: any;
  // 登陆页获取验证码需要校验的规则
  validateCaptcha?: any;
}

interface FormConnectProps extends NormalConnectProps {
  config: Config;
}

/**
 * 自动connect了userToken和form的修饰器(Decorator)函数，适用于表单页面
 */
const formConnect = (props: FormConnectProps) => Component => {
  const { fields, ...rest } = props.config;
  const config = {
    // 错误提示
    onSubmitFail(errors) {
      if (errors && Object.values(errors).length > 0) {
        const err = Object.values(errors)[0];
        console.log('form error:', err);
        Toast.show({ des: err.toString() });
      }
    },
    ...rest,
  };
  return connect(state => {
    let mapState2Props: any = {
      userToken: state.userToken,
    };
    if (props.reducers && props.reducers.length > 0) {
      for (let key of props.reducers) {
        if (state[key] === undefined) {
          console.warn(`请检查传入的reducer的key是否正确:${key};\n当前reducer keys:${Object.keys(state)}`);
        } else {
          mapState2Props[key] = state[key];
        }
      }
    }
    // 筛选当前form的值传到props中
    if (Array.isArray(fields) && fields.length > 0) {
      const selector = formValueSelector(config.form);
      const fieldsValue = {};
      fields.forEach(name => {
        fieldsValue[name] = selector(state, name);
      });
      mapState2Props.fieldsValue = fieldsValue;
    }
    return mapState2Props;
  })(reduxForm(config)(Component));
};

export {
  normalConnect,
  formConnect,
};
